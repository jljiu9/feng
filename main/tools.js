/**
 * @fileoverview 一个超可爱的控制台日志工具 (づ｡◕‿‿◕｡)づ
 * @author jljiu <jljiu@qq.com>
 * @version 1.0.0
 * @license MIT
 * @description
 * 这是一个让控制台输出变得有趣的日志工具，支持：
 * - 彩虹输出 🌈
 * - 随机表情 😊
 * - 趣味提示 ✨
 * - ASCII艺术 🎨
 * - 还有更多好玩的功能等你发现...
 * 
 * @example
 * ```js
 * const logger = new PluginLogger('开心日志')
 * logger.success('芜湖~起飞！')
 * logger.rainbow('来点彩虹色~')
 * ```
 */

/**
 * @class PluginLogger
 * @classdesc 可爱的日志输出器，让你的控制台充满乐趣 ٩(◕‿◕｡)۶
 */
class PluginLogger {
    /**
     * @constructor
     * @param {string} pluginName - 日志前缀名称
     * @param {string} [color='#4CAF50'] - 主题色
     */
    constructor(pluginName, color = '#4CAF50') {
        this.pluginName = pluginName
        this.color = color
        // 骚气的配色方案
        this.styles = {
            string: 'color: #FF69B4',         // 粉粉的字符串
            number: 'color: #00BFFF',         // 炫酷的数字
            object: 'color: #9370DB',         // 高贵的对象
            array: 'color: #FFA500',          // 活力的数组
            error: 'color: #FF4500',          // 报错红红火火
            warning: 'color: #FFD700',        // 警告黄黄的
            success: 'color: #98FB98',        // 成功绿绿的
            info: 'color: #87CEEB',           // 信息蓝蓝的
            rainbow: 'background: linear-gradient(to right, red, orange, yellow, green, blue, indigo, violet); color: white; padding: 2px 4px; border-radius: 3px'  // 彩虹输出
        }
        
        // 可爱的表情库
        this.emojis = {
            error: ['😱', '😨', '😰', '🤯', '💀', '👻'],
            warning: ['😅', '😓', '😥', '😰', '🤔', '🧐'],
            success: ['🎉', '✨', '🌈', '🎨', '🎸', '🎪'],
            info: ['💡', '✨', '🔍', '💫', '🌟', '⭐'],
            debug: ['🐛', '🔧', '🔍', '🐞', '🚧', '🔨'],
            fun: ['🎮', '🎲', '🎯', '🎪', '🎭', '🎨']
        }

        // 随机的趣味提示语
        this.funnyMessages = {
            error: [
                '哎呀妈呀出事啦！',
                '完犊子了！',
                '这波啊，这波是寄了！',
                '你的代码有亿点点问题...',
                '系统已抓狂！',
                '工程师，发生什么事了！',
                '我们遇到了一点小问题...',
                '这个bug有点东西！'
            ],
            success: [
                '好耶！成功啦！',
                '芜湖～起飞！',
                '这波操作很秀！',
                '稳得一批！',
                '收到收到！',
                '任务达成！撒花✿✿ヽ(°▽°)ノ✿',
                '完美！不愧是你！',
                '操作太骚了！'
            ],
            warning: [
                '这样不太好吧...',
                '你确定要这样吗？',
                '我觉得不太行...',
                '要不要再想想？',
                '这波操作有点东西...',
                '总感觉哪里怪怪的...',
                '我觉得可以优化一下...',
                '这样做会不会有问题？'
            ],
            loading: [
                '努力加载中...',
                '马上就好...',
                '让我想想...',
                '处理中，请稍等...'
            ]
        }

        // 添加更多HTTP状态码彩蛋
        this.httpStatusMessages = {
            200: '(请求成功啦！)',
            201: '(创建成功！)',
            204: '(悄悄地成功了~)',
            301: '(永久搬家啦！)',
            302: '(临时外出~)',
            304: '(没有变化，省流量~)',
            400: '(请求有点问题...)',
            401: '(你没有权限哦~)',
            403: '(不给看！)',
            404: '(咦？页面不见了？)',
            418: '(我是一个茶壶！)',
            500: '(服务器累趴下了...)',
            502: '(网关开小差了...)',
            503: '(服务器在休息...)',
            504: '(网关超时了...)'
        }
    }

    /**
     * 获取HTTP状态码的趣味提示
     * @private
     * @param {number} code - HTTP状态码
     * @returns {string} 趣味提示语
     */
    getHttpStatusMessage(code) {
        return this.httpStatusMessages[code] || ''
    }

    /**
     * 生成加载动画
     * @param {string} message - 加载提示语
     * @param {number} [duration=3000] - 持续时间(ms)
     * @returns {Function} 停止函数
     */
    loading(message) {
        const frames = ['⠋', '⠙', '⠹', '⠸', '⠼', '⠴', '⠦', '⠧', '⠇', '⠏']
        let i = 0
        const loadingMessage = this.funnyMessages.loading[
            Math.floor(Math.random() * this.funnyMessages.loading.length)
        ]
        const id = setInterval(() => {
            const frame = frames[i = ++i % frames.length]
            console.clear()
            this.info(`${frame} ${message || loadingMessage}`)
        }, 80)
        
        return () => {
            clearInterval(id)
            this.success('加载完成啦！')
        }
    }

    /**
     * 输出进度条
     * @param {number} progress - 进度(0-100)
     * @param {string} [message] - 提示信息
     */
    progress(progress, message = '') {
        const width = 20
        const filled = Math.floor(progress / 100 * width)
        const bar = '█'.repeat(filled) + '░'.repeat(width - filled)
        this.info(`${message} ${bar} ${progress}%`)
    }

    // 随机获取表情
    getRandomEmoji(type) {
        const emojis = this.emojis[type] || ['✨']
        return emojis[Math.floor(Math.random() * emojis.length)]
    }

    // 随机获取提示语
    getRandomMessage(type) {
        const messages = this.funnyMessages[type] || []
        return messages[Math.floor(Math.random() * messages.length)] || ''
    }

    /**
     * 彩虹输出
     * @param {string} message - 要输出的信息
     */
    rainbow(message) {
        console.log(`%c[${this.pluginName}] ${message}`, this.styles.rainbow)
    }

    /**
     * 大号字体输出
     * @param {string} message - 要输出的信息
     */
    big(message) {
        console.log(`%c${message}`, 'font-size: 24px; font-weight: bold; color: #FF69B4;')
    }

    /**
     * 输出ASCII艺术字
     * @param {string} art - ASCII艺术字符串
     */
    ascii(art) {
        console.log(`%c${art}`, 'font-family: monospace; color: #FF69B4;')
    }

    /**
     * 格式化输出内容
     * @param {any} message - 需要输出的内容
     * @returns {Object} - 返回格式化后的内容和样式
     */
    formatOutput(message) {
        const type = typeof message
        let output = message
        let style = this.styles.string
        let extraLog = null

        // 根据类型处理输出
        switch (type) {
            case 'string':
                output = `📝 ${message}`
                style = this.styles.string
                break
            case 'number':
                output = `🔢 ${message}${this.getNumberFun(message)}`
                style = this.styles.number
                break
            case 'object':
                if (message === null) {
                    output = '🈳 空空如也~'
                } else if (Array.isArray(message)) {
                    output = `📦 数组大小: ${message.length} ${message.length > 10 ? '(哇！好大一个数组！)' : ''}`
                    style = this.styles.array
                    extraLog = message
                } else if (message instanceof Error) {
                    output = `💥 ${this.getRandomMessage('error')} ${message.message}`
                    style = this.styles.error
                    extraLog = message.stack
                } else {
                    output = `🎁 对象类型: ${message.constructor.name}`
                    style = this.styles.object
                    extraLog = message
                }
                break
            case 'undefined':
                output = '❓ 未定义哦~ (你是不是忘记了什么？)'
                style = this.styles.warning
                break
            default:
                output = `❓ 神秘类型[${type}]: ${String(message)}`
        }

        return { output, style, extraLog }
    }

    // 数字的有趣提示
    getNumberFun(num) {
        if (num === 404) return ' (咦？页面不见了？)'
        if (num === 200) return ' (请求成功啦！)'
        if (num === 500) return ' (服务器累趴下了...)'
        if (num === 418) return ' (我是一个茶壶！)'
        if (num === 42) return ' (生命、宇宙及万物的答案！)'
        return ''
    }

    /**
     * 基础日志输出方法
     * @param {string} prefix - 日志前缀
     * @param {any} message - 日志内容
     * @param {string} style - 样式
     * @param {Array} args - 额外参数
     */
    baseLog(prefix, message, style, ...args) {
        const { output, style: msgStyle, extraLog } = this.formatOutput(message)
        console.log(
            `%c[${this.pluginName}]${prefix ? ` ${prefix}` : ''} ${output}`,
            `${style}; ${msgStyle}; font-weight: bold`,
            ...args
        )
        if (extraLog) {
            console.log('👇 详细信息：', extraLog)
        }
    }

    /**
     * 信息日志
     * @param {any} message - 日志内容
     * @param  {...any} args - 额外参数
     */
    info(message, ...args) {
        this.baseLog(this.getRandomEmoji('info'), message, this.styles.info, ...args)
    }

    /**
     * 错误日志
     * @param {any} message - 错误信息
     * @param {Error} [error] - 错误对象
     */
    error(message, error) {
        const emoji = this.getRandomEmoji('error')
        if (error) {
            this.baseLog(emoji, `${this.getRandomMessage('error')}${message}`, this.styles.error, error)
        } else {
            this.baseLog(emoji, message, this.styles.error)
        }
    }

    /**
     * 成功日志
     * @param {any} message - 日志内容
     */
    success(message) {
        this.baseLog(this.getRandomEmoji('success'), `${this.getRandomMessage('success')}${message}`, this.styles.success)
    }

    /**
     * 警告日志
     * @param {any} message - 日志内容
     */
    warn(message) {
        this.baseLog(this.getRandomEmoji('warning'), `${this.getRandomMessage('warning')}${message}`, this.styles.warning)
    }

    /**
     * 调试日志
     * @param {any} message - 日志内容
     */
    debug(message) {
        if (process.env.NODE_ENV === 'development') {
            this.baseLog(this.getRandomEmoji('debug'), `调试信息：${message}`, 'color: #607D8B')
        }
    }

    /**
     * 趣味输出
     * @param {any} message - 日志内容
     */
    fun(message) {
        this.baseLog(this.getRandomEmoji('fun'), message, this.styles.rainbow)
    }

    /**
     * 表格输出
     * @param {Array|Object} data - 表格数据
     * @param {Array} [columns] - 列配置
     */
    table(data, columns) {
        console.log(`%c[${this.pluginName}] 📊 表格输出：`, this.styles.info)
        if (columns) {
            console.table(data, columns)
        } else {
            console.table(data)
        }
    }

    /**
     * 分组输出
     * @param {string} label - 分组标签
     * @param {Function} callback - 分组回调
     */
    group(label, callback) {
        console.group(`%c[${this.pluginName}] 📑 ${label}`, this.styles.info)
        callback()
        console.groupEnd()
    }

    /**
     * 计时器
     * @param {string} label - 计时标签
     * @returns {Function} - 结束计时的函数
     */
    time(label) {
        const timeLabel = `[${this.pluginName}] ⏱️ ${label}`
        const startTime = Date.now()
        console.time(timeLabel)
        return () => {
            console.timeEnd(timeLabel)
            const duration = Date.now() - startTime
            let funnyComment = ''
            if (duration < 100) funnyComment = '哇！好快！'
            else if (duration < 1000) funnyComment = '还不错嘛～'
            else funnyComment = '有点慢哦，要不要优化一下？'
            this.info(`计时结束啦~ ${funnyComment}`)
        }
    }
}

// 导出实例
export default PluginLogger
export const logger = new PluginLogger('🥺小日志')

// // 创建一个全局实例
// const logger = new PluginLogger('🥺小日志🥺')
// // 将 logger 和 PluginLogger 都挂载到 window 对象上
// window.logger = logger
// window.PluginLogger = PluginLogger
// // 输出欢迎信息
// logger.info('控制台工具加载完成啦！')

// 使用示例：
/*
const logger = new PluginLogger('开心日志')

// 普通日志
logger.info('你好呀~')

// 彩虹输出
logger.rainbow('这是彩虹色的输出！')

// 大字输出
logger.big('这是大大的字！')

// ASCII art
logger.ascii(`
    /\\_/\\
   ( o.o )
    > ^ <
`)

// 趣味数字
logger.info(404)  // 会显示特殊提示

// 错误输出（带随机提示语）
logger.error('糟糕', new Error('网络出问题啦'))

// 成功输出（带随机提示语）
logger.success('任务完成！')

// 趣味输出
logger.fun('来玩个游戏吧！')

// 计时器（带趣味评价）
const endTimer = logger.time('耗时操作')
setTimeout(endTimer, 1000)
*/