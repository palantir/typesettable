#!/usr/bin/env bash

# Echos the specified package.json variable
function npmvar {
    npm run -s echo -- '$npm_package_'$1
}

# Compute all the fancy artifact variables for preview scripts
BUILD_PATH="/home/ubuntu/$(npmvar 'name')"
ARTIFACTS_URL="https://circleci.com/api/v1/project/$CIRCLE_PROJECT_USERNAME/$CIRCLE_PROJECT_REPONAME/$CIRCLE_BUILD_NUM/artifacts/0/$BUILD_PATH"
GH_API_URL="x-oauth-basic@api.github.com"
PROJECT_API_BASE_URL="https://$GH_AUTH_TOKEN:$GH_API_URL/repos/$CIRCLE_PROJECT_USERNAME/$CIRCLE_PROJECT_REPONAME"
PR_NUMBER=$(basename $CI_PULL_REQUEST)

# Submit the comment
function submitPreviewComment {
    COMMENT_JSON="{\"body\": \"$1\"}"

    if $PR_NUMBER; then
        # post comment to PR
        curl --data "$COMMENT_JSON" $PROJECT_API_BASE_URL/issues/$PR_NUMBER/comments
    else
        # PR not created yet; CircleCI doesn't know about it.
        # post comment to commi
        curl --data "$COMMENT_JSON" $PROJECT_API_BASE_URL/commits/$CIRCLE_SHA1/comments
    fi
}

# Create a artifact link string
function artifactLink {
    local HREF="${ARTIFACTS_URL}${1}"
    local LINK="$2"
    echo "<a href='$HREF' target='_blank'>$LINK</a>"
}

# Build previews
echo "Building dev preview..."
npm run preview
echo "Building docs preview..."
npm run docs

# Submit comment
echo "Submitting comment..."
COMMIT_MESSAGE=$(git --no-pager log --pretty=format:"%s" -1)
# escape commit message, see http://stackoverflow.com/a/10053951/3124288
COMMIT_MESSAGE=${COMMIT_MESSAGE//\"/\\\"}
PREVIEWS="$(artifactLink '/docs/index.html' 'docs') | $(artifactLink '/preview/index.html' 'dev')"
submitPreviewComment "<h3>${COMMIT_MESSAGE}</h3>\n\nPreview: <strong>${PREVIEWS}</strong>"
