# 智能家居H5页面部署指南

## 🚀 快速部署

### 方式一：直接部署到Web服务器

1. **下载代码**
```bash
git clone [您的GitHub仓库地址]
cd smart-home-h5-backup
```

2. **上传到服务器**
```bash
# 将所有文件上传到Web服务器根目录
scp -r * user@your-server:/var/www/html/
```

3. **配置HTTPS**
- 确保服务器支持HTTPS（微信要求）
- 配置SSL证书
- 测试HTTPS访问

### 方式二：使用GitHub Pages部署

1. **Fork此仓库**
2. **启用GitHub Pages**
   - 进入仓库Settings
   - 找到Pages设置
   - 选择Source为main分支
   - 保存设置

3. **访问地址**
   - 部署完成后访问：`https://yourusername.github.io/repository-name/`

### 方式三：使用Cloudflare Pages部署

1. **连接GitHub仓库**
   - 登录Cloudflare Pages
   - 连接此GitHub仓库

2. **配置构建设置**
   - Build command: 留空
   - Build output directory: `/`
   - Root directory: `/`

3. **自定义域名**（可选）
   - 添加自定义域名
   - 配置DNS记录

## 📱 微信集成

### 小程序WebView集成

1. **配置业务域名**
```javascript
// 在微信小程序后台配置业务域名
// 开发管理 -> 开发设置 -> 业务域名
// 添加您的部署域名，如：https://yourdomain.com
```

2. **WebView页面代码**
```javascript
// pages/webview/index.js
Page({
  data: {
    webviewUrl: ''
  },
  onLoad(options) {
    const page = options.page || 'home.html';
    this.setData({
      webviewUrl: `https://yourdomain.com/${page}`
    });
  }
});
```

3. **WebView页面模板**
```xml
<!-- pages/webview/index.wxml -->
<web-view src="{{webviewUrl}}"></web-view>
```

### H5页面调用小程序API

```javascript
// 在H5页面中使用
if (window.__wxjs_environment === 'miniprogram') {
  // 小程序环境
  wx.miniProgram.navigateTo({
    url: '/pages/index/index'
  });
} else {
  // 普通H5环境
  window.location.href = '/other-page.html';
}
```

## 🔧 配置说明

### 资源路径配置

确保以下资源路径正确：

1. **CSS文件**
```html
<link rel="stylesheet" href="css/styles.css">
<link rel="stylesheet" href="css/iphone16_fix.css">
<link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css" rel="stylesheet">
```

2. **JavaScript文件**
```html
<script src="js/common.js"></script>
<script src="js/form-validator.js"></script>
<script src="utils/h5-bridge.js"></script>
```

### 环境变量配置

根据部署环境修改配置：

```javascript
// 在页面中添加环境配置
const CONFIG = {
  // 开发环境
  development: {
    apiBaseUrl: 'http://localhost:3000/api',
    cdnUrl: '/css'
  },
  // 生产环境
  production: {
    apiBaseUrl: 'https://api.yourdomain.com',
    cdnUrl: 'https://cdn.yourdomain.com'
  }
};
```

## 🧪 测试验证

### 功能测试清单

- [ ] 页面正常加载
- [ ] CSS样式正确显示
- [ ] JavaScript功能正常
- [ ] 图片资源加载正常
- [ ] 表单提交功能
- [ ] 页面跳转功能
- [ ] 移动端适配
- [ ] 微信环境兼容性

### 测试命令

```bash
# 本地测试服务器
python -m http.server 8000
# 或
npx serve .

# 访问测试
open http://localhost:8000
```

## 📊 性能优化

### 1. 图片优化
- 使用WebP格式
- 启用图片懒加载
- 压缩图片大小

### 2. CSS优化
- 合并CSS文件
- 移除未使用的样式
- 启用Gzip压缩

### 3. JavaScript优化
- 压缩JS文件
- 移除console.log
- 启用缓存策略

## 🔒 安全配置

### HTTPS配置
```nginx
server {
    listen 443 ssl;
    server_name yourdomain.com;
    
    ssl_certificate /path/to/certificate.crt;
    ssl_certificate_key /path/to/private.key;
    
    location / {
        root /var/www/html;
        index index.html;
    }
}
```

### 安全头配置
```nginx
add_header X-Frame-Options "SAMEORIGIN";
add_header X-Content-Type-Options "nosniff";
add_header X-XSS-Protection "1; mode=block";
```

## 📞 技术支持

### 常见问题

1. **页面无法加载**
   - 检查HTTPS配置
   - 验证文件路径
   - 查看浏览器控制台错误

2. **样式显示异常**
   - 检查CSS文件路径
   - 验证CDN资源
   - 清除浏览器缓存

3. **微信小程序集成问题**
   - 确认业务域名配置
   - 检查HTTPS证书
   - 验证页面兼容性

### 联系方式

如有问题，请通过以下方式联系：
- 创建GitHub Issue
- 发送邮件至技术支持
- 查看项目Wiki文档

---

**部署指南版本**: v1.0  
**最后更新**: 2025-01-27  
**适用版本**: 智能家居H5页面备份 v1.0
