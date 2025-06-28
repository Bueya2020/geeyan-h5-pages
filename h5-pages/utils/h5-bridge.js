// H5与小程序通信桥接文件

(function() {
    'use strict';

    // 检测运行环境
    const env = {
        isWeChat: /micromessenger/i.test(navigator.userAgent),
        isAlipay: /alipayclient/i.test(navigator.userAgent),
        isTaro: window.__TARO_ENV,
        isMiniProgram: window.__wxjs_environment === 'miniprogram' || window.my || window.swan || window.tt,
        isH5: !window.__wxjs_environment && !window.my && !window.swan && !window.tt
    };

    // 小程序API桥接
    const bridge = {
        // 环境信息
        env: env,

        // 页面跳转
        navigateTo(url) {
            if (env.isMiniProgram) {
                if (window.wx && window.wx.miniProgram) {
                    window.wx.miniProgram.navigateTo({ url });
                } else if (window.my) {
                    window.my.navigateTo({ url });
                }
            } else {
                // H5环境下的处理
                window.location.href = url;
            }
        },

        // 返回上一页
        navigateBack() {
            if (env.isMiniProgram) {
                if (window.wx && window.wx.miniProgram) {
                    window.wx.miniProgram.navigateBack();
                } else if (window.my) {
                    window.my.navigateBack();
                }
            } else {
                window.history.back();
            }
        },

        // 重定向
        redirectTo(url) {
            if (env.isMiniProgram) {
                if (window.wx && window.wx.miniProgram) {
                    window.wx.miniProgram.redirectTo({ url });
                } else if (window.my) {
                    window.my.redirectTo({ url });
                }
            } else {
                window.location.replace(url);
            }
        },

        // 切换Tab
        switchTab(url) {
            if (env.isMiniProgram) {
                if (window.wx && window.wx.miniProgram) {
                    window.wx.miniProgram.switchTab({ url });
                } else if (window.my) {
                    window.my.switchTab({ url });
                }
            } else {
                window.location.href = url;
            }
        },

        // 获取用户信息
        getUserInfo(callback) {
            if (env.isMiniProgram) {
                if (window.wx && window.wx.miniProgram) {
                    window.wx.miniProgram.postMessage({
                        data: { action: 'getUserInfo' }
                    });
                }
            } else {
                // H5环境下的模拟数据
                const mockUser = {
                    nickName: '用户',
                    avatarUrl: '/images/default-avatar.png'
                };
                callback && callback(mockUser);
            }
        },

        // 显示提示
        showToast(options) {
            if (env.isMiniProgram) {
                if (window.wx && window.wx.miniProgram) {
                    window.wx.miniProgram.postMessage({
                        data: { action: 'showToast', ...options }
                    });
                }
            } else {
                // H5环境下使用自定义提示
                if (window.showMessage) {
                    window.showMessage(options.title || options.message, options.icon || 'info');
                } else {
                    alert(options.title || options.message);
                }
            }
        },

        // 显示加载中
        showLoading(options) {
            if (env.isMiniProgram) {
                if (window.wx && window.wx.miniProgram) {
                    window.wx.miniProgram.postMessage({
                        data: { action: 'showLoading', ...options }
                    });
                }
            } else {
                // H5环境下的加载提示
                const loadingEl = document.createElement('div');
                loadingEl.id = 'h5-loading';
                loadingEl.innerHTML = `
                    <div style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.5); z-index: 9999; display: flex; align-items: center; justify-content: center;">
                        <div style="background: white; padding: 20px; border-radius: 8px; text-align: center;">
                            <div style="width: 20px; height: 20px; border: 2px solid #f3f3f3; border-top: 2px solid #3498db; border-radius: 50%; animation: spin 1s linear infinite; margin: 0 auto 10px;"></div>
                            <div>${options.title || '加载中...'}</div>
                        </div>
                    </div>
                `;
                document.body.appendChild(loadingEl);
            }
        },

        // 隐藏加载中
        hideLoading() {
            if (env.isMiniProgram) {
                if (window.wx && window.wx.miniProgram) {
                    window.wx.miniProgram.postMessage({
                        data: { action: 'hideLoading' }
                    });
                }
            } else {
                const loadingEl = document.getElementById('h5-loading');
                if (loadingEl) {
                    loadingEl.remove();
                }
            }
        },

        // 设置导航栏标题
        setNavigationBarTitle(title) {
            if (env.isMiniProgram) {
                if (window.wx && window.wx.miniProgram) {
                    window.wx.miniProgram.postMessage({
                        data: { action: 'setNavigationBarTitle', title }
                    });
                }
            } else {
                document.title = title;
            }
        },

        // 获取系统信息
        getSystemInfo(callback) {
            if (env.isMiniProgram) {
                if (window.wx && window.wx.miniProgram) {
                    window.wx.miniProgram.postMessage({
                        data: { action: 'getSystemInfo' }
                    });
                }
            } else {
                // H5环境下的系统信息
                const systemInfo = {
                    platform: navigator.platform,
                    system: navigator.userAgent,
                    version: navigator.appVersion,
                    screenWidth: window.screen.width,
                    screenHeight: window.screen.height,
                    windowWidth: window.innerWidth,
                    windowHeight: window.innerHeight
                };
                callback && callback(systemInfo);
            }
        },

        // 本地存储
        setStorage(key, data) {
            if (env.isMiniProgram) {
                if (window.wx && window.wx.miniProgram) {
                    window.wx.miniProgram.postMessage({
                        data: { action: 'setStorage', key, data }
                    });
                }
            } else {
                try {
                    localStorage.setItem(key, JSON.stringify(data));
                } catch (e) {
                    console.error('设置存储失败:', e);
                }
            }
        },

        // 获取本地存储
        getStorage(key, callback) {
            if (env.isMiniProgram) {
                if (window.wx && window.wx.miniProgram) {
                    window.wx.miniProgram.postMessage({
                        data: { action: 'getStorage', key }
                    });
                }
            } else {
                try {
                    const data = localStorage.getItem(key);
                    const result = data ? JSON.parse(data) : null;
                    callback && callback(result);
                } catch (e) {
                    console.error('获取存储失败:', e);
                    callback && callback(null);
                }
            }
        },

        // 发起网络请求
        request(options) {
            if (env.isMiniProgram) {
                if (window.wx && window.wx.miniProgram) {
                    window.wx.miniProgram.postMessage({
                        data: { action: 'request', ...options }
                    });
                }
            } else {
                // H5环境下使用fetch
                const { url, method = 'GET', data, header = {}, success, fail } = options;
                
                const fetchOptions = {
                    method,
                    headers: {
                        'Content-Type': 'application/json',
                        ...header
                    }
                };

                if (data && method !== 'GET') {
                    fetchOptions.body = JSON.stringify(data);
                }

                fetch(url, fetchOptions)
                    .then(response => response.json())
                    .then(result => {
                        success && success(result);
                    })
                    .catch(error => {
                        fail && fail(error);
                    });
            }
        },

        // 选择图片
        chooseImage(options) {
            if (env.isMiniProgram) {
                if (window.wx && window.wx.miniProgram) {
                    window.wx.miniProgram.postMessage({
                        data: { action: 'chooseImage', ...options }
                    });
                }
            } else {
                // H5环境下使用input file
                const input = document.createElement('input');
                input.type = 'file';
                input.accept = 'image/*';
                input.multiple = options.count > 1;
                
                input.onchange = function(e) {
                    const files = Array.from(e.target.files);
                    const tempFilePaths = files.map(file => URL.createObjectURL(file));
                    options.success && options.success({ tempFilePaths });
                };
                
                input.click();
            }
        },

        // 预览图片
        previewImage(options) {
            if (env.isMiniProgram) {
                if (window.wx && window.wx.miniProgram) {
                    window.wx.miniProgram.postMessage({
                        data: { action: 'previewImage', ...options }
                    });
                }
            } else {
                // H5环境下的图片预览
                const { urls, current } = options;
                const currentIndex = urls.indexOf(current) || 0;

                // 创建预览容器
                const preview = document.createElement('div');
                preview.innerHTML = `
                    <div style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.9); z-index: 10000; display: flex; align-items: center; justify-content: center;">
                        <img src="${urls[currentIndex]}" style="max-width: 90%; max-height: 90%; object-fit: contain;">
                        <div style="position: absolute; top: 20px; right: 20px; color: white; font-size: 24px; cursor: pointer;" onclick="this.parentElement.parentElement.remove()">×</div>
                    </div>
                `;
                document.body.appendChild(preview);
            }
        },

        // 发起支付
        requestPayment(options) {
            console.log('H5Bridge: 发起支付请求', options);

            if (env.isMiniProgram) {
                if (window.wx && window.wx.miniProgram) {
                    // 向小程序发送支付请求
                    window.wx.miniProgram.postMessage({
                        data: {
                            action: 'requestPayment',
                            paymentData: options,
                            timestamp: Date.now()
                        }
                    });
                }
            } else {
                // H5环境下的支付处理
                this.handleH5Payment(options);
            }
        },

        // H5环境支付处理
        handleH5Payment(options) {
            const { method, amount, orderId } = options;

            // 显示支付选择弹窗
            const paymentModal = document.createElement('div');
            paymentModal.innerHTML = `
                <div style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.5); z-index: 10000; display: flex; align-items: center; justify-content: center;">
                    <div style="background: white; padding: 20px; border-radius: 12px; max-width: 300px; width: 90%;">
                        <h3 style="margin: 0 0 15px 0; text-align: center;">选择支付方式</h3>
                        <div style="margin-bottom: 15px;">
                            <div style="font-size: 14px; color: #666;">订单号：${orderId}</div>
                            <div style="font-size: 16px; font-weight: bold; color: #333;">支付金额：¥${(amount / 100).toFixed(2)}</div>
                        </div>
                        <div style="display: flex; flex-direction: column; gap: 10px;">
                            <button onclick="window.h5Bridge.processH5Payment('wechat', '${orderId}', ${amount})" style="padding: 12px; border: 1px solid #07c160; background: #07c160; color: white; border-radius: 6px; cursor: pointer;">微信支付</button>
                            <button onclick="window.h5Bridge.processH5Payment('alipay', '${orderId}', ${amount})" style="padding: 12px; border: 1px solid #1677ff; background: #1677ff; color: white; border-radius: 6px; cursor: pointer;">支付宝支付</button>
                            <button onclick="this.parentElement.parentElement.parentElement.remove()" style="padding: 12px; border: 1px solid #ccc; background: white; color: #666; border-radius: 6px; cursor: pointer;">取消</button>
                        </div>
                    </div>
                </div>
            `;
            document.body.appendChild(paymentModal);
        },

        // 处理H5支付
        processH5Payment(method, orderId, amount) {
            // 移除支付弹窗
            const modal = document.querySelector('[style*="z-index: 10000"]');
            if (modal) modal.remove();

            // 显示支付处理中
            this.showLoading({ title: '正在调起支付...' });

            // 模拟支付处理
            setTimeout(() => {
                this.hideLoading();

                // 模拟支付成功（90%概率）
                if (Math.random() > 0.1) {
                    this.showToast({ title: '支付成功！', icon: 'success' });

                    // 触发支付成功回调
                    if (window.handlePaymentSuccess) {
                        window.handlePaymentSuccess({
                            orderId,
                            transactionId: method.toUpperCase() + Date.now(),
                            paymentTime: new Date().toISOString(),
                            amount,
                            method
                        });
                    }
                } else {
                    this.showToast({ title: '支付失败，请重试', icon: 'error' });

                    // 触发支付失败回调
                    if (window.handlePaymentFailure) {
                        window.handlePaymentFailure({
                            orderId,
                            error: '支付失败',
                            method
                        });
                    }
                }
            }, 2000);
        },

        // 监听支付结果
        onPaymentResult(callback) {
            this._paymentCallback = callback;
        },

        // 触发支付结果回调
        triggerPaymentResult(result) {
            if (this._paymentCallback) {
                this._paymentCallback(result);
            }
        }
    };

    // 监听小程序消息
    if (env.isMiniProgram && window.wx && window.wx.miniProgram) {
        window.wx.miniProgram.getEnv(function(res) {
            if (res.miniprogram) {
                console.log('运行在小程序环境');
            }
        });
    }

    // 导出桥接对象
    window.h5Bridge = bridge;
    window.miniProgram = bridge; // 兼容旧版本

    // 页面加载完成后的初始化
    document.addEventListener('DOMContentLoaded', function() {
        // 设置页面标题
        if (document.title) {
            bridge.setNavigationBarTitle(document.title);
        }

        // 添加返回按钮事件监听
        const backButtons = document.querySelectorAll('[data-action="back"]');
        backButtons.forEach(button => {
            button.addEventListener('click', function() {
                bridge.navigateBack();
            });
        });

        // 添加页面跳转事件监听
        const navButtons = document.querySelectorAll('[data-navigate]');
        navButtons.forEach(button => {
            button.addEventListener('click', function() {
                const url = this.getAttribute('data-navigate');
                const type = this.getAttribute('data-navigate-type') || 'navigateTo';
                
                switch(type) {
                    case 'redirectTo':
                        bridge.redirectTo(url);
                        break;
                    case 'switchTab':
                        bridge.switchTab(url);
                        break;
                    default:
                        bridge.navigateTo(url);
                }
            });
        });
    });

    console.log('H5-Bridge 初始化完成', { env: bridge.env });
})();