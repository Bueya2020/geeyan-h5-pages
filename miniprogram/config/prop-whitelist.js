"use strict";
/**
 * 组件属性白名单配置
 * 统一声明各组件允许的属性，支持通配符匹配
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.PROP_VALUES = exports.PROP_TYPES = exports.REQUIRED_PROPS = exports.WILDCARD_RULES = exports.PROP_WHITELIST = void 0;
exports.getAllowedProps = getAllowedProps;
exports.getRequiredProps = getRequiredProps;
exports.getPropType = getPropType;
exports.getPropValues = getPropValues;
exports.validateProp = validateProp;
exports.validateComponentProps = validateComponentProps;
// 基础通用属性
const COMMON_PROPS = ['className', 'style', 'id', 'key'];
// Taro组件基础属性
const TARO_COMMON_PROPS = ['onClick', 'onTouchStart', 'onTouchEnd', 'onTouchMove'];
// 组件属性白名单配置
exports.PROP_WHITELIST = {
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
    ]
};
// 通配符规则配置
exports.WILDCARD_RULES = {
    // 所有UI组件都支持的通用属性
    'ui/*': [...COMMON_PROPS, ...TARO_COMMON_PROPS],
    // 所有基础组件都支持的属性
    'base/*': [...COMMON_PROPS],
    // 所有业务组件都支持的属性
    'business/*': [...COMMON_PROPS, ...TARO_COMMON_PROPS],
    // 所有组件都支持的最基础属性
    '*': COMMON_PROPS
};
// 必需属性配置
exports.REQUIRED_PROPS = {
    'ui/StatCard': ['title', 'value'],
    'ui/Tabs': ['items', 'activeKey'],
    'business/ServiceCard': ['title'],
    'business/CaseCard': ['title', 'image'],
    'business/UploadArea': ['onUpload'],
    'Empty': ['title'],
    'Icon': ['name'],
    'SectionHeader': ['title']
};
// 属性类型映射
exports.PROP_TYPES = {
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
};
// 属性值枚举
exports.PROP_VALUES = {
    'type': ['primary', 'default', 'warn'],
    'variant': ['primary', 'secondary', 'success', 'warning', 'danger', 'black', 'white', 'gray', 'minimal'],
    'size': ['small', 'medium', 'large', 'mini', 'default'],
    'status': ['normal', 'exception', 'active', 'success'],
    'trend': ['up', 'down', 'stable'],
    'position': ['bottom-right', 'bottom-left', 'top-right', 'top-left'],
    'tabPosition': ['top', 'bottom', 'left', 'right'],
    'barStyle': ['default', 'light-content', 'dark-content']
};
// 工具函数：获取组件允许的属性
function getAllowedProps(componentPath) {
    // 直接匹配
    if (componentPath in exports.PROP_WHITELIST) {
        return exports.PROP_WHITELIST[componentPath];
    }
    // 通配符匹配
    const wildcardProps = [];
    for (const [pattern, props] of Object.entries(exports.WILDCARD_RULES)) {
        if (matchesPattern(componentPath, pattern)) {
            wildcardProps.push(...props);
        }
    }
    return [...new Set(wildcardProps)]; // 去重
}
// 工具函数：获取组件必需属性
function getRequiredProps(componentPath) {
    return exports.REQUIRED_PROPS[componentPath] || [];
}
// 工具函数：获取属性类型
function getPropType(propName) {
    for (const [type, props] of Object.entries(exports.PROP_TYPES)) {
        if (props.includes(propName)) {
            return type;
        }
    }
    return 'any';
}
// 工具函数：获取属性可选值
function getPropValues(propName) {
    return exports.PROP_VALUES[propName];
}
// 工具函数：模式匹配
function matchesPattern(path, pattern) {
    if (pattern === '*')
        return true;
    if (pattern.endsWith('/*')) {
        const prefix = pattern.slice(0, -2);
        return path.startsWith(prefix + '/');
    }
    return path === pattern;
}
// 工具函数：验证属性
function validateProp(componentPath, propName, propValue) {
    const allowedProps = getAllowedProps(componentPath);
    // 检查属性是否在白名单中
    if (!allowedProps.includes(propName)) {
        return {
            valid: false,
            message: `属性 "${propName}" 不在组件 "${componentPath}" 的白名单中`
        };
    }
    // 检查属性值类型
    const expectedType = getPropType(propName);
    const actualType = typeof propValue;
    if (expectedType !== 'any' && expectedType !== actualType && propValue !== undefined) {
        return {
            valid: false,
            message: `属性 "${propName}" 期望类型 "${expectedType}"，实际类型 "${actualType}"`
        };
    }
    // 检查枚举值
    const allowedValues = getPropValues(propName);
    if (allowedValues && !allowedValues.includes(propValue)) {
        return {
            valid: false,
            message: `属性 "${propName}" 的值 "${propValue}" 不在允许的值列表中: ${allowedValues.join(', ')}`
        };
    }
    return { valid: true };
}
// 工具函数：验证组件所有属性
function validateComponentProps(componentPath, props) {
    const errors = [];
    const warnings = [];
    // 检查必需属性
    const requiredProps = getRequiredProps(componentPath);
    for (const requiredProp of requiredProps) {
        if (!(requiredProp in props)) {
            errors.push(`缺少必需属性: ${requiredProp}`);
        }
    }
    // 检查每个属性
    for (const [propName, propValue] of Object.entries(props)) {
        const result = validateProp(componentPath, propName, propValue);
        if (!result.valid) {
            warnings.push(result.message);
        }
    }
    return {
        valid: errors.length === 0,
        errors,
        warnings
    };
}
exports.default = exports.PROP_WHITELIST;
