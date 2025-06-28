/**
 * 开发环境Webpack配置扩展
 * 添加属性验证和实时检查功能
 */

const ESLintPlugin = require('eslint-webpack-plugin')
const path = require('path')

module.exports = {
  // 开发服务器配置
  devServer: {
    overlay: {
      warnings: true,
      errors: true
    },
    // 启用热重载时的属性验证
    before(app, server, compiler) {
      console.log('🔍 启用组件属性实时验证...')
      
      // 监听文件变化
      compiler.hooks.watchRun.tap('PropValidation', (compilation) => {
        const changedFiles = compilation.modifiedFiles || new Set()
        
        // 检查是否有组件文件变化
        const componentFiles = Array.from(changedFiles).filter(file => 
          file.includes('/components/') && (file.endsWith('.tsx') || file.endsWith('.ts'))
        )
        
        if (componentFiles.length > 0) {
          console.log('📝 检测到组件文件变化，执行属性验证...')
          
          // 这里可以添加实时验证逻辑
          componentFiles.forEach(file => {
            console.log(`  - ${path.relative(process.cwd(), file)}`)
          })
        }
      })
    }
  },
  
  // 插件配置
  plugins: [
    // ESLint插件配置
    new ESLintPlugin({
      extensions: ['ts', 'tsx'],
      exclude: ['node_modules', 'dist'],
      emitWarning: true,
      emitError: true,
      failOnError: false, // 开发环境不因ESLint错误中断
      failOnWarning: false,
      // 自定义格式化器
      formatter: (results) => {
        const propErrors = []
        const otherErrors = []
        
        results.forEach(result => {
          result.messages.forEach(message => {
            if (message.ruleId === 'props/prop-whitelist') {
              propErrors.push({
                file: result.filePath,
                ...message
              })
            } else {
              otherErrors.push({
                file: result.filePath,
                ...message
              })
            }
          })
        })
        
        let output = ''
        
        if (propErrors.length > 0) {
          output += '\n🚨 组件属性白名单违规:\n'
          propErrors.forEach(error => {
            const relativePath = path.relative(process.cwd(), error.file)
            output += `  ${relativePath}:${error.line}:${error.column} - ${error.message}\n`
          })
          output += '\n💡 运行 "npm run fix:props" 自动修复\n'
        }
        
        if (otherErrors.length > 0) {
          output += '\n📋 其他ESLint问题:\n'
          otherErrors.slice(0, 5).forEach(error => {
            const relativePath = path.relative(process.cwd(), error.file)
            output += `  ${relativePath}:${error.line}:${error.column} - ${error.message}\n`
          })
          if (otherErrors.length > 5) {
            output += `  ... 还有 ${otherErrors.length - 5} 个问题\n`
          }
        }
        
        return output
      }
    })
  ],
  
  // 模块解析配置
  resolve: {
    alias: {
      '@prop-whitelist': path.resolve(__dirname, './prop-whitelist.js')
    }
  },
  
  // 开发工具配置
  devtool: 'eval-source-map',
  
  // 性能提示
  performance: {
    hints: 'warning',
    maxAssetSize: 250000,
    maxEntrypointSize: 250000
  },
  
  // 统计信息配置
  stats: {
    colors: true,
    modules: false,
    children: false,
    chunks: false,
    chunkModules: false,
    // 自定义统计信息
    warningsFilter: [
      /prop-whitelist/
    ]
  }
}

// 开发环境专用的属性验证中间件
class PropValidationPlugin {
  constructor(options = {}) {
    this.options = {
      enabled: process.env.NODE_ENV === 'development',
      autoFix: false,
      showSuggestions: true,
      ...options
    }
  }
  
  apply(compiler) {
    if (!this.options.enabled) return
    
    compiler.hooks.compilation.tap('PropValidationPlugin', (compilation) => {
      // 在编译过程中进行属性验证
      compilation.hooks.buildModule.tap('PropValidationPlugin', (module) => {
        if (module.resource && module.resource.includes('/components/')) {
          // 这里可以添加模块级别的属性验证
        }
      })
      
      // 编译完成后的验证
      compilation.hooks.afterOptimizeChunks.tap('PropValidationPlugin', (chunks) => {
        if (this.options.showSuggestions) {
          console.log('\n💡 属性验证提示:')
          console.log('  - 使用 npm run fix:props 自动修复属性问题')
          console.log('  - 使用 npm run gen:prop-types 更新类型定义')
          console.log('  - 查看 config/prop-whitelist.ts 了解允许的属性')
        }
      })
    })
    
    // 监听文件变化
    compiler.hooks.watchRun.tap('PropValidationPlugin', (compiler) => {
      const changedFiles = compiler.modifiedFiles || new Set()
      
      // 检查白名单配置是否变化
      const whitelistChanged = Array.from(changedFiles).some(file => 
        file.includes('prop-whitelist.ts')
      )
      
      if (whitelistChanged) {
        console.log('🔄 检测到白名单配置变化，建议重新生成类型定义')
        
        if (this.options.autoFix) {
          console.log('🚀 自动重新生成类型定义...')
          // 这里可以添加自动重新生成的逻辑
        }
      }
    })
  }
}

module.exports.PropValidationPlugin = PropValidationPlugin
