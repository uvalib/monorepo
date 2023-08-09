#!/bin/bash

# Check if we're in the root of a git repository
if [ ! -d .git ] && [ ! -f .git ]; then
  echo "Not in the root of a git repository, navigating up..."
  cd ../..
fi

# Verify that we are now in the root of a git repository
if [ ! -d .git ] && [ ! -f .git ]; then
  echo "Error: still not in the root of a git repository, exiting."
  exit 1
fi

# Execute the git subtree pull command
git subtree pull --prefix=packages/drupal_library_theme/src https://github.com/uvalib/uvalib-drupal-theme.git main

