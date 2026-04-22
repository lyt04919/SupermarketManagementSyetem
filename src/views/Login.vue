<template>
  <div class="login-page">
    <h1 class="login-title">超市后台管理系统</h1>
    <div class="login-card">
      <div class="login-card-header"></div>
      <div class="login-form">
        <div class="form-item">
          <label>用户名:</label>
          <input v-model="form.username" type="text" placeholder="请输入用户帐号" />
        </div>
        <div class="form-item">
          <label>密 码:</label>
          <input v-model="form.password" type="password" placeholder="请输入密码" />
        </div>
        <div class="form-actions">
          <button class="btn-login" @click="login">登录</button>
          <button class="btn-reset" @click="reset">重置</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const form = ref({
  username: '',
  password: ''
})

const login = () => {
  if (form.value.username && form.value.password) {
    router.push('/home')
  } else {
    alert('请输入用户名和密码')
  }
}

const reset = () => {
  form.value.username = ''
  form.value.password = ''
}
</script>

<style scoped>
.login-page {
  width: 100vw;
  height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #4A90E2 0%, #5FB8FF 100%);
  position: relative;
  overflow: hidden;
}

.login-page::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: radial-gradient(circle at center, rgba(255, 255, 255, 0.1) 0%, transparent 70%);
}

.login-title {
  color: #fff;
  font-size: 28px;
  font-weight: bold;
  margin-bottom: 40px;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  z-index: 1;
}

.login-card {
  width: 400px;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  position: relative;
  z-index: 1;
  overflow: hidden;
}

.login-card-header {
  height: 10px;
  background: #4A90E2;
  border-top-left-radius: 8px;
  border-top-right-radius: 8px;
}

.login-form {
  padding: 30px;
}

.form-item {
  margin-bottom: 20px;
  display: flex;
  align-items: center;
}

.form-item label {
  width: 80px;
  font-size: 14px;
  color: #333;
}

.form-item input {
  flex: 1;
  height: 32px;
  padding: 0 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
}

.form-actions {
  display: flex;
  justify-content: center;
  gap: 20px;
  margin-top: 30px;
}

.btn-login,
.btn-reset {
  width: 80px;
  height: 36px;
  border: none;
  border-radius: 4px;
  font-size: 14px;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-login {
  background: #4A90E2;
  color: #fff;
}

.btn-login:hover {
  background: #357ABD;
}

.btn-reset {
  background: #E0E0E0;
  color: #333;
}

.btn-reset:hover {
  background: #D0D0D0;
}

@media (max-width: 480px) {
  .login-card {
    width: 90%;
    max-width: 400px;
  }
  
  .form-item {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .form-item label {
    margin-bottom: 5px;
  }
  
  .form-item input {
    width: 100%;
  }
}
</style>
