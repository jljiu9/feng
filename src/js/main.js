// 引入 Vue 和 ElementPlus 库
import { createApp } from 'vue'
import ElementPlus from 'element-plus'
import * as VueRouter from 'vue-router'

// 引入静态文件
import App from '../App.vue' // 主应用组件
import 'element-plus/dist/index.css' // ElementPlus 样式
import 'plyr/dist/plyr.css' // Plyr 媒体播放器样式
import '../css/main.scss' // 自定义样式

// 定义路由
const routes = [
    {
    path: '/:pathMatch(.*)*',  // 捕获所有路径
    name: 'dynamic-route',
    component: App,
    // 可以添加props来传递路径参数
    props: true
  }
]

// 创建路由实例
const router = VueRouter.createRouter({
    history: VueRouter.createWebHistory(), // 使用 HTML5 历史模式
    routes, // 路由配置
  })





// 创建 Vue 应用并挂载
createApp(App)
.use(router) // 使用路由
.use(ElementPlus) // 使用 ElementPlus 组件库
.mount('#app') // 挂载到 DOM 元素 需要放在最后一个位置