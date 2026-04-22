<template>
  <div class="password-container">
    <h2 class="page-title">密码修改</h2>
    <div class="form-container">
      <form @submit.prevent="submitForm">
        <div class="form-grid">
          <div class="form-item">
            <label>用户编号：</label>
            <input v-model="form.code" type="text" readonly />
          </div>
          <div class="form-item">
            <label>原始密码：</label>
            <input v-model="form.oldPassword" type="password" placeholder="请输入原密码" />
          </div>
          <div class="form-item">
            <label>新密码：</label>
            <input v-model="form.newPassword" type="password" placeholder="请输入新密码" />
          </div>
          <div class="form-item">
            <label>确认新密码：</label>
            <input v-model="form.confirmPassword" type="password" placeholder="请再次输入新密码" />
          </div>
        </div>
        <div class="form-actions">
          <button type="submit" class="btn-submit">提交</button>
          <button type="button" class="btn-reset" @click="resetForm">重置</button>
        </div>
      </form>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'

const form = ref({
  code: 'ck4001',
  oldPassword: '',
  newPassword: '',
  confirmPassword: ''
})

const submitForm = () => {
  if (!form.value.oldPassword || !form.value.newPassword || !form.value.confirmPassword) {
    alert('请填写所有字段')
    return
  }

  if (form.value.newPassword !== form.value.confirmPassword) {
    alert('两次输入的新密码不一致')
    return
  }

  alert('密码修改成功')
  resetForm()
}

const resetForm = () => {
  form.value.oldPassword = ''
  form.value.newPassword = ''
  form.value.confirmPassword = ''
}
</script>

<style scoped>
.password-container {
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
  max-width: 600px;
}

.form-grid {
  display: grid;
  grid-template-columns: repeat(1, 1fr);
  gap: 15px;
  margin-bottom: 20px;
}

.form-item {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.form-item label {
  font-size: 14px;
  color: #333;
  font-weight: 500;
}

.form-item input {
  height: 32px;
  padding: 0 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
  transition: all 0.3s ease;
}

.form-item input:focus {
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
.btn-reset {
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

.btn-reset {
  background: #fff;
  color: #333;
}

.btn-reset:hover {
  background: #F0F0F0;
}

@media (max-width: 768px) {
  .form-actions {
    flex-direction: column;
  }
  
  .btn-submit,
  .btn-reset {
    width: 100%;
  }
}
</style>
