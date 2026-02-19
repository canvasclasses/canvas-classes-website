const fs = require('fs');
const path = require('path');

const questionsDir = '/Users/CanvasClasses/Desktop/canvas/data/questions';

// Files to archive (old chapter format)
const filesToArchive = [
  'chapter_aldehydes_ketones_and_carboxylic_acids.json',
  'chapter_amines.json',
  'chapter_aromatic_compounds.json',
  'chapter_atomic_structure.json',
  'chapter_biomolecules.json',
  'chapter_chemical_bonding.json',
  'chapter_chemical_equilibrium.json',
  'chapter_chemical_kinetics.json',
  'chapter_coordination_compounds.json',
  'chapter_d_and_f_block.json',
  'chapter_electrochemistry.json',
  'chapter_general_organic_chemistry.json',
  'chapter_hydrocarbons.json',
  'chapter_periodic_properties.json',
  'chapter_salt_analysis.json',
  'chapter_solutions.json',
  'chapter_stereochemistry.json',
  'chapter_structure_of_atom.json',
  'chapter_thermodynamics.json',
  'chapter_uncategorized.json'
];

console.log('🗄️  ARCHIVING OLD CHAPTER FILES\n');
console.log('This will rename old format files to prevent future conflicts\n');

let archived = 0;
let skipped = 0;

filesToArchive.forEach(filename => {
  const filepath = path.join(questionsDir, filename);
  const archivePath = filepath + '.OLD_ARCHIVED';
  
  try {
    if (fs.existsSync(filepath)) {
      // Check if already archived
      if (fs.existsSync(archivePath)) {
        console.log(`⚠️  ${filename} - Already archived`);
        skipped++;
      } else {
        fs.renameSync(filepath, archivePath);
        console.log(`✅ ${filename} - Archived`);
        archived++;
      }
    } else {
      console.log(`⏭️  ${filename} - Not found (already archived or doesn't exist)`);
      skipped++;
    }
  } catch (error) {
    console.log(`❌ ${filename} - Error: ${error.message}`);
  }
});

console.log(`\n📊 Summary: ${archived} archived, ${skipped} skipped`);
console.log('\n✅ Cleanup complete! All old chapter files archived.');
console.log('📁 Active data source: /data/chapters/');
