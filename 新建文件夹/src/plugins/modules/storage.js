import { BasePlugin, storeManager } from '../core'

/**
 * 文件预览组件
 */
const FilePreview = {
  props: ['file'],
  template: `
    <div class="file-preview">
      <img v-if="isImage" :src="file.url" :alt="file.name">
      <video v-else-if="isVideo" :src="file.url" controls></video>
      <div v-else class="file-icon">
        {{ file.extension }}
      </div>
      <div class="file-info">
        <div class="file-name">{{ file.name }}</div>
        <div class="file-size">{{ formatSize(file.size) }}</div>
      </div>
    </div>
  `,
  computed: {
    isImage() {
      return /\.(jpg|jpeg|png|gif)$/i.test(this.file.name)
    },
    isVideo() {
      return /\.(mp4|webm|ogg)$/i.test(this.file.name)
    }
  },
  methods: {
    formatSize(bytes) {
      return window.$store.utils.formatFileSize(bytes)
    }
  }
}

/**
 * 文件上传组件
 */
const FileUpload = {
  template: `
    <div class="file-upload" 
         @dragover.prevent 
         @drop.prevent="handleDrop">
      <input type="file" 
             ref="fileInput" 
             @change="handleFileChange" 
             multiple>
      <div class="upload-area">
        <div v-if="uploading">
          上传进度: {{ progress }}%
        </div>
        <div v-else>
          拖拽文件到此处或点击上传
        </div>
      </div>
    </div>
  `,
  data() {
    return {
      uploading: false,
      progress: 0
    }
  },
  methods: {
    handleDrop(e) {
      const files = Array.from(e.dataTransfer.files)
      this.uploadFiles(files)
    },
    handleFileChange(e) {
      const files = Array.from(e.target.files)
      this.uploadFiles(files)
    },
    async uploadFiles(files) {
      this.uploading = true
      this.progress = 0
      
      try {
        for (const file of files) {
          await window.$store.state.storage.uploadFile.value(file, (progress) => {
            this.progress = Math.round(progress * 100)
          })
        }
      } finally {
        this.uploading = false
      }
    }
  }
}

/**
 * 存储模块插件
 */
class StoragePlugin extends BasePlugin {
  constructor() {
    super('StoragePlugin')
    
    // 定义模块状态
    this.state = {
      files: [],
      currentPath: '/',
      selectedFiles: [],
      uploadQueue: [],
      uploading: false,
      
      // 方法
      uploadFile: async (file, onProgress) => {
        // 实现文件上传逻辑
      },
      
      deleteFile: async (fileId) => {
        // 实现文件删除逻辑
      },
      
      createFolder: async (name) => {
        // 实现创建文件夹逻辑
      },
      
      moveFile: async (fileId, targetPath) => {
        // 实现文件移动逻辑
      }
    }
  }

  /**
   * 安装插件
   */
  install() {
    // 注册状态模块
    storeManager.registerModule('storage', this.state)
    
    // 注册组件
    storeManager.registerComponent('FilePreview', FilePreview)
    storeManager.registerComponent('FileUpload', FileUpload)
    
    // 初始化上传队列处理
    this.initUploadQueue()
    
    this.logger.success('存储模块插件安装成功')
  }

  /**
   * 初始化上传队列处理
   * @private
   */
  initUploadQueue() {
    setInterval(() => {
      if (this.state.uploading || this.state.uploadQueue.length === 0) return
      
      const nextFile = this.state.uploadQueue[0]
      if (nextFile) {
        this.state.uploading = true
        this.state.uploadFile(nextFile)
          .finally(() => {
            this.state.uploadQueue.shift()
            this.state.uploading = false
          })
      }
    }, 1000)
  }
}

// 创建插件实例
export const storagePlugin = new StoragePlugin() 