export default {
  // 简化的页面配置 - 只保留web-view页面
  pages: [
    'pages/webview/index'  // 主要的web-view容器页面
  ],



  // 窗口配置
  window: {
    backgroundTextStyle: 'light',
    navigationBarBackgroundColor: '#fff',
    navigationBarTitleText: '智能设计小程序',
    navigationBarTextStyle: 'black',
    backgroundColor: '#f8f8f8'
  },

  // 权限声明 - 只保留必需的权限
  permission: {
    "scope.userLocation": {
      "desc": "您的位置信息将用于小程序位置接口的效果展示"
    }
  },

  // 网络超时配置
  networkTimeout: {
    request: 10000,
    downloadFile: 10000
  },

  // 调试配置
  debug: false
}
