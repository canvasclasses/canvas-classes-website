// SQLite-based progress tracker for resumable pipeline
const sqlite3 = require('sqlite3').verbose();
const { promisify } = require('util');

class ProgressTracker {
  constructor(dbPath) {
    this.dbPath = dbPath;
    this.db = null;
  }

  async init() {
    return new Promise((resolve, reject) => {
      this.db = new sqlite3.Database(this.dbPath, (err) => {
        if (err) reject(err);
        else resolve();
      });
    });

    // Promisify database methods
    this.run = promisify(this.db.run.bind(this.db));
    this.get = promisify(this.db.get.bind(this.db));
    this.all = promisify(this.db.all.bind(this.db));

    // Create tables
    await this.run(`
      CREATE TABLE IF NOT EXISTS folders (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        folder_path TEXT UNIQUE NOT NULL,
        parent_folder TEXT,
        status TEXT DEFAULT 'pending',
        started_at DATETIME,
        completed_at DATETIME,
        total_images INTEGER DEFAULT 0,
        processed_images INTEGER DEFAULT 0,
        successful_questions INTEGER DEFAULT 0,
        failed_questions INTEGER DEFAULT 0,
        metadata TEXT
      )
    `);

    await this.run(`
      CREATE TABLE IF NOT EXISTS images (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        folder_id INTEGER NOT NULL,
        image_path TEXT UNIQUE NOT NULL,
        file_hash TEXT,
        status TEXT DEFAULT 'pending',
        started_at DATETIME,
        completed_at DATETIME,
        question_id TEXT,
        display_id TEXT,
        error_message TEXT,
        extracted_json TEXT,
        FOREIGN KEY (folder_id) REFERENCES folders(id)
      )
    `);

    await this.run(`
      CREATE TABLE IF NOT EXISTS processing_log (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
        level TEXT,
        stage TEXT,
        message TEXT,
        data TEXT
      )
    `);

    await this.run(`CREATE INDEX IF NOT EXISTS idx_folders_status ON folders(status)`);
    await this.run(`CREATE INDEX IF NOT EXISTS idx_images_status ON images(status)`);
    await this.run(`CREATE INDEX IF NOT EXISTS idx_images_folder ON images(folder_id)`);
  }

  // ===== FOLDER OPERATIONS =====

  async registerFolder(folderPath, parentFolder, totalImages, metadata = {}) {
    const result = await this.run(`
      INSERT OR IGNORE INTO folders (folder_path, parent_folder, total_images, metadata)
      VALUES (?, ?, ?, ?)
    `, [folderPath, parentFolder, totalImages, JSON.stringify(metadata)]);

    if (result.changes === 0) {
      // Folder already exists, get its ID
      const existing = await this.get(
        'SELECT id FROM folders WHERE folder_path = ?',
        [folderPath]
      );
      return existing.id;
    }

    return result.lastID;
  }

  async startFolder(folderId) {
    await this.run(`
      UPDATE folders
      SET status = 'processing', started_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `, [folderId]);
  }

  async completeFolder(folderId, successful, failed) {
    await this.run(`
      UPDATE folders
      SET status = 'completed',
          completed_at = CURRENT_TIMESTAMP,
          successful_questions = ?,
          failed_questions = ?
      WHERE id = ?
    `, [successful, failed, folderId]);
  }

  async failFolder(folderId, errorMessage) {
    await this.run(`
      UPDATE folders
      SET status = 'failed', completed_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `, [folderId]);

    await this.log('error', 'folder_processing', errorMessage, { folderId });
  }

  async getPendingFolders() {
    return await this.all(`
      SELECT * FROM folders
      WHERE status IN ('pending', 'processing')
      ORDER BY id ASC
    `);
  }

  async getFolderStats(folderId) {
    return await this.get(`
      SELECT
        f.*,
        COUNT(i.id) as total_images_tracked,
        SUM(CASE WHEN i.status = 'completed' THEN 1 ELSE 0 END) as completed_images,
        SUM(CASE WHEN i.status = 'failed' THEN 1 ELSE 0 END) as failed_images,
        SUM(CASE WHEN i.status = 'pending' THEN 1 ELSE 0 END) as pending_images
      FROM folders f
      LEFT JOIN images i ON f.id = i.folder_id
      WHERE f.id = ?
      GROUP BY f.id
    `, [folderId]);
  }

  // ===== IMAGE OPERATIONS =====

  async registerImage(folderId, imagePath, fileHash) {
    const result = await this.run(`
      INSERT OR IGNORE INTO images (folder_id, image_path, file_hash)
      VALUES (?, ?, ?)
    `, [folderId, imagePath, fileHash]);

    if (result.changes === 0) {
      const existing = await this.get(
        'SELECT id FROM images WHERE image_path = ?',
        [imagePath]
      );
      return existing.id;
    }

    return result.lastID;
  }

  async startImage(imageId) {
    await this.run(`
      UPDATE images
      SET status = 'processing', started_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `, [imageId]);
  }

  async completeImage(imageId, questionId, displayId, extractedJson) {
    await this.run(`
      UPDATE images
      SET status = 'completed',
          completed_at = CURRENT_TIMESTAMP,
          question_id = ?,
          display_id = ?,
          extracted_json = ?
      WHERE id = ?
    `, [questionId, displayId, JSON.stringify(extractedJson), imageId]);

    // Update folder progress
    const image = await this.get('SELECT folder_id FROM images WHERE id = ?', [imageId]);
    await this.run(`
      UPDATE folders
      SET processed_images = processed_images + 1,
          successful_questions = successful_questions + 1
      WHERE id = ?
    `, [image.folder_id]);
  }

  async failImage(imageId, errorMessage) {
    await this.run(`
      UPDATE images
      SET status = 'failed',
          completed_at = CURRENT_TIMESTAMP,
          error_message = ?
      WHERE id = ?
    `, [errorMessage, imageId]);

    // Update folder progress
    const image = await this.get('SELECT folder_id FROM images WHERE id = ?', [imageId]);
    await this.run(`
      UPDATE folders
      SET processed_images = processed_images + 1,
          failed_questions = failed_questions + 1
      WHERE id = ?
    `, [image.folder_id]);
  }

  async skipImage(imageId, reason) {
    await this.run(`
      UPDATE images
      SET status = 'skipped',
          completed_at = CURRENT_TIMESTAMP,
          error_message = ?
      WHERE id = ?
    `, [reason, imageId]);
  }

  async getPendingImages(folderId) {
    return await this.all(`
      SELECT * FROM images
      WHERE folder_id = ? AND status = 'pending'
      ORDER BY image_path ASC
    `, [folderId]);
  }

  async getImageByPath(imagePath) {
    return await this.get(
      'SELECT * FROM images WHERE image_path = ?',
      [imagePath]
    );
  }

  // ===== LOGGING =====

  async log(level, stage, message, data = null) {
    await this.run(`
      INSERT INTO processing_log (level, stage, message, data)
      VALUES (?, ?, ?, ?)
    `, [level, stage, message, data ? JSON.stringify(data) : null]);
  }

  async getRecentLogs(limit = 100) {
    return await this.all(`
      SELECT * FROM processing_log
      ORDER BY timestamp DESC
      LIMIT ?
    `, [limit]);
  }

  // ===== STATISTICS =====

  async getOverallStats() {
    const folderStats = await this.get(`
      SELECT
        COUNT(*) as total_folders,
        SUM(CASE WHEN status = 'completed' THEN 1 ELSE 0 END) as completed_folders,
        SUM(CASE WHEN status = 'failed' THEN 1 ELSE 0 END) as failed_folders,
        SUM(CASE WHEN status = 'processing' THEN 1 ELSE 0 END) as processing_folders,
        SUM(CASE WHEN status = 'pending' THEN 1 ELSE 0 END) as pending_folders,
        SUM(successful_questions) as total_successful,
        SUM(failed_questions) as total_failed
      FROM folders
    `);

    const imageStats = await this.get(`
      SELECT
        COUNT(*) as total_images,
        SUM(CASE WHEN status = 'completed' THEN 1 ELSE 0 END) as completed_images,
        SUM(CASE WHEN status = 'failed' THEN 1 ELSE 0 END) as failed_images,
        SUM(CASE WHEN status = 'skipped' THEN 1 ELSE 0 END) as skipped_images,
        SUM(CASE WHEN status = 'pending' THEN 1 ELSE 0 END) as pending_images
      FROM images
    `);

    return { ...folderStats, ...imageStats };
  }

  // ===== CLEANUP =====

  async resetFolder(folderId) {
    await this.run(`
      UPDATE folders
      SET status = 'pending',
          started_at = NULL,
          completed_at = NULL,
          processed_images = 0,
          successful_questions = 0,
          failed_questions = 0
      WHERE id = ?
    `, [folderId]);

    await this.run(`
      UPDATE images
      SET status = 'pending',
          started_at = NULL,
          completed_at = NULL,
          question_id = NULL,
          display_id = NULL,
          error_message = NULL,
          extracted_json = NULL
      WHERE folder_id = ?
    `, [folderId]);
  }

  async close() {
    return new Promise((resolve, reject) => {
      this.db.close((err) => {
        if (err) reject(err);
        else resolve();
      });
    });
  }
}

module.exports = ProgressTracker;
