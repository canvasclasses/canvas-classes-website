// Mock r2Storage module for automation pipeline
// Since we're skipping diagram extraction, this is a stub

async function uploadToR2(filePath, fileName) {
  // Mock implementation - returns a placeholder URL
  return {
    success: false,
    url: null,
    message: 'Diagram upload skipped - add SVGs manually'
  };
}

module.exports = {
  uploadToR2
};
