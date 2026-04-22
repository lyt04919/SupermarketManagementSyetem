<template>
  <div class="user-edit-container">
    <h2 class="page-title">用户修改</h2>
    <div class="form-container">
      <form @submit.prevent="saveForm">
        <div class="form-grid">
          <div class="form-item">
            <label>用户编号：</label>
            <input v-model="form.code" type="text" readonly />
          </div>
          <div class="form-item">
            <label>用户名称：</label>
            <input v-model="form.name" type="text" placeholder="请输入用户名称" />
          </div>
          <div class="form-item">
            <label>用户性别：</label>
            <select v-model="form.gender">
              <option value="男">男</option>
              <option value="女">女</option>
            </select>
          </div>
          <div class="form-item">
            <label>出生日期：</label>
            <input v-model="form.birthdate" type="date" />
          </div>
          <div class="form-item">
            <label>用户电话：</label>
            <input v-model="form.phone" type="text" placeholder="请输入联系电话" />
          </div>
          <div class="form-item">
            <label>用户邮箱：</label>
            <input v-model="form.email" type="email" placeholder="请输入邮箱地址" />
          </div>
          <div class="form-item full-width">
            <label>用户地址：</label>
            <input v-model="form.address" type="text" placeholder="请输入详细地址" />
          </div>
          <div class="form-item">
            <label>用户角色：</label>
            <select v-model="form.role">
              <option value="普通员工">普通员工</option>
              <option value="经理助理">经理助理</option>
              <option value="销售经理">销售经理</option>
              <option value="财务会计">财务会计</option>
            </select>
          </div>
        </div>
        <div class="form-actions">
          <button type="submit" class="btn-submit">提交</button>
          <button type="button" class="btn-back" @click="goBack">返回</button>
        </div>
      </form>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const router = useRouter()
const route = useRoute()

const form = ref({
  code: 'ck4002',
  name: 'Jone',
  gender: '女',
  birthdate: '2007-02-15',
  phone: '13801234568',
  address: '杭州市萧山区山水世纪988号',
  email: '',
  role: '财务会计'
})

const saveForm = () => {
  if (!form.value.name || !form.value.phone) {
    alert('请填写必填字段')
    return
  }

  alert('用户信息更新成功')
  router.push('/home/user')
}

const goBack = () => {
  router.push('/home/user')
}

onMounted(() => {
  const userId = route.query.id
  if (userId) {
    // 当前仍为静态演示数据，后续可在这里接入接口获取真实详情。
  }
})
</script>

<style scoped>
.user-edit-container {
  padding: 20px;
  height: calc(100vh - 120px);
  overflow: auto;
}

.page-title {
  font-size: 18px;
  font-weight: bold;
  color: #333;
  margin-bottom: 20px;
  padding-bottom: 10px;
  border-bottom: 1px solid #E0E0E0;
}

.form-container {
  background: #fff;
  padding: 20px;
  border-radius: 4px;
  border: 1px solid #E0E0E0;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.form-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 15px;
  margin-bottom: 20px;
}

.form-item {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.form-item.full-width {
  grid-column: span 2;
}

.form-item label {
  font-size: 14px;
  color: #333;
  font-weight: 500;
}

.form-item input,
.form-item select {
  height: 32px;
  padding: 0 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
  transition: all 0.3s ease;
}

.form-item input:focus,
.form-item select:focus {
  outline: none;
  border-color: #4A90E2;
  box-shadow: 0 0 0 2px rgba(74, 144, 226, 0.1);
}

.form-item input:read-only {
  background: #F8F9FA;
  cursor: not-allowed;
}

.form-actions {
  display: flex;
  gap: 10px;
  justify-content: flex-start;
  padding-top: 20px;
  border-top: 1px solid #E0E0E0;
}

.btn-submit,
.btn-back {
  padding: 8px 16px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-submit {
  background: #4A90E2;
  color: #fff;
  border-color: #4A90E2;
}

.btn-submit:hover {
  background: #357ABD;
}

.btn-back {
  background: #fff;
  color: #333;
}

.btn-back:hover {
  background: #F0F0F0;
}

@media (max-width: 768px) {
  .form-grid {
    grid-template-columns: 1fr;
  }
  
  .form-item.full-width {
    grid-column: span 1;
  }
  
  .form-actions {
    flex-direction: column;
  }
  
  .btn-submit,
  .btn-back {
    width: 100%;
  }
}
</style>
