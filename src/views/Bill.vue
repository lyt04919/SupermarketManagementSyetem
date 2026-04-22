<template>
  <div class="bill-container">
    <!-- 搜索区域 -->
    <div class="search-section">
      <div class="search-fields">
        <div class="search-item">
          <label>订单号：</label>
          <input v-model="searchForm.orderNo" type="text" placeholder="请输入订单号" />
        </div>
        <div class="search-item">
          <label>客户名称：</label>
          <input v-model="searchForm.customerName" type="text" placeholder="请输入客户名称" />
        </div>
        <div class="search-item">
          <label>订单状态：</label>
          <select v-model="searchForm.status">
            <option value="">请选择</option>
            <option value="待处理">待处理</option>
            <option value="已完成">已完成</option>
            <option value="已取消">已取消</option>
          </select>
        </div>
        <div class="search-actions">
          <button class="btn-search" @click="search">搜索</button>
          <button class="btn-reset" @click="resetSearch">重置</button>
          <button class="btn-add" @click="openAddDialog">+ 添加订单</button>
        </div>
      </div>
    </div>

    <!-- 表格区域 -->
    <div class="table-section">
      <table class="bill-table">
        <thead>
          <tr>
            <th>订单号</th>
            <th>客户名称</th>
            <th>商品名称</th>
            <th>数量</th>
            <th>总金额</th>
            <th>订单状态</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="bill in paginatedBills" :key="bill.id">
            <td>{{ bill.orderNo }}</td>
            <td>{{ bill.customerName }}</td>
            <td>{{ bill.productName }}</td>
            <td>{{ bill.quantity }}</td>
            <td>{{ bill.totalAmount.toFixed(2) }}</td>
            <td>
              <span class="status-badge" :class="getStatusClass(bill.status)">
                {{ bill.status }}
              </span>
            </td>
            <td>
              <div class="action-buttons">
                <button class="action-btn view" title="查看" @click="viewBill(bill)">
                  <img :src="readIcon" alt="查看" />
                </button>
                <button class="action-btn edit" title="编辑" @click="openEditDialog(bill)">
                  <img :src="xiugaiIcon" alt="编辑" />
                </button>
                <button class="action-btn delete" title="删除" @click="showDeleteDialog(bill.id)">
                  <img :src="schuIcon" alt="删除" />
                </button>
              </div>
            </td>
          </tr>
          <tr v-if="paginatedBills.length === 0">
            <td colspan="7" class="empty-cell">没有匹配到订单数据</td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- 分页区域 -->
    <div class="pagination-section">
      <div class="pagination-info">
        <span>共 {{ filteredBills.length }} 条记录 / {{ totalPages }} 页</span>
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

    <!-- 添加/编辑订单对话框 -->
    <div v-if="showFormDialog" class="modal-overlay" @click.self="showFormDialog = false">
      <div class="form-dialog">
        <div class="dialog-header">
          <h3>{{ isEditing ? '编辑订单' : '添加订单' }}</h3>
        </div>
        <div class="dialog-body">
          <form @submit.prevent="saveBill">
            <div class="form-item">
              <label>订单号：</label>
              <input v-model="formData.orderNo" type="text" placeholder="请输入订单号" :disabled="isEditing" />
            </div>
            <div class="form-item">
              <label>客户名称：</label>
              <input v-model="formData.customerName" type="text" placeholder="请输入客户名称" required />
            </div>
            <div class="form-item">
              <label>商品名称：</label>
              <select v-model="formData.productName" required>
                <option value="">请选择</option>
                <option value="苹果电脑">苹果电脑</option>
                <option value="vivo手机">vivo手机</option>
                <option value="oppo平板">oppo平板</option>
              </select>
            </div>
            <div class="form-item">
              <label>数量：</label>
              <input v-model.number="formData.quantity" type="number" placeholder="请输入数量" min="1" required />
            </div>
            <div class="form-item">
              <label>总金额：</label>
              <input v-model.number="formData.totalAmount" type="number" placeholder="请输入总金额" step="0.01" min="0" required />
            </div>
            <div class="form-item">
              <label>订单状态：</label>
              <select v-model="formData.status" required>
                <option value="待处理">待处理</option>
                <option value="已完成">已完成</option>
                <option value="已取消">已取消</option>
              </select>
            </div>
          </form>
        </div>
        <div class="dialog-footer">
          <button class="btn-cancel" @click="showFormDialog = false">取消</button>
          <button class="btn-confirm" @click="saveBill">确定</button>
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

interface Bill {
  id: number
  orderNo: string
  customerName: string
  productName: string
  quantity: number
  totalAmount: number
  status: string
}

const searchForm = ref({
  orderNo: '',
  customerName: '',
  status: ''
})

const bills = ref<Bill[]>([
  { id: 1, orderNo: 'order1001', customerName: '张三', productName: '苹果电脑', quantity: 2, totalAmount: 17000, status: '待处理' },
  { id: 2, orderNo: 'order1002', customerName: '李四', productName: 'vivo手机', quantity: 1, totalAmount: 2980, status: '已完成' },
  { id: 3, orderNo: 'order1003', customerName: '王五', productName: 'oppo平板', quantity: 3, totalAmount: 5940, status: '已取消' }
])

let nextId = 4

const currentPage = ref(1)
const pageSize = ref(10)
const goToPage = ref(1)

const filteredBills = computed(() =>
  bills.value.filter((bill) => {
    const matchOrderNo = !searchForm.value.orderNo || bill.orderNo.includes(searchForm.value.orderNo)
    const matchCustomerName = !searchForm.value.customerName || bill.customerName.includes(searchForm.value.customerName)
    const matchStatus = !searchForm.value.status || bill.status === searchForm.value.status

    return matchOrderNo && matchCustomerName && matchStatus
  })
)

const totalPages = computed(() => Math.max(1, Math.ceil(filteredBills.value.length / pageSize.value)))
const paginatedBills = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value
  return filteredBills.value.slice(start, start + pageSize.value)
})

watch(filteredBills, () => {
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
    orderNo: '',
    customerName: '',
    status: ''
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

const getStatusClass = (status: string) => {
  switch (status) {
    case '待处理':
      return 'status-pending'
    case '已完成':
      return 'status-active'
    case '已取消':
      return 'status-inactive'
    default:
      return ''
  }
}

const viewBill = (bill: Bill) => {
  alert(`查看订单：${bill.orderNo}\n客户：${bill.customerName}\n商品：${bill.productName}\n数量：${bill.quantity}\n总金额：${bill.totalAmount.toFixed(2)}\n状态：${bill.status}`)
}

const showFormDialog = ref(false)
const isEditing = ref(false)
const formData = ref<Bill>({
  id: 0,
  orderNo: '',
  customerName: '',
  productName: '',
  quantity: 1,
  totalAmount: 0,
  status: '待处理'
})

const openAddDialog = () => {
  isEditing.value = false
  formData.value = {
    id: 0,
    orderNo: '',
    customerName: '',
    productName: '',
    quantity: 1,
    totalAmount: 0,
    status: '待处理'
  }
  showFormDialog.value = true
}

const openEditDialog = (bill: Bill) => {
  isEditing.value = true
  formData.value = { ...bill }
  showFormDialog.value = true
}

const saveBill = () => {
  if (!formData.value.orderNo || !formData.value.customerName || !formData.value.productName) {
    alert('请填写完整的订单信息')
    return
  }

  if (isEditing.value) {
    // 编辑现有订单
    const index = bills.value.findIndex(b => b.id === formData.value.id)
    if (index !== -1) {
      bills.value[index] = { ...formData.value }
    }
  } else {
    // 添加新订单
    const newBill: Bill = {
      ...formData.value,
      id: nextId++
    }
    bills.value.push(newBill)
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
  bills.value = bills.value.filter((bill) => bill.id !== deleteId.value)
  showDelDialog.value = false
  search()
}
</script>

<style scoped>
.bill-container {
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

.bill-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 14px;
}

.bill-table th,
.bill-table td {
  padding: 12px;
  text-align: center;
  border-bottom: 1px solid #E0E0E0;
}

.bill-table th {
  background: #F8F9FA;
  font-weight: bold;
  color: #333;
  position: sticky;
  top: 0;
  z-index: 10;
}

.bill-table tr:hover {
  background: #F5F5F5;
}

.status-badge {
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: bold;
}

.status-active {
  background: #D4F1F4;
  color: #055160;
}

.status-inactive {
  background: #F8D7DA;
  color: #721C24;
}

.status-pending {
  background: #FFF3CD;
  color: #856404;
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