#!/usr/bin/env bash

set -e

PACKAGE_NAME=$(npm run -s echo -- '$npm_package_name')
CURRENT_VERSION=$(npm info $PACKAGE_NAME version)
NEW_VERSION=$(npm run -s echo -- '$npm_package_version')

if [ "$CURRENT_VERSION" == "$NEW_VERSION" ]; then
  echo "Version number in package.json was not updated!"
  exit 1
else
  echo "New version detected. Preparing $NEW_VERSION"
fi

# Prepare artifacts, one last check on tests
npm test

# Publish to npm
# https://circleci.com/docs/npm-login/
echo -e "$NPM_USER\n$NPM_PASSWORD\n$NPM_EMAIL" | npm login
npm publish
