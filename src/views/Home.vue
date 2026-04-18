<template>
  <div class="home-container">
    <!-- 顶部导航栏 -->
    <header class="header">
      <div class="header-left">
        <h1>超市后台管理系统</h1>
      </div>
      <div class="header-right">
        <span>{{ currentDate }}</span>
        <span class="user-info">上午好: {{ username }}</span>
        <button class="theme-btn">退出</button>
      </div>
    </header>
    
    <!-- 主要内容区域 -->
    <div class="main-content">
      <!-- 左侧侧边栏 -->
      <aside class="sidebar">
        <h3>功能列表</h3>
        <ul class="menu">
          <li @click="navigate('/home/product')">
            <img class="menu-icon" :src="goodsIcon" alt="商品管理">
            商品管理
          </li>
          <li @click="navigate('/home/order')">
            <img class="menu-icon" :src="buyIcon" alt="订单管理">
            订单管理
          </li>
          <li @click="navigate('/home/supplier')">
            <img class="menu-icon" :src="gysIcon" alt="供应商管理">
            供应商管理
          </li>
          <li @click="navigate('/home/user')">
            <img class="menu-icon" :src="yhIcon" alt="用户管理">
            用户管理
          </li>
          <li @click="navigate('/home/password')">
            <img class="menu-icon" :src="mmIcon" alt="密码修改">
            密码修改
          </li>
          <li @click="logout">
            <img class="menu-icon" :src="tcIcon" alt="退出系统">
            退出系统
          </li>
        </ul>
      </aside>
      
      <!-- 右侧内容区域 -->
      <main class="content">
        <!-- 内容头部 -->
        <div class="content-header">
          <span class="location">您现在的位置是：{{ currentLocation }}</span>
          <span class="warning">温馨提示：为了正常显示内容，请使用IE10及以上版本</span>
        </div>
        
        <!-- 内容主体 -->
        <div class="content-body">
          <router-view v-slot="{ Component }">
            <transition name="fade" mode="out-in">
              <component :is="Component" />
            </transition>
          </router-view>
          <!-- 系统管理员默认页面 -->
          <div v-if="currentLocation === '系统管理员'" class="admin-page">
            <img class="lock-icon" :src="lockIcon" alt="系统管理员">
            <h2>系统管理员</h2>
            <p>欢迎来到超市后台管理系统</p>
          </div>
        </div>
        
        <!-- 底部版权信息 -->
        <div class="content-footer">
          <span>超市集团©版权所有 2025-02-04</span>
        </div>
      </main>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'

// 导入图标
import goodsIcon from '../assets/icon/goods.png'
import buyIcon from '../assets/icon/buy.png'
import gysIcon from '../assets/icon/gys.png'
import yhIcon from '../assets/icon/yh.png'
import mmIcon from '../assets/icon/mm.png'
import tcIcon from '../assets/icon/tc.png'
import lockIcon from '../assets/icon/zd.png'

const router = useRouter()
const route = useRoute()

const username = ref('tom')
const currentDate = ref('')

// 计算当前位置
const currentLocation = computed(() => {
  const path = route.path
  if (path === '/home') return '系统管理员'
  if (path === '/home/product') return '商品管理'
  if (path === '/home/user') return '用户管理'
  if (path === '/home/user/add') return '用户管理页面→用户添加页面'
  return '系统管理员'
})

// 导航到指定路由
const navigate = (path: string) => {
  router.push(path)
}

// 退出登录
const logout = () => {
  router.push('/login')
}

// 更新当前日期
const updateCurrentDate = () => {
  const now = new Date()
  const year = now.getFullYear()
  const month = String(now.getMonth() + 1).padStart(2, '0')
  const day = String(now.getDate()).padStart(2, '0')
  const hours = String(now.getHours()).padStart(2, '0')
  const minutes = String(now.getMinutes()).padStart(2, '0')
  const seconds = String(now.getSeconds()).padStart(2, '0')
  const weekdays = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六']
  const weekday = weekdays[now.getDay()]
  currentDate.value = `${year}-${month}-${day} ${hours}:${minutes}:${seconds} ${weekday}`
}

onMounted(() => {
  updateCurrentDate()
  setInterval(updateCurrentDate, 1000)
})
</script>

<style scoped>
.home-container {
  width: 100vw;
  height: 100vh;
  display: flex;
  flex-direction: column;
  font-family: Arial, sans-serif;
}

/* 顶部导航栏 */
.header {
  height: 60px;
  background: linear-gradient(90deg, #4facfe 0%, #00f2fe 100%);
  color: #333;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 20px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.header-left h1 {
  font-size: 20px;
  margin: 0;
}

.header-right {
  display: flex;
  align-items: center;
  gap: 20px;
  font-size: 14px;
}

.user-info {
  font-weight: bold;
}

.theme-btn {
  padding: 4px 12px;
  border: none;
  border-radius: 4px;
  background: rgba(255, 255, 255, 0.2);
  color: #333;
  font-size: 14px;
  cursor: pointer;
  transition: background 0.3s;
}

.theme-btn:hover {
  background: rgba(255, 255, 255, 0.3);
}

/* 主要内容区域 */
.main-content {
  flex: 1;
  display: flex;
  overflow: hidden;
}

/* 左侧侧边栏 */
.sidebar {
  width: 200px;
  background: #f5f5f5;
  border-right: 1px solid #ddd;
  padding: 20px 0;
}

.sidebar h3 {
  font-size: 16px;
  color: #333;
  margin: 0 0 20px 20px;
}

.menu {
  list-style: none;
  padding: 0;
  margin: 0;
}

.menu li {
  padding: 12px 20px;
  cursor: pointer;
  transition: background 0.3s;
  display: flex;
  align-items: center;
  gap: 8px;
}

.menu li:hover {
  background: #e0e0e0;
}

.menu-icon {
  width: 16px;
  height: 16px;
  object-fit: contain;
}

/* 右侧内容区域 */
.content {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

/* 内容头部 */
.content-header {
  height: 40px;
  background: #f9f9f9;
  border-bottom: 1px solid #ddd;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 20px;
  font-size: 14px;
  color: #666;
}

.location {
  font-weight: bold;
}

.warning {
  color: #ff6b6b;
}

/* 内容主体 */
.content-body {
  flex: 1;
  padding: 20px;
  overflow-y: auto;
  background: white;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

/* 系统管理员默认页面 */
.admin-page {
  text-align: center;
  padding: 40px;
}

.lock-icon {
  width: 64px;
  height: 64px;
  margin-bottom: 20px;
}

.admin-page h2 {
  font-size: 24px;
  color: #333;
  margin-bottom: 10px;
}

.admin-page p {
  font-size: 16px;
  color: #666;
  margin: 0;
}

/* 内容底部 */
.content-footer {
  height: 40px;
  background: #f9f9f9;
  border-top: 1px solid #ddd;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  color: #999;
}

/* 过渡动画 */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>