<template>
  <div class="user-edit-container">
    <div class="user-edit-form">
      <div class="form-item">
        <label for="code">用户编码:</label>
        <input type="text" id="code" v-model="form.code" readonly>
      </div>
      <div class="form-item">
        <label for="name">用户名称:</label>
        <input type="text" id="name" v-model="form.name">
      </div>
      <div class="form-item">
        <label for="gender">用户性别:</label>
        <select id="gender" v-model="form.gender">
          <option value="男">男</option>
          <option value="女">女</option>
        </select>
      </div>
      <div class="form-item">
        <label for="birthdate">出生日期:</label>
        <input type="date" id="birthdate" v-model="form.birthdate">
      </div>
      <div class="form-item">
        <label for="phone">用户电话:</label>
        <input type="text" id="phone" v-model="form.phone">
      </div>
      <div class="form-item">
        <label for="address">用户地址:</label>
        <input type="text" id="address" v-model="form.address">
      </div>
      <div class="form-item">
        <label for="email">用户邮箱:</label>
        <input type="email" id="email" v-model="form.email">
      </div>
      <div class="form-item">
        <label for="role">用户角色:</label>
        <select id="role" v-model="form.role">
          <option value="普通员工">普通员工</option>
          <option value="经理助理">经理助理</option>
          <option value="销售经理">销售经理</option>
          <option value="财务会计">财务会计</option>
        </select>
      </div>
      <div class="form-actions">
        <button @click="saveForm">更新</button>
        <button @click="goBack">返回</button>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()

// 表单数据
const form = ref({
  code: 'ck4002',
  name: 'Jone',
  gender: '女',
  birthdate: '2007/2/15',
  phone: '13801234568',
  address: '杭州市萧山区山水世纪988号',
  email: '',
  role: '财务会计'
})

// 保存表单
const saveForm = () => {
  // 简单的表单验证
  if (!form.value.name || !form.value.phone) {
    alert('请填写必填字段')
    return
  }
  // 保存成功，返回用户管理页面
  alert('用户信息更新成功')
  router.push('/home/user')
}

// 返回按钮
const goBack = () => {
  router.push('/home/user')
}

// 可以根据路由参数获取用户ID，然后从API获取用户详情
onMounted(() => {
  // 这里可以根据路由参数获取用户ID，然后从API获取用户详情
  // const userId = route.params.id
  // 调用API获取用户详情并填充表单
})
</script>

<style scoped>
.user-edit-container {
  width: 100%;
  font-family: Arial, sans-serif;
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 400px;
}

.user-edit-form {
  width: 500px;
  padding: 30px;
  background: #f9f9f9;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.form-item {
  margin-bottom: 20px;
  display: flex;
  align-items: center;
}

.form-item label {
  width: 120px;
  font-size: 14px;
  color: #333;
}

.form-item input,
.form-item select {
  flex: 1;
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
}

.form-item input[readonly] {
  background: #e9ecef;
  cursor: not-allowed;
}

.form-actions {
  display: flex;
  justify-content: center;
  gap: 20px;
  margin-top: 30px;
}

.form-actions button {
  padding: 8px 24px;
  border: none;
  border-radius: 4px;
  background: #4facfe;
  color: white;
  font-size: 14px;
  cursor: pointer;
  transition: background 0.3s;
}

.form-actions button:hover {
  background: #3a8ffd;
}

.form-actions button:last-child {
  background: #6c757d;
}

.form-actions button:last-child:hover {
  background: #5a6268;
}
</style>