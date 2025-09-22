#!/bin/bash
echo "🚀 Automating Git Push..."

git add .
git status

# Default commit message if none is provided
commit_message=${1:-"auto-commit"}

git commit -m "$commit_message"
git push origin main

echo "✅ Code pushed successfully!"
