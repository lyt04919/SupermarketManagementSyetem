<template>
  <div class="product-container">
    <!-- 搜索区域 -->
    <div class="search-section">
      <div class="search-fields">
        <div class="search-item">
          <label>商品名称：</label>
          <input v-model="searchForm.productName" type="text" placeholder="请输入商品名称" />
        </div>
        <div class="search-item">
          <label>供应商号：</label>
          <select v-model="searchForm.supplier">
            <option value="">请选择</option>
            <option v-for="supplier in suppliers" :key="supplier.id" :value="supplier.supplierId">
              {{ supplier.supplierId }}
            </option>
          </select>
        </div>
        <div class="search-item">
          <label>状态：</label>
          <select v-model="searchForm.status">
            <option value="">请选择</option>
            <option value="上架">上架</option>
            <option value="下架">下架</option>
          </select>
        </div>
        <div class="search-actions">
          <button class="btn-search" @click="search">搜索</button>
          <button class="btn-reset" @click="resetSearch">重置</button>
          <button class="btn-add" @click="openAddDialog">+ 添加商品</button>
        </div>
      </div>
    </div>

    <p v-if="errorMessage" class="empty-cell">{{ errorMessage }}</p>

    <!-- 表格区域 -->
    <div class="table-section">
      <table class="product-table">
        <thead>
          <tr>
            <th>商品编码</th>
            <th>商品名称</th>
            <th>供应商号</th>
            <th>价格</th>
            <th>库存</th>
            <th>状态</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="product in paginatedProducts" :key="product.id">
            <td>{{ product.code }}</td>
            <td>{{ product.name }}</td>
            <td>{{ product.supplierId }}</td>
            <td>{{ product.price.toFixed(2) }}</td>
            <td>{{ product.stock }}</td>
            <td>
              <span class="status-badge" :class="product.status === '上架' ? 'status-active' : 'status-inactive'">
                {{ product.status }}
              </span>
            </td>
            <td>
              <div class="action-buttons">
                <button class="action-btn view" title="查看" @click="viewProduct(product)">
                  <img :src="readIcon" alt="查看" />
                </button>
                <button class="action-btn edit" title="编辑" @click="openEditDialog(product)">
                  <img :src="xiugaiIcon" alt="编辑" />
                </button>
                <button class="action-btn delete" title="删除" @click="showDeleteDialog(product.id)">
                  <img :src="schuIcon" alt="删除" />
                </button>
              </div>
            </td>
          </tr>
          <tr v-if="paginatedProducts.length === 0">
            <td colspan="7" class="empty-cell">没有匹配到商品数据</td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- 分页区域 -->
    <div class="pagination-section">
      <div class="pagination-info">
        <span>共 {{ filteredProducts.length }} 条记录 / {{ totalPages }} 页</span>
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

    <!-- 添加/编辑商品对话框 -->
    <div v-if="showFormDialog" class="modal-overlay" @click.self="showFormDialog = false">
      <div class="form-dialog">
        <div class="dialog-header">
          <h3>{{ isEditing ? '编辑商品' : '添加商品' }}</h3>
        </div>
        <div class="dialog-body">
          <form @submit.prevent="saveProduct">
            <div class="form-item">
              <label>商品编码：</label>
              <input v-model="formData.code" type="text" placeholder="请输入商品编码" :disabled="isEditing" />
            </div>
            <div class="form-item">
              <label>商品名称：</label>
              <input v-model="formData.name" type="text" placeholder="请输入商品名称" required />
            </div>
            <div class="form-item">
              <label>供应商号：</label>
              <select v-model="formData.supplierId" required>
                <option value="">请选择</option>
                <option v-for="supplier in suppliers" :key="supplier.id" :value="supplier.supplierId">
                  {{ supplier.supplierId }} - {{ supplier.supplierName }}
                </option>
              </select>
            </div>
            <div class="form-item">
              <label>价格：</label>
              <input v-model.number="formData.price" type="number" placeholder="请输入价格" step="0.01" min="0" required />
            </div>
            <div class="form-item">
              <label>库存：</label>
              <input v-model.number="formData.stock" type="number" placeholder="请输入库存" min="0" required />
            </div>
            <div class="form-item">
              <label>状态：</label>
              <select v-model="formData.status" required>
                <option value="上架">上架</option>
                <option value="下架">下架</option>
              </select>
            </div>
          </form>
        </div>
        <div class="dialog-footer">
          <button class="btn-cancel" @click="showFormDialog = false">取消</button>
          <button class="btn-confirm" @click="saveProduct">确定</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed, onMounted, ref, watch } from 'vue'

import readIcon from '../assets/icons/read.png'
import schuIcon from '../assets/icons/schu.png'
import xiugaiIcon from '../assets/icons/xiugai.png'
import {
  createProduct,
  deleteProduct,
  listProducts,
  listSuppliers,
  type Product,
  type Supplier,
  updateProduct
} from '../api'

const searchForm = ref({
  productName: '',
  supplier: '',
  status: ''
})

const products = ref<Product[]>([])
const suppliers = ref<Supplier[]>([])
const errorMessage = ref('')
const currentPage = ref(1)
const pageSize = ref(10)
const goToPage = ref(1)

const filteredProducts = computed(() =>
  products.value.filter((product) => {
    const matchName = !searchForm.value.productName || product.name.includes(searchForm.value.productName)
    const matchSupplier = !searchForm.value.supplier || product.supplierId === searchForm.value.supplier
    const matchStatus = !searchForm.value.status || product.status === searchForm.value.status

    return matchName && matchSupplier && matchStatus
  })
)

const totalPages = computed(() => Math.max(1, Math.ceil(filteredProducts.value.length / pageSize.value)))
const paginatedProducts = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value
  return filteredProducts.value.slice(start, start + pageSize.value)
})

watch(filteredProducts, () => {
  if (currentPage.value > totalPages.value) {
    currentPage.value = totalPages.value
    goToPage.value = totalPages.value
  }
})

const loadProducts = async () => {
  products.value = await listProducts()
}

const loadSuppliersData = async () => {
  suppliers.value = await listSuppliers()
}

const loadData = async () => {
  errorMessage.value = ''

  try {
    await Promise.all([loadProducts(), loadSuppliersData()])
  } catch (error) {
    errorMessage.value = '数据加载失败，请先启动 json-server：npm run server'
    console.error(error)
  }
}

const search = () => {
  currentPage.value = 1
  goToPage.value = 1
}

const resetSearch = () => {
  searchForm.value = {
    productName: '',
    supplier: '',
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

const viewProduct = (product: Product) => {
  alert(`查看商品：${product.name}\n编码：${product.code}\n价格：${product.price.toFixed(2)}\n库存：${product.stock}\n状态：${product.status}`)
}

const showFormDialog = ref(false)
const isEditing = ref(false)
const formData = ref<Product>({
  id: undefined,
  code: '',
  name: '',
  supplierId: '',
  price: 0,
  stock: 0,
  status: '上架'
})

const openAddDialog = () => {
  isEditing.value = false
  formData.value = {
    id: undefined,
    code: '',
    name: '',
    supplierId: '',
    price: 0,
    stock: 0,
    status: '上架'
  }
  showFormDialog.value = true
}

const openEditDialog = (product: Product) => {
  isEditing.value = true
  formData.value = { ...product }
  showFormDialog.value = true
}

const saveProduct = async () => {
  if (!formData.value.code || !formData.value.name || !formData.value.supplierId) {
    alert('请填写完整的商品信息')
    return
  }

  try {
    if (isEditing.value && formData.value.id) {
      await updateProduct(formData.value.id, formData.value)
    } else {
      await createProduct({
        code: formData.value.code,
        name: formData.value.name,
        supplierId: formData.value.supplierId,
        price: formData.value.price,
        stock: formData.value.stock,
        status: formData.value.status
      })
    }

    showFormDialog.value = false
    await loadProducts()
    search()
  } catch (error) {
    alert('保存失败，请确认 json-server 已启动')
    console.error(error)
  }
}

const showDelDialog = ref(false)
const deleteId = ref<number | null>(null)

const showDeleteDialog = (id: number) => {
  deleteId.value = id
  showDelDialog.value = true
}

const confirmDelete = async () => {
  if (!deleteId.value) {
    return
  }

  try {
    await deleteProduct(deleteId.value)
    showDelDialog.value = false
    deleteId.value = null
    await loadProducts()
    search()
  } catch (error) {
    alert('删除失败，请确认 json-server 已启动')
    console.error(error)
  }
}

onMounted(loadData)
</script>

<style scoped>
.product-container {
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

.product-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 14px;
}

.product-table th,
.product-table td {
  padding: 12px;
  text-align: center;
  border-bottom: 1px solid #E0E0E0;
}

.product-table th {
  background: #F8F9FA;
  font-weight: bold;
  color: #333;
  position: sticky;
  top: 0;
  z-index: 10;
}

.product-table tr:hover {
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
