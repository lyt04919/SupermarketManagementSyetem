<template>
  <div class="user-detail-container">
    <div class="user-detail-card">
      <div class="detail-item">
        <label>用户编码:</label>
        <span>{{ user.code }}</span>
      </div>
      <div class="detail-item">
        <label>用户名称:</label>
        <span>{{ user.name }}</span>
      </div>
      <div class="detail-item">
        <label>用户性别:</label>
        <span>{{ user.gender }}</span>
      </div>
      <div class="detail-item">
        <label>出生日期:</label>
        <span>{{ user.birthdate }}</span>
      </div>
      <div class="detail-item">
        <label>用户电话:</label>
        <span>{{ user.phone }}</span>
      </div>
      <div class="detail-item">
        <label>用户地址:</label>
        <span>{{ user.address }}</span>
      </div>
      <div class="detail-item">
        <label>用户邮箱:</label>
        <span>{{ user.email }}</span>
      </div>
      <div class="detail-item">
        <label>用户角色:</label>
        <span>{{ user.role }}</span>
      </div>
      <div class="detail-actions">
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

// 模拟用户数据
const users = [
  { id: 1, code: 'ck4009', name: 'irina', gender: '男', age: 23, phone: '13313224667', role: '普通员工', birthdate: '2003-01-01', address: '北京市朝阳区', email: 'irina@example.com' },
  { id: 2, code: 'ck4010', name: 'alice', gender: '女', age: 21, phone: '13813224668', role: '经理助理', birthdate: '2005-02-02', address: '上海市浦东新区', email: 'alice@example.com' },
  { id: 3, code: 'ck4011', name: '赵婷', gender: '女', age: 20, phone: '13601324667', role: '经理助理', birthdate: '2006-08-11', address: '上海市宝山区', email: 'chaoke@sina.com' },
  { id: 4, code: 'ck4012', name: 'tina', gender: '男', age: 21, phone: '13313224667', role: '销售经理', birthdate: '2005-03-03', address: '广州市天河区', email: 'tina@example.com' },
  { id: 5, code: 'ck4013', name: 'bob', gender: '男', age: 25, phone: '13913224667', role: '普通员工', birthdate: '2001-04-04', address: '深圳市南山区', email: 'bob@example.com' },
  { id: 6, code: 'ck4014', name: 'lucy', gender: '女', age: 22, phone: '13713224667', role: '经理助理', birthdate: '2004-05-05', address: '杭州市西湖区', email: 'lucy@example.com' },
  { id: 7, code: 'ck4015', name: '张三', gender: '男', age: 24, phone: '13513224667', role: '销售经理', birthdate: '2002-06-06', address: '成都市武侯区', email: 'zhangsan@example.com' },
  { id: 8, code: 'ck4016', name: '李四', gender: '女', age: 23, phone: '13413224667', role: '普通员工', birthdate: '2003-07-07', address: '武汉市武昌区', email: 'lisi@example.com' },
  { id: 9, code: 'ck4017', name: '王五', gender: '男', age: 26, phone: '13213224667', role: '销售经理', birthdate: '2000-08-08', address: '西安市雁塔区', email: 'wangwu@example.com' },
  { id: 10, code: 'ck4018', name: '赵六', gender: '女', age: 20, phone: '13113224667', role: '经理助理', birthdate: '2006-09-09', address: '南京市玄武区', email: 'zhaoliu@example.com' },
  { id: 11, code: 'ck4002', name: 'Jone', gender: '女', age: 21, phone: '13801234568', role: '财务会计', birthdate: '2005-10-10', address: '苏州市姑苏区', email: 'jone@example.com' },
  { id: 12, code: 'ck4003', name: 'linda', gender: '女', age: 20, phone: '13301234669', role: '财务会计', birthdate: '2006-11-11', address: '重庆市渝中区', email: 'linda@example.com' }
]

// 用户数据
const user = ref({
  code: 'ck4011',
  name: '赵婷',
  gender: '女',
  birthdate: '2006-08-11',
  phone: '13601234567',
  address: '上海市宝山区',
  email: 'chaoke@sina.com',
  role: '经理助理'
})

// 返回按钮
const goBack = () => {
  router.push('/home/user')
}

// 根据路由参数获取用户ID，然后从用户数据中获取用户详情
onMounted(() => {
  const userId = parseInt(route.query.id as string)
  if (!isNaN(userId)) {
    const foundUser = users.find(u => u.id === userId)
    if (foundUser) {
      user.value = {
        code: foundUser.code,
        name: foundUser.name,
        gender: foundUser.gender,
        birthdate: foundUser.birthdate,
        phone: foundUser.phone,
        address: foundUser.address,
        email: foundUser.email,
        role: foundUser.role
      }
    }
  }
})
</script>

<style scoped>
.user-detail-container {
  width: 100%;
  font-family: Arial, sans-serif;
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 400px;
}

.user-detail-card {
  width: 400px;
  padding: 30px;
  background: #f9f9f9;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.detail-item {
  margin-bottom: 15px;
  display: flex;
  align-items: center;
}

.detail-item label {
  width: 120px;
  font-size: 14px;
  color: #333;
  font-weight: bold;
}

.detail-item span {
  flex: 1;
  font-size: 14px;
  color: #666;
}

.detail-actions {
  margin-top: 30px;
  display: flex;
  justify-content: center;
}

.detail-actions button {
  padding: 8px 24px;
  border: none;
  border-radius: 4px;
  background: #4facfe;
  color: white;
  font-size: 14px;
  cursor: pointer;
  transition: background 0.3s;
}

.detail-actions button:hover {
  background: #3a8ffd;
}
</style>