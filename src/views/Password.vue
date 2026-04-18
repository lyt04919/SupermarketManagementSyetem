<template>
  <div class="password-container">
    <div class="password-form">
      <div class="form-item">
        <label for="code">用户编码:</label>
        <input type="text" id="code" v-model="form.code" readonly value="ck4001">
      </div>
      <div class="form-item">
        <label for="oldPassword">原始密码:</label>
        <input type="password" id="oldPassword" v-model="form.oldPassword" placeholder="请输入原密码">
      </div>
      <div class="form-item">
        <label for="newPassword">输入新密码:</label>
        <input type="password" id="newPassword" v-model="form.newPassword" placeholder="请输入新密码">
      </div>
      <div class="form-item">
        <label for="confirmPassword">确认新密码:</label>
        <input type="password" id="confirmPassword" v-model="form.confirmPassword" placeholder="请确认新密码">
      </div>
      <div class="form-actions">
        <button @click="submitForm">提交</button>
        <button @click="resetForm">重置</button>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'

// 表单数据
const form = ref({
  code: 'ck4001',
  oldPassword: '',
  newPassword: '',
  confirmPassword: ''
})

// 提交表单
const submitForm = () => {
  // 简单的表单验证
  if (!form.value.oldPassword || !form.value.newPassword || !form.value.confirmPassword) {
    alert('请填写所有字段')
    return
  }
  if (form.value.newPassword !== form.value.confirmPassword) {
    alert('两次输入的新密码不一致')
    return
  }
  // 提交成功
  alert('密码修改成功')
  // 可以在这里添加重置表单的逻辑
  resetForm()
}

// 重置表单
const resetForm = () => {
  form.value.oldPassword = ''
  form.value.newPassword = ''
  form.value.confirmPassword = ''
}
</script>

<style scoped>
.password-container {
  width: 100%;
  font-family: Arial, sans-serif;
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 400px;
}

.password-form {
  width: 400px;
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

.form-item input {
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