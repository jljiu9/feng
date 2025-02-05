# 一叶枫☁ - 综合业务系统平台

## 项目简介
一叶枫☁是一个基于 Vue 3 + Vite 构建的现代化综合业务系统平台。该项目采用微服务架构思想，将各个业务模块解耦，实现高度可扩展的模块化设计。平台整合了云存储、即时通讯、邮件系统等多个核心业务模块，并提供统一的用户体验。

## 系统架构
- **微前端架构**
  - 基于模块化的前端架构
  - 独立部署的业务模块
  - 统一的状态管理
  - 共享组件库

## 核心业务模块
- **云存储系统**
  - 文件管理与共享
  - 多媒体文件预览
  - 文件版本控制
  - 协同编辑支持
- **即时通讯系统**
  - 文本消息
  - 语音/视频通话 (WebRTC)
  - 群组聊天
  - 消息推送
- **邮件系统**
  - 邮件收发
  - 邮件分类
  - 垃圾邮件过滤
  - 邮件提醒
- **用户中心**
  - 统一账号管理
  - 权限控制
  - 个人设置
  - 消息通知
- **实时协作**
  - 在线文档
  - 项目管理
  - 任务追踪
  - 日程安排

## 技术架构
- **前端核心**:
  - Vue 3 (组合式 API)
  - Vite (构建工具)
  - Pinia (状态管理)
  - Vue Router (路由管理)
- **UI 框架**: 
  - Element Plus (逐步迁移中)
  - Tailwind CSS (主要使用)

- **通信层**:
  - WebSocket (实时通信)
  - WebRTC (点对点通信)
  - RESTful API
- **数据存储**:
  - Firebase Realtime DB
  - IndexedDB (离线支持)
- **工具库**:
  - @vueuse/core
  - Socket.IO
  - TensorFlow.js (AI 特性)
  - WebAssembly (性能优化)

## 模块化设计
- **共享基础设施**
  - 统一路由系统
  - 公共组件库
  - 主题系统
  - 国际化支持
- **业务模块**
  - 每个模块独立开发部署
  - 模块间通过事件总线通信
  - 支持动态加载
  - 插件化扩展

## 开发环境设置
1. 安装依赖
```bash
npm install
```

2. 启动开发服务器
```bash
npm run dev
```

3. 构建生产版本
```bash
npm run build
```

## 项目结构
- `src/`
  - `modules/`: 业务模块（每个模块使用单文件组件模式）
    - `storage/`
      - `index.vue`      # 模块入口，包含路由和主要逻辑
      - `composables.js` # 模块专用的组合式函数
    - `chat/`
      - `index.vue`      # 聊天模块入口
      - `composables.js` # 聊天相关功能函数
    - `mail/`
      - `index.vue`      # 邮件模块入口
      - `composables.js` # 邮件相关功能函数
  - `components/`: 共享组件（每个组件尽量独立完整）
    - `AppHeader.vue`    # 应用头部
    - `AppSidebar.vue`   # 侧边栏
    - `AppModal.vue`     # 通用弹窗
  - `composables/`: 全局共享的组合式函数
    - `useAuth.js`       # 认证相关
    - `useHttp.js`       # 网络请求
    - `useWebSocket.js`  # WebSocket 封装
  - `stores/`: 状态管理（按功能集中管理）
    - `index.js`         # 统一导出
    - `user.js`          # 用户状态
    - `app.js`          # 应用状态
  - `styles/`: 样式文件
    - `index.scss`       # 主样式入口
    - `variables.scss`   # 变量定义
  - `utils/`: 工具函数（按功能分类）
    - `index.js`         # 统一导出
    - `format.js`        # 格式化工具
    - `validate.js`      # 验证工具
  - `App.vue`            # 应用入口
  - `main.js`            # 主入口文件
  - `router.js`          # 路由配置（集中管理）

## 模块开发规范
- **单文件集成原则**
  - 每个业务模块主要逻辑集中在 index.vue 中
  - 使用 Vue 3 script setup 语法组织代码
  - 通过 composables 抽取可复用逻辑
  - 组件内部状态使用 ref/reactive 管理

- **模块示例结构**
```vue
<!-- modules/storage/index.vue -->
<script setup>
// 1. 组件依赖
import { ref } from 'vue'
import { AppModal } from '@/components'

// 2. 组合式函数
import { useFileUpload } from './composables'

// 3. 状态定义
const files = ref([])
const currentFolder = ref('/')

// 4. 业务逻辑
const { uploadFile, deleteFile } = useFileUpload()

// 5. 事件处理
const handleUpload = async (file) => {
  // 处理上传
}

// 6. 生命周期
onMounted(() => {
  // 初始化逻辑
})
</script>

<template>
  <div class="storage-module">
    <!-- 模块界面 -->
  </div>
</template>

<style lang="scss" scoped>
// 模块样式
</style>
```

## 代码组织原则
1. **集中管理**
   - 相关功能代码集中在一起
   - 减少不必要的文件拆分
   - 使用清晰的代码分区

2. **复用原则**
   - 抽取通用逻辑到 composables
   - 共享组件放在 components 目录
   - 工具函数统一管理

3. **状态管理**
   - 模块内状态在模块内管理
   - 跨模块状态使用 Pinia
   - 及时清理无用状态

4. **代码规范**
   - 使用 ESLint 保持代码风格统一
   - 使用 JSDoc 注释关键函数
   - 保持代码简洁清晰

## 开发指南
- 遵循模块化开发原则
- 编写单元测试和集成测试
- 遵循代码规范和提交规范

## 性能优化
- 路由懒加载
- 组件按需加载
- 资源预加载
- 离线缓存支持
- WebAssembly 性能优化

## 安全特性
- CSRF 防护
- XSS 防护
- 请求加密
- 权限控制
- 操作审计


## 样式指南
- 优先使用 Tailwind CSS 进行样式开发
- 对于复杂的自定义样式，使用 SCSS
- Element Plus 组件将逐步迁移至 Tailwind CSS 实现
## 部署说明
- 支持容器化部署
- 多环境配置
- CI/CD 流程
- 监控告警

## 注意事项
- 项目正在进行 UI 框架迁移，新功能优先使用 Tailwind CSS
- 保持代码风格统一，遵循项目既定的开发规范
- 遵循模块化开发规范
- 注意代码复用和解耦
- 保持向后兼容性
- 关注性能优化
- 重视安全防护 