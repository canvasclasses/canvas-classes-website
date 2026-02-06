/**
 * Download graph images from Mathpix CDN
 */
const https = require('https');
const fs = require('fs');
const path = require('path');

const GRAPHS_DIR = path.join(__dirname, '../public/graphs');

const images = [
    // 21st Jan Morning
    { url: 'https://cdn.mathpix.com/cropped/bcb96d5e-6a15-42e9-a78b-38ba93653797-01.jpg?height=307&width=659&top_left_y=1957&top_left_x=214', filename: 'jee2026_jan21m_q53_reaction.jpg' },
    { url: 'https://cdn.mathpix.com/cropped/bcb96d5e-6a15-42e9-a78b-38ba93653797-05.jpg?height=184&width=769&top_left_y=280&top_left_x=207', filename: 'jee2026_jan21m_q74_reaction.jpg' },
    // Q68 graph options
    { url: 'https://cdn.mathpix.com/cropped/bcb96d5e-6a15-42e9-a78b-38ba93653797-03.jpg?height=428&width=453&top_left_y=607&top_left_x=1206', filename: 'jee2026_jan21m_q68_opt1.jpg' },
    { url: 'https://cdn.mathpix.com/cropped/bcb96d5e-6a15-42e9-a78b-38ba93653797-03.jpg?height=425&width=456&top_left_y=1069&top_left_x=1201', filename: 'jee2026_jan21m_q68_opt2.jpg' },
    { url: 'https://cdn.mathpix.com/cropped/bcb96d5e-6a15-42e9-a78b-38ba93653797-03.jpg?height=440&width=458&top_left_y=1525&top_left_x=1199', filename: 'jee2026_jan21m_q68_opt3.jpg' },
    { url: 'https://cdn.mathpix.com/cropped/bcb96d5e-6a15-42e9-a78b-38ba93653797-03.jpg?height=421&width=451&top_left_y=1996&top_left_x=1206', filename: 'jee2026_jan21m_q68_opt4.jpg' },
    // Q69 graph
    { url: 'https://cdn.mathpix.com/cropped/bcb96d5e-6a15-42e9-a78b-38ba93653797-04.jpg?height=364&width=602&top_left_y=964&top_left_x=214', filename: 'jee2026_jan21m_q69_graph.jpg' },
];

function downloadImage(url, filepath) {
    return new Promise((resolve, reject) => {
        const file = fs.createWriteStream(filepath);
        https.get(url, (response) => {
            if (response.statusCode === 302 || response.statusCode === 301) {
                // Follow redirect
                https.get(response.headers.location, (res) => {
                    res.pipe(file);
                    file.on('finish', () => {
                        file.close();
                        resolve(filepath);
                    });
                });
            } else {
                response.pipe(file);
                file.on('finish', () => {
                    file.close();
                    resolve(filepath);
                });
            }
        }).on('error', (err) => {
            fs.unlink(filepath, () => { });
            reject(err);
        });
    });
}

async function downloadAll() {
    console.log('Downloading graph images...\n');

    for (const img of images) {
        const filepath = path.join(GRAPHS_DIR, img.filename);
        try {
            await downloadImage(img.url, filepath);
            console.log(`✓ Downloaded: ${img.filename}`);
        } catch (err) {
            console.log(`✗ Failed: ${img.filename} - ${err.message}`);
        }
    }

    console.log('\n✅ Download complete!');
}

downloadAll();
