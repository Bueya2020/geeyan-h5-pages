import { defineConfig, type UserConfigExport } from '@tarojs/cli'
import path from 'path'
import devConfig from './dev'
import prodConfig from './prod'

// https://taro-docs.jd.com/docs/next/config
export default defineConfig((merge, { command, mode }) => {
  const baseConfig = {
    projectName: 'smart-construction-miniprogram',
    date: '2024-6-19',
    designWidth: 393,
    deviceRatio: {
      640: 2.34 / 2,
      750: 1,
      375: 2,
      828: 1.81 / 2,
      393: 1 // iPhone 16 适配
    },
    sourceRoot: 'src',
    outputRoot: 'dist',
    plugins: [
      '@tarojs/plugin-framework-react'
    ],
    defineConstants: {
      ENABLE_INNER_HTML: JSON.stringify(true),
      ENABLE_ADJACENT_HTML: JSON.stringify(true),
      ENABLE_SIZE_APIS: JSON.stringify(true),
      ENABLE_TEMPLATE_CONTENT: JSON.stringify(true),
      ENABLE_CLONE_NODE: JSON.stringify(true),
      ENABLE_CONTAINS: JSON.stringify(true),
      ENABLE_MUTATION_OBSERVER: JSON.stringify(true)
    },
    copy: {
      patterns: [
        {
          from: 'src/assets/',
          to: 'dist/assets/'
        }
      ],
      options: {}
    },
    framework: 'react',
    compiler: {
      type: 'webpack5'
    },
    cache: {
      enable: false // 暂时禁用缓存避免app.config解析问题
    },
    alias: {
      '@': path.resolve(__dirname, '..', 'src'),
      '@components': path.resolve(__dirname, '..', 'src/components'),
      '@pages': path.resolve(__dirname, '..', 'src/pages'),
      '@utils': path.resolve(__dirname, '..', 'src/utils'),
      '@store': path.resolve(__dirname, '..', 'src/store'),
      '@config': path.resolve(__dirname, '..', 'src/config'),
      '@constants': path.resolve(__dirname, '..', 'src/constants'),
      '@services': path.resolve(__dirname, '..', 'src/services'),
      '@types': path.resolve(__dirname, '..', 'src/types')
    },
    mini: {
      miniCssExtractPluginOption: {
        ignoreOrder: true
      },
      postcss: {
        pxtransform: {
          enable: true,
          config: {
            selectorBlackList: ['nut-']
          }
        },
        url: {
          enable: true,
          config: {
            limit: 1024
          }
        },
        cssModules: {
          enable: false,
          config: {
            namingPattern: 'module',
            generateScopedName: '[name]__[local]___[hash:base64:5]'
          }
        }
      }
    },
    h5: {
      publicPath: '/',
      staticDirectory: 'static',
      output: {
        filename: 'js/[name].[hash:8].js',
        chunkFilename: 'js/[name].[chunkhash:8].js'
      },
      miniCssExtractPluginOption: {
        ignoreOrder: true,
        filename: 'css/[name].[hash].css',
        chunkFilename: 'css/[name].[chunkhash].css'
      },
      postcss: {
        autoprefixer: {
          enable: true,
          config: {}
        },
        cssModules: {
          enable: false,
          config: {
            namingPattern: 'module',
            generateScopedName: '[name]__[local]___[hash:base64:5]'
          }
        }
      }
    }
  }
  if (process.env.NODE_ENV === 'development') {
    return merge({}, baseConfig, devConfig)
  }
  return merge({}, baseConfig, prodConfig)
})