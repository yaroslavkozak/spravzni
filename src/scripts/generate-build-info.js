/**
 * Generate build info file with version and build number
 * This script runs during build to create a build-info.json file
 * Also auto-increments the patch version in package.json
 * 
 * Usage: node scripts/generate-build-info.js
 */

const { writeFileSync, readFileSync } = require('fs');
const { execSync } = require('child_process');
const path = require('path');

const getGitCommitHash = () => {
  try {
    return execSync('git rev-parse --short HEAD', { encoding: 'utf-8' }).trim();
  } catch {
    return 'unknown';
  }
};

const getBuildTimestamp = () => {
  return new Date().toISOString();
};

// Read current package.json
const packageJsonPath = path.join(__dirname, '..', 'package.json');
const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf-8'));

// Parse current version (semver format: major.minor.patch)
const currentVersion = packageJson.version || '0.1.0';
const versionParts = currentVersion.split('.').map(Number);

// Increment patch version (last number)
versionParts[2] = (versionParts[2] || 0) + 1;
const newVersion = versionParts.join('.');

// Update package.json with new version
packageJson.version = newVersion;
writeFileSync(
  packageJsonPath,
  JSON.stringify(packageJson, null, 2) + '\n'
);

const buildInfo = {
  version: newVersion,
  buildNumber: Date.now(),
  commitHash: getGitCommitHash(),
  buildTime: getBuildTimestamp(),
};

// Write to public folder so it's accessible at runtime via fetch
const publicPath = path.join(__dirname, '..', 'public', 'build-info.json');
writeFileSync(
  publicPath,
  JSON.stringify(buildInfo, null, 2)
);

console.log(`Version updated: ${currentVersion} → ${newVersion}`);
console.log('Build info generated:', buildInfo);
