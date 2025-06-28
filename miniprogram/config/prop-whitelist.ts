/**
 * 组件属性白名单配置
 * 统一声明各组件允许的属性，支持通配符匹配
 */

// 基础通用属性
const COMMON_PROPS = ['className', 'style', 'id', 'key'] as const

// Taro组件基础属性
const TARO_COMMON_PROPS = ['onClick', 'onTouchStart', 'onTouchEnd', 'onTouchMove'] as const

// 组件属性白名单配置
export const PROP_WHITELIST = {
  // UI组件
  'ui/Button': [
    ...COMMON_PROPS,
    ...TARO_COMMON_PROPS,
    'type', 'variant', 'size', 'disabled', 'loading', 'icon', 'children'
  ],
  
  'ui/Card': [
    ...COMMON_PROPS,
    ...TARO_COMMON_PROPS,
    'title', 'subtitle', 'hoverable', 'bordered', 'actions', 'extra', 'children'
  ],
  
  'ui/Tabs': [
    ...COMMON_PROPS,
    'items', 'activeKey', 'scrollable', 'onChange', 'tabPosition'
  ],
  
  'ui/Progress': [
    ...COMMON_PROPS,
    'percent', 'showInfo', 'status', 'strokeWidth', 'strokeColor', 'trailColor'
  ],
  
  'ui/Badge': [
    ...COMMON_PROPS,
    'count', 'maxCount', 'dot', 'text', 'variant', 'size', 'children'
  ],
  
  'ui/StatCard': [
    ...COMMON_PROPS,
    ...TARO_COMMON_PROPS,
    'title', 'value', 'icon', 'trend', 'loading'
  ],
  
  'ui/FloatingActionButton': [
    ...COMMON_PROPS,
    ...TARO_COMMON_PROPS,
    'icon', 'position'
  ],
  
  // 基础组件
  'base/StatusBar': [
    ...COMMON_PROPS,
    'style', 'hidden', 'backgroundColor', 'barStyle'
  ],
  
  'base/BottomNavigation': [
    ...COMMON_PROPS,
    'items', 'activeIndex', 'onChange', 'fixed'
  ],
  
  // 业务组件
  'business/ServiceCard': [
    ...COMMON_PROPS,
    ...TARO_COMMON_PROPS,
    'title', 'description', 'icon', 'price', 'originalPrice', 'badge'
  ],
  
  'business/CaseCard': [
    ...COMMON_PROPS,
    ...TARO_COMMON_PROPS,
    'title', 'description', 'image', 'tags', 'author', 'date'
  ],
  
  'business/UploadArea': [
    ...COMMON_PROPS,
    'title', 'subtitle', 'buttonText', 'onUpload', 'accept', 'multiple'
  ],
  
  // 通用组件
  'Empty': [
    ...COMMON_PROPS,
    'title', 'description', 'action', 'image'
  ],
  
  'Loading': [
    ...COMMON_PROPS,
    'size', 'color', 'text'
  ],
  
  'Icon': [
    ...COMMON_PROPS,
    'name', 'size', 'color', 'prefix'
  ],
  
  'SectionHeader': [
    ...COMMON_PROPS,
    'title', 'showViewAll', 'onViewAll'
  ],
  
  // 开发工具组件
  'dev/StateMonitor': [
    ...COMMON_PROPS,
    'visible', 'onClose'
  ],

  // Taro内置组件
  'View': [
    ...COMMON_PROPS,
    ...TARO_COMMON_PROPS,
    'hoverClass', 'hoverStartTime', 'hoverStayTime', 'hoverStopPropagation'
  ],

  'Text': [
    ...COMMON_PROPS,
    'selectable', 'space', 'decode', 'userSelect'
  ],

  'RichText': [
    ...COMMON_PROPS,
    'nodes', 'space'
  ],

  'Button': [
    ...COMMON_PROPS,
    ...TARO_COMMON_PROPS,
    'size', 'type', 'plain', 'disabled', 'loading', 'formType', 'openType',
    'hoverClass', 'hoverStartTime', 'hoverStayTime', 'hoverStopPropagation',
    'lang', 'sessionFrom', 'sendMessageTitle', 'sendMessagePath', 'sendMessageImg',
    'appParameter', 'scope', 'onGetUserInfo', 'onContact', 'onGetPhoneNumber',
    'onError', 'onLaunchApp', 'onChooseAvatar'
  ],

  'Checkbox': [
    ...COMMON_PROPS,
    'value', 'disabled', 'checked', 'color', 'onChange'
  ],

  'CheckboxGroup': [
    ...COMMON_PROPS,
    'onChange', 'children'
  ],

  'Form': [
    ...COMMON_PROPS,
    'reportSubmit', 'reportSubmitTimeout', 'onSubmit', 'onReset'
  ],

  'Input': [
    ...COMMON_PROPS,
    'value', 'type', 'password', 'placeholder', 'placeholderStyle', 'placeholderClass',
    'disabled', 'maxlength', 'cursorSpacing', 'autoFocus', 'focus', 'confirmType',
    'confirmHold', 'cursor', 'selectionStart', 'selectionEnd', 'adjustPosition',
    'holdKeyboard', 'onInput', 'onFocus', 'onBlur', 'onConfirm', 'onKeyboardHeightChange'
  ],

  'Label': [
    ...COMMON_PROPS,
    'for', 'children'
  ],

  'Picker': [
    ...COMMON_PROPS,
    'mode', 'disabled', 'range', 'rangeKey', 'value', 'start', 'end', 'fields',
    'customItem', 'onChange', 'onCancel', 'onColumnChange'
  ],

  'PickerView': [
    ...COMMON_PROPS,
    'value', 'indicatorStyle', 'indicatorClass', 'maskStyle', 'maskClass',
    'onChange', 'onPickStart', 'onPickEnd'
  ],

  'PickerViewColumn': [
    ...COMMON_PROPS,
    'children'
  ],

  'Radio': [
    ...COMMON_PROPS,
    'value', 'checked', 'disabled', 'color', 'onChange'
  ],

  'RadioGroup': [
    ...COMMON_PROPS,
    'onChange', 'children'
  ],

  'Slider': [
    ...COMMON_PROPS,
    'min', 'max', 'step', 'disabled', 'value', 'color', 'selectedColor',
    'activeColor', 'backgroundColor', 'blockSize', 'blockColor', 'showValue',
    'onChange', 'onChanging'
  ],

  'Switch': [
    ...COMMON_PROPS,
    'checked', 'disabled', 'type', 'color', 'onChange'
  ],

  'Textarea': [
    ...COMMON_PROPS,
    'value', 'placeholder', 'placeholderStyle', 'placeholderClass', 'disabled',
    'maxlength', 'autoFocus', 'focus', 'autoHeight', 'fixed', 'cursorSpacing',
    'cursor', 'showConfirmBar', 'selectionStart', 'selectionEnd', 'adjustPosition',
    'holdKeyboard', 'onInput', 'onFocus', 'onBlur', 'onConfirm', 'onLineChange',
    'onKeyboardHeightChange'
  ],

  // 导航组件
  'Navigator': [
    ...COMMON_PROPS,
    'target', 'url', 'openType', 'delta', 'appId', 'path', 'extraData',
    'version', 'hoverClass', 'hoverStartTime', 'hoverStayTime', 'hoverStopPropagation',
    'onSuccess', 'onFail', 'onComplete'
  ],

  // 媒体组件
  'Image': [
    ...COMMON_PROPS,
    'src', 'mode', 'webp', 'lazyLoad', 'showMenuByLongpress', 'onError', 'onLoad'
  ],

  'Video': [
    ...COMMON_PROPS,
    'src', 'duration', 'controls', 'danmuList', 'danmuBtn', 'enableDanmu',
    'autoplay', 'loop', 'muted', 'initialTime', 'pageGesture', 'direction',
    'showProgress', 'showFullscreenBtn', 'showPlayBtn', 'showCenterPlayBtn',
    'enableProgressGesture', 'objectFit', 'poster', 'showMuteBtn', 'title',
    'playBtnPosition', 'enablePlayGesture', 'autoPauseIfNavigate', 'autoPauseIfOpenNative',
    'vslideGesture', 'vslideGestureInFullscreen', 'adUnitId', 'posterForCrawler',
    'onPlay', 'onPause', 'onEnded', 'onTimeUpdate', 'onFullscreenChange',
    'onWaiting', 'onError', 'onProgress', 'onLoadedMetadata'
  ],

  // 地图组件
  'Map': [
    ...COMMON_PROPS,
    'longitude', 'latitude', 'scale', 'markers', 'covers', 'polyline',
    'circles', 'controls', 'includePoints', 'showLocation', 'layerStyle',
    'onTap', 'onMarkerTap', 'onLabelTap', 'onControlTap', 'onCalloutTap',
    'onUpdated', 'onRegionChange', 'onPoiTap'
  ],

  // 画布组件
  'Canvas': [
    ...COMMON_PROPS,
    'type', 'canvasId', 'disableScroll', 'onTouchStart', 'onTouchMove',
    'onTouchEnd', 'onTouchCancel', 'onLongTap', 'onError'
  ],

  // 开放能力组件
  'WebView': [
    ...COMMON_PROPS,
    'src', 'onMessage', 'onLoad', 'onError'
  ],

  'Ad': [
    ...COMMON_PROPS,
    'unitId', 'adIntervals', 'onLoad', 'onError', 'onClose'
  ],

  'OfficialAccount': [
    ...COMMON_PROPS,
    'onLoad', 'onError'
  ],

  'OpenData': [
    ...COMMON_PROPS,
    'type', 'openGid', 'lang', 'onError'
  ],

  // 页面属性组件
  'PageMeta': [
    ...COMMON_PROPS,
    'backgroundColor', 'backgroundTextStyle', 'backgroundColorTop', 'backgroundColorBottom',
    'rootBackgroundColor', 'onResize', 'onScroll', 'onScrollDone'
  ],

  'NavigationBar': [
    ...COMMON_PROPS,
    'title', 'loading', 'frontColor', 'backgroundColor', 'colorAnimationDuration',
    'colorAnimationTimingFunc'
  ],

  // 滚动视图组件
  'ScrollView': [
    ...COMMON_PROPS,
    'scrollX', 'scrollY', 'upperThreshold', 'lowerThreshold', 'scrollTop',
    'scrollLeft', 'scrollIntoView', 'scrollWithAnimation', 'enableBackToTop',
    'enableFlex', 'scrollAnchoring', 'refresherEnabled', 'refresherThreshold',
    'refresherDefaultStyle', 'refresherBackground', 'refresherTriggered',
    'enhanced', 'bounces', 'showScrollbar', 'pagingEnabled', 'fastDeceleration',
    'onScrollToUpper', 'onScrollToLower', 'onScroll', 'onRefresherPulling',
    'onRefresherRefresh', 'onRefresherRestore', 'onRefresherAbort'
  ],

  'Swiper': [
    ...COMMON_PROPS,
    'indicatorDots', 'indicatorColor', 'indicatorActiveColor', 'autoplay',
    'current', 'interval', 'duration', 'circular', 'vertical', 'previousMargin',
    'nextMargin', 'displayMultipleItems', 'skipHiddenItemLayout', 'easingFunction',
    'onChange', 'onTransition', 'onAnimationFinish'
  ],

  'SwiperItem': [
    ...COMMON_PROPS,
    'itemId', 'children'
  ],

  'MovableView': [
    ...COMMON_PROPS,
    'direction', 'inertia', 'outOfBounds', 'x', 'y', 'damping', 'friction',
    'disabled', 'scale', 'scaleMin', 'scaleMax', 'scaleValue', 'animation',
    'onChange', 'onScale'
  ],

  'MovableArea': [
    ...COMMON_PROPS,
    'scaleArea', 'children'
  ],

  'CoverView': [
    ...COMMON_PROPS,
    'scrollTop', 'children'
  ],

  'CoverImage': [
    ...COMMON_PROPS,
    'src', 'onLoad', 'onError'
  ]
} as const

// 通配符规则配置
export const WILDCARD_RULES = {
  // 所有UI组件都支持的通用属性
  'ui/*': [...COMMON_PROPS, ...TARO_COMMON_PROPS],
  
  // 所有基础组件都支持的属性
  'base/*': [...COMMON_PROPS],
  
  // 所有业务组件都支持的属性
  'business/*': [...COMMON_PROPS, ...TARO_COMMON_PROPS],
  
  // 所有组件都支持的最基础属性
  '*': COMMON_PROPS
} as const

// 必需属性配置
export const REQUIRED_PROPS = {
  'ui/StatCard': ['title', 'value'],
  'ui/Tabs': ['items', 'activeKey'],
  'business/ServiceCard': ['title'],
  'business/CaseCard': ['title', 'image'],
  'business/UploadArea': ['onUpload'],
  'Empty': ['title'],
  'Icon': ['name'],
  'SectionHeader': ['title']
} as const

// 属性类型映射
export const PROP_TYPES = {
  // 字符串类型
  string: ['title', 'subtitle', 'description', 'text', 'name', 'icon', 'className', 'id'],
  
  // 数字类型
  number: ['size', 'count', 'maxCount', 'percent', 'strokeWidth', 'activeIndex', 'value'],
  
  // 布尔类型
  boolean: ['disabled', 'loading', 'hoverable', 'bordered', 'scrollable', 'dot', 'hidden', 'fixed', 'multiple'],
  
  // 函数类型
  function: ['onClick', 'onChange', 'onUpload', 'onViewAll', 'onClose', 'onTouchStart', 'onTouchEnd', 'onTouchMove'],
  
  // 数组类型
  array: ['items', 'actions', 'tags', 'accept'],
  
  // 对象类型
  object: ['style', 'extra'],
  
  // React节点类型
  reactNode: ['children', 'action', 'image']
} as const

// 属性值枚举
export const PROP_VALUES = {
  'type': ['primary', 'default', 'warn'],
  'variant': ['primary', 'secondary', 'success', 'warning', 'danger', 'black', 'white', 'gray', 'minimal'],
  'size': ['small', 'medium', 'large', 'mini', 'default'],
  'status': ['normal', 'exception', 'active', 'success'],
  'trend': ['up', 'down', 'stable'],
  'position': ['bottom-right', 'bottom-left', 'top-right', 'top-left'],
  'tabPosition': ['top', 'bottom', 'left', 'right'],
  'barStyle': ['default', 'light-content', 'dark-content']
} as const

// 工具函数：获取组件允许的属性
export function getAllowedProps(componentPath: string): readonly string[] {
  // 直接匹配
  if (componentPath in PROP_WHITELIST) {
    return PROP_WHITELIST[componentPath as keyof typeof PROP_WHITELIST]
  }
  
  // 通配符匹配
  const wildcardProps: string[] = []
  
  for (const [pattern, props] of Object.entries(WILDCARD_RULES)) {
    if (matchesPattern(componentPath, pattern)) {
      wildcardProps.push(...props)
    }
  }
  
  return [...new Set(wildcardProps)] // 去重
}

// 工具函数：获取组件必需属性
export function getRequiredProps(componentPath: string): readonly string[] {
  return REQUIRED_PROPS[componentPath as keyof typeof REQUIRED_PROPS] || []
}

// 工具函数：获取属性类型
export function getPropType(propName: string): string {
  for (const [type, props] of Object.entries(PROP_TYPES)) {
    if ((props as readonly string[]).includes(propName)) {
      return type
    }
  }
  return 'any'
}

// 工具函数：获取属性可选值
export function getPropValues(propName: string): readonly string[] | undefined {
  return PROP_VALUES[propName as keyof typeof PROP_VALUES]
}

// 工具函数：模式匹配
function matchesPattern(path: string, pattern: string): boolean {
  if (pattern === '*') return true
  if (pattern.endsWith('/*')) {
    const prefix = pattern.slice(0, -2)
    return path.startsWith(prefix + '/')
  }
  return path === pattern
}

// 工具函数：验证属性
export function validateProp(
  componentPath: string, 
  propName: string, 
  propValue: any
): { valid: boolean; message?: string } {
  const allowedProps = getAllowedProps(componentPath)
  
  // 检查属性是否在白名单中
  if (!allowedProps.includes(propName)) {
    return {
      valid: false,
      message: `属性 "${propName}" 不在组件 "${componentPath}" 的白名单中`
    }
  }
  
  // 检查属性值类型
  const expectedType = getPropType(propName)
  const actualType = typeof propValue
  
  if (expectedType !== 'any' && expectedType !== actualType && propValue !== undefined) {
    return {
      valid: false,
      message: `属性 "${propName}" 期望类型 "${expectedType}"，实际类型 "${actualType}"`
    }
  }
  
  // 检查枚举值
  const allowedValues = getPropValues(propName)
  if (allowedValues && !allowedValues.includes(propValue)) {
    return {
      valid: false,
      message: `属性 "${propName}" 的值 "${propValue}" 不在允许的值列表中: ${allowedValues.join(', ')}`
    }
  }
  
  return { valid: true }
}

// 工具函数：验证组件所有属性
export function validateComponentProps(
  componentPath: string, 
  props: Record<string, any>
): { valid: boolean; errors: string[]; warnings: string[] } {
  const errors: string[] = []
  const warnings: string[] = []
  
  // 检查必需属性
  const requiredProps = getRequiredProps(componentPath)
  for (const requiredProp of requiredProps) {
    if (!(requiredProp in props)) {
      errors.push(`缺少必需属性: ${requiredProp}`)
    }
  }
  
  // 检查每个属性
  for (const [propName, propValue] of Object.entries(props)) {
    const result = validateProp(componentPath, propName, propValue)
    if (!result.valid) {
      warnings.push(result.message!)
    }
  }
  
  return {
    valid: errors.length === 0,
    errors,
    warnings
  }
}

export default PROP_WHITELIST
