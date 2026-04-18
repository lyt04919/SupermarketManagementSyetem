<template>
  <div class="user-container">
    <!-- 搜索区域 -->
    <div class="search-section">
      <input type="text" placeholder="请输入用户名称" v-model="searchForm.username">
      <select v-model="searchForm.role">
        <option value="">请选择</option>
        <option value="普通员工">普通员工</option>
        <option value="经理助理">经理助理</option>
        <option value="销售经理">销售经理</option>
        <option value="财务会计">财务会计</option>
      </select>
      <button class="search-btn" @click="search">
        <img :src="searchIcon" alt="搜索" class="btn-icon">
        搜索
      </button>
      <button class="add-btn" @click="addUser">
        <img :src="tianjiaIcon" alt="添加" class="btn-icon">
        添加用户
      </button>
    </div>
    
    <!-- 用户列表 -->
    <div class="user-list">
      <table>
        <thead>
          <tr>
            <th>用户编号</th>
            <th>用户名称</th>
            <th>性别</th>
            <th>年龄</th>
            <th>电话</th>
            <th>用户角色</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="user in paginatedUsers" :key="user.id">
            <td>{{ user.code }}</td>
            <td>{{ user.name }}</td>
            <td>{{ user.gender }}</td>
            <td>{{ user.age }}</td>
            <td>{{ user.phone }}</td>
            <td>{{ user.role }}</td>
            <td class="action-buttons">
              <button class="view-btn" @click="viewUser(user.id)">
                <img :src="readIcon" alt="查看" class="btn-icon">
              </button>
              <button class="edit-btn" @click="editUser(user.id)">
                <img :src="xiugaiIcon" alt="编辑" class="btn-icon">
              </button>
              <button class="delete-btn" @click="showDeleteDialog(user.id)">
                <img :src="schuIcon" alt="删除" class="btn-icon">
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    
    <!-- 分页功能 -->
    <div class="pagination">
      <span>Total: {{ filteredUsers.length }} | {{ totalPages }}page</span>
      <select v-model="pageSize" @change="currentPage = 1">
        <option value="4">4</option>
        <option value="8">8</option>
        <option value="12">12</option>
      </select>
      <div class="page-buttons">
        <button @click="prevPage" :disabled="currentPage === 1">«</button>
        <button 
          v-for="page in totalPages" 
          :key="page"
          @click="currentPage = page"
          :class="{ active: currentPage === page }"
        >
          {{ page }}
        </button>
        <button @click="nextPage" :disabled="currentPage === totalPages">»</button>
      </div>
      <span>Go to: <input type="number" v-model="goToPage" @keyup.enter="navigateToPage" min="1" :max="totalPages"></span>
    </div>
    
    <!-- 删除确认对话框 -->
    <div v-if="showDialog" class="dialog-overlay">
      <div class="dialog">
        <div class="dialog-header">
          <h3>提示</h3>
          <button class="close-btn" @click="showDialog = false">×</button>
        </div>
        <div class="dialog-body">
          <p>确定删除吗？</p>
        </div>
        <div class="dialog-footer">
          <button @click="showDialog = false">取消</button>
          <button @click="confirmDelete" class="confirm-btn">确定</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

// 导入图标
import searchIcon from '../assets/icon/search.png'
import tianjiaIcon from '../assets/icon/tianjia.png'
import xiugaiIcon from '../assets/icon/xiugai.png'
import readIcon from '../assets/icon/read.png'
import schuIcon from '../assets/icon/schu.png'

// 搜索表单
const searchForm = ref({
  username: '',
  role: ''
})

// 对话框状态
const showDialog = ref(false)
const deleteUserId = ref(null)

// 用户数据
const users = ref([
  { id: 1, code: 'ck4009', name: 'irina', gender: '男', age: 23, phone: '13313224667', role: '普通员工' },
  { id: 2, code: 'ck4010', name: 'alice', gender: '女', age: 21, phone: '13813224668', role: '经理助理' },
  { id: 3, code: 'ck4011', name: '赵琳', gender: '女', age: 20, phone: '13601324667', role: '经理助理' },
  { id: 4, code: 'ck4012', name: 'tina', gender: '男', age: 21, phone: '13313224667', role: '销售经理' },
  // 更多模拟数据
  { id: 5, code: 'ck4013', name: 'bob', gender: '男', age: 25, phone: '13913224667', role: '普通员工' },
  { id: 6, code: 'ck4014', name: 'lucy', gender: '女', age: 22, phone: '13713224667', role: '经理助理' },
  { id: 7, code: 'ck4015', name: '张三', gender: '男', age: 24, phone: '13513224667', role: '销售经理' },
  { id: 8, code: 'ck4016', name: '李四', gender: '女', age: 23, phone: '13413224667', role: '普通员工' },
  { id: 9, code: 'ck4017', name: '王五', gender: '男', age: 26, phone: '13213224667', role: '销售经理' },
  { id: 10, code: 'ck4018', name: '赵六', gender: '女', age: 20, phone: '13113224667', role: '经理助理' },
  // 财务会计角色的用户
  { id: 11, code: 'ck4002', name: 'Jone', gender: '女', age: 21, phone: '13801234568', role: '财务会计' },
  { id: 12, code: 'ck4003', name: 'linda', gender: '女', age: 20, phone: '13301234669', role: '财务会计' }
])

// 分页相关
const currentPage = ref(1)
const pageSize = ref(4)
const goToPage = ref(1)

// 过滤后的用户数据
const filteredUsers = computed(() => {
  return users.value.filter(user => {
    const matchesUsername = user.name.toLowerCase().includes(searchForm.value.username.toLowerCase())
    const matchesRole = !searchForm.value.role || user.role === searchForm.value.role
    return matchesUsername && matchesRole
  })
})

// 计算总页数
const totalPages = computed(() => {
  return Math.ceil(filteredUsers.value.length / pageSize.value)
})

// 计算当前页的用户
const paginatedUsers = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value
  const end = start + pageSize.value
  return filteredUsers.value.slice(start, end)
})

// 搜索功能
const search = () => {
  currentPage.value = 1
  goToPage.value = 1
}

// 上一页
const prevPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--
    goToPage.value = currentPage.value
  }
}

// 下一页
const nextPage = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value++
    goToPage.value = currentPage.value
  }
}

// 跳转到指定页
const navigateToPage = () => {
  let page = parseInt(goToPage.value.toString())
  if (isNaN(page)) page = 1
  if (page < 1) page = 1
  if (page > totalPages.value) page = totalPages.value
  currentPage.value = page
  goToPage.value = page
}

// 添加用户
const addUser = () => {
  router.push('/home/user/add')
}

// 查看用户详情
const viewUser = (id) => {
  // 跳转到详情页并传递用户ID
  router.push({
    path: '/home/user/detail',
    query: { id: id.toString() }
  })
}

// 编辑用户
const editUser = (id) => {
  // 跳转到编辑页并传递用户ID
  router.push({
    path: '/home/user/edit',
    query: { id: id.toString() }
  })
}

// 显示删除确认对话框
const showDeleteDialog = (id) => {
  deleteUserId.value = id
  showDialog.value = true
}

// 确认删除
const confirmDelete = () => {
  // 删除用户的逻辑
  users.value = users.value.filter(user => user.id !== deleteUserId.value)
  alert('用户删除成功')
  showDialog.value = false
}
</script>

<style scoped>
.user-container {
  width: 100%;
  font-family: Arial, sans-serif;
}

/* 搜索区域 */
.search-section {
  margin-bottom: 20px;
  padding: 15px;
  background: #f9f9f9;
  border-radius: 8px;
  display: flex;
  gap: 10px;
  align-items: center;
}

.search-section input,
.search-section select {
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
}

.search-section input {
  width: 200px;
}

.search-btn {
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  background: #4facfe;
  color: white;
  font-size: 14px;
  cursor: pointer;
  transition: background 0.3s;
}

.search-btn:hover {
  background: #3a8ffd;
}

.add-btn {
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  background: #4caf50;
  color: white;
  font-size: 14px;
  cursor: pointer;
  transition: background 0.3s;
}

.add-btn:hover {
  background: #45a049;
}

/* 用户列表 */
.user-list {
  margin-bottom: 20px;
}

.user-list table {
  width: 100%;
  border-collapse: collapse;
  border: 1px solid #ddd;
}

.user-list th,
.user-list td {
  padding: 12px;
  text-align: left;
  border-bottom: 1px solid #ddd;
}

.user-list th {
  background: #f5f5f5;
  font-weight: bold;
  color: #333;
}

.user-list tr:hover {
  background: #f9f9f9;
}

.action-buttons {
  display: flex;
  gap: 8px;
}

.edit-btn,
.view-btn,
.delete-btn {
  padding: 4px 8px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background 0.3s;
  display: flex;
  align-items: center;
  justify-content: center;
}

.edit-btn {
  background: #ffc107;
}

.view-btn {
  background: #17a2b8;
}

.delete-btn {
  background: #dc3545;
}

.edit-btn:hover {
  background: #e0a800;
}

.view-btn:hover {
  background: #138496;
}

.delete-btn:hover {
  background: #c82333;
}

/* 按钮图标 */
.btn-icon {
  width: 16px;
  height: 16px;
  object-fit: contain;
}

.search-btn,
.add-btn {
  display: flex;
  align-items: center;
  gap: 5px;
}

/* 分页功能 */
.pagination {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px;
  background: #f9f9f9;
  border-radius: 8px;
  font-size: 14px;
}

.page-buttons {
  display: flex;
  gap: 5px;
}

.page-buttons button {
  padding: 4px 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
  background: white;
  cursor: pointer;
  transition: all 0.3s;
}

.page-buttons button:hover {
  background: #f5f5f5;
}

.page-buttons button.active {
  background: #4facfe;
  color: white;
  border-color: #4facfe;
}

.page-buttons button:disabled {
  cursor: not-allowed;
  opacity: 0.5;
}

.pagination input {
  width: 50px;
  padding: 4px 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
  text-align: center;
  margin: 0 5px;
}
/* 删除确认对话框 */
.dialog-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.dialog {
  width: 300px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
  overflow: hidden;
}

.dialog-header {
  padding: 15px;
  background: #f5f5f5;
  border-bottom: 1px solid #ddd;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.dialog-header h3 {
  margin: 0;
  font-size: 16px;
  color: #333;
}

.close-btn {
  background: none;
  border: none;
  font-size: 20px;
  cursor: pointer;
  color: #999;
  padding: 0;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.close-btn:hover {
  color: #333;
}

.dialog-body {
  padding: 20px;
  text-align: center;
}

.dialog-body p {
  margin: 0;
  font-size: 14px;
  color: #333;
}

.dialog-footer {
  padding: 15px;
  background: #f5f5f5;
  border-top: 1px solid #ddd;
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}

.dialog-footer button {
  padding: 6px 16px;
  border: none;
  border-radius: 4px;
  font-size: 14px;
  cursor: pointer;
  transition: background 0.3s;
}

.dialog-footer button:first-child {
  background: #6c757d;
  color: white;
}

.dialog-footer button:first-child:hover {
  background: #5a6268;
}

.confirm-btn {
  background: #dc3545 !important;
  color: white !important;
}

.confirm-btn:hover {
  background: #c82333 !important;
}
</style>