const fs = require('fs');
const path = require('path');

// Read current version
const versionPath = path.join(__dirname, 'version.json');
let versionData = { version: '1.0.0', build: '1', lastUpdated: new Date().toISOString() };

try {
    if (fs.existsSync(versionPath)) {
        versionData = JSON.parse(fs.readFileSync(versionPath, 'utf8'));
    }
} catch (error) {
    console.log('Creating new version file');
}

// Increment build number
versionData.build = (parseInt(versionData.build) + 1).toString();
versionData.lastUpdated = new Date().toISOString();

// Update version based on build number
const buildNum = parseInt(versionData.build);
if (buildNum > 100) {
    // Major version update every 100 builds
    const major = Math.floor(buildNum / 100);
    const minor = buildNum % 100;
    versionData.version = `${major}.${minor}.0`;
} else {
    // Minor version update every 10 builds
    const major = 1;
    const minor = Math.floor(buildNum / 10);
    const patch = buildNum % 10;
    versionData.version = `${major}.${minor}.${patch}`;
}

// Write updated version
fs.writeFileSync(versionPath, JSON.stringify(versionData, null, 2));

console.log(`Version updated to ${versionData.version} (build ${versionData.build})`); 