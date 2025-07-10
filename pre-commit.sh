#!/bin/bash

# Update version before commit
echo "Updating version..."
./update-version.sh

# Add the updated version file to the commit
git add version.json

echo "Version updated and ready for commit!" 