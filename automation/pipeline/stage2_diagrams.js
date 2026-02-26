// Stage 2: Diagram extraction, cropping, and SVG conversion
const sharp = require('sharp');
const fs = require('fs').promises;
const path = require('path');
const { generateUniqueFilename, sleep, ensureDir } = require('./utils');
const { uploadToR2 } = require('../../lib/r2Storage');

class DiagramProcessor {
  constructor(config, logger) {
    this.config = config;
    this.logger = logger;
    this.svgInputFolder = config.paths.svgInput;
    this.svgOutputFolder = config.paths.svgOutput;
    this.croppedFolder = config.paths.diagramsCropped;
  }

  /**
   * Process all diagrams detected in a question
   */
  async processDiagrams(imagePath, diagrams, questionId) {
    if (!diagrams || diagrams.length === 0) {
      return [];
    }

    await this.logger.info(`Processing ${diagrams.length} diagram(s) for question`, { questionId });

    const processedDiagrams = [];

    for (let i = 0; i < diagrams.length; i++) {
      const diagram = diagrams[i];
      try {
        const result = await this.processSingleDiagram(imagePath, diagram, questionId, i);
        processedDiagrams.push(result);
      } catch (error) {
        await this.logger.error(`Failed to process diagram ${i + 1}`, { error: error.message, diagram });
        processedDiagrams.push({
          ...diagram,
          status: 'failed',
          error: error.message,
        });
      }
    }

    return processedDiagrams;
  }

  /**
   * Process a single diagram: crop, convert to SVG, upload to R2
   */
  async processSingleDiagram(imagePath, diagram, questionId, index) {
    const { bbox, location, description } = diagram;

    // Step 1: Crop the diagram from the original image
    const croppedPath = await this.cropDiagram(imagePath, bbox, questionId, index);

    // Step 2: Convert to SVG using Mac Automator
    const svgPath = await this.convertToSVG(croppedPath);

    // Step 3: Upload to Cloudflare R2
    const cdnUrl = await this.uploadToR2(svgPath, questionId, location, description);

    // Step 4: Generate markdown link
    const markdownLink = `![${description || 'diagram'}](${cdnUrl})`;

    await this.logger.info(`Diagram processed successfully`, {
      questionId,
      location,
      cdnUrl,
    });

    return {
      location,
      description,
      bbox,
      croppedPath,
      svgPath,
      cdnUrl,
      markdownLink,
      status: 'success',
    };
  }

  /**
   * Crop diagram from image using bounding box coordinates
   */
  async cropDiagram(imagePath, bbox, questionId, index) {
    await ensureDir(this.croppedFolder);

    // Load image to get dimensions
    const image = sharp(imagePath);
    const metadata = await image.metadata();
    const { width: imgWidth, height: imgHeight } = metadata;

    // Convert percentage bbox to pixels
    const x = Math.round((bbox.x / 100) * imgWidth);
    const y = Math.round((bbox.y / 100) * imgHeight);
    const width = Math.round((bbox.width / 100) * imgWidth);
    const height = Math.round((bbox.height / 100) * imgHeight);

    // Add padding
    const padding = this.config.processing.diagrams.padding;
    const extractRegion = {
      left: Math.max(0, x - padding),
      top: Math.max(0, y - padding),
      width: Math.min(imgWidth - x + padding, width + 2 * padding),
      height: Math.min(imgHeight - y + padding, height + 2 * padding),
    };

    // Validate dimensions
    if (extractRegion.width < this.config.processing.diagrams.minWidth ||
        extractRegion.height < this.config.processing.diagrams.minHeight) {
      throw new Error(`Diagram too small: ${extractRegion.width}x${extractRegion.height}`);
    }

    // Crop and resize if needed
    let processedImage = image.extract(extractRegion);

    // Scale down if too large (to optimize SVG conversion)
    const targetMaxWidth = this.config.processing.diagrams.targetMaxWidth;
    if (extractRegion.width > targetMaxWidth) {
      const scaleFactor = targetMaxWidth / extractRegion.width;
      const newHeight = Math.round(extractRegion.height * scaleFactor);
      processedImage = processedImage.resize(targetMaxWidth, newHeight, {
        fit: 'inside',
        withoutEnlargement: true,
      });
    }

    // Save cropped image
    const filename = generateUniqueFilename(`${questionId}_diagram_${index + 1}`, 'png');
    const outputPath = path.join(this.croppedFolder, filename);

    await processedImage.png({ quality: 100 }).toFile(outputPath);

    await this.logger.debug(`Diagram cropped`, {
      questionId,
      index,
      bbox,
      extractRegion,
      outputPath,
    });

    return outputPath;
  }

  /**
   * Convert cropped image to SVG using Mac Automator
   */
  async convertToSVG(croppedImagePath) {
    // Copy image to Mac Automator input folder
    const filename = path.basename(croppedImagePath);
    const inputPath = path.join(this.svgInputFolder, filename);
    
    await fs.copyFile(croppedImagePath, inputPath);
    await this.logger.debug(`Copied to SVG automation input folder`, { inputPath });

    // Wait for SVG to appear in output folder
    const expectedSvgName = filename.replace(/\.png$/i, '.svg');
    const expectedSvgPath = path.join(this.svgOutputFolder, expectedSvgName);

    const timeout = this.config.processing.diagrams.svgConversionTimeout * 1000;
    const pollInterval = this.config.processing.diagrams.svgPollingInterval;
    const startTime = Date.now();

    while (Date.now() - startTime < timeout) {
      try {
        await fs.access(expectedSvgPath);
        // SVG file exists!
        await this.logger.debug(`SVG conversion complete`, { expectedSvgPath });
        
        // Wait a bit more to ensure file is fully written
        await sleep(500);
        
        return expectedSvgPath;
      } catch (error) {
        // File doesn't exist yet, keep waiting
        await sleep(pollInterval);
      }
    }

    throw new Error(`SVG conversion timeout after ${timeout}ms`);
  }

  /**
   * Upload SVG to Cloudflare R2
   */
  async uploadToR2(svgPath, questionId, location, description) {
    if (!this.config.features.enableR2Upload) {
      await this.logger.warn('R2 upload disabled, returning local path');
      return `file://${svgPath}`;
    }

    // Read SVG file
    const svgBuffer = await fs.readFile(svgPath);
    
    // Generate storage path
    const timestamp = Date.now();
    const sanitizedDesc = (description || 'diagram')
      .replace(/[^a-z0-9]/gi, '_')
      .toLowerCase()
      .substring(0, 30);
    const hash = require('crypto').randomBytes(4).toString('hex');
    const fileName = `${timestamp}_${sanitizedDesc}_${hash}.svg`;
    
    // Upload to R2 with organized path structure
    const storagePath = `questions/${questionId}/svg/${fileName}`;
    
    const result = await uploadToR2(
      svgBuffer,
      fileName,
      'svg',
      'image/svg+xml',
      storagePath
    );

    await this.logger.info(`Uploaded SVG to R2`, {
      questionId,
      location,
      cdnUrl: result.cdnUrl,
    });

    // Clean up local files
    try {
      await fs.unlink(svgPath);
      await this.logger.debug(`Cleaned up local SVG file`, { svgPath });
    } catch (error) {
      await this.logger.warn(`Failed to clean up SVG file`, { svgPath, error: error.message });
    }

    return result.cdnUrl;
  }

  /**
   * Insert diagram markdown links into question text and options
   */
  insertDiagramLinks(questionData, processedDiagrams) {
    const successfulDiagrams = processedDiagrams.filter(d => d.status === 'success');

    if (successfulDiagrams.length === 0) {
      return questionData;
    }

    // Group diagrams by location
    const diagramsByLocation = {};
    for (const diagram of successfulDiagrams) {
      if (!diagramsByLocation[diagram.location]) {
        diagramsByLocation[diagram.location] = [];
      }
      diagramsByLocation[diagram.location].push(diagram);
    }

    // Insert into question text
    if (diagramsByLocation.question) {
      const links = diagramsByLocation.question.map(d => d.markdownLink).join('\n\n');
      questionData.question_text += `\n\n${links}`;
    }

    // Insert into options
    if (questionData.options) {
      for (const option of questionData.options) {
        const locationKey = `option_${option.id}`;
        if (diagramsByLocation[locationKey]) {
          const links = diagramsByLocation[locationKey].map(d => d.markdownLink).join('\n\n');
          option.text += `\n\n${links}`;
        }
      }
    }

    return questionData;
  }

  /**
   * Check if Mac Automator folders are accessible
   */
  async checkAutomatorSetup() {
    try {
      await fs.access(this.svgInputFolder);
      await fs.access(this.svgOutputFolder);
      await this.logger.info('Mac Automator folders accessible', {
        input: this.svgInputFolder,
        output: this.svgOutputFolder,
      });
      return true;
    } catch (error) {
      await this.logger.error('Mac Automator folders not accessible', {
        input: this.svgInputFolder,
        output: this.svgOutputFolder,
        error: error.message,
      });
      return false;
    }
  }
}

module.exports = DiagramProcessor;
