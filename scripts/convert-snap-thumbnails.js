const sharp = require('sharp');
const fs = require('fs').promises;
const path = require('path');

const templatesDir = path.join(__dirname, '../public/snap/templates');

async function convertToWebP() {
  const files = await fs.readdir(templatesDir);
  const jpgFiles = files.filter(f => f.endsWith('.jpg') || f.endsWith('.jpeg'));

  console.log(`Found ${jpgFiles.length} JPG files to convert...`);

  for (const file of jpgFiles) {
    const inputPath = path.join(templatesDir, file);
    const outputPath = path.join(templatesDir, file.replace(/\.(jpg|jpeg)$/i, '.webp'));

    const inputStat = await fs.stat(inputPath);

    await sharp(inputPath)
      .resize(800, 1000, {
        fit: 'cover',
        position: 'center',
        withoutEnlargement: true
      })
      .webp({ quality: 85 })
      .toFile(outputPath);

    const outputStat = await fs.stat(outputPath);
    const reduction = ((1 - outputStat.size / inputStat.size) * 100).toFixed(1);

    console.log(
      `✓ ${file} → ${path.basename(outputPath)} ` +
      `(${(inputStat.size / 1024).toFixed(0)}KB → ${(outputStat.size / 1024).toFixed(0)}KB, -${reduction}%)`
    );
  }

  console.log('\nConversion complete!');
}

convertToWebP().catch(console.error);
