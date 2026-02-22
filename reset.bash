#!/usr/bin/env bash
set -euo pipefail

# Reset template: normalize project name, rename directory, update git

read -r -p "Enter project name: " proj
if [[ -z "$proj" ]]; then
  echo "Error: Project name cannot be empty"
  exit 1
fi

# Normalize: lowercase, spaces to hyphens, keep alphanumeric/hyphens only
proj=$(echo "$proj" | tr '[:upper:]' '[:lower:]' | tr ' ' '-' | sed 's/[^a-z0-9-]//g')

if [[ -z "$proj" ]]; then
  echo "Error: Invalid project name after normalization"
  exit 1
fi

echo "Using project name: $proj"

# Rename directory if needed
current_dir=$(basename "$(pwd)")
if [[ "$current_dir" != "$proj" ]]; then
  parent_dir=$(dirname "$(pwd)")
  mv "$(pwd)" "$parent_dir/$proj"
  cd "$parent_dir/$proj"
  echo "Renamed directory to: $proj"
fi

# Update package.json
if [[ -f package.json ]]; then
  node -e "const fs=require('fs');const p=JSON.parse(fs.readFileSync('package.json'));p.name='$proj';fs.writeFileSync('package.json',JSON.stringify(p,null,2)+'\n');"
  echo "Updated package.json"
fi

# Reinit git
rm -rf .git
git init > /dev/null
git add .
git commit -m "initial create" > /dev/null 2>&1 || true
echo "Initialized git repository"

# Remove this script
rm -f reset.bash
echo "Done!"