/**
 * Chemical Bonding - Batch 2 Tagging Updates (BOND-031 to BOND-060)
 * Expert tagging by chemistry subject matter expert for JEE
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
  primary_tag_id: string;
  microConcept: string;
  cognitiveType: 'recall' | 'conceptual' | 'application' | 'procedural' | 'multi-step' | 'analytical';
  calcLoad: 'calc-none' | 'calc-light' | 'calc-moderate' | 'calc-heavy' | 'calc-trap';
  entryPoint: 'clear-entry' | 'strategy-first' | 'novel-framing';
  isMultiConcept: boolean;
}

const batch2Updates: QuestionUpdate[] = [
  {
    display_id: 'BOND-031',
    primary_tag_id: 'tag_bonding_8', // CORRECTED: Was tag_bonding_4, should be MOT
    microConcept: 'Bond Order Calculation',
    cognitiveType: 'procedural',
    calcLoad: 'calc-light',
    entryPoint: 'clear-entry',
    isMultiConcept: true, // Bond order + magnetic behavior
  },
  {
    display_id: 'BOND-032',
    primary_tag_id: 'tag_bonding_8', // CORRECTED: Was tag_bonding_4, should be MOT
    microConcept: 'Magnetic Behavior',
    cognitiveType: 'procedural',
    calcLoad: 'calc-moderate',
    entryPoint: 'clear-entry',
    isMultiConcept: false,
  },
  {
    display_id: 'BOND-033',
    primary_tag_id: 'tag_bonding_3', // CORRECTED: Was tag_bonding_5, should be Dipole Moment & Polarity
    microConcept: 'Bond Polarity vs. Molecular Polarity',
    cognitiveType: 'conceptual',
    calcLoad: 'calc-none',
    entryPoint: 'clear-entry',
    isMultiConcept: false,
  },
  {
    display_id: 'BOND-034',
    primary_tag_id: 'tag_bonding_4', // CORRECTED: Was tag_bonding_5, should be Fajan's Rule
    microConcept: 'Comparing covalent character',
    cognitiveType: 'application',
    calcLoad: 'calc-none',
    entryPoint: 'clear-entry',
    isMultiConcept: false,
  },
  {
    display_id: 'BOND-035',
    primary_tag_id: 'tag_bonding_4', // CORRECTED: Was tag_bonding_5, should be Fajan's Rule
    microConcept: 'Comparing covalent character',
    cognitiveType: 'application',
    calcLoad: 'calc-none',
    entryPoint: 'clear-entry',
    isMultiConcept: false,
  },
  {
    display_id: 'BOND-036',
    primary_tag_id: 'tag_bonding_3', // CORRECTED: Was tag_bonding_5, should be Dipole Moment & Polarity
    microConcept: 'Comparison of Dipole Moments',
    cognitiveType: 'application',
    calcLoad: 'calc-none',
    entryPoint: 'clear-entry',
    isMultiConcept: false,
  },
  {
    display_id: 'BOND-037',
    primary_tag_id: 'tag_bonding_3', // CORRECTED: Was tag_bonding_5, should be Dipole Moment & Polarity
    microConcept: 'Resultant Dipole Moment, symmetry & non polarity',
    cognitiveType: 'procedural',
    calcLoad: 'calc-none',
    entryPoint: 'clear-entry',
    isMultiConcept: false,
  },
  {
    display_id: 'BOND-038',
    primary_tag_id: 'tag_bonding_3', // CORRECTED: Was tag_bonding_5, should be Dipole Moment & Polarity
    microConcept: 'Resultant Dipole Moment, symmetry & non polarity',
    cognitiveType: 'procedural',
    calcLoad: 'calc-none',
    entryPoint: 'clear-entry',
    isMultiConcept: false,
  },
  {
    display_id: 'BOND-039',
    primary_tag_id: 'tag_bonding_3', // CORRECTED: Was tag_bonding_5, should be Dipole Moment & Polarity
    microConcept: 'Resultant Dipole Moment, symmetry & non polarity',
    cognitiveType: 'procedural',
    calcLoad: 'calc-none',
    entryPoint: 'clear-entry',
    isMultiConcept: false,
  },
  {
    display_id: 'BOND-040',
    primary_tag_id: 'tag_bonding_3', // Keep as Dipole Moment & Polarity
    microConcept: '% Ionic Character',
    cognitiveType: 'procedural',
    calcLoad: 'calc-moderate',
    entryPoint: 'clear-entry',
    isMultiConcept: false,
  },
  {
    display_id: 'BOND-041',
    primary_tag_id: 'tag_bonding_3', // CORRECTED: Was tag_bonding_5, should be Dipole Moment & Polarity
    microConcept: 'Resultant Dipole Moment, symmetry & non polarity',
    cognitiveType: 'conceptual',
    calcLoad: 'calc-none',
    entryPoint: 'clear-entry',
    isMultiConcept: false,
  },
  {
    display_id: 'BOND-042',
    primary_tag_id: 'tag_bonding_3', // CORRECTED: Was tag_bonding_5, should be Dipole Moment & Polarity
    microConcept: 'Resultant Dipole Moment, symmetry & non polarity',
    cognitiveType: 'procedural',
    calcLoad: 'calc-none',
    entryPoint: 'clear-entry',
    isMultiConcept: false,
  },
  {
    display_id: 'BOND-043',
    primary_tag_id: 'tag_bonding_5', // CORRECTED: Was tag_bonding_6, should be H-Bonding
    microConcept: 'Intramolecular vs. Intermolecular H-Bonding (Effect on BP & solubility)',
    cognitiveType: 'conceptual',
    calcLoad: 'calc-none',
    entryPoint: 'clear-entry',
    isMultiConcept: false,
  },
  {
    display_id: 'BOND-044',
    primary_tag_id: 'tag_bonding_5', // CORRECTED: Was tag_bonding_6, should be H-Bonding
    microConcept: 'Strength of H-Bonds',
    cognitiveType: 'application',
    calcLoad: 'calc-none',
    entryPoint: 'clear-entry',
    isMultiConcept: false,
  },
  {
    display_id: 'BOND-045',
    primary_tag_id: 'tag_bonding_2', // CORRECTED: Was tag_bonding_1, should be Basics/Octet Rule
    microConcept: 'Lewis Dot Structures',
    cognitiveType: 'procedural',
    calcLoad: 'calc-light',
    entryPoint: 'clear-entry',
    isMultiConcept: false,
  },
  {
    display_id: 'BOND-046',
    primary_tag_id: 'tag_bonding_9', // CORRECTED: Was tag_bonding_1, should be Molecular Properties
    microConcept: 'Bond Length Comparison',
    cognitiveType: 'procedural',
    calcLoad: 'calc-light',
    entryPoint: 'clear-entry',
    isMultiConcept: false,
  },
  {
    display_id: 'BOND-047',
    primary_tag_id: 'tag_bonding_2', // CORRECTED: Was tag_bonding_1, should be Basics/Octet Rule
    microConcept: 'Octet Rule Exceptions',
    cognitiveType: 'recall',
    calcLoad: 'calc-none',
    entryPoint: 'clear-entry',
    isMultiConcept: false,
  },
  {
    display_id: 'BOND-048',
    primary_tag_id: 'tag_bonding_2', // Keep as Basics/Octet Rule (need to see full question)
    microConcept: 'Formal Charge Calculation',
    cognitiveType: 'procedural',
    calcLoad: 'calc-light',
    entryPoint: 'clear-entry',
    isMultiConcept: false,
  },
  {
    display_id: 'BOND-049',
    primary_tag_id: 'tag_bonding_2', // Keep as Basics/Octet Rule
    microConcept: 'Lewis Dot Structures',
    cognitiveType: 'procedural',
    calcLoad: 'calc-none',
    entryPoint: 'clear-entry',
    isMultiConcept: false,
  },
  {
    display_id: 'BOND-050',
    primary_tag_id: 'tag_bonding_2', // Keep as Basics/Octet Rule
    microConcept: 'Formal Charge Calculation',
    cognitiveType: 'procedural',
    calcLoad: 'calc-light',
    entryPoint: 'clear-entry',
    isMultiConcept: false,
  },
  {
    display_id: 'BOND-051',
    primary_tag_id: 'tag_bonding_6', // CORRECTED: Was tag_bonding_3, should be VSEPR
    microConcept: 'Bond Angle Comparison',
    cognitiveType: 'application',
    calcLoad: 'calc-none',
    entryPoint: 'clear-entry',
    isMultiConcept: false,
  },
  {
    display_id: 'BOND-052',
    primary_tag_id: 'tag_bonding_6', // CORRECTED: Was tag_bonding_3, should be VSEPR
    microConcept: 'Predicting shape of molecules/ions',
    cognitiveType: 'procedural',
    calcLoad: 'calc-none',
    entryPoint: 'clear-entry',
    isMultiConcept: false,
  },
  {
    display_id: 'BOND-053',
    primary_tag_id: 'tag_bonding_6', // CORRECTED: Was tag_bonding_3, should be VSEPR
    microConcept: 'Predicting shape of molecules/ions',
    cognitiveType: 'procedural',
    calcLoad: 'calc-none',
    entryPoint: 'clear-entry',
    isMultiConcept: false,
  },
  {
    display_id: 'BOND-054',
    primary_tag_id: 'tag_bonding_10', // CORRECTED: Was tag_bonding_3, should be VBT/Hybridization
    microConcept: 'Calculation of Hybridization',
    cognitiveType: 'procedural',
    calcLoad: 'calc-light',
    entryPoint: 'clear-entry',
    isMultiConcept: false,
  },
  {
    display_id: 'BOND-055',
    primary_tag_id: 'tag_bonding_6', // CORRECTED: Was tag_bonding_3, should be VSEPR
    microConcept: 'Bond Angle Comparison',
    cognitiveType: 'application',
    calcLoad: 'calc-none',
    entryPoint: 'clear-entry',
    isMultiConcept: false,
  },
  {
    display_id: 'BOND-056',
    primary_tag_id: 'tag_bonding_6', // CORRECTED: Was tag_bonding_3, should be VSEPR
    microConcept: 'Predicting shape of molecules/ions',
    cognitiveType: 'procedural',
    calcLoad: 'calc-none',
    entryPoint: 'clear-entry',
    isMultiConcept: false,
  },
  {
    display_id: 'BOND-057',
    primary_tag_id: 'tag_bonding_6', // CORRECTED: Was tag_bonding_3, should be VSEPR
    microConcept: 'Predicting shape of molecules/ions',
    cognitiveType: 'procedural',
    calcLoad: 'calc-none',
    entryPoint: 'clear-entry',
    isMultiConcept: false,
  },
  {
    display_id: 'BOND-058',
    primary_tag_id: 'tag_bonding_6', // CORRECTED: Was tag_bonding_3, should be VSEPR
    microConcept: 'Predicting shape of molecules/ions',
    cognitiveType: 'procedural',
    calcLoad: 'calc-light',
    entryPoint: 'clear-entry',
    isMultiConcept: false,
  },
  {
    display_id: 'BOND-059',
    primary_tag_id: 'tag_bonding_6', // CORRECTED: Was tag_bonding_3, should be VSEPR
    microConcept: 'Predicting shape of molecules/ions',
    cognitiveType: 'procedural',
    calcLoad: 'calc-light',
    entryPoint: 'clear-entry',
    isMultiConcept: false,
  },
  {
    display_id: 'BOND-060',
    primary_tag_id: 'tag_bonding_6', // CORRECTED: Was tag_bonding_3, should be VSEPR
    microConcept: 'Predicting shape of molecules/ions',
    cognitiveType: 'procedural',
    calcLoad: 'calc-none',
    entryPoint: 'clear-entry',
    isMultiConcept: false,
  },
];

async function applyUpdates() {
  await mongoose.connect(MONGODB_URI);
  console.log('✅ Connected to MongoDB\n');

  let successCount = 0;
  let errorCount = 0;

  for (const update of batch2Updates) {
    try {
      const question = await QuestionV2.findOne({ display_id: update.display_id }).lean();
      
      if (!question) {
        console.log(`❌ ${update.display_id} not found`);
        errorCount++;
        continue;
      }

      const updateObj: any = {
        'metadata.microConcept': update.microConcept,
        'metadata.cognitiveType': update.cognitiveType,
        'metadata.calcLoad': update.calcLoad,
        'metadata.entryPoint': update.entryPoint,
        'metadata.isMultiConcept': update.isMultiConcept,
        'updated_at': new Date(),
      };

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
  console.log(`📊 Total processed: ${batch2Updates.length}`);
  console.log('='.repeat(80));

  await mongoose.disconnect();
}

applyUpdates().catch(console.error);
