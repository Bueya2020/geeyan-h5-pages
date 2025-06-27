# 智能家居H5页面GitHub上传脚本
# PowerShell脚本 - 请在PowerShell中运行

Write-Host "🚀 智能家居H5页面GitHub上传脚本" -ForegroundColor Green
Write-Host "================================================" -ForegroundColor Green

# 检查当前目录
$currentDir = Get-Location
Write-Host "当前目录: $currentDir" -ForegroundColor Yellow

# 检查是否在正确的目录
if (-not (Test-Path "README.md")) {
    Write-Host "❌ 错误: 请在github-h5-backup目录中运行此脚本" -ForegroundColor Red
    exit 1
}

Write-Host "✅ 目录检查通过" -ForegroundColor Green

# 检查Git状态
Write-Host "`n📋 检查Git状态..." -ForegroundColor Cyan
git status

# 检查是否有未提交的更改
$gitStatus = git status --porcelain
if ($gitStatus) {
    Write-Host "⚠️  发现未提交的更改，正在提交..." -ForegroundColor Yellow
    git add .
    git commit -m "最终提交: 准备上传到GitHub"
}

# 获取用户输入的GitHub仓库信息
Write-Host "`n🔧 GitHub仓库配置" -ForegroundColor Cyan
Write-Host "请提供您的GitHub仓库信息:" -ForegroundColor Yellow

# 获取GitHub用户名
$githubUsername = Read-Host "请输入您的GitHub用户名"
if (-not $githubUsername) {
    Write-Host "❌ GitHub用户名不能为空" -ForegroundColor Red
    exit 1
}

# 获取仓库名称
$defaultRepoName = "smart-home-h5-pages-backup"
$repoName = Read-Host "请输入仓库名称 (默认: $defaultRepoName)"
if (-not $repoName) {
    $repoName = $defaultRepoName
}

# 构建仓库URL
$repoUrl = "https://github.com/$githubUsername/$repoName.git"
Write-Host "仓库URL: $repoUrl" -ForegroundColor Green

# 检查是否已经配置了远程仓库
$remoteOrigin = git remote get-url origin 2>$null
if ($remoteOrigin) {
    Write-Host "⚠️  已存在远程仓库: $remoteOrigin" -ForegroundColor Yellow
    $overwrite = Read-Host "是否要覆盖现有的远程仓库配置? (y/N)"
    if ($overwrite -eq "y" -or $overwrite -eq "Y") {
        git remote remove origin
        Write-Host "✅ 已移除现有远程仓库配置" -ForegroundColor Green
    } else {
        Write-Host "❌ 取消操作" -ForegroundColor Red
        exit 1
    }
}

# 添加远程仓库
Write-Host "`n🔗 添加远程仓库..." -ForegroundColor Cyan
try {
    git remote add origin $repoUrl
    Write-Host "✅ 远程仓库添加成功" -ForegroundColor Green
} catch {
    Write-Host "❌ 添加远程仓库失败: $_" -ForegroundColor Red
    exit 1
}

# 设置主分支
Write-Host "`n🌿 设置主分支..." -ForegroundColor Cyan
git branch -M main

# 显示即将上传的文件
Write-Host "`n📁 即将上传的文件:" -ForegroundColor Cyan
$htmlFiles = Get-ChildItem -Filter "*.html" | Measure-Object
$totalFiles = Get-ChildItem -Recurse | Where-Object { -not $_.PSIsContainer } | Measure-Object
Write-Host "- HTML页面: $($htmlFiles.Count) 个" -ForegroundColor Yellow
Write-Host "- 总文件数: $($totalFiles.Count) 个" -ForegroundColor Yellow
Write-Host "- 包含目录: css/, js/, utils/, home/, project/" -ForegroundColor Yellow

# 确认上传
Write-Host "`n⚠️  重要提示:" -ForegroundColor Yellow
Write-Host "1. 请确保您已在GitHub上创建了仓库: $repoName" -ForegroundColor Yellow
Write-Host "2. 请确保您有该仓库的推送权限" -ForegroundColor Yellow
Write-Host "3. 如果仓库不存在，请先在GitHub上创建" -ForegroundColor Yellow

$confirm = Read-Host "`n是否继续上传到GitHub? (y/N)"
if ($confirm -ne "y" -and $confirm -ne "Y") {
    Write-Host "❌ 取消上传" -ForegroundColor Red
    exit 1
}

# 执行推送
Write-Host "`n🚀 开始推送到GitHub..." -ForegroundColor Cyan
Write-Host "这可能需要几分钟时间，请耐心等待..." -ForegroundColor Yellow

try {
    # 首次推送
    git push -u origin main
    
    Write-Host "`n🎉 上传成功!" -ForegroundColor Green
    Write-Host "================================================" -ForegroundColor Green
    Write-Host "✅ 智能家居H5页面已成功备份到GitHub" -ForegroundColor Green
    Write-Host "📍 仓库地址: https://github.com/$githubUsername/$repoName" -ForegroundColor Cyan
    Write-Host "📱 如需启用GitHub Pages，请到仓库设置中配置" -ForegroundColor Yellow
    
    # 显示下一步建议
    Write-Host "`n📋 下一步建议:" -ForegroundColor Cyan
    Write-Host "1. 访问仓库页面验证文件上传" -ForegroundColor White
    Write-Host "2. 设置仓库描述和标签" -ForegroundColor White
    Write-Host "3. 启用GitHub Pages (可选)" -ForegroundColor White
    Write-Host "4. 创建Release版本 (可选)" -ForegroundColor White
    
} catch {
    Write-Host "`n❌ 推送失败!" -ForegroundColor Red
    Write-Host "错误信息: $_" -ForegroundColor Red
    Write-Host "`n🔧 可能的解决方案:" -ForegroundColor Yellow
    Write-Host "1. 检查GitHub仓库是否存在" -ForegroundColor White
    Write-Host "2. 检查网络连接" -ForegroundColor White
    Write-Host "3. 检查Git凭据配置" -ForegroundColor White
    Write-Host "4. 确认仓库权限" -ForegroundColor White
    
    # 显示Git凭据配置帮助
    Write-Host "`n💡 Git凭据配置帮助:" -ForegroundColor Cyan
    Write-Host "如果需要配置Git凭据，请运行:" -ForegroundColor White
    Write-Host "git config --global user.name `"您的用户名`"" -ForegroundColor Gray
    Write-Host "git config --global user.email `"您的邮箱`"" -ForegroundColor Gray
    
    exit 1
}

Write-Host "`n🎊 脚本执行完成!" -ForegroundColor Green
