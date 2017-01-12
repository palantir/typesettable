#!/usr/bin/env bash

set -e

# https://circleci.com/docs/npm-login/
echo -e "$NPM_USER\n$NPM_PASSWORD\n$NPM_EMAIL" | npm login

npm publish
