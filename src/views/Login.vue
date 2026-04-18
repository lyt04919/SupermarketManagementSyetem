<template>
  <div class="login-container">
    <h1>超市后台管理系统</h1>
    <div class="login-form">
      <div class="form-header"></div>
      <div class="form-body">
        <div class="form-item">
          <label for="username">用户名:</label>
          <input type="text" id="username" v-model="form.username" placeholder="请输入用户帐号">
        </div>
        <div class="form-item">
          <label for="password">密 码:</label>
          <input type="password" id="password" v-model="form.password" placeholder="请输入密码">
        </div>
        <div class="form-actions">
          <button @click="login">登录</button>
          <button @click="reset">重置</button>
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
  // 简单的登录验证
  if (form.value.username && form.value.password) {
    // 登录成功，跳转到主页
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
.login-container {
  width: 100vw;
  height: 100vh;
  background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  font-family: Arial, sans-serif;
}

.login-container h1 {
  color: white;
  margin-bottom: 40px;
  font-size: 28px;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.login-form {
  width: 400px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.form-header {
  height: 10px;
  background: linear-gradient(90deg, #4facfe 0%, #00f2fe 100%);
}

.form-body {
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
  padding: 8px 12px;
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
</style>