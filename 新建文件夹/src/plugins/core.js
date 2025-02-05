import { ref } from 'vue'

/**
 * 插件日志工具类
 */
class PluginLogger {
  constructor(pluginName, color = '#4CAF50') {
    this.pluginName = pluginName
    this.color = color
  }

  info(message, ...args) {
    console.log(`%c[${this.pluginName}] ${message}`, `color: ${this.color}`, ...args)
  }

  error(message, error) {
    console.error(`%c[${this.pluginName}] ❌ ${message}`, `color: #f44336`, error || '')
  }

  success(message) {
    console.log(`%c[${this.pluginName}] ✅ ${message}`, `color: #4CAF50`)
  }

  warn(message) {
    console.log(`%c[${this.pluginName}] ⚠️ ${message}`, `color: #FFA500`)
  }
}

/**
 * 插件基类
 */
class BasePlugin {
  constructor(name) {
    this.name = name
    this.logger = new PluginLogger(name)
    this.enabled = true
  }

  // 插件安装方法
  install(app) {
    throw new Error('插件必须实现 install 方法')
  }

  // 插件卸载方法
  uninstall(app) {
    // 可选实现
  }

  enable() {
    this.enabled = true
    this.logger.success('插件已启用')
  }

  disable() {
    this.enabled = false
    this.logger.warn('插件已禁用')
  }
}

/**
 * API路由工具类 - 处理服务器API请求
 */
class ApiRouter {
  constructor() {
    this.routes = new Map()
    this.logger = new PluginLogger('ApiRouter', '#FF5722')
    this.middlewares = []
  }

  /**
   * 注册中间件
   * @param {Function} middleware - 中间件函数
   */
  use(middleware) {
    this.middlewares.push(middleware)
    return this
  }

  /**
   * 注册API路由
   * @param {string} method - HTTP方法
   * @param {string} path - 路由路径
   * @param {Function} handler - 处理函数
   */
  route(method, path, handler) {
    const key = `${method.toUpperCase()}:${path}`
    
    // 包装处理函数，支持中间件
    const wrappedHandler = async (ctx) => {
      // 执行中间件链
      for (const middleware of this.middlewares) {
        await middleware(ctx)
      }
      return handler(ctx)
    }

    this.routes.set(key, wrappedHandler)
    this.logger.info(`注册API路由: ${method.toUpperCase()} ${path}`)
    return this
  }

  // HTTP方法包装
  get(path, handler) { return this.route('GET', path, handler) }
  post(path, handler) { return this.route('POST', path, handler) }
  put(path, handler) { return this.route('PUT', path, handler) }
  delete(path, handler) { return this.route('DELETE', path, handler) }

  /**
   * 执行API请求
   * @param {string} method - HTTP方法
   * @param {string} path - 路由路径
   * @param {Object} ctx - 上下文对象
   */
  async handle(method, path, ctx = {}) {
    const handler = this.routes.get(`${method.toUpperCase()}:${path}`)
    if (!handler) {
      throw new Error(`未找到路由: ${method} ${path}`)
    }
    return handler(ctx)
  }
}


/**
 * 路由组 - 用于组织嵌套路由
 */
class RouteGroup {
  constructor(prefix = '') {
    this.prefix = prefix
    this.routes = []
  }

  add(config) {
    if (Array.isArray(config)) {
      this.routes.push(...config.map(route => ({
        ...route,
        path: this.prefix + route.path
      })))
    } else {
      this.routes.push({
        ...config,
        path: this.prefix + config.path
      })
    }
    return this
  }

  getRoutes() {
    return this.routes
  }
}

/**
 * 插件管理器类
 */
class PluginManager {
  constructor() {
    this.plugins = new Map()
    this.logger = new PluginLogger('PluginManager', '#9C27B0')
  }

  /**
   * 注册并安装插件（支持链式调用）
   * @param {BasePlugin} plugin - 插件实例
   */
  use(plugin) {
    if (this.plugins.has(plugin.name)) {
      this.logger.warn(`插件 ${plugin.name} 已经注册`)
      return this
    }

    try {
      // 注册插件
      this.plugins.set(plugin.name, plugin)
      
      // 安装插件
      plugin.install(window.$store.app)
      
      this.logger.success(`插件 ${plugin.name} 注册并安装成功`)
    } catch (error) {
      this.logger.error(`插件 ${plugin.name} 安装失败:`, error)
      this.plugins.delete(plugin.name)
    }

    return this
  }

  /**
   * 卸载插件（支持链式调用）
   * @param {string} pluginName - 插件名称
   */
  unuse(pluginName) {
    const plugin = this.plugins.get(pluginName)
    if (!plugin) {
      this.logger.warn(`插件 ${pluginName} 未注册`)
      return this
    }

    try {
      // 执行插件的卸载方法
      if (plugin.uninstall) {
        plugin.uninstall(window.$store.app)
      }
      
      this.plugins.delete(pluginName)
      this.logger.success(`插件 ${pluginName} 已卸载`)
    } catch (error) {
      this.logger.error(`插件 ${pluginName} 卸载失败:`, error)
    }

    return this
  }

  getPlugin(pluginName) {
    return this.plugins.get(pluginName)
  }

  getAllPlugins() {
    return Array.from(this.plugins.values())
  }
}

/**
 * 全局状态管理器类
 */
class StoreManager {
  constructor() {
    this.logger = new PluginLogger('StoreManager', '#1976D2')
    
    // 初始化全局状态
    if (!window.$store) {
      window.$store = {
        cl: new PluginLogger('响应', '#1976D2'),
        app: null,        // Vue 实例
        router: null,     // Vue Router 实例
        state: {},        // 状态管理
        plugins: {},      // 插件管理
        routes: new ApiRouter(), // 路由管理
      }
    }
  }
  
  /**
   * 注册状态模块
   * @param {string} namespace - 模块命名空间
   * @param {Object} state - 状态对象
   */
  registerModule(namespace, state) {
    if (window.$store.state[namespace]) {
      this.logger.warn(`模块 ${namespace} 已存在`)
      return
    }

    // 将所有属性转换为ref
    const refState = {}
    for (const [key, value] of Object.entries(state)) {
      refState[key] = ref(value)
    }

    window.$store.state[namespace] = refState
    this.logger.success(`模块 ${namespace} 注册成功`)
  }
}

/**
 * 插件管理器增强
 */
class EnhancedPluginManager extends PluginManager {
  constructor() {
    super()
    this.hooks = new Map()
  }

  /**
   * 注册钩子
   * @param {string} name - 钩子名称
   * @param {Function} callback - 钩子回调
   */
  hook(name, callback) {
    if (!this.hooks.has(name)) {
      this.hooks.set(name, [])
    }
    this.hooks.get(name).push(callback)
    return this
  }

  /**
   * 触发钩子
   * @param {string} name - 钩子名称
   * @param {...any} args - 参数
   */
  async trigger(name, ...args) {
    const hooks = this.hooks.get(name) || []
    for (const hook of hooks) {
      await hook(...args)
    }
  }

  /**
   * 注册全局组件
   * @param {string} name - 组件名称
   * @param {Object} component - 组件定义
   */
  component(name, component) {
    if (window.$store.app) {
      window.$store.app.component(name, component)
    }
    return this
  }

  /**
   * 注册全局指令
   * @param {string} name - 指令名称
   * @param {Object} directive - 指令定义
   */
  directive(name, directive) {
    if (window.$store.app) {
      window.$store.app.directive(name, directive)
    }
    return this
  }
}

// 创建管理器实例
const pluginManager = new EnhancedPluginManager()
const storeManager = new StoreManager()
const apiRouter = new ApiRouter()


// 添加到全局状态
window.$store.pluginManager = pluginManager
window.$store.storeManager = storeManager
window.$store.apiRouter = apiRouter

// 导出工具类和管理器
export {
  PluginLogger,
  BasePlugin,
  ApiRouter,
  RouteGroup,
  EnhancedPluginManager,
  StoreManager,
  pluginManager,
  storeManager,
  apiRouter,
}

// 使用示例：

// 注册API路由
window.$store.apiRouter
  // 添加全局中间件
  .use(async (ctx) => {
    console.log('请求开始:', ctx.path)
  })
  
  // 注册API路由
  .get('/api/users', async (ctx) => {
    return { users: [] }
  })
  .post('/api/users', async (ctx) => {
    const { body } = ctx
    return { success: true }
  })


// 注册插件
window.$store.pluginManager
  // 注册钩子
  .hook('beforeMount', async (app) => {
    console.log('应用挂载前')
  })
  
  // 注册全局组件
  .component('AppButton', {
    template: '<button class="app-btn"><slot></slot></button>'
  })
  
  // 注册全局指令
  .directive('focus', {
    mounted: (el) => el.focus()
  })
  
  // 注册插件
  // .use(new CustomPlugin())
