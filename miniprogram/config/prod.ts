import type { UserConfigExport } from '@tarojs/cli'
import TerserPlugin from 'terser-webpack-plugin'
import path from 'path'

export default {
  mini: {
    webpackChain(chain) {
      // 启用代码分割和优化
      chain.optimization
        .minimize(true)
        .minimizer('terser')
        .use(TerserPlugin, [{
          terserOptions: {
            compress: {
              drop_console: true, // 移除console
              drop_debugger: true,
              pure_funcs: ['console.log', 'console.info', 'console.debug'], // 移除特定console方法
              dead_code: true, // 移除死代码
              unused: true, // 移除未使用的代码
              collapse_vars: true, // 折叠变量
              reduce_vars: true, // 减少变量
              passes: 2 // 多次压缩
            },
            format: {
              comments: false // 移除注释
            }
          },
          extractComments: false // 不提取注释到单独文件
        }])

      // 启用代码分割
      chain.optimization.splitChunks({
        chunks: 'all',
        cacheGroups: {
          // 第三方库单独打包
          vendor: {
            name: 'vendor',
            test: /[\\/]node_modules[\\/]/,
            priority: 10,
            chunks: 'all'
          },
          // Taro框架单独打包
          taro: {
            name: 'taro',
            test: /[\\/]node_modules[\\/]@tarojs[\\/]/,
            priority: 20,
            chunks: 'all'
          },
          // 公共组件单独打包
          common: {
            name: 'common',
            test: /[\\/]src[\\/]components[\\/]/,
            priority: 5,
            chunks: 'all',
            minChunks: 2
          }
        }
      })

      // 启用运行时chunk
      chain.optimization.runtimeChunk({
        name: 'runtime'
      })

      // 优化模块解析
      chain.resolve.alias
        .set('@', path.resolve(__dirname, '../src'))
        .set('@components', path.resolve(__dirname, '../src/components'))
        .set('@pages', path.resolve(__dirname, '../src/pages'))
        .set('@utils', path.resolve(__dirname, '../src/utils'))
        .set('@services', path.resolve(__dirname, '../src/services'))
        .set('@assets', path.resolve(__dirname, '../src/assets'))

      // 排除不必要的模块
      chain.externals({
        'react': 'React',
        'react-dom': 'ReactDOM'
      })

      // 优化输出 - 小程序使用标准文件名（不使用哈希值）
      chain.output
        .filename('[name].js')
        .chunkFilename('[name].js')

      // 配置缓存策略
      chain.module
        .rule('images')
        .test(/\.(png|jpe?g|gif|svg|webp)$/i)
        .use('file-loader')
        .loader('file-loader')
        .options({
          name: 'assets/images/[name].[contenthash:8].[ext]',
          publicPath: '../'
        })

      chain.module
        .rule('fonts')
        .test(/\.(woff|woff2|eot|ttf|otf)$/i)
        .use('file-loader')
        .loader('file-loader')
        .options({
          name: 'assets/fonts/[name].[contenthash:8].[ext]',
          publicPath: '../'
        })
    }
  },
  h5: {
    /**
     * WebpackChain 插件配置
     * @docs https://github.com/neutrinojs/webpack-chain
     */
    // webpackChain (chain) {
    //   /**
    //    * 如果 h5 端编译后体积过大，可以使用 webpack-bundle-analyzer 插件对打包体积进行分析。
    //    * @docs https://github.com/webpack-contrib/webpack-bundle-analyzer
    //    */
    //   chain.plugin('analyzer')
    //     .use(require('webpack-bundle-analyzer').BundleAnalyzerPlugin, [])
    //   /**
    //    * 如果 h5 端首屏加载时间过长，可以使用 prerender-spa-plugin 插件预加载首屏数据。
    //    * @docs https://github.com/chrisvfritz/prerender-spa-plugin
    //    */
    //   const path = require('path')
    //   const Prerender = require('prerender-spa-plugin')
    //   const staticDir = path.join(__dirname, '..', 'dist')
    //   chain
    //     .plugin('prerender')
    //     .use(Prerender, [{
    //       staticDir,
    //       routes: [ '/pages/index/index' ],
    //       postProcess (renderedRoute) {
    //         renderedRoute.html = renderedRoute.html
    //           .replace(/<script (.*?)>/gi, '<script $1 defer>')
    //           .replace('id="app"', 'id="app" data-server-rendered="true"')
    //         return renderedRoute
    //       },
    //       minify: {
    //         collapseBooleanAttributes: true,
    //         collapseWhitespace: true,
    //         decodeEntities: true,
    //         keepClosingSlash: true,
    //         sortAttributes: true
    //       }
    //     }])
    // }
  }
} satisfies UserConfigExport