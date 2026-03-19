# Backup & Disaster Recovery Strategy

## Overview

This document outlines the comprehensive backup and disaster recovery strategy for Canvas Classes, protecting against data loss from MongoDB breaches, accidental deletions, or infrastructure failures.

## 🎯 Backup Strategy (3-2-1 Rule)

- **3** copies of data (production + 2 backups)
- **2** different storage locations (R2 cloud + GitHub artifacts)
- **1** offsite backup (Cloudflare R2)

## 📊 What Gets Backed Up

### Critical Collections (Daily Backups)
1. **`questions_v2`** - Question bank (your core content)
2. **`student_responses`** - User practice data & answers
3. **`student_chapter_profiles`** - User proficiency & progress
4. **`example_view_sessions`** - Worked examples tracking
5. **`activity_logs`** - User activity & engagement
6. **`assets`** - Asset metadata (SVG/images/audio)
7. **`audit_logs`** - Audit trail for compliance
8. **`chapters`** - Chapter data (backup)
9. **`taxonomy`** - Taxonomy data (backup)

### Asset Files (Weekly Backups)
- All R2 bucket contents (SVG diagrams, images, audio)
- Stored in `questions/{question_id}/` organized structure

## 🔄 Backup Schedule

### Daily Backups (Automated)
- **When**: 2:00 AM UTC (7:30 AM IST) daily
- **What**: All MongoDB collections → Cloudflare R2
- **Retention**: 30 days
- **Location**: `r2://canvas-chemistry-assets/backups/mongodb/`
- **Automation**: GitHub Actions (`.github/workflows/daily-backup.yml`)

### Weekly Backups (Automated)
- **When**: Sunday 3:00 AM UTC (8:30 AM IST)
- **What**: MongoDB + R2 assets → GitHub Artifacts
- **Retention**: 90 days
- **Location**: GitHub Actions artifacts
- **Automation**: GitHub Actions (`.github/workflows/weekly-backup.yml`)

### Monthly Backups (Manual)
- **When**: 1st of each month
- **What**: Full backup to local encrypted drive
- **Retention**: 1 year
- **Location**: Local secure storage

## 🛠️ Backup Scripts

### 1. MongoDB Backup (`scripts/mongodb-backup.ts`)

**Basic usage:**
```bash
# Local backup only
npx tsx scripts/mongodb-backup.ts --local

# Cloud backup to R2
npx tsx scripts/mongodb-backup.ts --r2

# Both local and cloud
npx tsx scripts/mongodb-backup.ts --local --r2

# Specific collections only
npx tsx scripts/mongodb-backup.ts --r2 --collections=questions_v2,student_responses
```

**Output:**
- JSON files (human-readable)
- Compressed .json.gz files (storage-efficient, 70-80% compression)
- `backup-metadata.json` with statistics

### 2. MongoDB Restore (`scripts/mongodb-restore.ts`)

**⚠️ WARNING: This OVERWRITES existing data!**

```bash
# Dry run (preview what would be restored)
npx tsx scripts/mongodb-restore.ts ./backups/mongodb_2026-03-19T12-00-00 --dry-run

# Restore all collections
npx tsx scripts/mongodb-restore.ts ./backups/mongodb_2026-03-19T12-00-00

# Restore specific collections only
npx tsx scripts/mongodb-restore.ts ./backups/mongodb_2026-03-19T12-00-00 --collections=questions_v2
```

**Safety features:**
- Confirmation prompt before deletion
- Dry-run mode for testing
- Detailed logging of all operations

### 3. R2 Assets Backup (`scripts/r2-backup.ts`)

```bash
# Download all R2 assets to local folder
npx tsx scripts/r2-backup.ts ./r2-backup

# Custom output directory
npx tsx scripts/r2-backup.ts /path/to/backup/folder
```

### 4. Retention Cleanup (`scripts/backup-retention-cleanup.ts`)

**Retention policy:**
- Daily backups: Keep for 30 days
- Weekly backups (Sundays): Keep for 90 days
- Monthly backups (1st of month): Keep for 1 year
- Older backups: Automatically deleted

```bash
# Dry run (see what would be deleted)
npx tsx scripts/backup-retention-cleanup.ts --dry-run

# Execute cleanup
npx tsx scripts/backup-retention-cleanup.ts
```

## 🚨 Disaster Recovery Procedures

### Scenario 1: MongoDB Account Breach

**Immediate actions:**
1. **Disconnect compromised MongoDB cluster** from application
2. **Provision new MongoDB cluster** with fresh credentials
3. **Restore from latest backup:**
   ```bash
   # Download latest backup from R2 (if needed)
   # Then restore
   npx tsx scripts/mongodb-restore.ts ./backups/mongodb_LATEST
   ```
4. **Update `MONGODB_URI`** in Vercel environment variables
5. **Verify data integrity** by spot-checking questions and user profiles
6. **Monitor for anomalies** in the first 24 hours

**Recovery Time Objective (RTO):** < 2 hours  
**Recovery Point Objective (RPO):** < 24 hours (daily backups)

### Scenario 2: Accidental Data Deletion

**Example: Accidentally deleted 100 questions**

1. **Stop all write operations** to affected collections
2. **Identify last good backup** (check `backup-metadata.json`)
3. **Restore specific collection:**
   ```bash
   npx tsx scripts/mongodb-restore.ts ./backups/mongodb_2026-03-19T02-00-00 --collections=questions_v2
   ```
4. **Verify restored data**
5. **Resume normal operations**

**RTO:** < 1 hour  
**RPO:** < 24 hours

### Scenario 3: R2 Asset Loss

**Example: SVG diagrams accidentally deleted**

1. **Download latest R2 backup:**
   ```bash
   npx tsx scripts/r2-backup.ts ./r2-restore
   ```
2. **Re-upload to R2** using R2 dashboard or S3 API
3. **Verify asset URLs** are accessible

**RTO:** < 3 hours  
**RPO:** < 7 days (weekly backups)

### Scenario 4: Complete Infrastructure Loss

**Example: Both MongoDB and R2 compromised**

1. **Provision new infrastructure:**
   - New MongoDB cluster
   - New R2 bucket (or use existing)
2. **Restore MongoDB from GitHub artifacts** (weekly backup)
3. **Restore R2 assets from GitHub artifacts**
4. **Update all environment variables**
5. **Full system verification**

**RTO:** < 6 hours  
**RPO:** < 7 days

## 📋 Setup Checklist

### Initial Setup (One-time)

- [ ] **Add GitHub Secrets** (Settings → Secrets and variables → Actions):
  - `MONGODB_URI`
  - `R2_ACCOUNT_ID`
  - `R2_ACCESS_KEY_ID`
  - `R2_SECRET_ACCESS_KEY`

- [ ] **Test backup scripts locally:**
  ```bash
  npx tsx scripts/mongodb-backup.ts --local
  npx tsx scripts/mongodb-restore.ts ./backups/mongodb_LATEST --dry-run
  npx tsx scripts/r2-backup.ts ./test-r2-backup
  ```

- [ ] **Enable GitHub Actions workflows:**
  - Go to Actions tab in GitHub
  - Enable workflows if disabled
  - Manually trigger daily-backup workflow to test

- [ ] **Set up local backup drive:**
  - External SSD/HDD with encryption
  - Monthly manual backup schedule reminder

- [ ] **Document recovery contacts:**
  - MongoDB Atlas support
  - Cloudflare R2 support
  - Team members with access

### Monthly Maintenance

- [ ] **Review backup logs** in GitHub Actions
- [ ] **Test restore procedure** on staging environment
- [ ] **Run retention cleanup:**
  ```bash
  npx tsx scripts/backup-retention-cleanup.ts
  ```
- [ ] **Verify backup sizes** are reasonable (not growing unexpectedly)
- [ ] **Update this document** if procedures change

### Quarterly Audit

- [ ] **Full disaster recovery drill:**
  - Restore to test MongoDB cluster
  - Verify all collections
  - Check data integrity
- [ ] **Review and update RTO/RPO targets**
- [ ] **Audit access controls** for backup systems
- [ ] **Review retention policy** effectiveness

## 📊 Monitoring & Alerts

### Backup Success Monitoring

**GitHub Actions:**
- Email notifications on workflow failure (configure in GitHub settings)
- Check Actions tab weekly for any failed runs

**Manual checks:**
```bash
# List recent R2 backups
aws s3 ls s3://canvas-chemistry-assets/backups/mongodb/ \
  --endpoint-url https://${R2_ACCOUNT_ID}.r2.cloudflarestorage.com \
  --profile r2
```

### Backup Size Trends

Monitor backup sizes to detect:
- Unexpected data growth (possible data corruption)
- Backup failures (size = 0)
- Compression issues

Expected sizes (as of March 2026):
- `questions_v2`: ~50-100 MB uncompressed
- `student_responses`: ~10-50 MB (grows over time)
- `student_chapter_profiles`: ~5-20 MB
- Total: ~100-200 MB uncompressed, ~20-40 MB compressed

## 🔐 Security Best Practices

1. **Encrypt backups at rest** (R2 provides encryption by default)
2. **Use separate credentials** for backup operations
3. **Limit backup access** to essential team members only
4. **Rotate R2 access keys** every 90 days
5. **Never commit credentials** to git (use environment variables)
6. **Audit backup access logs** monthly

## 📞 Emergency Contacts

**MongoDB Atlas Support:**
- Email: support@mongodb.com
- Emergency: https://support.mongodb.com

**Cloudflare R2 Support:**
- Dashboard: https://dash.cloudflare.com
- Support: https://support.cloudflare.com

**Internal Team:**
- Primary: [Your contact info]
- Secondary: [Backup contact]

## 🔄 Backup Verification

### Automated Verification (TODO - Future Enhancement)

Create a monthly verification script that:
1. Restores backup to test MongoDB cluster
2. Runs data integrity checks
3. Compares document counts with production
4. Sends report via email

### Manual Verification (Current)

Monthly spot-check:
```bash
# 1. Download latest backup
npx tsx scripts/mongodb-backup.ts --local

# 2. Check metadata
cat backups/mongodb_LATEST/backup-metadata.json

# 3. Verify document counts match production
# (Compare with MongoDB Atlas dashboard)
```

## 📈 Future Improvements

1. **Point-in-Time Recovery** - Enable MongoDB Atlas continuous backups
2. **Automated restore testing** - Monthly automated restore to staging
3. **Cross-region replication** - Store backups in multiple geographic regions
4. **Incremental backups** - Only backup changed documents (reduce storage costs)
5. **Backup encryption** - Add client-side encryption before upload
6. **Notification system** - Slack/Discord alerts for backup status
7. **Backup dashboard** - Web UI to monitor backup health

## 📝 Version History

- **v1.0** (March 2026) - Initial backup strategy implementation
  - Daily MongoDB backups to R2
  - Weekly full backups to GitHub artifacts
  - Restore scripts with safety features
  - Retention policy automation
