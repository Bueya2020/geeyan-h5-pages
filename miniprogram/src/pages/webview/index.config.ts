import { isUrlAllowed, sanitizeUrl, WEBVIEW_SECURITY_CONFIG, logSecurityEvent } from '@/utils/webview-security'

export default definePageConfig({
  navigationBarTitleText: '加载中...',
  navigationBarBackgroundColor: '#ffffff',
  navigationBarTextStyle: 'black'
})

function definePageConfig(config: any) {
  return config;
}
