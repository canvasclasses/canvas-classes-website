#!/bin/bash

# Automated Update Script for Mac Mini Workspace
# Run this from your existing workspace directory

echo "🔄 Applying updates to Question Ingestion Workspace..."
echo ""

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: package.json not found. Please run this from your workspace root."
    exit 1
fi

echo "📦 Backing up current package.json..."
cp package.json package.json.backup

echo "📋 Copying new components..."
mkdir -p app/admin/components
mkdir -p lib
mkdir -p .agent/workflows

cp UPDATES_2026-03-10/app/admin/components/MathRenderer.tsx app/admin/components/
cp UPDATES_2026-03-10/lib/latexValidator.ts lib/
cp UPDATES_2026-03-10/.agent/workflows/LATEX_VALIDATION_WORKFLOW.md .agent/workflows/

echo "📚 Copying documentation..."
cp UPDATES_2026-03-10/LATEX_STYLE_GUIDE.md .
cp UPDATES_2026-03-10/QUICK_START.md .
cp UPDATES_2026-03-10/SECURITY_NOTICE.md .

echo "⚙️  Updating package.json..."
# Note: This requires manual merge or use the new package.json
echo "⚠️  Please manually merge dependencies from UPDATES_2026-03-10/package.json"
echo "   Or replace with: cp UPDATES_2026-03-10/package.json package.json"

echo ""
echo "✅ Files copied successfully!"
echo ""
echo "📋 Next steps:"
echo "1. Review UPDATES_2026-03-10/package.json"
echo "2. Merge new dependencies into your package.json"
echo "3. Run: npm install"
echo "4. Run: npm run dev"
echo "5. Test LaTeX rendering"
echo ""
echo "💾 Your original package.json is backed up as package.json.backup"
