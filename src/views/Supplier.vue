<template>
  <div class="supplier-container">
    <!-- 搜索区域 -->
    <div class="search-section">
      <div class="search-fields">
        <div class="search-item">
          <label>供应商号：</label>
          <input v-model="searchForm.supplierId" type="text" placeholder="请输入供应商号" />
        </div>
        <div class="search-item">
          <label>供应商名称：</label>
          <input v-model="searchForm.supplierName" type="text" placeholder="请输入供应商名称" />
        </div>
        <div class="search-item">
          <label>联系人：</label>
          <input v-model="searchForm.contact" type="text" placeholder="请输入联系人" />
        </div>
        <div class="search-actions">
          <button class="btn-search" @click="search">搜索</button>
          <button class="btn-reset" @click="resetSearch">重置</button>
          <button class="btn-add" @click="openAddDialog">+ 添加供应商</button>
        </div>
      </div>
    </div>

    <!-- 表格区域 -->
    <div class="table-section">
      <table class="supplier-table">
        <thead>
          <tr>
            <th>供应商号</th>
            <th>供应商名称</th>
            <th>联系人</th>
            <th>联系电话</th>
            <th>地址</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="supplier in paginatedSuppliers" :key="supplier.id">
            <td>{{ supplier.supplierId }}</td>
            <td>{{ supplier.supplierName }}</td>
            <td>{{ supplier.contact }}</td>
            <td>{{ supplier.phone }}</td>
            <td>{{ supplier.address }}</td>
            <td>
              <div class="action-buttons">
                <button class="action-btn view" title="查看" @click="viewSupplier(supplier)">
                  <img :src="readIcon" alt="查看" />
                </button>
                <button class="action-btn edit" title="编辑" @click="openEditDialog(supplier)">
                  <img :src="xiugaiIcon" alt="编辑" />
                </button>
                <button class="action-btn delete" title="删除" @click="showDeleteDialog(supplier.id)">
                  <img :src="schuIcon" alt="删除" />
                </button>
              </div>
            </td>
          </tr>
          <tr v-if="paginatedSuppliers.length === 0">
            <td colspan="6" class="empty-cell">没有匹配到供应商数据</td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- 分页区域 -->
    <div class="pagination-section">
      <div class="pagination-info">
        <span>共 {{ filteredSuppliers.length }} 条记录 / {{ totalPages }} 页</span>
      </div>
      <div class="pagination-controls">
        <select v-model="pageSize" @change="currentPage = 1">
          <option :value="5">5</option>
          <option :value="10">10</option>
          <option :value="20">20</option>
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
        <span>前往</span>
        <input v-model="goToPage" type="number" min="1" :max="totalPages" @keyup.enter="navigateToPage" />
      </div>
    </div>

    <!-- 删除确认对话框 -->
    <div v-if="showDelDialog" class="modal-overlay" @click.self="showDelDialog = false">
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
          <button class="btn-cancel" @click="showDelDialog = false">取消</button>
          <button class="btn-confirm" @click="confirmDelete">确定</button>
        </div>
      </div>
    </div>

    <!-- 添加/编辑供应商对话框 -->
    <div v-if="showFormDialog" class="modal-overlay" @click.self="showFormDialog = false">
      <div class="form-dialog">
        <div class="dialog-header">
          <h3>{{ isEditing ? '编辑供应商' : '添加供应商' }}</h3>
        </div>
        <div class="dialog-body">
          <form @submit.prevent="saveSupplier">
            <div class="form-item">
              <label>供应商号：</label>
              <input v-model="formData.supplierId" type="text" placeholder="请输入供应商号" :disabled="isEditing" />
            </div>
            <div class="form-item">
              <label>供应商名称：</label>
              <input v-model="formData.supplierName" type="text" placeholder="请输入供应商名称" required />
            </div>
            <div class="form-item">
              <label>联系人：</label>
              <input v-model="formData.contact" type="text" placeholder="请输入联系人" required />
            </div>
            <div class="form-item">
              <label>联系电话：</label>
              <input v-model="formData.phone" type="text" placeholder="请输入联系电话" required />
            </div>
            <div class="form-item">
              <label>地址：</label>
              <input v-model="formData.address" type="text" placeholder="请输入地址" required />
            </div>
          </form>
        </div>
        <div class="dialog-footer">
          <button class="btn-cancel" @click="showFormDialog = false">取消</button>
          <button class="btn-confirm" @click="saveSupplier">确定</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed, ref, watch } from 'vue'

import readIcon from '../assets/icon/read.png'
import schuIcon from '../assets/icon/schu.png'
import xiugaiIcon from '../assets/icon/xiugai.png'

interface Supplier {
  id: number
  supplierId: string
  supplierName: string
  contact: string
  phone: string
  address: string
}

const searchForm = ref({
  supplierId: '',
  supplierName: '',
  contact: ''
})

const suppliers = ref<Supplier[]>([
  { id: 1, supplierId: '3003', supplierName: 'vivo供应商', contact: '张经理', phone: '13800138000', address: '广东省深圳市' },
  { id: 2, supplierId: '3004', supplierName: '苹果供应商', contact: '李经理', phone: '13900139000', address: '上海市浦东新区' },
  { id: 3, supplierId: '3005', supplierName: 'oppo供应商', contact: '王经理', phone: '13700137000', address: '广东省东莞市' }
])

let nextId = 4

const currentPage = ref(1)
const pageSize = ref(10)
const goToPage = ref(1)

const filteredSuppliers = computed(() =>
  suppliers.value.filter((supplier) => {
    const matchSupplierId = !searchForm.value.supplierId || supplier.supplierId.includes(searchForm.value.supplierId)
    const matchSupplierName = !searchForm.value.supplierName || supplier.supplierName.includes(searchForm.value.supplierName)
    const matchContact = !searchForm.value.contact || supplier.contact.includes(searchForm.value.contact)

    return matchSupplierId && matchSupplierName && matchContact
  })
)

const totalPages = computed(() => Math.max(1, Math.ceil(filteredSuppliers.value.length / pageSize.value)))
const paginatedSuppliers = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value
  return filteredSuppliers.value.slice(start, start + pageSize.value)
})

watch(filteredSuppliers, () => {
  if (currentPage.value > totalPages.value) {
    currentPage.value = totalPages.value
    goToPage.value = totalPages.value
  }
})

const search = () => {
  currentPage.value = 1
  goToPage.value = 1
}

const resetSearch = () => {
  searchForm.value = {
    supplierId: '',
    supplierName: '',
    contact: ''
  }
  search()
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

const viewSupplier = (supplier: Supplier) => {
  alert(`查看供应商：${supplier.supplierName}\n供应商号：${supplier.supplierId}\n联系人：${supplier.contact}\n联系电话：${supplier.phone}\n地址：${supplier.address}`)
}

const showFormDialog = ref(false)
const isEditing = ref(false)
const formData = ref<Supplier>({
  id: 0,
  supplierId: '',
  supplierName: '',
  contact: '',
  phone: '',
  address: ''
})

const openAddDialog = () => {
  isEditing.value = false
  formData.value = {
    id: 0,
    supplierId: '',
    supplierName: '',
    contact: '',
    phone: '',
    address: ''
  }
  showFormDialog.value = true
}

const openEditDialog = (supplier: Supplier) => {
  isEditing.value = true
  formData.value = { ...supplier }
  showFormDialog.value = true
}

const saveSupplier = () => {
  if (!formData.value.supplierId || !formData.value.supplierName || !formData.value.contact || !formData.value.phone || !formData.value.address) {
    alert('请填写完整的供应商信息')
    return
  }

  if (isEditing.value) {
    // 编辑现有供应商
    const index = suppliers.value.findIndex(s => s.id === formData.value.id)
    if (index !== -1) {
      suppliers.value[index] = { ...formData.value }
    }
  } else {
    // 添加新供应商
    const newSupplier: Supplier = {
      ...formData.value,
      id: nextId++
    }
    suppliers.value.push(newSupplier)
  }

  showFormDialog.value = false
  search()
}

const showDelDialog = ref(false)
const deleteId = ref<number | null>(null)

const showDeleteDialog = (id: number) => {
  deleteId.value = id
  showDelDialog.value = true
}

const confirmDelete = () => {
  suppliers.value = suppliers.value.filter((supplier) => supplier.id !== deleteId.value)
  showDelDialog.value = false
  search()
}
</script>

<style scoped>
.supplier-container {
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
.btn-reset,
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

.btn-reset {
  background: #95A5A6;
  color: #fff;
}

.btn-reset:hover {
  background: #7F8C8D;
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

.supplier-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 14px;
}

.supplier-table th,
.supplier-table td {
  padding: 12px;
  text-align: center;
  border-bottom: 1px solid #E0E0E0;
}

.supplier-table th {
  background: #F8F9FA;
  font-weight: bold;
  color: #333;
  position: sticky;
  top: 0;
  z-index: 10;
}

.supplier-table tr:hover {
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

.form-dialog {
  width: 400px;
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

.form-item {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 15px;
}

.form-item label {
  width: 80px;
  font-size: 14px;
  color: #333;
  white-space: nowrap;
}

.form-item input,
.form-item select {
  flex: 1;
  height: 32px;
  padding: 0 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
}

.form-item input:disabled {
  background: #F8F9FA;
  cursor: not-allowed;
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
  
  .form-dialog {
    width: 90%;
    max-width: 400px;
  }
  
  .form-item {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .form-item label {
    width: 100%;
    margin-bottom: 5px;
  }
  
  .form-item input,
  .form-item select {
    width: 100%;
  }
}
</style>