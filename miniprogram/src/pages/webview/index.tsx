import React, { Component } from 'react';
import { isUrlAllowed, sanitizeUrl, WEBVIEW_SECURITY_CONFIG, logSecurityEvent } from '@/utils/webview-security'

import { View, Text, WebView } from '@tarojs/components';
import Taro, { getCurrentInstance } from '@tarojs/taro';
import { getH5PageConfig, getPageTitle, requiresAuth, CATEGORY_NAMES } from '../../config/h5-pages-config';
import './index.scss';

interface WebViewPageState {
  url: string;
  title: string;
  loading: boolean;
  error: boolean;
  errorMessage: string;
  pageParam: string;
  pageConfig: any;
  category: string;
}

class WebViewPage extends Component<{}, WebViewPageState> {
  private webviewRef: any = null;
  private baseUrl: string = '';

  constructor(props: {}) {
    super(props);

    const instance = getCurrentInstance();
    const params = instance.router?.params || {};

    // 支持两种加载方式：
    // 1. 直接URL: ?url=https://example.com/page.html
    // 2. 页面参数: ?page=design-result (会自动拼接完整路径)
    let url = '';
    let pageParam = '';

    if (params.url) {
      url = decodeURIComponent(params.url);
    } else if (params.page) {
      pageParam = params.page;
      // 构建H5页面的完整URL
      url = this.buildH5PageUrl(pageParam);
    }

    // 获取页面配置
    const pageConfig = getH5PageConfig(pageParam || url);
    const title = params.title ? decodeURIComponent(params.title) : pageConfig.title;

    this.state = {
      url,
      title,
      loading: true,
      error: false,
      errorMessage: '',
      pageParam,
      pageConfig,
      category: pageConfig.category
    };

    // 设置基础URL（根据实际部署环境调整）
    // 🔧 部署时请修改为您的实际 HTTPS 域名
    // ⚠️ 重要：这个域名必须在微信公众平台的"业务域名"中配置
    this.baseUrl = process.env.NODE_ENV === 'production' ?
    'https://geeyan.cn/' :  // 👈 修改为您的实际域名，H5文件直接在根目录
    '/';
    
    // 📝 业务域名配置步骤：
    // 1. 登录微信公众平台 → 开发 → 开发管理 → 开发设置
    // 2. 找到"业务域名"，添加您的 H5 域名（如：https://geeyan.cn）
    // 3. 下载校验文件 MP_verify_xxxx.txt
    // 4. 上传到您的 H5 服务器根目录（如：https://geeyan.cn/MP_verify_xxxx.txt）
  }

  /**
   * 构建H5页面的完整URL
   */
  buildH5PageUrl = (pageName: string): string => {
    // 确保页面名称有.html后缀
    const fileName = pageName.endsWith('.html') ? pageName : `${pageName}.html`;

    // 开发和生产环境都使用相对路径，指向编译后的 h5-pages 目录
    const url = `${this.baseUrl}${fileName}`;
    console.log('构建H5页面URL:', url);
    return url;
  };

  componentDidMount() {
    const { url, title } = this.state;

    // 验证URL
    if (!url) {
      this.setState({
        error: true,
        errorMessage: '页面地址不能为空',
        loading: false
      });
      return;
    }

    // 设置页面标题
    this.setNavigationBarTitle(title || this.getDefaultTitle(url));

    // 注册小程序全局方法，供H5页面调用
    this.registerGlobalMethods();
  }

  componentWillUnmount() {
    // 清理全局方法
    this.cleanupGlobalMethods();
  }

  /**
   * 注册全局方法供H5页面调用
   */
  registerGlobalMethods = () => {
    // 在小程序全局对象上注册方法
    const globalData = Taro.getApp().globalData || {};
    globalData.webviewBridge = {
      // 导航到小程序页面
      navigateTo: this.handleNavigateTo,
      // 返回上一页
      navigateBack: this.handleNavigateBack,
      // 显示提示
      showToast: this.handleShowToast,
      // 获取用户信息
      getUserInfo: this.handleGetUserInfo,
      // 分享页面
      sharePage: this.handleSharePage,
      // 设置页面标题
      setTitle: this.handleSetTitle,
      // 发起支付
      requestPayment: this.handleRequestPayment
    };
  };

  /**
   * 清理全局方法
   */
  cleanupGlobalMethods = () => {
    const globalData = Taro.getApp().globalData || {};
    if (globalData.webviewBridge) {
      delete globalData.webviewBridge;
    }
  };

  /**
   * 设置导航栏标题
   */
  setNavigationBarTitle = (title: string) => {
    Taro.setNavigationBarTitle({ title });
    this.setState({ title });
  };

  /**
   * 根据URL获取默认标题（使用配置文件）
   */
  getDefaultTitle = (url: string): string => {
    return getPageTitle(url);
  };

  /**
   * 检查页面是否需要认证
   */
  checkAuthRequired = (url: string): boolean => {
    return requiresAuth(url);
  };

  /**
   * 获取页面分类名称
   */
  getCategoryName = (category: string): string => {
    return CATEGORY_NAMES[category] || '未知';
  };

  /**
   * 处理来自H5页面的消息
   */
  handleMessage = (event: any) => {
    try {
      const { detail } = event;
      const { data } = detail;

      if (!data || !data.type) {
        return;
      }

      // 根据消息类型处理不同的操作
      switch (data.type) {
        case 'navigate':
          this.handleNavigateMessage(data);
          break;
        case 'setTitle':
          this.handleSetTitleMessage(data);
          break;
        case 'showToast':
          this.handleShowToastMessage(data);
          break;
        case 'getUserInfo':
          this.handleGetUserInfoMessage(data);
          break;
        case 'share':
          this.handleShareMessage(data);
          break;
        case 'requestPayment':
          this.handlePaymentMessage(data);
          break;
        default:
          // 未知消息类型
          break;
      }
    } catch (error) {
      // 消息处理错误
    }
  };

  /**
   * 处理导航消息
   */
  handleNavigateMessage = (data: any) => {
    const { url, type = 'navigateTo' } = data;

    if (type === 'navigateBack') {
      Taro.navigateBack();
    } else if (url) {
      if (url.startsWith('/pages/')) {
        // 小程序页面
        Taro.navigateTo({ url });
      } else {
        // H5页面
        const webviewUrl = `/pages/webview/index?page=${encodeURIComponent(url)}`;
        Taro.navigateTo({ url: webviewUrl });
      }
    }
  };

  /**
   * 处理设置标题消息
   */
  handleSetTitleMessage = (data: any) => {
    const { title } = data;
    if (title) {
      this.setNavigationBarTitle(title);
    }
  };

  /**
   * 处理显示提示消息
   */
  handleShowToastMessage = (data: any) => {
    const { title, icon = 'none', duration = 2000 } = data;
    if (title) {
      Taro.showToast({ title, icon, duration });
    }
  };

  /**
   * 处理获取用户信息消息
   */
  handleGetUserInfoMessage = (data: any) => {
    // 获取用户信息并发送回H5页面
    const userInfo = Taro.getStorageSync('userInfo') || {};
    this.postMessageToH5({
      type: 'userInfo',
      data: userInfo,
      requestId: data.requestId
    });
  };

  /**
   * 处理分享消息
   */
  handleShareMessage = (data: any) => {
    const { title, desc, imageUrl } = data;
    // 触发小程序分享
    Taro.showShareMenu({
      withShareTicket: true
    });
  };

  /**
   * 处理支付消息
   */
  handlePaymentMessage = (data: any) => {
    const { paymentData } = data;
    console.log('WebView收到支付请求:', paymentData);

    // 调用Taro支付API
    Taro.requestPayment({
      timeStamp: paymentData.timeStamp || Date.now().toString(),
      nonceStr: paymentData.nonceStr || this.generateNonceStr(),
      package: paymentData.package || `prepay_id=${paymentData.orderId}`,
      signType: paymentData.signType || 'MD5',
      paySign: paymentData.paySign || this.generatePaySign(paymentData),
      success: (res) => {
        console.log('支付成功:', res);
        this.postMessageToH5({
          type: 'paymentSuccess',
          data: {
            orderId: paymentData.orderId,
            transactionId: res.transactionId || 'WX' + Date.now(),
            paymentTime: new Date().toISOString(),
            amount: paymentData.amount,
            method: paymentData.method || 'wechat'
          }
        });
      },
      fail: (err) => {
        console.error('支付失败:', err);
        this.postMessageToH5({
          type: 'paymentFail',
          error: {
            orderId: paymentData.orderId,
            errMsg: err.errMsg || '支付失败',
            method: paymentData.method || 'wechat'
          }
        });
      }
    });
  };

  /**
   * 生成随机字符串
   */
  generateNonceStr = (): string => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < 32; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  };

  /**
   * 生成支付签名（实际项目中应该由后端生成）
   */
  generatePaySign = (paymentData: any): string => {
    // 这里只是模拟签名生成，实际项目中应该由后端生成
    const timestamp = Date.now().toString();
    const orderId = paymentData.orderId || '';
    return `MOCK_SIGN_${timestamp}_${orderId}`;
  };

  /**
   * 向H5页面发送消息
   */
  postMessageToH5 = (message: any) => {
    if (this.webviewRef) {
      this.webviewRef.postMessage({
        data: message
      });
    }
  };

  /**
   * WebView加载完成
   */
  handleLoad = () => {
    console.log('✅ WebView加载完成');
    this.setState({
      loading: false,
      error: false,
      errorMessage: ''
    });

    // 向H5页面发送初始化消息
    setTimeout(() => {
      this.postMessageToH5({
        type: 'miniProgramReady',
        data: {
          platform: 'wechat',
          version: Taro.getSystemInfoSync().version,
          userInfo: Taro.getStorageSync('userInfo') || {}
        }
      });
    }, 500);
  };

  /**
   * WebView加载失败
   */
  handleError = (event: any) => {
    console.error('❌ WebView加载失败:', event);
    this.setState({
      loading: false,
      error: true,
      errorMessage: '页面加载失败，请检查网络连接'
    });

    Taro.showToast({
      title: '页面加载失败',
      icon: 'none',
      duration: 2000
    });
  };

  // ===== 供H5页面调用的方法 =====

  /**
   * 处理导航请求
   */
  handleNavigateTo = (url: string) => {
    if (url.startsWith('/pages/')) {
      // 小程序页面
      Taro.navigateTo({ url });
    } else {
      // H5页面
      const webviewUrl = `/pages/webview/index?page=${encodeURIComponent(url)}`;
      Taro.navigateTo({ url: webviewUrl });
    }
  };

  /**
   * 处理返回请求
   */
  handleNavigateBack = () => {
    Taro.navigateBack();
  };

  /**
   * 处理显示提示请求
   */
  handleShowToast = (title: string, icon: 'loading' | 'error' | 'none' | 'success' = 'none') => {
    Taro.showToast({ title, icon, duration: 2000 });
  };

  /**
   * 处理获取用户信息请求
   */
  handleGetUserInfo = () => {
    return Taro.getStorageSync('userInfo') || {};
  };

  /**
   * 处理分享请求
   */
  handleSharePage = (options: any) => {
    Taro.showShareMenu({
      withShareTicket: true
    });
  };

  /**
   * 处理设置标题请求
   */
  handleSetTitle = (title: string) => {
    this.setNavigationBarTitle(title);
  };

  /**
   * 处理支付请求
   */
  handleRequestPayment = (paymentData: any) => {
    console.log('WebView处理支付请求:', paymentData);

    // 调用Taro支付API
    Taro.requestPayment({
      timeStamp: paymentData.timeStamp || Date.now().toString(),
      nonceStr: paymentData.nonceStr || this.generateNonceStr(),
      package: paymentData.package || `prepay_id=${paymentData.orderId}`,
      signType: paymentData.signType || 'MD5',
      paySign: paymentData.paySign || this.generatePaySign(paymentData),
      success: (res) => {
        console.log('支付成功:', res);
        // 通知H5页面支付成功
        this.postMessageToH5({
          type: 'paymentSuccess',
          data: {
            orderId: paymentData.orderId,
            transactionId: res.transactionId || 'WX' + Date.now(),
            paymentTime: new Date().toISOString(),
            amount: paymentData.amount,
            method: paymentData.method || 'wechat'
          }
        });
      },
      fail: (err) => {
        console.error('支付失败:', err);
        // 通知H5页面支付失败
        this.postMessageToH5({
          type: 'paymentFail',
          error: {
            orderId: paymentData.orderId,
            errMsg: err.errMsg || '支付失败',
            method: paymentData.method || 'wechat'
          }
        });
      }
    });
  };

  render() {
    const { url, loading, error } = this.state;

    // 显示错误页面
    if (error) {
      return (
        <View className="webview-error">
          <View className="error-content">
            <View className="error-icon">⚠️</View>
            <Text className="error-title">页面加载失败</Text>
            <Text className="error-message">{this.state.errorMessage}</Text>
          </View>
        </View>
      );
    }

    return (
      <View className="webview-container">
        {/* 页面信息条（开发模式显示） */}
        {process.env.NODE_ENV === 'development' && (
          <View className="webview-info-bar">
            <Text className="info-text">
              {this.getCategoryName(this.state.category)} | {this.state.title}
              {this.state.pageConfig?.requireAuth && ' 🔒'}
            </Text>
          </View>
        )}

        {/* 加载遮罩 */}
        {loading && (
          <View className="webview-loading-mask">
            <View className="loading-spinner" />
            <Text className="loading-text">正在加载 {this.state.title}...</Text>
            <Text className="loading-url">{url}</Text>
          </View>
        )}

        {/* WebView组件 */}
        <WebView
          ref={(ref) => { this.webviewRef = ref; }}
          src={url}
          onMessage={this.handleMessage}
          onLoad={this.handleLoad}
          onError={this.handleError}
          className="webview-content"
        />
      </View>
    );
  }
}

export default WebViewPage;
