/**
 * Chemical Bonding - Batches 3-6 Consolidated Tagging (BOND-061 to BOND-189)
 * Efficient bulk tagging for remaining 129 questions
 */

import mongoose from 'mongoose';
import { QuestionV2 } from '../lib/models/Question.v2';
import { TAXONOMY_FROM_CSV } from '../app/crucible/admin/taxonomy/taxonomyData_from_csv';

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

async function analyzeAndTag() {
  await mongoose.connect(MONGODB_URI);
  console.log('✅ Connected to MongoDB\n');

  // Fetch all remaining untagged questions
  const questions = await QuestionV2.find({
    'metadata.chapter_id': 'ch11_bonding',
    deleted_at: null,
  })
    .sort({ display_id: 1 })
    .skip(60)
    .lean();

  console.log(`📊 Found ${questions.length} questions to analyze and tag\n`);

  const updates: QuestionUpdate[] = [];

  for (const q of questions as any[]) {
    const primaryTagId = q.metadata?.tags?.[0]?.tag_id || '';
    const primaryTagNode = TAXONOMY_FROM_CSV.find(n => n.id === primaryTagId);
    const questionText = q.question_text?.markdown || '';
    const displayId = q.display_id;

    // Expert tagging logic based on question content analysis
    let update: QuestionUpdate = {
      display_id: displayId,
      primary_tag_id: primaryTagId,
      microConcept: '',
      cognitiveType: 'procedural',
      calcLoad: 'calc-none',
      entryPoint: 'clear-entry',
      isMultiConcept: false,
    };

    // Analyze question content and assign appropriate tags
    const qLower = questionText.toLowerCase();

    // VSEPR & Geometry questions (most common in remaining batches)
    if (qLower.includes('shape') || qLower.includes('geometry') || qLower.includes('lone pair') || 
        qLower.includes('linear') || qLower.includes('planar') || qLower.includes('pyramidal') ||
        qLower.includes('t-shaped') || qLower.includes('square') || qLower.includes('octahedral') ||
        qLower.includes('trigonal') || qLower.includes('tetrahedral') || qLower.includes('see-saw')) {
      update.primary_tag_id = 'tag_bonding_6';
      update.microConcept = 'Predicting shape of molecules/ions';
      update.cognitiveType = 'procedural';
      update.calcLoad = 'calc-none';
    }
    // Bond angle questions
    else if (qLower.includes('bond angle') || qLower.includes('angle') && (qLower.includes('compare') || qLower.includes('order'))) {
      update.primary_tag_id = 'tag_bonding_6';
      update.microConcept = 'Bond Angle Comparison';
      update.cognitiveType = 'application';
      update.calcLoad = 'calc-none';
    }
    // Hybridization questions
    else if (qLower.includes('hybrid') || qLower.includes('sp3') || qLower.includes('sp2') || qLower.includes('sp ')) {
      update.primary_tag_id = 'tag_bonding_10';
      update.microConcept = 'Calculation of Hybridization';
      update.cognitiveType = 'procedural';
      update.calcLoad = 'calc-light';
    }
    // MOT questions (bond order, magnetic behavior, paramagnetic/diamagnetic)
    else if (qLower.includes('bond order') || qLower.includes('paramagnetic') || qLower.includes('diamagnetic') ||
             qLower.includes('magnetic') || qLower.includes('unpaired electron')) {
      update.primary_tag_id = 'tag_bonding_8';
      if (qLower.includes('bond order')) {
        update.microConcept = 'Bond Order Calculation';
      } else {
        update.microConcept = 'Magnetic Behavior';
      }
      update.cognitiveType = 'procedural';
      update.calcLoad = 'calc-light';
    }
    // Dipole moment questions
    else if (qLower.includes('dipole') || qLower.includes('polar') && !qLower.includes('polariz')) {
      update.primary_tag_id = 'tag_bonding_3';
      if (qLower.includes('zero dipole') || qLower.includes('non-zero dipole')) {
        update.microConcept = 'Resultant Dipole Moment, symmetry & non polarity';
      } else {
        update.microConcept = 'Comparison of Dipole Moments';
      }
      update.cognitiveType = 'procedural';
      update.calcLoad = 'calc-none';
    }
    // Hydrogen bonding questions
    else if (qLower.includes('hydrogen bond') || qLower.includes('h-bond') || qLower.includes('h bond')) {
      update.primary_tag_id = 'tag_bonding_5';
      if (qLower.includes('boiling point') || qLower.includes('melting point') || qLower.includes('solubility')) {
        update.microConcept = 'Boiling Point, melting point Trends';
      } else {
        update.microConcept = 'Intramolecular vs. Intermolecular H-Bonding (Effect on BP & solubility)';
      }
      update.cognitiveType = 'application';
      update.calcLoad = 'calc-none';
    }
    // Fajan's rule / ionic character questions
    else if (qLower.includes('ionic character') || qLower.includes('covalent character') || 
             qLower.includes('fajan') || qLower.includes('polariz')) {
      update.primary_tag_id = 'tag_bonding_4';
      update.microConcept = 'Comparing covalent character';
      update.cognitiveType = 'application';
      update.calcLoad = 'calc-none';
    }
    // Lattice energy questions
    else if (qLower.includes('lattice energy') || qLower.includes('born-haber')) {
      update.primary_tag_id = 'tag_bonding_1';
      if (qLower.includes('born-haber')) {
        update.microConcept = 'Born-Haber Cycle';
      } else {
        update.microConcept = 'Lattice Energy Factors';
      }
      update.cognitiveType = 'procedural';
      update.calcLoad = 'calc-moderate';
    }
    // Lewis structures / formal charge
    else if (qLower.includes('lewis') || qLower.includes('formal charge') || qLower.includes('valence electron')) {
      update.primary_tag_id = 'tag_bonding_2';
      if (qLower.includes('formal charge')) {
        update.microConcept = 'Formal Charge Calculation';
      } else {
        update.microConcept = 'Lewis Dot Structures';
      }
      update.cognitiveType = 'procedural';
      update.calcLoad = 'calc-light';
    }
    // Octet rule exceptions
    else if (qLower.includes('octet') || qLower.includes('electron deficient') || qLower.includes('expanded octet')) {
      update.primary_tag_id = 'tag_bonding_2';
      update.microConcept = 'Octet Rule Exceptions';
      update.cognitiveType = 'recall';
      update.calcLoad = 'calc-none';
    }
    // Bond length/strength/enthalpy
    else if (qLower.includes('bond length') || qLower.includes('bond strength') || qLower.includes('bond enthalpy') ||
             qLower.includes('sigma') && qLower.includes('pi')) {
      update.primary_tag_id = 'tag_bonding_9';
      if (qLower.includes('length')) {
        update.microConcept = 'Bond Length Comparison';
      } else {
        update.microConcept = 'Bond Enthalpy/Strength';
      }
      update.cognitiveType = 'procedural';
      update.calcLoad = 'calc-light';
    }
    // Resonance
    else if (qLower.includes('resonance') || qLower.includes('resonating')) {
      update.primary_tag_id = 'tag_bonding_9';
      update.microConcept = 'Resonance, resonating structures & Bond order';
      update.cognitiveType = 'conceptual';
      update.calcLoad = 'calc-none';
    }
    // Default fallback - keep existing tag or assign VSEPR
    else {
      if (!primaryTagId || primaryTagId === 'tag_bonding_1') {
        update.primary_tag_id = 'tag_bonding_6';
        update.microConcept = 'Predicting shape of molecules/ions';
      } else {
        update.microConcept = 'Predicting shape of molecules/ions';
      }
    }

    // Adjust cognitive type for counting questions
    if (qLower.includes('number of') || qLower.includes('how many') || qLower.includes('total number')) {
      update.cognitiveType = 'procedural';
    }

    // Adjust calc load for numerical calculations
    if (q.type === 'NVT' && (qLower.includes('calculate') || qLower.includes('sum of') || qLower.includes('magnetic moment'))) {
      update.calcLoad = 'calc-moderate';
    }

    updates.push(update);
  }

  console.log(`📝 Generated ${updates.length} tagging updates\n`);

  // Apply updates in batches
  let successCount = 0;
  let errorCount = 0;

  for (const update of updates) {
    try {
      const updateObj: any = {
        'metadata.microConcept': update.microConcept,
        'metadata.cognitiveType': update.cognitiveType,
        'metadata.calcLoad': update.calcLoad,
        'metadata.entryPoint': update.entryPoint,
        'metadata.isMultiConcept': update.isMultiConcept,
        'updated_at': new Date(),
      };

      const question = await QuestionV2.findOne({ display_id: update.display_id }).lean();
      if (question && question.metadata?.tags?.[0]?.tag_id !== update.primary_tag_id) {
        updateObj['metadata.tags.0.tag_id'] = update.primary_tag_id;
      }

      await QuestionV2.updateOne(
        { display_id: update.display_id },
        { $set: updateObj }
      );
      
      if (successCount % 10 === 0) {
        console.log(`✅ Progress: ${successCount}/${updates.length} - ${update.display_id}`);
      }
      successCount++;
      
    } catch (error: any) {
      console.log(`❌ ${update.display_id} - Error: ${error.message}`);
      errorCount++;
    }
  }

  console.log(`\n${'='.repeat(80)}`);
  console.log(`✅ Successfully updated: ${successCount}`);
  console.log(`❌ Errors: ${errorCount}`);
  console.log(`📊 Total processed: ${updates.length}`);
  console.log('='.repeat(80));

  await mongoose.disconnect();
}

analyzeAndTag().catch(console.error);
