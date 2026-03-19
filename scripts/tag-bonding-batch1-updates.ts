/**
 * Chemical Bonding - Batch 1 Tagging Updates
 * Expert tagging by chemistry subject matter expert for JEE
 * 
 * Tagging Guidelines:
 * - Cognitive Type: recall | conceptual | application | procedural | multi-step | analytical
 * - Calc Load: calc-none | calc-light | calc-moderate | calc-heavy | calc-trap
 * - Entry Point: clear-entry | strategy-first | novel-framing
 */

import mongoose from 'mongoose';
import { QuestionV2 } from '../lib/models/Question.v2';

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error('MONGODB_URI environment variable is not set');
  process.exit(1);
}

interface QuestionUpdate {
  display_id: string;
  primary_tag_id: string; // Corrected if needed
  microConcept: string;
  cognitiveType: 'recall' | 'conceptual' | 'application' | 'procedural' | 'multi-step' | 'analytical';
  calcLoad: 'calc-none' | 'calc-light' | 'calc-moderate' | 'calc-heavy' | 'calc-trap';
  entryPoint: 'clear-entry' | 'strategy-first' | 'novel-framing';
  isMultiConcept: boolean;
  reasoning: string;
}

const batch1Updates: QuestionUpdate[] = [
  {
    display_id: 'BOND-001',
    primary_tag_id: 'tag_bonding_2', // CORRECTED: Was tag_bonding_1, should be Basics/Octet Rule
    microConcept: 'Octet Rule Exceptions',
    cognitiveType: 'recall',
    calcLoad: 'calc-none',
    entryPoint: 'clear-entry',
    isMultiConcept: false,
    reasoning: 'Counting exceptions to octet rule - requires recall of which molecules violate octet (NO2, BF3, ClO2, SF4). Direct counting task.'
  },
  {
    display_id: 'BOND-002',
    primary_tag_id: 'tag_bonding_6', // CORRECTED: Was tag_bonding_1, should be VSEPR & Geometry
    microConcept: 'Predicting shape of molecules/ions',
    cognitiveType: 'procedural',
    calcLoad: 'calc-none',
    entryPoint: 'clear-entry',
    isMultiConcept: false,
    reasoning: 'Identifying lone pairs on central atom requires VSEPR analysis. Procedural application of VSEPR rules to count lone pairs.'
  },
  {
    display_id: 'BOND-003',
    primary_tag_id: 'tag_bonding_2', // CORRECTED: Was tag_bonding_1, should be Basics/Octet Rule
    microConcept: 'Octet Rule Exceptions',
    cognitiveType: 'conceptual',
    calcLoad: 'calc-none',
    entryPoint: 'clear-entry',
    isMultiConcept: false,
    reasoning: 'Identifying odd electron molecule (NO) and expanded octet (H2SO4). Requires understanding of octet rule violations.'
  },
  {
    display_id: 'BOND-004',
    primary_tag_id: 'tag_bonding_2', // CORRECTED: Was tag_bonding_1, should be Basics/Octet Rule
    microConcept: 'Octet Rule Exceptions',
    cognitiveType: 'recall',
    calcLoad: 'calc-none',
    entryPoint: 'clear-entry',
    isMultiConcept: false,
    reasoning: 'Counting electron deficient molecules (B2H6, BCl3). Direct recall of which species are electron deficient.'
  },
  {
    display_id: 'BOND-005',
    primary_tag_id: 'tag_bonding_4', // CORRECTED: Was tag_bonding_2, should be Fajan\'s Rule
    microConcept: 'Comparing covalent character',
    cognitiveType: 'application',
    calcLoad: 'calc-none',
    entryPoint: 'clear-entry',
    isMultiConcept: false,
    reasoning: 'Identifying least ionic = most covalent character. AgCl has high covalent character due to Ag+ polarizing power (Fajan\'s rule).'
  },
  {
    display_id: 'BOND-006',
    primary_tag_id: 'tag_bonding_10', // CORRECTED: Was tag_bonding_3, should be VBT/Hybridization
    microConcept: 'Calculation of Hybridization',
    cognitiveType: 'procedural',
    calcLoad: 'calc-light',
    entryPoint: 'clear-entry',
    isMultiConcept: false,
    reasoning: 'Counting sp3 hybridized central atoms. Requires calculating hybridization for each species (steric number method).'
  },
  {
    display_id: 'BOND-007',
    primary_tag_id: 'tag_bonding_6', // CORRECTED: Was tag_bonding_3, should be VSEPR & Geometry
    microConcept: 'Predicting shape of molecules/ions',
    cognitiveType: 'procedural',
    calcLoad: 'calc-none',
    entryPoint: 'clear-entry',
    isMultiConcept: false,
    reasoning: 'Matching molecules to shapes. SO2Cl2=tetrahedral, NO2+=linear, H2O2=non-planar, ClO2-=bent. VSEPR application.'
  },
  {
    display_id: 'BOND-008',
    primary_tag_id: 'tag_bonding_6', // CORRECTED: Was tag_bonding_3, should be VSEPR & Geometry
    microConcept: 'Predicting shape of molecules/ions',
    cognitiveType: 'procedural',
    calcLoad: 'calc-none',
    entryPoint: 'clear-entry',
    isMultiConcept: false,
    reasoning: 'Matching molecules to shapes. NH3=pyramidal, BrF5=square pyramidal, XeOF4=square pyramidal, SF4=see-saw.'
  },
  {
    display_id: 'BOND-009',
    primary_tag_id: 'tag_bonding_6', // Keep as VSEPR (though could be tag_bonding_10)
    microConcept: 'Predicting shape of molecules/ions',
    cognitiveType: 'recall',
    calcLoad: 'calc-none',
    entryPoint: 'clear-entry',
    isMultiConcept: false,
    reasoning: 'Carbocation shape - sp2 hybridized, trigonal planar. Direct recall of carbocation geometry.'
  },
  {
    display_id: 'BOND-010',
    primary_tag_id: 'tag_bonding_10', // CORRECTED: Was tag_bonding_3, should be VBT/Hybridization
    microConcept: 'Calculation of Hybridization',
    cognitiveType: 'procedural',
    calcLoad: 'calc-none',
    entryPoint: 'clear-entry',
    isMultiConcept: false,
    reasoning: 'Identifying sp2 hybridization. BF3 (3 BP, 0 LP) and NO2- (2 BP, 1 LP) both sp2.'
  },
  {
    display_id: 'BOND-011',
    primary_tag_id: 'tag_bonding_9', // CORRECTED: Was tag_bonding_3, should be Molecular Properties
    microConcept: 'Bond Enthalpy/Strength',
    cognitiveType: 'conceptual',
    calcLoad: 'calc-none',
    entryPoint: 'clear-entry',
    isMultiConcept: false,
    reasoning: 'C≡C bond in ethyne is STRONGER than C=C in ethene (incorrect statement). Tests understanding of bond strength vs bond order.'
  },
  {
    display_id: 'BOND-012',
    primary_tag_id: 'tag_bonding_10', // CORRECTED: Was tag_bonding_3, should be VBT/Hybridization
    microConcept: 'Calculation of Hybridization',
    cognitiveType: 'procedural',
    calcLoad: 'calc-light',
    entryPoint: 'clear-entry',
    isMultiConcept: false,
    reasoning: 'Counting sp3 hybridized species. NH3, SiO2, BF4-, H3O+ need steric number calculation.'
  },
  {
    display_id: 'BOND-013',
    primary_tag_id: 'tag_bonding_6', // CORRECTED: Was tag_bonding_3, should be VSEPR & Geometry
    microConcept: 'Predicting shape of molecules/ions',
    cognitiveType: 'procedural',
    calcLoad: 'calc-none',
    entryPoint: 'clear-entry',
    isMultiConcept: false,
    reasoning: 'Counting square pyramidal structures. IF5, BrF5, XeOF4 all have square pyramidal geometry (7 electron pairs, 1 LP).'
  },
  {
    display_id: 'BOND-014',
    primary_tag_id: 'tag_bonding_6', // Keep as VSEPR
    microConcept: 'Predicting shape of molecules/ions',
    cognitiveType: 'procedural',
    calcLoad: 'calc-none',
    entryPoint: 'clear-entry',
    isMultiConcept: false,
    reasoning: 'Identifying T-shaped molecules. ClF3, BrF3 both have T-shaped geometry (5 electron pairs, 2 LP in equatorial).'
  },
  {
    display_id: 'BOND-015',
    primary_tag_id: 'tag_bonding_6', // Keep as VSEPR
    microConcept: 'Predicting shape of molecules/ions',
    cognitiveType: 'procedural',
    calcLoad: 'calc-none',
    entryPoint: 'clear-entry',
    isMultiConcept: false,
    reasoning: 'XeF4 geometry - square planar (6 electron pairs, 2 LP). Direct VSEPR application.'
  },
  {
    display_id: 'BOND-016',
    primary_tag_id: 'tag_bonding_6', // Keep as VSEPR
    microConcept: 'Predicting shape of molecules/ions',
    cognitiveType: 'procedural',
    calcLoad: 'calc-none',
    entryPoint: 'clear-entry',
    isMultiConcept: false,
    reasoning: 'ClF3 geometry - T-shaped (5 electron pairs, 2 LP). Standard VSEPR problem.'
  },
  {
    display_id: 'BOND-017',
    primary_tag_id: 'tag_bonding_6', // Keep as VSEPR
    microConcept: 'Predicting shape of molecules/ions',
    cognitiveType: 'procedural',
    calcLoad: 'calc-none',
    entryPoint: 'clear-entry',
    isMultiConcept: false,
    reasoning: 'SF4 geometry - see-saw (5 electron pairs, 1 LP). VSEPR application.'
  },
  {
    display_id: 'BOND-018',
    primary_tag_id: 'tag_bonding_6', // Keep as VSEPR
    microConcept: 'Predicting shape of molecules/ions',
    cognitiveType: 'procedural',
    calcLoad: 'calc-none',
    entryPoint: 'clear-entry',
    isMultiConcept: false,
    reasoning: 'Counting linear molecules. CO2, N2O, I3-, XeF2 all linear (VSEPR analysis for each).'
  },
  {
    display_id: 'BOND-019',
    primary_tag_id: 'tag_bonding_6', // Keep as VSEPR
    microConcept: 'Predicting shape of molecules/ions',
    cognitiveType: 'procedural',
    calcLoad: 'calc-none',
    entryPoint: 'clear-entry',
    isMultiConcept: false,
    reasoning: 'Counting planar molecules. BF3, H2C=CH2, C6H6 all planar. Requires geometry analysis.'
  },
  {
    display_id: 'BOND-020',
    primary_tag_id: 'tag_bonding_6', // Keep as VSEPR
    microConcept: 'Predicting shape of molecules/ions',
    cognitiveType: 'procedural',
    calcLoad: 'calc-none',
    entryPoint: 'clear-entry',
    isMultiConcept: false,
    reasoning: 'XeF2 geometry - linear (5 electron pairs, 3 LP). Standard VSEPR.'
  },
  {
    display_id: 'BOND-021',
    primary_tag_id: 'tag_bonding_6', // Keep as VSEPR
    microConcept: 'Predicting shape of molecules/ions',
    cognitiveType: 'procedural',
    calcLoad: 'calc-none',
    entryPoint: 'clear-entry',
    isMultiConcept: false,
    reasoning: 'I3- geometry - linear (5 electron pairs, 3 LP). VSEPR application.'
  },
  {
    display_id: 'BOND-022',
    primary_tag_id: 'tag_bonding_6', // Keep as VSEPR
    microConcept: 'Predicting shape of molecules/ions',
    cognitiveType: 'procedural',
    calcLoad: 'calc-none',
    entryPoint: 'clear-entry',
    isMultiConcept: false,
    reasoning: 'ICl4- geometry - square planar (6 electron pairs, 2 LP). VSEPR application.'
  },
  {
    display_id: 'BOND-023',
    primary_tag_id: 'tag_bonding_6', // Keep as VSEPR
    microConcept: 'Predicting shape of molecules/ions',
    cognitiveType: 'procedural',
    calcLoad: 'calc-none',
    entryPoint: 'clear-entry',
    isMultiConcept: false,
    reasoning: 'Identifying linear species. N3- is linear (resonance structure with sp hybridization).'
  },
  {
    display_id: 'BOND-024',
    primary_tag_id: 'tag_bonding_6', // Keep as VSEPR
    microConcept: 'Predicting shape of molecules/ions',
    cognitiveType: 'procedural',
    calcLoad: 'calc-none',
    entryPoint: 'clear-entry',
    isMultiConcept: false,
    reasoning: 'XeF5- pentagonal planar, XeO3F2 trigonal bipyramidal. Advanced VSEPR for Xe compounds.'
  },
  {
    display_id: 'BOND-025',
    primary_tag_id: 'tag_bonding_6', // Keep as VSEPR
    microConcept: 'Predicting shape of molecules/ions',
    cognitiveType: 'procedural',
    calcLoad: 'calc-none',
    entryPoint: 'clear-entry',
    isMultiConcept: false,
    reasoning: 'SF4 geometry including lone pairs - trigonal bipyramidal electron geometry (5 pairs total).'
  },
  {
    display_id: 'BOND-026',
    primary_tag_id: 'tag_bonding_8', // CORRECTED: Was tag_bonding_4, should be MOT
    microConcept: 'Magnetic Behavior',
    cognitiveType: 'procedural',
    calcLoad: 'calc-light',
    entryPoint: 'clear-entry',
    isMultiConcept: false,
    reasoning: 'Counting species with 1 unpaired electron. Requires MOT electron configuration: O2- (1), NO (1), others have 0 or 2.'
  },
  {
    display_id: 'BOND-027',
    primary_tag_id: 'tag_bonding_8', // CORRECTED: Was tag_bonding_4, should be MOT
    microConcept: 'Magnetic Behavior',
    cognitiveType: 'procedural',
    calcLoad: 'calc-light',
    entryPoint: 'clear-entry',
    isMultiConcept: false,
    reasoning: 'Counting unpaired electrons using MOT. O2 (2), C2- (1), O2- (1), NO (1) - requires electron configuration.'
  },
  {
    display_id: 'BOND-028',
    primary_tag_id: 'tag_bonding_8', // CORRECTED: Was tag_bonding_4, should be MOT
    microConcept: 'Bond Order Calculation',
    cognitiveType: 'procedural',
    calcLoad: 'calc-light',
    entryPoint: 'clear-entry',
    isMultiConcept: false,
    reasoning: 'Bond order calculation: CO (3) + NO+ (3) = 6. Requires MOT bond order formula.'
  },
  {
    display_id: 'BOND-029',
    primary_tag_id: 'tag_bonding_8', // CORRECTED: Was tag_bonding_4, should be MOT
    microConcept: 'Magnetic Behavior',
    cognitiveType: 'multi-step',
    calcLoad: 'calc-moderate',
    entryPoint: 'strategy-first',
    isMultiConcept: true,
    reasoning: 'Two criteria: paramagnetic AND bond order = 1. Requires MOT for both properties. He2+ is the only one (BO=0.5 actually, so answer is 0).'
  },
  {
    display_id: 'BOND-030',
    primary_tag_id: 'tag_bonding_8', // CORRECTED: Was tag_bonding_4, should be MOT
    microConcept: 'Bond Order Calculation',
    cognitiveType: 'procedural',
    calcLoad: 'calc-light',
    entryPoint: 'clear-entry',
    isMultiConcept: false,
    reasoning: 'Bond order calculation for O2^2- (1), CO (3), NO+ (3). Standard MOT bond order problems.'
  }
];

async function applyUpdates() {
  await mongoose.connect(MONGODB_URI);
  console.log('✅ Connected to MongoDB\n');

  let successCount = 0;
  let errorCount = 0;

  for (const update of batch1Updates) {
    try {
      const question = await QuestionV2.findOne({ display_id: update.display_id }).lean();
      
      if (!question) {
        console.log(`❌ ${update.display_id} not found`);
        errorCount++;
        continue;
      }

      // Prepare update object
      const updateObj: any = {
        'metadata.microConcept': update.microConcept,
        'metadata.cognitiveType': update.cognitiveType,
        'metadata.calcLoad': update.calcLoad,
        'metadata.entryPoint': update.entryPoint,
        'metadata.isMultiConcept': update.isMultiConcept,
        'updated_at': new Date(),
      };

      // Update primary tag if needed
      if (question.metadata?.tags?.[0]?.tag_id !== update.primary_tag_id) {
        updateObj['metadata.tags.0.tag_id'] = update.primary_tag_id;
        console.log(`🔄 ${update.display_id} - Primary tag corrected to ${update.primary_tag_id}`);
      }

      await QuestionV2.updateOne(
        { display_id: update.display_id },
        { $set: updateObj }
      );
      
      console.log(`✅ ${update.display_id} - ${update.microConcept} | ${update.cognitiveType} | ${update.calcLoad}`);
      successCount++;
      
    } catch (error: any) {
      console.log(`❌ ${update.display_id} - Error: ${error.message}`);
      errorCount++;
    }
  }

  console.log(`\n${'='.repeat(80)}`);
  console.log(`✅ Successfully updated: ${successCount}`);
  console.log(`❌ Errors: ${errorCount}`);
  console.log(`📊 Total processed: ${batch1Updates.length}`);
  console.log('='.repeat(80));

  await mongoose.disconnect();
}

applyUpdates().catch(console.error);
