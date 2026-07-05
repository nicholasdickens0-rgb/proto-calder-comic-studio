#!/usr/bin/env bash
set -euo pipefail

cd "$(dirname "$0")"

if [ ! -d ".git" ]; then
  git init -b main
fi

git branch -M main

if git remote get-url origin >/dev/null 2>&1; then
  git remote set-url origin "https://github.com/nicholasdickens0-rgb/proto-calder-comic-studio.git"
else
  git remote add origin "https://github.com/nicholasdickens0-rgb/proto-calder-comic-studio.git"
fi

git add .

if git diff --cached --quiet; then
  echo "No new changes to commit."
else
  git commit -m "Initial Proto Calder Comic Studio"
fi

git push -u origin main
