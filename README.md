# 智能家居小程序项目

## 📋 项目说明

这是一个智能家居小程序项目，采用H5 + 小程序WebView的混合架构。

### 🏗️ 项目架构

- **H5版本**: 完整的H5页面，保持原有UI不变
- **小程序版本**: 通过WebView加载H5页面，实现支付等原生功能

### 📁 目录结构

```
├── h5-pages/           # H5页面文件（67个页面）
├── miniprogram/        # 小程序源码
├── docs/              # 项目文档
├── database/          # 数据库相关
└── scripts/           # 构建脚本
```

### 🚀 快速开始

#### H5页面测试
```bash
cd h5-pages
python -m http.server 8080
```

#### 小程序开发
```bash
cd miniprogram
npm install
npm run dev:weapp
```

### 📖 更多文档

- [Taro小程序开发方案](docs/taro-miniprogram)
- [项目打包方案](PROJECT-GIT-PACKAGING-PLAN.md)
- [完整打包总结](FINAL-GIT-PACKAGING-SUMMARY.md)

### 🎯 核心特点

- ✅ **67个完整H5页面** - 已修复，功能完整
- ✅ **双版本支持** - H5 + 小程序WebView方案
- ✅ **零UI改动** - H5页面保持100%原样
- ✅ **完整文档** - 开发、部署、测试指南

### 📊 页面统计

| 模块分类 | 页面数量 | 主要页面 |
|---------|----------|----------|
| **商城模块** | 7个 | mall.html, mall-detail.html, mall-cart.html |
| **设计模块** | 10个 | design-result.html, design-upload.html |
| **施工模块** | 10个 | construction.html, spaces.html |
| **知识模块** | 5个 | knowledge.html, knowledge-detail.html |
| **用户模块** | 6个 | me.html, profile-address.html |
| **项目模块** | 6个 | project-*.html 系列 |
| **认证模块** | 3个 | login.html, register.html, auth.html |
| **其他模块** | 20个 | home.html, index.html 等 |

### ⚠️ 部署要求

1. **HTTPS域名**: H5页面必须部署在HTTPS域名
2. **业务域名**: 在微信小程序后台配置业务域名
3. **文件验证**: 上传微信要求的验证文件
4. **跨域配置**: 确保H5页面支持跨域通信

---

**创建时间**: 2025-06-28  
**项目版本**: 1.0.0  
**架构方案**: H5 + Taro WebView
