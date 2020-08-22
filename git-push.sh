#!/usr/bin/env sh

# 确保脚本抛出遇到的错误
set -e

echo "Enter COMMIT TEXT(输入提交提示语): "
read TEXT

git add -A
git commit -m $TEXT

# 如果发布到 https://<USERNAME>.github.io
# git push -f git@github.com:<USERNAME>/<USERNAME>.github.io.git master

# 如果发布到 https://<USERNAME>.github.io/<REPO>
git push 'https://github.com/Wuner/wuner-notes.git'
git push 'https://402341aa5195325dd21cbe646d205481@gitee.com/Wuner/wuner-notes.git'

./deploy.sh
