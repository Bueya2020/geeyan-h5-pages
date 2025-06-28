# H5页面测试脚本
# 用途: 测试H5页面的完整性和功能

param(
    [string]$H5Path = ".\h5-pages",
    [int]$Port = 8080
)

Write-Host "🧪 开始H5页面测试..." -ForegroundColor Green

# 检查H5页面目录
if (-not (Test-Path $H5Path)) {
    Write-Host "❌ H5页面目录不存在: $H5Path" -ForegroundColor Red
    exit 1
}

Write-Host "📁 H5页面目录: $H5Path" -ForegroundColor Yellow

# 统计页面文件
$htmlFiles = Get-ChildItem "$H5Path\*.html"
$cssFiles = Get-ChildItem "$H5Path\css\*.css" -ErrorAction SilentlyContinue
$jsFiles = Get-ChildItem "$H5Path\js\*.js" -ErrorAction SilentlyContinue

Write-Host "`n📊 文件统计:" -ForegroundColor Cyan
Write-Host "📄 HTML页面: $($htmlFiles.Count) 个" -ForegroundColor White
Write-Host "🎨 CSS文件: $($cssFiles.Count) 个" -ForegroundColor White
Write-Host "⚡ JS文件: $($jsFiles.Count) 个" -ForegroundColor White

# 检查关键页面
$keyPages = @(
    "index.html",
    "home.html", 
    "mall.html",
    "design.html",
    "construction.html",
    "me.html",
    "login.html",
    "order-confirm.html"
)

Write-Host "`n🔍 检查关键页面:" -ForegroundColor Cyan
foreach ($page in $keyPages) {
    $pagePath = "$H5Path\$page"
    if (Test-Path $pagePath) {
        $size = (Get-Item $pagePath).Length
        $sizeKB = [math]::Round($size / 1KB, 1)
        Write-Host "✅ $page ($sizeKB KB)" -ForegroundColor Green
    } else {
        Write-Host "❌ $page (缺失)" -ForegroundColor Red
    }
}

# 检查资源文件
Write-Host "`n🎨 检查资源文件:" -ForegroundColor Cyan

$resourceChecks = @{
    "css/styles.css" = "主样式文件"
    "css/fontawesome.min.css" = "字体图标"
    "js/common.js" = "公共脚本"
    "utils/h5-bridge.js" = "H5桥接工具"
}

foreach ($resource in $resourceChecks.Keys) {
    $resourcePath = "$H5Path\$resource"
    if (Test-Path $resourcePath) {
        Write-Host "✅ $($resourceChecks[$resource]): $resource" -ForegroundColor Green
    } else {
        Write-Host "❌ $($resourceChecks[$resource]): $resource (缺失)" -ForegroundColor Red
    }
}

# 检查HTML文件内容
Write-Host "`n🔍 检查HTML文件内容:" -ForegroundColor Cyan

$contentIssues = @()

foreach ($htmlFile in $htmlFiles) {
    $content = Get-Content $htmlFile.FullName -Raw -Encoding UTF8
    
    # 检查基本HTML结构
    if ($content -notmatch "<!DOCTYPE html>") {
        $contentIssues += "$($htmlFile.Name): 缺少DOCTYPE声明"
    }
    
    if ($content -notmatch "<html[^>]*>") {
        $contentIssues += "$($htmlFile.Name): 缺少html标签"
    }
    
    if ($content -notmatch "<head[^>]*>") {
        $contentIssues += "$($htmlFile.Name): 缺少head标签"
    }
    
    if ($content -notmatch "<body[^>]*>") {
        $contentIssues += "$($htmlFile.Name): 缺少body标签"
    }
    
    # 检查CSS引用
    if ($content -notmatch "styles\.css") {
        $contentIssues += "$($htmlFile.Name): 可能缺少主样式文件引用"
    }
    
    # 检查字符编码
    if ($content -notmatch "charset.*utf-8") {
        $contentIssues += "$($htmlFile.Name): 可能缺少UTF-8编码声明"
    }
}

if ($contentIssues.Count -eq 0) {
    Write-Host "✅ 所有HTML文件结构检查通过" -ForegroundColor Green
} else {
    Write-Host "⚠️  发现以下问题:" -ForegroundColor Yellow
    foreach ($issue in $contentIssues) {
        Write-Host "   - $issue" -ForegroundColor Yellow
    }
}

# 启动本地服务器测试
Write-Host "`n🌐 启动本地服务器测试..." -ForegroundColor Cyan

# 检查Python是否可用
$pythonCmd = $null
if (Get-Command python -ErrorAction SilentlyContinue) {
    $pythonCmd = "python"
} elseif (Get-Command python3 -ErrorAction SilentlyContinue) {
    $pythonCmd = "python3"
}

if ($pythonCmd) {
    Write-Host "🐍 使用 $pythonCmd 启动HTTP服务器..." -ForegroundColor Yellow
    Write-Host "📡 服务器地址: http://localhost:$Port" -ForegroundColor Green
    Write-Host "📁 服务目录: $H5Path" -ForegroundColor Green
    Write-Host "`n⚠️  请在浏览器中测试以下页面:" -ForegroundColor Yellow
    
    foreach ($page in $keyPages) {
        if (Test-Path "$H5Path\$page") {
            Write-Host "   http://localhost:$Port/$page" -ForegroundColor White
        }
    }
    
    Write-Host "`n🔄 按 Ctrl+C 停止服务器" -ForegroundColor Cyan
    Write-Host "🚀 启动服务器..." -ForegroundColor Green
    
    Set-Location $H5Path
    & $pythonCmd -m http.server $Port
} else {
    Write-Host "❌ 未找到Python，无法启动HTTP服务器" -ForegroundColor Red
    Write-Host "💡 请安装Python或使用其他HTTP服务器测试页面" -ForegroundColor Yellow
    
    # 提供其他服务器选项
    Write-Host "`n🔧 其他测试选项:" -ForegroundColor Cyan
    Write-Host "1. 安装Python: https://python.org" -ForegroundColor White
    Write-Host "2. 使用Node.js: npx http-server $H5Path -p $Port" -ForegroundColor White
    Write-Host "3. 使用VS Code Live Server扩展" -ForegroundColor White
    Write-Host "4. 直接在浏览器中打开HTML文件" -ForegroundColor White
}

Write-Host "`n✨ H5页面测试脚本执行完成！" -ForegroundColor Green
