<template>
  <div class="system-container">
    <!-- 顶部导航栏 -->
    <header class="system-header">
      <div class="header-left">
        <h1>超市后台管理系统</h1>
      </div>
      <div class="header-right">
        <span class="header-time">{{ currentDate }}</span>
        <span class="header-user">上午好: {{ username }}</span>
        <span class="header-welcome">欢迎</span>
      </div>
    </header>

    <div class="system-body">
      <!-- 左侧功能列表 -->
      <aside class="function-sidebar">
        <h2 class="sidebar-title">功能列表</h2>
        <ul class="function-list">
          <li 
            v-for="item in menuItems" 
            :key="item.label"
            class="function-item"
            :class="{ active: isActive(item.path) }"
            @click="handleMenuClick(item)"
          >
            <img class="function-icon" :src="item.icon" :alt="item.label" />
            <span>{{ item.label }}</span>
          </li>
        </ul>
      </aside>

      <!-- 右侧主内容区 -->
      <main class="main-content">
        <div class="content-header">
          <div class="location-info">
            <span>你现在的位置是: {{ currentLocation }}</span>
          </div>
          <div class="system-tip">
            <span>温馨提示: 为了正常显示内容，请使用IE10及以上版本</span>
          </div>
        </div>

        <div v-if="route.path === '/home'" class="welcome-section">
          <div class="welcome-card">
            <img class="welcome-icon" :src="lockIcon" alt="系统管理员" />
            <h2 class="welcome-title">系统管理员</h2>
            <p class="welcome-message">欢迎来到超市后台管理系统</p>
          </div>
        </div>

        <router-view v-else v-slot="{ Component }">
          <component :is="Component" />
        </router-view>

        <!-- 底部版权信息 -->
        <footer class="system-footer">
          <span>超市集团版权所有 © 2026-02-04</span>
        </footer>
      </main>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'

import buyIcon from '../assets/icon/buy.png'
import goodsIcon from '../assets/icon/goods.png'
import gysIcon from '../assets/icon/gys.png'
import lockIcon from '../assets/icon/zd.png'
import mmIcon from '../assets/icon/mm.png'
import tcIcon from '../assets/icon/tc.png'
import yhIcon from '../assets/icon/yh.png'

const router = useRouter()
const route = useRoute()

const username = ref('tom')
const currentDate = ref('')
let timer: number | undefined

const menuItems = [
  { label: '商品管理', path: '/home/product', icon: goodsIcon },
  { label: '订单管理', path: '/home/bill', icon: buyIcon },
  { label: '供应商管理', path: '/home/supplier', icon: gysIcon },
  { label: '用户管理', path: '/home/user', icon: yhIcon },
  { label: '密码修改', path: '/home/password', icon: mmIcon },
  { label: '退出系统', path: '/login', icon: tcIcon }
]

const locationMap: Record<string, string> = {
  '/home': '系统首页',
  '/home/product': '商品管理',
  '/home/bill': '订单管理',
  '/home/supplier': '供应商管理',
  '/home/user': '用户管理',
  '/home/user/add': '用户管理页面>>用户添加页面',
  '/home/user/detail': '用户管理页面>>用户详情页面',
  '/home/user/edit': '用户管理页面>>用户修改页面',
  '/home/password': '用户密码管理页面'
}

const currentLocation = computed(() => locationMap[route.path] ?? '系统首页')

const isActive = (path: string) => {
  if (path === '/login') {
    return false
  }
  return route.path === path || route.path.startsWith(`${path}/`)
}

const handleMenuClick = (item: { path: string }) => {
  if (item.path === '/login') {
    logout()
    return
  }
  router.push(item.path)
}

const logout = () => {
  router.push('/login')
}

const updateCurrentDate = () => {
  const now = new Date()
  const year = now.getFullYear()
  const month = String(now.getMonth() + 1).padStart(2, '0')
  const day = String(now.getDate()).padStart(2, '0')
  const hours = String(now.getHours()).padStart(2, '0')
  const minutes = String(now.getMinutes()).padStart(2, '0')
  const seconds = String(now.getSeconds()).padStart(2, '0')
  const weekdays = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六']
  currentDate.value = `${year}年${month}月${day}日 ${hours}:${minutes}:${seconds} ${weekdays[now.getDay()]}`
}

onMounted(() => {
  updateCurrentDate()
  timer = window.setInterval(updateCurrentDate, 1000)
})

onUnmounted(() => {
  if (timer) {
    window.clearInterval(timer)
  }
})
</script>

<style scoped>
.system-container {
  width: 100vw;
  height: 100vh;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.system-header {
  height: 50px;
  background: linear-gradient(90deg, #4A90E2 0%, #5FB8FF 100%);
  color: #fff;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 20px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.header-left h1 {
  font-size: 18px;
  font-weight: bold;
  margin: 0;
}

.header-right {
  display: flex;
  align-items: center;
  gap: 20px;
  font-size: 12px;
}

.header-time {
  color: #fff;
}

.header-user {
  color: #fff;
}

.header-welcome {
  color: #fff;
  font-weight: bold;
}

.system-body {
  flex: 1;
  display: flex;
  overflow: hidden;
}

.function-sidebar {
  width: 180px;
  background: #F5F5F5;
  border-right: 1px solid #E0E0E0;
  padding: 20px 0;
  overflow-y: auto;
}

.sidebar-title {
  font-size: 16px;
  font-weight: bold;
  color: #333;
  margin: 0 0 20px 20px;
  padding-bottom: 10px;
  border-bottom: 1px solid #E0E0E0;
}

.function-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.function-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 20px;
  cursor: pointer;
  transition: all 0.3s ease;
  color: #333;
  font-size: 14px;
}

.function-item:hover {
  background: #E3F2FD;
}

.function-item.active {
  background: #2196F3;
  color: #fff;
}

.function-icon {
  width: 16px;
  height: 16px;
  object-fit: contain;
}

.main-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  background: #fff;
}

.content-header {
  height: 40px;
  background: #F8F9FA;
  border-bottom: 1px solid #E0E0E0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 20px;
  font-size: 12px;
  color: #666;
}

.location-info {
  font-weight: bold;
}

.system-tip {
  color: #999;
}

.welcome-section {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #fff;
}

.welcome-card {
  text-align: center;
  padding: 40px;
  background: #F8F9FA;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.welcome-icon {
  width: 80px;
  height: 80px;
  margin-bottom: 20px;
}

.welcome-title {
  font-size: 24px;
  font-weight: bold;
  color: #333;
  margin: 0 0 10px;
}

.welcome-message {
  font-size: 14px;
  color: #666;
  margin: 0;
}

.system-footer {
  height: 30px;
  background: #F8F9FA;
  border-top: 1px solid #E0E0E0;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  color: #999;
}

@media (max-width: 768px) {
  .function-sidebar {
    width: 140px;
  }
  
  .header-right {
    gap: 10px;
    font-size: 10px;
  }
  
  .content-header {
    font-size: 10px;
    padding: 0 10px;
  }
}
</style>
