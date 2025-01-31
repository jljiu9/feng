# 一叶枫☁ - 前端项目

## 项目简介
一叶枫☁是一个基于 Vue 3 + Vite 的现代化前端项目。

## 技术栈
- **核心框架**: Vue 3
- **构建工具**: Vite
- **UI 框架**: 
  - Element Plus (逐步迁移中)
  - Tailwind CSS (主要使用)
- **样式处理**: 
  - SCSS
  - Tailwind CSS
- **状态管理**: Vuex
- **路由管理**: Vue Router
- **工具库**:
  - @vueuse/core
  - Filepond (文件上传)
  - Plyr (视频播放)
  - LightGallery (图片展示)
  - SparkMD5

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
  - `components/`: Vue 组件
  - `css/`: 样式文件
  - `js/`: JavaScript 工具和配置
  - `img/`: 图片资源
- `public/`: 静态资源
- `dist/`: 构建输出目录

## 样式指南
- 优先使用 Tailwind CSS 进行样式开发
- 对于复杂的自定义样式，使用 SCSS
- Element Plus 组件将逐步迁移至 Tailwind CSS 实现

## 注意事项
- 项目正在进行 UI 框架迁移，新功能优先使用 Tailwind CSS
- 保持代码风格统一，遵循项目既定的开发规范 