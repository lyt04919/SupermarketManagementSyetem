<template>
  <div class="product-container">
    <!-- 搜索区域 -->
    <div class="search-section">
      <input type="text" placeholder="请输入商品名称" v-model="searchForm.productName">
      <select v-model="searchForm.supplier">
        <option value="">请选择供应商</option>
        <option value="3003">供应商A</option>
        <option value="3004">供应商B</option>
        <option value="3005">供应商C</option>
      </select>
      <select v-model="searchForm.status">
        <option value="">请选择状态</option>
        <option value="上架">上架</option>
        <option value="下架">下架</option>
      </select>
      <button class="search-btn" @click="search">
        <img :src="searchIcon" alt="搜索" class="btn-icon">
        搜索
      </button>
      <button class="add-btn" @click="openAddDialog">
        <img :src="tianjiaIcon" alt="添加" class="btn-icon">
        添加商品
      </button>
    </div>

    <!-- 商品列表 -->
    <div class="product-list">
      <table>
        <thead>
          <tr>
            <th>商品编码</th>
            <th>商品名称</th>
            <th>供应商号</th>
            <th>价格（元）</th>
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
            <td>{{ product.price }}</td>
            <td>{{ product.stock }}</td>
            <td>
              <span :class="product.status === '上架' ? 'badge-up' : 'badge-down'">
                {{ product.status }}
              </span>
            </td>
            <td class="action-buttons">
              <button class="view-btn" @click="viewProduct(product)" title="查看">
                <img :src="readIcon" alt="查看" class="btn-icon">
              </button>
              <button class="edit-btn" @click="openEditDialog(product)" title="编辑">
                <img :src="xiugaiIcon" alt="编辑" class="btn-icon">
              </button>
              <button class="delete-btn" @click="showDeleteDialog(product.id)" title="删除">
                <img :src="schuIcon" alt="删除" class="btn-icon">
              </button>
            </td>
          </tr>
          <tr v-if="paginatedProducts.length === 0">
            <td colspan="7" class="empty-row">暂无数据</td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- 分页功能 -->
    <div class="pagination">
      <span>共 {{ filteredProducts.length }} 条 | {{ totalPages }} 页</span>
      <select v-model="pageSize" @change="currentPage = 1">
        <option :value="5">5条/页</option>
        <option :value="10">10条/页</option>
        <option :value="20">20条/页</option>
      </select>
      <div class="page-buttons">
        <button @click="prevPage" :disabled="currentPage === 1">«</button>
        <button
          v-for="page in totalPages"
          :key="page"
          @click="currentPage = page"
          :class="{ active: currentPage === page }"
        >{{ page }}</button>
        <button @click="nextPage" :disabled="currentPage === totalPages">»</button>
      </div>
      <span>跳转: <input type="number" v-model="goToPage" @keyup.enter="navigateToPage" min="1" :max="totalPages"></span>
    </div>

    <!-- 查看详情弹窗 -->
    <div v-if="showViewDialog" class="dialog-overlay" @click.self="showViewDialog = false">
      <div class="dialog dialog-lg">
        <div class="dialog-header">
          <h3>商品详情</h3>
          <button class="close-btn" @click="showViewDialog = false">×</button>
        </div>
        <div class="dialog-body">
          <div class="detail-grid">
            <div class="detail-item"><span class="detail-label">商品编码：</span><span>{{ viewForm.code }}</span></div>
            <div class="detail-item"><span class="detail-label">商品名称：</span><span>{{ viewForm.name }}</span></div>
            <div class="detail-item"><span class="detail-label">供应商号：</span><span>{{ viewForm.supplierId }}</span></div>
            <div class="detail-item"><span class="detail-label">价格（元）：</span><span>{{ viewForm.price }}</span></div>
            <div class="detail-item"><span class="detail-label">库存数量：</span><span>{{ viewForm.stock }}</span></div>
            <div class="detail-item">
              <span class="detail-label">商品状态：</span>
              <span :class="viewForm.status === '上架' ? 'badge-up' : 'badge-down'">{{ viewForm.status }}</span>
            </div>
          </div>
        </div>
        <div class="dialog-footer">
          <button @click="showViewDialog = false">关闭</button>
        </div>
      </div>
    </div>

    <!-- 添加/编辑弹窗 -->
    <div v-if="showFormDialog" class="dialog-overlay" @click.self="showFormDialog = false">
      <div class="dialog dialog-lg">
        <div class="dialog-header">
          <h3>{{ isEditing ? '编辑商品' : '添加商品' }}</h3>
          <button class="close-btn" @click="showFormDialog = false">×</button>
        </div>
        <div class="dialog-body">
          <div class="form-grid">
            <div class="form-item">
              <label>商品编码：</label>
              <input type="text" v-model="editForm.code" :readonly="isEditing" :class="{ readonly: isEditing }">
            </div>
            <div class="form-item">
              <label>商品名称：</label>
              <input type="text" v-model="editForm.name" placeholder="请输入商品名称">
            </div>
            <div class="form-item">
              <label>供应商号：</label>
              <select v-model="editForm.supplierId">
                <option value="3003">3003 (供应商A)</option>
                <option value="3004">3004 (供应商B)</option>
                <option value="3005">3005 (供应商C)</option>
              </select>
            </div>
            <div class="form-item">
              <label>价格（元）：</label>
              <input type="number" v-model="editForm.price" placeholder="请输入价格" min="0">
            </div>
            <div class="form-item">
              <label>库存数量：</label>
              <input type="number" v-model="editForm.stock" placeholder="请输入库存" min="0">
            </div>
            <div class="form-item">
              <label>商品状态：</label>
              <select v-model="editForm.status">
                <option value="上架">上架</option>
                <option value="下架">下架</option>
              </select>
            </div>
          </div>
        </div>
        <div class="dialog-footer">
          <button @click="showFormDialog = false">取消</button>
          <button class="confirm-btn" @click="submitForm">{{ isEditing ? '保存' : '添加' }}</button>
        </div>
      </div>
    </div>

    <!-- 删除确认弹窗 -->
    <div v-if="showDelDialog" class="dialog-overlay" @click.self="showDelDialog = false">
      <div class="dialog">
        <div class="dialog-header">
          <h3>提示</h3>
          <button class="close-btn" @click="showDelDialog = false">×</button>
        </div>
        <div class="dialog-body">
          <p>确定要删除该商品吗？此操作不可撤销。</p>
        </div>
        <div class="dialog-footer">
          <button @click="showDelDialog = false">取消</button>
          <button class="danger-btn" @click="confirmDelete">确定删除</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed, watch } from 'vue'

// 导入图标
import searchIcon from '../assets/icon/search.png'
import tianjiaIcon from '../assets/icon/tianjia.png'
import xiugaiIcon from '../assets/icon/xiugai.png'
import readIcon from '../assets/icon/read.png'
import schuIcon from '../assets/icon/schu.png'

interface Product {
  id: number
  code: string
  name: string
  supplierId: string
  price: number
  stock: number
  status: string
}

// 搜索表单
const searchForm = ref({ productName: '', supplier: '', status: '' })

// 商品数据
const products = ref<Product[]>([
  { id: 1, code: 'product1004', name: '苹果电脑', supplierId: '3004', price: 8500, stock: 10, status: '下架' },
  { id: 2, code: 'product1005', name: 'vivo手机', supplierId: '3003', price: 2980, stock: 218, status: '上架' },
  { id: 3, code: 'product1006', name: 'oppo平板', supplierId: '3005', price: 1980, stock: 182, status: '上架' },
  { id: 4, code: 'product1007', name: '华为手表', supplierId: '3003', price: 1280, stock: 95, status: '上架' },
  { id: 5, code: 'product1008', name: '小米耳机', supplierId: '3004', price: 299, stock: 320, status: '上架' },
  { id: 6, code: 'product1009', name: '联想笔记本', supplierId: '3005', price: 5999, stock: 45, status: '下架' },
  { id: 7, code: 'product1010', name: '三星电视', supplierId: '3003', price: 3999, stock: 28, status: '上架' },
  { id: 8, code: 'product1011', name: '索尼相机', supplierId: '3004', price: 4999, stock: 15, status: '上架' },
  { id: 9, code: 'product1012', name: '戴尔显示器', supplierId: '3005', price: 1299, stock: 60, status: '上架' },
])

let nextId = 10

// 分页相关
const currentPage = ref(1)
const pageSize = ref(5)
const goToPage = ref(1)

// 过滤后的商品
const filteredProducts = computed(() => {
  return products.value.filter(p => {
    const matchName = !searchForm.value.productName || p.name.includes(searchForm.value.productName)
    const matchSupplier = !searchForm.value.supplier || p.supplierId === searchForm.value.supplier
    const matchStatus = !searchForm.value.status || p.status === searchForm.value.status
    return matchName && matchSupplier && matchStatus
  })
})

// Ensure current page stays within bounds when filtered list changes
watch(filteredProducts, (newVal) => {
  if (currentPage.value > totalPages.value) {
    currentPage.value = totalPages.value
    goToPage.value = totalPages.value
  }
})

const totalPages = computed(() => Math.max(1, Math.ceil(filteredProducts.value.length / pageSize.value)))
const paginatedProducts = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value
  return filteredProducts.value.slice(start, start + pageSize.value)
})

const search = () => { currentPage.value = 1; goToPage.value = 1 }
const prevPage = () => { if (currentPage.value > 1) { currentPage.value--; goToPage.value = currentPage.value } }
const nextPage = () => { if (currentPage.value < totalPages.value) { currentPage.value++; goToPage.value = currentPage.value } }
const navigateToPage = () => {
  let page = parseInt(goToPage.value.toString())
  if (isNaN(page) || page < 1) page = 1
  if (page > totalPages.value) page = totalPages.value
  currentPage.value = page
  goToPage.value = page
}

// 查看弹窗
const showViewDialog = ref(false)
const viewForm = ref<Product>({} as Product)
const viewProduct = (product: Product) => {
  viewForm.value = { ...product }
  showViewDialog.value = true
}

// 添加/编辑弹窗
const showFormDialog = ref(false)
const isEditing = ref(false)
const editForm = ref<Product>({ id: 0, code: '', name: '', supplierId: '3003', price: 0, stock: 0, status: '上架' })

const openAddDialog = () => {
  isEditing.value = false
  // Generate product code based on nextId (e.g., product10)
  editForm.value = { id: nextId, code: `product${nextId}`, name: '', supplierId: '3003', price: 0, stock: 0, status: '上架' }
  showFormDialog.value = true
}

const openEditDialog = (product: Product) => {
  isEditing.value = true
  editForm.value = { ...product }
  showFormDialog.value = true
}

const isDuplicateCode = (code: string) => {
  return products.value.some(p => p.code === code)
}

const submitForm = () => {
  if (!editForm.value.name) { alert('请输入商品名称'); return }
  if (editForm.value.price < 0) { alert('价格不能为负数'); return }
  if (editForm.value.stock < 0) { alert('库存不能为负数'); return }
  // Check duplicate code when adding new product
  if (!isEditing.value && isDuplicateCode(editForm.value.code)) { alert('商品编码已存在'); return }
  if (isEditing.value) {
    const idx = products.value.findIndex(p => p.id === editForm.value.id)
    if (idx !== -1) products.value[idx] = { ...editForm.value }
  } else {
    products.value.push({ ...editForm.value, id: nextId++ })
  }
  // Reset search form to avoid stale filters
  searchForm.value = { productName: '', supplier: '', status: '' }
  showFormDialog.value = false
}

// 删除弹窗
const showDelDialog = ref(false)
const deleteId = ref<number | null>(null)
const showDeleteDialog = (id: number) => { deleteId.value = id; showDelDialog.value = true }
const confirmDelete = () => {
  products.value = products.value.filter(p => p.id !== deleteId.value)
  showDelDialog.value = false
}
</script>

<style scoped>
.product-container {
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
  flex-wrap: wrap;
}

.search-section input,
.search-section select {
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
}

.search-section input { width: 200px; }

.search-btn {
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  background: #4facfe;
  color: white;
  font-size: 14px;
  cursor: pointer;
  transition: background 0.3s;
  display: flex;
  align-items: center;
  gap: 5px;
}
.search-btn:hover { background: #3a8ffd; }

.add-btn {
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  background: #4caf50;
  color: white;
  font-size: 14px;
  cursor: pointer;
  transition: background 0.3s;
  display: flex;
  align-items: center;
  gap: 5px;
}
.add-btn:hover { background: #45a049; }

/* 商品列表 */
.product-list { margin-bottom: 20px; }
.product-list table { width: 100%; border-collapse: collapse; border: 1px solid #ddd; }
.product-list th, .product-list td {
  padding: 10px 12px;
  text-align: left;
  border-bottom: 1px solid #ddd;
  font-size: 14px;
}
.product-list th { background: #f5f5f5; font-weight: bold; color: #333; }
.product-list tr:hover { background: #f9f9f9; }

.empty-row { text-align: center; color: #999; padding: 30px 0 !important; }

/* 状态徽章 */
.badge-up {
  display: inline-block;
  padding: 2px 10px;
  border-radius: 12px;
  font-size: 12px;
  background: #e8f5e9;
  color: #388e3c;
  font-weight: bold;
}
.badge-down {
  display: inline-block;
  padding: 2px 10px;
  border-radius: 12px;
  font-size: 12px;
  background: #fce4ec;
  color: #c62828;
  font-weight: bold;
}

/* 操作按钮 */
.action-buttons { display: flex; gap: 6px; }
.edit-btn, .view-btn, .delete-btn {
  padding: 4px 8px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background 0.3s;
  display: flex;
  align-items: center;
  justify-content: center;
}
.edit-btn { background: #ffc107; }
.view-btn { background: #17a2b8; }
.delete-btn { background: #dc3545; }
.edit-btn:hover { background: #e0a800; }
.view-btn:hover { background: #138496; }
.delete-btn:hover { background: #c82333; }

.btn-icon { width: 16px; height: 16px; object-fit: contain; }

/* 分页 */
.pagination {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 15px;
  background: #f9f9f9;
  border-radius: 8px;
  font-size: 14px;
  flex-wrap: wrap;
  gap: 10px;
}
.page-buttons { display: flex; gap: 4px; }
.page-buttons button {
  padding: 4px 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
  background: white;
  cursor: pointer;
  transition: all 0.3s;
  font-size: 13px;
}
.page-buttons button:hover { background: #f5f5f5; }
.page-buttons button.active { background: #4facfe; color: white; border-color: #4facfe; }
.page-buttons button:disabled { cursor: not-allowed; opacity: 0.5; }
.pagination input {
  width: 50px; padding: 4px 6px; border: 1px solid #ddd;
  border-radius: 4px; font-size: 14px; text-align: center; margin: 0 5px;
}
.pagination select {
  padding: 4px 8px; border: 1px solid #ddd; border-radius: 4px; font-size: 13px;
}

/* 弹窗 */
.dialog-overlay {
  position: fixed; top: 0; left: 0; width: 100vw; height: 100vh;
  background: rgba(0,0,0,0.5); display: flex; justify-content: center;
  align-items: center; z-index: 1000;
}
.dialog {
  width: 360px; background: white; border-radius: 8px;
  box-shadow: 0 5px 20px rgba(0,0,0,0.3); overflow: hidden;
}
.dialog-lg { width: 520px; }
.dialog-header {
  padding: 14px 18px; background: #f5f5f5; border-bottom: 1px solid #ddd;
  display: flex; justify-content: space-between; align-items: center;
}
.dialog-header h3 { margin: 0; font-size: 16px; color: #333; }
.close-btn {
  background: none; border: none; font-size: 20px; cursor: pointer;
  color: #999; padding: 0; width: 24px; height: 24px;
  display: flex; align-items: center; justify-content: center;
}
.close-btn:hover { color: #333; }
.dialog-body { padding: 20px; }
.dialog-body p { margin: 0; font-size: 14px; color: #333; }
.dialog-footer {
  padding: 12px 18px; background: #f5f5f5; border-top: 1px solid #ddd;
  display: flex; justify-content: flex-end; gap: 10px;
}
.dialog-footer button {
  padding: 6px 18px; border: none; border-radius: 4px; font-size: 14px;
  cursor: pointer; transition: background 0.3s; background: #6c757d; color: white;
}
.dialog-footer button:hover { background: #5a6268; }
.confirm-btn { background: #4facfe !important; color: white !important; }
.confirm-btn:hover { background: #3a8ffd !important; }
.danger-btn { background: #dc3545 !important; color: white !important; }
.danger-btn:hover { background: #c82333 !important; }

/* 详情布局 */
.detail-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
.detail-item { display: flex; align-items: center; font-size: 14px; }
.detail-label { color: #666; min-width: 90px; }

/* 表单布局 */
.form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
.form-item { display: flex; flex-direction: column; gap: 6px; font-size: 14px; }
.form-item label { color: #555; font-weight: 500; }
.form-item input, .form-item select {
  padding: 8px 10px; border: 1px solid #ddd; border-radius: 4px; font-size: 14px;
}
.form-item input:focus, .form-item select:focus { outline: none; border-color: #4facfe; }
.form-item input.readonly { background: #e9ecef; cursor: not-allowed; }
</style>