<!-- NavProjects.vue -->
<template>
  <div class="py-2">
    <div class="px-3 text-xs font-medium text-muted-foreground" :class="{ 'text-center': collapsed }">项目</div>
    <nav class="mt-1">
      <div v-for="project in projects" :key="project.name" class="group relative">
        <router-link
          :to="project.url"
          class="flex items-center gap-2 rounded-md px-3 py-1.5 hover:bg-muted/50"
          :class="{ 'justify-center': collapsed }"
        >
          <svg class="size-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" v-html="project.icon"></svg>
          <span v-if="!collapsed" class="text-xs">{{ project.name }}</span>
        </router-link>
        <!-- 悬浮提示 -->
        <div
          v-if="collapsed"
          class="invisible absolute left-full top-1/2 ml-1.5 -translate-y-1/2 w-32 rounded-md border bg-card px-2 py-1 opacity-0 shadow-lg transition-all group-hover:visible group-hover:opacity-100"
        >
          <div class="text-xs">{{ project.name }}</div>
        </div>
      </div>
    </nav>
  </div>
</template>

<script setup>
defineProps({
  projects: {
    type: Array,
    default: () => []
  },
  collapsed: {
    type: Boolean,
    default: false
  }
})
</script> 