#!/bin/bash

# Setup script to copy essential files from main project to question ingestion workspace
# Run this from the main canvas project directory

echo "🚀 Setting up Question Ingestion Workspace..."

WORKSPACE_DIR="./question-ingestion-workspace"
MAIN_DIR="."

# Create directory structure
echo "📁 Creating directory structure..."
mkdir -p "$WORKSPACE_DIR/app/admin"
mkdir -p "$WORKSPACE_DIR/app/api/v2/questions"
mkdir -p "$WORKSPACE_DIR/app/api/v2/assets"
mkdir -p "$WORKSPACE_DIR/app/api/v2/taxonomy"
mkdir -p "$WORKSPACE_DIR/app/api/ai"
mkdir -p "$WORKSPACE_DIR/lib/models"
mkdir -p "$WORKSPACE_DIR/.agent/workflows"

# Copy admin panel
echo "📋 Copying admin panel..."
cp -r "$MAIN_DIR/app/crucible/admin" "$WORKSPACE_DIR/app/"

# Copy API routes
echo "🔌 Copying API routes..."
cp -r "$MAIN_DIR/app/api/v2/questions" "$WORKSPACE_DIR/app/api/v2/"
cp -r "$MAIN_DIR/app/api/v2/assets" "$WORKSPACE_DIR/app/api/v2/"
cp -r "$MAIN_DIR/app/api/v2/taxonomy" "$WORKSPACE_DIR/app/api/v2/"
cp -r "$MAIN_DIR/app/api/v2/chapters" "$WORKSPACE_DIR/app/api/v2/"
cp -r "$MAIN_DIR/app/api/ai" "$WORKSPACE_DIR/app/api/"

# Copy MongoDB models
echo "💾 Copying database models..."
cp "$MAIN_DIR/lib/mongodb.ts" "$WORKSPACE_DIR/lib/"
cp -r "$MAIN_DIR/lib/models" "$WORKSPACE_DIR/lib/"

# Copy R2 storage utilities
echo "☁️ Copying R2 storage utilities..."
cp "$MAIN_DIR/lib/r2Storage.ts" "$WORKSPACE_DIR/lib/" 2>/dev/null || echo "⚠️  r2Storage.ts not found, skipping..."

# Copy workflows
echo "📝 Copying workflows..."
cp "$MAIN_DIR/.agent/workflows/QUESTION_INGESTION_WORKFLOW.md" "$WORKSPACE_DIR/.agent/workflows/" 2>/dev/null || echo "⚠️  Workflow file not found, skipping..."

# Copy essential components
echo "🎨 Copying shared components..."
mkdir -p "$WORKSPACE_DIR/components"
cp "$MAIN_DIR/components/MathRenderer.tsx" "$WORKSPACE_DIR/components/" 2>/dev/null || echo "⚠️  MathRenderer not found, skipping..."

# Create minimal app layout
echo "🏗️ Creating app layout..."
cat > "$WORKSPACE_DIR/app/layout.tsx" << 'EOF'
import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Question Ingestion - Canvas Classes",
  description: "Admin workspace for question management",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
EOF

# Create globals.css
cat > "$WORKSPACE_DIR/app/globals.css" << 'EOF'
@tailwind base;
@tailwind components;
@tailwind utilities;

body {
  @apply bg-gray-950 text-white;
}
EOF

# Create postcss config
cat > "$WORKSPACE_DIR/postcss.config.mjs" << 'EOF'
export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
};
EOF

# Create .gitignore
cat > "$WORKSPACE_DIR/.gitignore" << 'EOF'
# Dependencies
node_modules/
.pnp
.pnp.js

# Next.js
.next/
out/
build/
dist/

# Environment variables
.env
.env.local
.env.production.local
.env.development.local
.env.test.local

# Debug
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# OS
.DS_Store
*.pem

# IDE
.vscode/
.idea/
*.swp
*.swo
*~

# TypeScript
*.tsbuildinfo
next-env.d.ts
EOF

echo ""
echo "✅ Workspace setup complete!"
echo ""
echo "📋 Next steps:"
echo "1. cd question-ingestion-workspace"
echo "2. cp .env.example .env.local"
echo "3. Edit .env.local with your MongoDB URI and R2 credentials"
echo "4. npm install"
echo "5. npm run dev"
echo ""
echo "🎯 The admin panel will be available at http://localhost:3000"
