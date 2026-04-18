<template>
  <div class="add-user-container">
    <div class="add-user-form">
      <div class="form-item">
        <label for="code">用户编号:</label>
        <input type="text" id="code" v-model="form.code" readonly value="ck40199">
      </div>
      <div class="form-item">
        <label for="name">用户名称:</label>
        <input type="text" id="name" v-model="form.name">
      </div>
      <div class="form-item">
        <label for="password">用户密码:</label>
        <input type="password" id="password" v-model="form.password">
      </div>
      <div class="form-item">
        <label for="confirmPassword">确认密码:</label>
        <input type="password" id="confirmPassword" v-model="form.confirmPassword">
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
        </select>
      </div>
      <div class="form-actions">
        <button @click="submitForm">提交</button>
        <button @click="goBack">返回</button>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const form = ref({
  code: 'ck40199',
  name: 'test',
  password: '****',
  confirmPassword: '',
  gender: '男',
  birthdate: '2000/1/30',
  phone: '13132123457',
  address: '台州神州58',
  email: 'test@qq.com',
  role: '普通员工'
})

const submitForm = () => {
  // 简单的表单验证
  if (!form.value.name || !form.value.password) {
    alert('请填写必填字段')
    return
  }
  if (form.value.password !== form.value.confirmPassword) {
    alert('两次输入的密码不一致')
    return
  }
  // 提交成功，返回用户管理页面
  alert('用户添加成功')
  router.push('/home/user')
}

const goBack = () => {
  router.push('/home/user')
}
</script>

<style scoped>
.add-user-container {
  width: 100%;
  font-family: Arial, sans-serif;
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 400px;
}

.add-user-form {
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