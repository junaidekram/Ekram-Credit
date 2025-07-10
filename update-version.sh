#!/bin/bash

# Read current version from version.json
VERSION_FILE="version.json"

# Default values
CURRENT_VERSION="1.0.0"
CURRENT_BUILD="1"

# Read existing version if file exists
if [ -f "$VERSION_FILE" ]; then
    CURRENT_VERSION=$(grep '"version"' "$VERSION_FILE" | cut -d'"' -f4)
    CURRENT_BUILD=$(grep '"build"' "$VERSION_FILE" | cut -d'"' -f4)
fi

# Increment build number
NEW_BUILD=$((CURRENT_BUILD + 1))

# Update version based on build number
if [ $NEW_BUILD -gt 100 ]; then
    # Major version update every 100 builds
    MAJOR=$((NEW_BUILD / 100))
    MINOR=$((NEW_BUILD % 100))
    NEW_VERSION="${MAJOR}.${MINOR}.0"
else
    # Minor version update every 10 builds
    MAJOR=1
    MINOR=$((NEW_BUILD / 10))
    PATCH=$((NEW_BUILD % 10))
    NEW_VERSION="${MAJOR}.${MINOR}.${PATCH}"
fi

# Create new version.json
cat > "$VERSION_FILE" << EOF
{
  "version": "$NEW_VERSION",
  "build": "$NEW_BUILD",
  "lastUpdated": "$(date -u +"%Y-%m-%dT%H:%M:%S.000Z")"
}
EOF

echo "Version updated to $NEW_VERSION (build $NEW_BUILD)" 