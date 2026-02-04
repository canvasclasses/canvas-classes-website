/**
 * The Crucible - Index Barrel File
 * 
 * Export all models from a single entry point
 */

const Question = require('./Question');
const Taxonomy = require('./Taxonomy');
const ActivityLog = require('./ActivityLog');
const User = require('./User');

module.exports = {
    Question,
    Taxonomy,
    ActivityLog,
    User
};
