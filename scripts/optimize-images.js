// Image optimization script - converts PNG to WebP
const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const publicDir = './public';

// Images to optimize (large PNGs)
const imagesToOptimize = [
    'student_avatar_fixed.png',
    'student_v2.png',
    'student_avatar.png',
    'paaras_hero.png',
    'student_final.png',
    'student_character.png',
    'molecular_bg.png',
    'neet_student.png',
    'revision_student.png',
    'revision_student_new.png',
    'jee_student.png',
    'nebula_bg.png',
    'logo.png',
];

async function optimizeImages() {
    console.log('🖼️  Starting image optimization...\n');

    let totalOriginal = 0;
    let totalOptimized = 0;

    for (const filename of imagesToOptimize) {
        const inputPath = path.join(publicDir, filename);
        const outputFilename = filename.replace(/\.png$/, '.webp');
        const outputPath = path.join(publicDir, outputFilename);

        if (!fs.existsSync(inputPath)) {
            console.log(`⚠️  Skipping ${filename} (not found)`);
            continue;
        }

        const originalStats = fs.statSync(inputPath);
        const originalSize = originalStats.size;
        totalOriginal += originalSize;

        try {
            await sharp(inputPath)
                .webp({ quality: 85 })
                .toFile(outputPath);

            const optimizedStats = fs.statSync(outputPath);
            const optimizedSize = optimizedStats.size;
            totalOptimized += optimizedSize;

            const savings = ((1 - optimizedSize / originalSize) * 100).toFixed(1);
            console.log(`✅ ${filename}`);
            console.log(`   ${(originalSize / 1024).toFixed(0)} KB → ${(optimizedSize / 1024).toFixed(0)} KB (${savings}% smaller)\n`);
        } catch (error) {
            console.log(`❌ Error processing ${filename}: ${error.message}`);
        }
    }

    console.log('━'.repeat(50));
    console.log(`📊 Total: ${(totalOriginal / 1024 / 1024).toFixed(2)} MB → ${(totalOptimized / 1024 / 1024).toFixed(2)} MB`);
    console.log(`💾 Saved: ${((totalOriginal - totalOptimized) / 1024 / 1024).toFixed(2)} MB (${((1 - totalOptimized / totalOriginal) * 100).toFixed(1)}%)`);
}

optimizeImages().catch(console.error);
