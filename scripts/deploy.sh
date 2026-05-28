#!/usr/bin/env bash
set -euo pipefail

# Deploy script: bumps version, publishes to npm, merges chore branch
# Usage: ./scripts/deploy.sh <patch|minor|major>

BUMP_TYPE="${1:-patch}"

cd "$(git rev-parse --show-toplevel)"

git pull --rebase
npm run verify

npm version "$BUMP_TYPE" --no-git-tag-version

VERSION=$(node -p "require('./package.json').version")
BRANCH="chore/version-bump-${VERSION}"

git checkout -b "$BRANCH"
git add package.json package-lock.json
git commit -m "chore: bump version to ${VERSION}"
git push origin "$BRANCH"

npm publish

gh pr create --base master --head "$BRANCH" \
  --title "chore: bump version to ${VERSION}" \
  --body "Version bump to ${VERSION}" \
  --fill

gh pr merge --squash --auto
