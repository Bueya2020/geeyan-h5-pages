@echo off
chcp 65001 >nul
echo.
echo 🚀 智能家居H5页面快速上传脚本
echo ================================================
echo.

REM 检查当前目录
if not exist "README.md" (
    echo ❌ 错误: 请在github-h5-backup目录中运行此脚本
    pause
    exit /b 1
)

echo ✅ 目录检查通过
echo.

REM 显示当前Git状态
echo 📋 当前Git状态:
git status
echo.

REM 获取用户输入
set /p github_username="请输入您的GitHub用户名: "
if "%github_username%"=="" (
    echo ❌ GitHub用户名不能为空
    pause
    exit /b 1
)

set /p repo_name="请输入仓库名称 (默认: smart-home-h5-pages-backup): "
if "%repo_name%"=="" set repo_name=smart-home-h5-pages-backup

set repo_url=https://github.com/%github_username%/%repo_name%.git
echo.
echo 仓库URL: %repo_url%
echo.

REM 检查并移除现有远程仓库
git remote remove origin 2>nul

REM 添加远程仓库
echo 🔗 添加远程仓库...
git remote add origin %repo_url%
if errorlevel 1 (
    echo ❌ 添加远程仓库失败
    pause
    exit /b 1
)

REM 设置主分支
echo 🌿 设置主分支...
git branch -M main

REM 显示文件统计
echo.
echo 📁 准备上传的内容:
dir /b *.html | find /c /v "" > temp_count.txt
set /p html_count=<temp_count.txt
del temp_count.txt
echo - HTML页面: %html_count% 个
echo - 包含完整的CSS、JS和工具资源
echo.

REM 确认上传
echo ⚠️  重要提示:
echo 1. 请确保您已在GitHub上创建了仓库: %repo_name%
echo 2. 请确保您有该仓库的推送权限
echo.
set /p confirm="是否继续上传到GitHub? (y/N): "
if /i not "%confirm%"=="y" (
    echo ❌ 取消上传
    pause
    exit /b 1
)

REM 执行推送
echo.
echo 🚀 开始推送到GitHub...
echo 这可能需要几分钟时间，请耐心等待...
echo.

git push -u origin main
if errorlevel 1 (
    echo.
    echo ❌ 推送失败!
    echo.
    echo 🔧 可能的解决方案:
    echo 1. 检查GitHub仓库是否存在
    echo 2. 检查网络连接
    echo 3. 检查Git凭据配置
    echo 4. 确认仓库权限
    echo.
    pause
    exit /b 1
)

echo.
echo 🎉 上传成功!
echo ================================================
echo ✅ 智能家居H5页面已成功备份到GitHub
echo 📍 仓库地址: https://github.com/%github_username%/%repo_name%
echo.
echo 📋 下一步建议:
echo 1. 访问仓库页面验证文件上传
echo 2. 设置仓库描述和标签
echo 3. 启用GitHub Pages (可选)
echo 4. 创建Release版本 (可选)
echo.
echo 🎊 脚本执行完成!
pause
