# 智能家居小程序项目Git打包方案

## 📋 项目架构分析

### 🎯 核心方案
- **H5版本**: 使用 `backup-taro-native/src/pages/h5-page` 中的完整H5页面（67个页面）
- **小程序版本**: 使用 `docs/taro-miniprogram` 方案，通过WebView加载H5页面
- **双版本部署**: 保持两套完整的部署方案

### 📁 项目结构概览
```
miniprogram/
├── backup-taro-native/          # Taro原生开发备份（不打包）
├── github-h5-backup/           # H5页面备份（已整理，可参考）
├── docs/                       # 项目文档
├── src/                        # 当前Taro小程序源码
├── scripts/                    # 构建和部署脚本
├── database/                   # 数据库相关文件
├── reports/                    # 项目报告
└── 其他配置文件
```

## 🎯 Git打包策略

### ✅ 需要打包的核心文件

#### 1. **H5页面集合** (主要内容)
```
h5-pages/                       # 新建目录，整合H5页面
├── *.html                      # 67个HTML页面文件
├── css/                        # 样式资源
│   ├── styles.css
│   ├── fontawesome.min.css
│   ├── youpin-tabs.css
│   └── fonts/
├── js/                         # JavaScript资源
│   ├── common.js
│   ├── form-validator.js
│   ├── order-utils.js
│   └── youpin-tab-component.js
└── utils/                      # 工具文件
    └── h5-bridge.js
```

#### 2. **Taro小程序源码**
```
miniprogram/                    # 小程序目录
├── src/
│   ├── app.config.ts          # 应用配置
│   ├── app.scss               # 全局样式
│   ├── app.tsx                # 应用入口
│   └── pages/
│       └── webview/           # WebView容器页面
├── config/                    # 构建配置
├── project.config.json        # 小程序配置
└── package.json               # 依赖配置
```

#### 3. **文档和配置**
```
docs/
├── taro-miniprogram/          # 小程序开发方案文档
├── README.md                  # 项目说明
└── deployment-guide.md        # 部署指南

database/
├── database_migration.sql     # 数据库迁移脚本
└── database_mapping.csv       # 数据库映射

scripts/
├── deploy-h5.ps1             # H5部署脚本
├── deploy-miniprogram.ps1    # 小程序部署脚本
└── test-purchase-flow.js     # 购买流程测试
```

### ❌ 不需要打包的文件

#### 排除目录
- `node_modules/` - 依赖包（通过package.json重新安装）
- `dist/` - 构建产物
- `coverage/` - 测试覆盖率报告
- `backup/` - 各种备份目录
- `backup-taro-native/` - Taro原生开发备份
- `github-h5-backup/` - H5备份（已整合到h5-pages）
- `reports/` - 项目报告（可选择性保留重要报告）

#### 排除文件
- `*.log` - 日志文件
- `*.tmp` - 临时文件
- `风车无敌免费AI助手1.0.0.exe` - 无关文件
- `MP_verify_*.txt` - 微信验证文件（部署时重新生成）

## 🚀 Git仓库组织方案

### 方案一：单仓库双分支
```
main分支 (默认)
├── h5-pages/              # H5页面
├── miniprogram/           # 小程序代码
├── docs/                  # 文档
├── database/              # 数据库
├── scripts/               # 脚本
├── .gitignore
├── README.md
└── package.json

h5-only分支
├── h5-pages/              # 仅H5页面
├── docs/deployment-h5.md  # H5部署文档
└── README-H5.md
```

### 方案二：多仓库分离（推荐）
```
geeyan-smart-home-main/     # 主仓库
├── h5-pages/
├── miniprogram/
├── docs/
└── README.md

geeyan-h5-pages/           # H5专用仓库
├── *.html
├── css/
├── js/
└── utils/

geeyan-miniprogram/        # 小程序专用仓库
├── src/
├── config/
└── project.config.json
```

## 📝 .gitignore 配置

```gitignore
# 依赖和构建产物
node_modules/
dist/
coverage/
*.log
*.tmp

# 备份目录
backup/
backup-taro-native/
github-h5-backup/

# 系统文件
.DS_Store
Thumbs.db
*.exe

# 环境配置
.env
.env.local
.env.production

# IDE配置
.vscode/
.idea/
*.swp
*.swo

# 微信小程序
project.private.config.json
```

## 🔧 部署配置

### H5部署配置
```json
{
  "name": "geeyan-h5-pages",
  "version": "1.0.0",
  "description": "智能家居H5页面",
  "scripts": {
    "deploy": "powershell ./scripts/deploy-h5.ps1",
    "test": "node ./scripts/test-purchase-flow.js"
  }
}
```

### 小程序部署配置
```json
{
  "name": "geeyan-miniprogram",
  "version": "1.0.0",
  "description": "智能家居小程序",
  "dependencies": {
    "@tarojs/components": "^3.6.0",
    "@tarojs/runtime": "^3.6.0",
    "@tarojs/taro": "^3.6.0"
  },
  "scripts": {
    "build:weapp": "taro build --type weapp",
    "dev:weapp": "npm run build:weapp -- --watch"
  }
}
```

## 📋 执行步骤

### 第一步：创建项目目录结构
```powershell
# 创建新的项目根目录
mkdir geeyan-smart-home-project
cd geeyan-smart-home-project

# 创建主要目录
mkdir h5-pages
mkdir miniprogram
mkdir docs
mkdir database
mkdir scripts
```

### 第二步：整理H5页面
```powershell
# 复制H5页面文件
Copy-Item "F:\AI编程\miniprogram\backup-taro-native\src\pages\h5-page\*.html" -Destination ".\h5-pages\"
Copy-Item "F:\AI编程\miniprogram\backup-taro-native\src\pages\h5-page\css" -Destination ".\h5-pages\" -Recurse
Copy-Item "F:\AI编程\miniprogram\backup-taro-native\src\pages\h5-page\js" -Destination ".\h5-pages\" -Recurse
Copy-Item "F:\AI编程\miniprogram\backup-taro-native\src\pages\h5-page\utils" -Destination ".\h5-pages\" -Recurse
```

### 第三步：整理小程序代码
```powershell
# 复制小程序核心文件
Copy-Item "F:\AI编程\miniprogram\src\app.config.ts" -Destination ".\miniprogram\src\"
Copy-Item "F:\AI编程\miniprogram\src\app.scss" -Destination ".\miniprogram\src\"
Copy-Item "F:\AI编程\miniprogram\src\app.tsx" -Destination ".\miniprogram\src\"
Copy-Item "F:\AI编程\miniprogram\src\pages\webview" -Destination ".\miniprogram\src\pages\" -Recurse
Copy-Item "F:\AI编程\miniprogram\config" -Destination ".\miniprogram\" -Recurse
```

### 第四步：整理文档和配置
```powershell
# 复制重要文档
Copy-Item "F:\AI编程\miniprogram\docs\taro-miniprogram" -Destination ".\docs\" -Recurse
Copy-Item "F:\AI编程\miniprogram\database\database_migration.sql" -Destination ".\database\"
Copy-Item "F:\AI编程\miniprogram\database\database_mapping.csv" -Destination ".\database\"

# 复制重要脚本
Copy-Item "F:\AI编程\miniprogram\scripts\test-purchase-flow.js" -Destination ".\scripts\"
Copy-Item "F:\AI编程\miniprogram\scripts\deploy-*.ps1" -Destination ".\scripts\"
```

### 第五步：创建配置文件

```powershell
# 创建.gitignore
@"
# 依赖和构建产物
node_modules/
dist/
coverage/
*.log
*.tmp

# 备份目录
backup/
backup-taro-native/
github-h5-backup/

# 系统文件
.DS_Store
Thumbs.db
*.exe

# 环境配置
.env
.env.local
.env.production

# IDE配置
.vscode/
.idea/
*.swp
*.swo

# 微信小程序
project.private.config.json
"@ | Out-File -FilePath ".gitignore" -Encoding UTF8
```

## 🧪 测试验证步骤

### H5页面测试

1. **本地服务器测试**
```powershell
cd h5-pages
python -m http.server 8080
# 访问 http://localhost:8080 测试页面加载
```

2. **功能测试清单**
- [ ] 页面正常加载
- [ ] CSS样式正确显示
- [ ] JavaScript功能正常
- [ ] 表单提交功能
- [ ] 页面间导航
- [ ] 移动端适配

### 小程序测试

1. **开发工具测试**
```powershell
cd miniprogram
npm install
npm run dev:weapp
# 在微信开发者工具中打开dist目录
```

2. **WebView通信测试**
- [ ] WebView正常加载H5页面
- [ ] postMessage通信正常
- [ ] 支付接口调用正常
- [ ] 页面跳转正常

## 🚀 Git仓库创建和推送

### 创建本地仓库

```powershell
git init
git add .
git commit -m "Initial commit: 智能家居小程序项目"
```

### 推送到GitHub

```powershell
# 创建远程仓库后
git remote add origin https://github.com/username/geeyan-smart-home.git
git branch -M main
git push -u origin main
```

### 创建分支策略

```powershell
# 创建开发分支
git checkout -b develop
git push -u origin develop

# 创建H5专用分支
git checkout -b h5-only
# 删除miniprogram目录，只保留h5-pages
git push -u origin h5-only
```

## 📊 项目统计信息

### 文件统计
- **H5页面**: 67个HTML文件
- **CSS文件**: 6个样式文件 + 字体资源
- **JavaScript文件**: 7个工具文件
- **小程序页面**: 1个WebView容器页面
- **配置文件**: 5个主要配置文件
- **文档文件**: 10+个说明文档

### 预估大小
- **H5页面目录**: ~15MB
- **小程序代码**: ~2MB
- **文档和配置**: ~1MB
- **总计**: ~18MB（不含node_modules）

## ⚠️ 注意事项

1. **域名配置**: 确保H5页面部署的域名已在微信小程序后台配置业务域名
2. **HTTPS要求**: H5页面必须使用HTTPS协议
3. **跨域处理**: 注意H5页面与小程序的通信跨域问题
4. **版本同步**: 保持H5版本和小程序版本的功能同步
5. **测试覆盖**: 重点测试支付流程和页面跳转功能

## 🎯 下一步行动

1. **立即执行**: 按照上述步骤创建项目结构
2. **测试验证**: 完成H5页面和小程序的功能测试
3. **Git推送**: 将整理好的代码推送到Git仓库
4. **部署准备**: 准备生产环境的部署配置
5. **文档完善**: 补充部署和维护文档
