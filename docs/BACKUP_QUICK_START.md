# Backup Quick Start Guide

## 🚀 5-Minute Setup

### Step 1: Add GitHub Secrets

Go to your GitHub repository → Settings → Secrets and variables → Actions → New repository secret

Add these secrets:
```
MONGODB_URI=mongodb+srv://YOUR_USERNAME:YOUR_PASSWORD@YOUR_CLUSTER.mongodb.net/YOUR_DATABASE
R2_ACCOUNT_ID=your_cloudflare_account_id
R2_ACCESS_KEY_ID=your_r2_access_key
R2_SECRET_ACCESS_KEY=your_r2_secret_key
```

### Step 2: Test Local Backup

```bash
# Install dependencies (if not already done)
npm install

# Run a test backup locally
npx tsx scripts/mongodb-backup.ts --local

# Check the backup folder
ls -lh backups/mongodb_*
```

### Step 3: Enable Automated Backups

The GitHub Actions workflows are already configured:
- **Daily backups**: Automatically run at 2:00 AM UTC
- **Weekly backups**: Automatically run Sundays at 3:00 AM UTC

To verify they're enabled:
1. Go to GitHub → Actions tab
2. You should see "Daily MongoDB Backup" and "Weekly Full Backup"
3. Click "Run workflow" to test manually

### Step 4: Verify First Backup

After the first automated run (or manual trigger):
1. Check GitHub Actions for green checkmark ✅
2. Verify R2 bucket has new files:
   - Go to Cloudflare dashboard → R2 → canvas-chemistry-assets
   - Look for `backups/mongodb/` folder

## 🆘 Emergency Recovery

### Quick Restore (If Data Lost)

```bash
# 1. List available backups
ls -lh backups/

# 2. Restore from latest backup (DRY RUN first!)
npx tsx scripts/mongodb-restore.ts ./backups/mongodb_LATEST --dry-run

# 3. If dry run looks good, restore for real
npx tsx scripts/mongodb-restore.ts ./backups/mongodb_LATEST
```

### Download Backup from R2 (If Local Backup Lost)

```bash
# Set up R2 credentials in .env.local
R2_ACCOUNT_ID=your_account_id
R2_ACCESS_KEY_ID=your_access_key
R2_SECRET_ACCESS_KEY=your_secret_key

# Download R2 backups
npx tsx scripts/r2-backup.ts ./downloaded-backups
```

## 📊 Check Backup Status

### View Latest Backup Info

```bash
# Find latest backup
ls -lt backups/ | head -n 5

# View backup metadata
cat backups/mongodb_LATEST/backup-metadata.json
```

### Monitor GitHub Actions

1. Go to GitHub → Actions tab
2. Check recent workflow runs
3. Green ✅ = success, Red ❌ = failed (investigate logs)

## 🔧 Common Commands

```bash
# Manual backup (local + R2)
npx tsx scripts/mongodb-backup.ts --local --r2

# Backup specific collections only
npx tsx scripts/mongodb-backup.ts --local --collections=questions_v2,student_responses

# Restore with confirmation
npx tsx scripts/mongodb-restore.ts ./backups/mongodb_2026-03-19T02-00-00

# Backup R2 assets
npx tsx scripts/r2-backup.ts ./r2-backup

# Clean up old backups (dry run)
npx tsx scripts/backup-retention-cleanup.ts --dry-run
```

## ⚠️ Important Notes

1. **Always run `--dry-run` first** when restoring
2. **Backups overwrite existing data** - be careful!
3. **Keep local backups** on an external drive monthly
4. **Test restore quarterly** to ensure backups work
5. **Monitor GitHub Actions** for failed backup runs

## 📞 Need Help?

See full documentation: `docs/BACKUP_DISASTER_RECOVERY.md`
