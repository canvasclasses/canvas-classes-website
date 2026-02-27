// Mock taxonomy data for automation pipeline
// This is a simplified version for validation purposes

const TAXONOMY_FROM_CSV = [
  // Chemistry chapters
  { id: 'CK', type: 'chapter', name: 'Aldehydes, Ketones and Carboxylic Acids' },
  { id: 'CH', type: 'chapter', name: 'Chemistry' },
  { id: 'OC', type: 'chapter', name: 'Organic Chemistry' },
  { id: 'PC', type: 'chapter', name: 'Physical Chemistry' },
  { id: 'IC', type: 'chapter', name: 'Inorganic Chemistry' },
  
  // Common topics (add more as needed)
  { id: 'nomenclature', type: 'topic', name: 'Nomenclature' },
  { id: 'reactions', type: 'topic', name: 'Reactions' },
  { id: 'mechanisms', type: 'topic', name: 'Mechanisms' },
  { id: 'properties', type: 'topic', name: 'Properties' },
  { id: 'preparation', type: 'topic', name: 'Preparation' },
];

module.exports = {
  TAXONOMY_FROM_CSV
};
