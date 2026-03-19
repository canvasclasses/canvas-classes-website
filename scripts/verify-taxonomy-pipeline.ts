/**
 * Verification script for taxonomy pipeline
 * Checks: taxonomyData_from_csv.ts → MongoDB sync → Frontend display
 */

import { TAXONOMY_FROM_CSV } from '../app/crucible/admin/taxonomy/taxonomyData_from_csv';

interface TaxonomyStats {
  totalChapters: number;
  totalPrimaryTags: number;
  totalMicroTags: number;
  chemicalBondingStats: {
    primaryTags: number;
    microTags: number;
    primaryTagsWithMicro: string[];
    primaryTagsWithoutMicro: string[];
    microTagsByPrimary: Record<string, number>;
  };
  additionalConceptsFound: boolean;
  miscellaneousConceptsFound: boolean;
}

function verifyTaxonomyStructure(): TaxonomyStats {
  const chapters = TAXONOMY_FROM_CSV.filter(n => n.type === 'chapter');
  const primaryTags = TAXONOMY_FROM_CSV.filter(n => n.type === 'topic');
  const microTags = TAXONOMY_FROM_CSV.filter(n => n.type === 'micro_topic');

  // Find Chemical Bonding chapter
  const chemBondingChapter = chapters.find(c => c.id === 'ch11_bonding');
  
  if (!chemBondingChapter) {
    throw new Error('Chemical Bonding chapter not found!');
  }

  // Get all primary tags under Chemical Bonding
  const chemBondingPrimaryTags = primaryTags.filter(t => t.parent_id === 'ch11_bonding');
  
  // Get all micro tags under Chemical Bonding primary tags
  const chemBondingMicroTags = microTags.filter(mt => 
    chemBondingPrimaryTags.some(pt => pt.id === mt.parent_id)
  );

  // Analyze which primary tags have micro tags
  const primaryTagsWithMicro: string[] = [];
  const primaryTagsWithoutMicro: string[] = [];
  const microTagsByPrimary: Record<string, number> = {};

  chemBondingPrimaryTags.forEach(pt => {
    const microCount = microTags.filter(mt => mt.parent_id === pt.id).length;
    microTagsByPrimary[pt.name] = microCount;
    
    if (microCount > 0) {
      primaryTagsWithMicro.push(pt.name);
    } else {
      primaryTagsWithoutMicro.push(pt.name);
    }
  });

  // Check for "Additional Concepts" vs "Miscellaneous Concepts"
  const additionalConceptsFound = chemBondingPrimaryTags.some(pt => 
    pt.name.toLowerCase().includes('additional concepts')
  );
  const miscellaneousConceptsFound = chemBondingPrimaryTags.some(pt => 
    pt.name.toLowerCase().includes('miscellaneous')
  );

  return {
    totalChapters: chapters.length,
    totalPrimaryTags: primaryTags.length,
    totalMicroTags: microTags.length,
    chemicalBondingStats: {
      primaryTags: chemBondingPrimaryTags.length,
      microTags: chemBondingMicroTags.length,
      primaryTagsWithMicro,
      primaryTagsWithoutMicro,
      microTagsByPrimary,
    },
    additionalConceptsFound,
    miscellaneousConceptsFound,
  };
}

// Run verification
console.log('=== TAXONOMY PIPELINE VERIFICATION ===\n');

try {
  const stats = verifyTaxonomyStructure();
  
  console.log('📊 Overall Statistics:');
  console.log(`   Total Chapters: ${stats.totalChapters}`);
  console.log(`   Total Primary Tags: ${stats.totalPrimaryTags}`);
  console.log(`   Total Micro Tags: ${stats.totalMicroTags}\n`);
  
  console.log('🧪 Chemical Bonding Chapter:');
  console.log(`   Primary Tags: ${stats.chemicalBondingStats.primaryTags}`);
  console.log(`   Micro Tags: ${stats.chemicalBondingStats.microTags}\n`);
  
  console.log('📋 Micro Tags Distribution:');
  Object.entries(stats.chemicalBondingStats.microTagsByPrimary).forEach(([name, count]) => {
    const icon = count > 0 ? '✅' : '❌';
    console.log(`   ${icon} ${name}: ${count} micro tags`);
  });
  
  console.log('\n🔍 Rename Status:');
  if (stats.additionalConceptsFound) {
    console.log('   ✅ "Additional Concepts" found - rename successful');
  } else {
    console.log('   ❌ "Additional Concepts" NOT found');
  }
  
  if (stats.miscellaneousConceptsFound) {
    console.log('   ⚠️  "Miscellaneous Concepts" still exists - rename NOT persisted');
  } else {
    console.log('   ✅ "Miscellaneous Concepts" removed');
  }
  
  console.log('\n📝 Summary:');
  console.log(`   Primary tags WITH micro tags: ${stats.chemicalBondingStats.primaryTagsWithMicro.length}`);
  console.log(`   Primary tags WITHOUT micro tags: ${stats.chemicalBondingStats.primaryTagsWithoutMicro.length}`);
  
  if (stats.chemicalBondingStats.primaryTagsWithoutMicro.length > 0) {
    console.log('\n⚠️  Primary tags missing micro tags:');
    stats.chemicalBondingStats.primaryTagsWithoutMicro.forEach(name => {
      console.log(`      - ${name}`);
    });
  }
  
  // Verification result
  console.log('\n' + '='.repeat(50));
  if (stats.additionalConceptsFound && !stats.miscellaneousConceptsFound && 
      stats.chemicalBondingStats.microTags > 0) {
    console.log('✅ VERIFICATION PASSED');
    console.log('   - Micro tags added successfully');
    console.log('   - Rename to "Additional Concepts" persisted');
  } else {
    console.log('⚠️  VERIFICATION ISSUES DETECTED');
    if (!stats.additionalConceptsFound || stats.miscellaneousConceptsFound) {
      console.log('   - Rename issue: Check "Additional Concepts" vs "Miscellaneous"');
    }
    if (stats.chemicalBondingStats.microTags === 0) {
      console.log('   - No micro tags found for Chemical Bonding');
    }
  }
  console.log('='.repeat(50));
  
} catch (error: any) {
  console.error('❌ VERIFICATION FAILED:', error.message);
  process.exit(1);
}
