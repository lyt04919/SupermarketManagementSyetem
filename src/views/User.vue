<template>
  <div class="user-container">
    <!-- 搜索区域 -->
    <div class="search-section">
      <div class="search-fields">
        <div class="search-item">
          <label>用户名：</label>
          <input v-model="searchForm.username" type="text" placeholder="请输入用户名称" />
        </div>
        <div class="search-item">
          <label>用户角色：</label>
          <select v-model="searchForm.role">
            <option value="">请选择</option>
            <option value="普通员工">普通员工</option>
            <option value="经理助理">经理助理</option>
            <option value="销售经理">销售经理</option>
            <option value="财务会计">财务会计</option>
          </select>
        </div>
        <div class="search-actions">
          <button class="btn-search" @click="search">搜索</button>
          <button class="btn-add" @click="addUser">+ 添加用户</button>
        </div>
      </div>
    </div>

    <!-- 表格区域 -->
    <div class="table-section">
      <table class="user-table">
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
            <td>
              <div class="action-buttons">
                <button class="action-btn view" title="查看" @click="viewUser(user.id)">
                  <img :src="readIcon" alt="查看" />
                </button>
                <button class="action-btn edit" title="编辑" @click="editUser(user.id)">
                  <img :src="xiugaiIcon" alt="编辑" />
                </button>
                <button class="action-btn delete" title="删除" @click="showDeleteDialog(user.id)">
                  <img :src="schuIcon" alt="删除" />
                </button>
              </div>
            </td>
          </tr>
          <tr v-if="paginatedUsers.length === 0">
            <td colspan="7" class="empty-cell">没有匹配到用户数据</td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- 分页区域 -->
    <div class="pagination-section">
      <div class="pagination-info">
        <span>Total {{ filteredUsers.length }} / {{ totalPages }}page</span>
      </div>
      <div class="pagination-controls">
        <select v-model="pageSize" @change="currentPage = 1">
          <option :value="4">4</option>
          <option :value="8">8</option>
          <option :value="12">12</option>
        </select>
        <button class="page-btn" :disabled="currentPage === 1" @click="prevPage">«</button>
        <button
          v-for="page in totalPages"
          :key="page"
          class="page-btn"
          :class="{ active: currentPage === page }"
          @click="currentPage = page"
        >
          {{ page }}
        </button>
        <button class="page-btn" :disabled="currentPage === totalPages" @click="nextPage">»</button>
        <span>Go to</span>
        <input v-model="goToPage" type="number" min="1" :max="totalPages" @keyup.enter="navigateToPage" />
      </div>
    </div>

    <!-- 删除确认对话框 -->
    <div v-if="showDialog" class="modal-overlay" @click.self="showDialog = false">
      <div class="confirm-dialog">
        <div class="dialog-header">
          <h3>提示</h3>
        </div>
        <div class="dialog-body">
          <div class="dialog-content">
            <span class="warning-icon">⚠</span>
            <p>确定删除吗？</p>
          </div>
        </div>
        <div class="dialog-footer">
          <button class="btn-cancel" @click="showDialog = false">取消</button>
          <button class="btn-confirm" @click="confirmDelete">确定</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed, ref, watch } from 'vue'
import { useRouter } from 'vue-router'

import readIcon from '../assets/icons/read.png'
import schuIcon from '../assets/icons/schu.png'
import xiugaiIcon from '../assets/icons/xiugai.png'

interface UserRecord {
  id: number
  code: string
  name: string
  gender: string
  age: number
  phone: string
  role: string
}

const router = useRouter()

const searchForm = ref({
  username: '',
  role: ''
})

const showDialog = ref(false)
const deleteUserId = ref<number | null>(null)

const users = ref<UserRecord[]>([
  { id: 1, code: 'ck4009', name: 'irina', gender: '男', age: 23, phone: '13313224667', role: '普通员工' },
  { id: 2, code: 'ck4010', name: 'alice', gender: '女', age: 21, phone: '13813224668', role: '经理助理' },
  { id: 3, code: 'ck4011', name: '赵琳', gender: '女', age: 20, phone: '13601324667', role: '经理助理' },
  { id: 4, code: 'ck4012', name: 'tina', gender: '男', age: 21, phone: '13313224667', role: '销售经理' },
  { id: 5, code: 'ck4002', name: 'Jone', gender: '女', age: 21, phone: '13801234568', role: '财务会计' },
  { id: 6, code: 'ck4003', name: 'linda', gender: '女', age: 20, phone: '13301234669', role: '财务会计' }
])

const currentPage = ref(1)
const pageSize = ref(4)
const goToPage = ref(1)

const filteredUsers = computed(() =>
  users.value.filter((user) => {
    const matchesUsername = user.name.toLowerCase().includes(searchForm.value.username.toLowerCase())
    const matchesRole = !searchForm.value.role || user.role === searchForm.value.role
    return matchesUsername && matchesRole
  })
)

const totalPages = computed(() => Math.max(1, Math.ceil(filteredUsers.value.length / pageSize.value)))
const paginatedUsers = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value
  return filteredUsers.value.slice(start, start + pageSize.value)
})

watch(filteredUsers, () => {
  if (currentPage.value > totalPages.value) {
    currentPage.value = totalPages.value
    goToPage.value = totalPages.value
  }
})

const search = () => {
  currentPage.value = 1
  goToPage.value = 1
}

const prevPage = () => {
  if (currentPage.value > 1) {
    currentPage.value -= 1
    goToPage.value = currentPage.value
  }
}

const nextPage = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value += 1
    goToPage.value = currentPage.value
  }
}

const navigateToPage = () => {
  let page = parseInt(goToPage.value.toString(), 10)

  if (Number.isNaN(page) || page < 1) {
    page = 1
  }

  if (page > totalPages.value) {
    page = totalPages.value
  }

  currentPage.value = page
  goToPage.value = page
}

const addUser = () => {
  router.push('/home/user/add')
}

const viewUser = (id: number) => {
  router.push({
    path: '/home/user/detail',
    query: { id: id.toString() }
  })
}

const editUser = (id: number) => {
  router.push({
    path: '/home/user/edit',
    query: { id: id.toString() }
  })
}

const showDeleteDialog = (id: number) => {
  deleteUserId.value = id
  showDialog.value = true
}

const confirmDelete = () => {
  users.value = users.value.filter((user) => user.id !== deleteUserId.value)
  showDialog.value = false
  search()
}
</script>

<style scoped>
.user-container {
  padding: 20px;
  height: calc(100vh - 120px);
  display: flex;
  flex-direction: column;
  gap: 20px;
  overflow: hidden;
}

.search-section {
  background: #F8F9FA;
  padding: 15px;
  border-radius: 4px;
  border: 1px solid #E0E0E0;
}

.search-fields {
  display: flex;
  align-items: center;
  gap: 15px;
  flex-wrap: wrap;
}

.search-item {
  display: flex;
  align-items: center;
  gap: 5px;
}

.search-item label {
  font-size: 14px;
  color: #333;
  white-space: nowrap;
}

.search-item input,
.search-item select {
  height: 32px;
  padding: 0 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
}

.search-item input {
  width: 150px;
}

.search-item select {
  width: 120px;
}

.search-actions {
  display: flex;
  gap: 10px;
  margin-left: auto;
}

.btn-search,
.btn-add {
  height: 32px;
  padding: 0 15px;
  border: none;
  border-radius: 4px;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-search {
  background: #4A90E2;
  color: #fff;
}

.btn-search:hover {
  background: #357ABD;
}

.btn-add {
  background: #5CB85C;
  color: #fff;
  font-weight: bold;
}

.btn-add:hover {
  background: #4CAF50;
}

.table-section {
  flex: 1;
  overflow: auto;
  border: 1px solid #E0E0E0;
  border-radius: 4px;
}

.user-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 14px;
}

.user-table th,
.user-table td {
  padding: 12px;
  text-align: center;
  border-bottom: 1px solid #E0E0E0;
}

.user-table th {
  background: #F8F9FA;
  font-weight: bold;
  color: #333;
  position: sticky;
  top: 0;
  z-index: 10;
}

.user-table tr:hover {
  background: #F5F5F5;
}

.action-buttons {
  display: flex;
  gap: 8px;
  justify-content: center;
}

.action-btn {
  width: 24px;
  height: 24px;
  border: none;
  background: none;
  cursor: pointer;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
}

.action-btn:hover {
  transform: scale(1.1);
}

.action-btn img {
  width: 16px;
  height: 16px;
  object-fit: contain;
}

.action-btn.delete {
  color: #D9534F;
}

.empty-cell {
  height: 100px;
  vertical-align: middle;
  color: #999;
  font-style: italic;
}

.pagination-section {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 0;
  border-top: 1px solid #E0E0E0;
}

.pagination-info {
  font-size: 12px;
  color: #666;
}

.pagination-controls {
  display: flex;
  align-items: center;
  gap: 10px;
}

.pagination-controls select {
  height: 28px;
  padding: 0 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 12px;
}

.page-btn {
  width: 28px;
  height: 28px;
  border: 1px solid #ddd;
  background: #fff;
  cursor: pointer;
  border-radius: 4px;
  font-size: 12px;
  transition: all 0.3s ease;
}

.page-btn:hover {
  background: #F0F0F0;
}

.page-btn.active {
  background: #4A90E2;
  color: #fff;
  border-color: #4A90E2;
}

.page-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.pagination-controls input {
  width: 40px;
  height: 28px;
  padding: 0 5px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 12px;
  text-align: center;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.confirm-dialog {
  width: 300px;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  overflow: hidden;
}

.dialog-header {
  background: #F8F9FA;
  padding: 15px;
  border-bottom: 1px solid #E0E0E0;
}

.dialog-header h3 {
  margin: 0;
  font-size: 16px;
  font-weight: bold;
  color: #333;
}

.dialog-body {
  padding: 20px;
}

.dialog-content {
  display: flex;
  align-items: center;
  gap: 10px;
}

.warning-icon {
  font-size: 20px;
  color: #F0AD4E;
}

.dialog-content p {
  margin: 0;
  font-size: 14px;
  color: #333;
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  padding: 15px;
  border-top: 1px solid #E0E0E0;
  background: #F8F9FA;
}

.btn-cancel,
.btn-confirm {
  padding: 6px 15px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-cancel {
  background: #fff;
  color: #333;
}

.btn-cancel:hover {
  background: #F0F0F0;
}

.btn-confirm {
  background: #4A90E2;
  color: #fff;
  border-color: #4A90E2;
}

.btn-confirm:hover {
  background: #357ABD;
}

@media (max-width: 768px) {
  .search-fields {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .search-actions {
    margin-left: 0;
    width: 100%;
    justify-content: flex-end;
  }
  
  .pagination-section {
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
  }
  
  .pagination-controls {
    width: 100%;
    justify-content: space-between;
  }
}
</style>
