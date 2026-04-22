<template>
  <div class="user-detail-container">
    <h2 class="page-title">用户详情</h2>
    <div class="detail-container">
      <div class="detail-grid">
        <div class="detail-item">
          <label>用户编号：</label>
          <span>{{ user.code }}</span>
        </div>
        <div class="detail-item">
          <label>用户名称：</label>
          <span>{{ user.name }}</span>
        </div>
        <div class="detail-item">
          <label>用户性别：</label>
          <span>{{ user.gender }}</span>
        </div>
        <div class="detail-item">
          <label>出生日期：</label>
          <span>{{ user.birthdate }}</span>
        </div>
        <div class="detail-item">
          <label>用户电话：</label>
          <span>{{ user.phone }}</span>
        </div>
        <div class="detail-item">
          <label>用户邮箱：</label>
          <span>{{ user.email }}</span>
        </div>
        <div class="detail-item full-width">
          <label>用户地址：</label>
          <span>{{ user.address }}</span>
        </div>
        <div class="detail-item">
          <label>用户角色：</label>
          <span>{{ user.role }}</span>
        </div>
      </div>
      <div class="detail-actions">
        <button class="btn-back" @click="goBack">返回</button>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'

interface DetailUser {
  id?: number
  code: string
  name: string
  gender: string
  birthdate: string
  phone: string
  address: string
  email: string
  role: string
}

const router = useRouter()
const route = useRoute()

const users: Array<DetailUser & { id: number }> = [
  { id: 1, code: 'ck4009', name: 'irina', gender: '男', birthdate: '2003-01-01', phone: '13313224667', address: '北京市朝阳区', email: 'irina@example.com', role: '普通员工' },
  { id: 2, code: 'ck4010', name: 'alice', gender: '女', birthdate: '2005-02-02', phone: '13813224668', address: '上海市浦东新区', email: 'alice@example.com', role: '经理助理' },
  { id: 3, code: 'ck4011', name: '赵婷', gender: '女', birthdate: '2006-08-11', phone: '13601324667', address: '上海市宝山区', email: 'chaoke@sina.com', role: '经理助理' },
  { id: 4, code: 'ck4012', name: 'tina', gender: '男', birthdate: '2005-03-03', phone: '13313224667', address: '广州市天河区', email: 'tina@example.com', role: '销售经理' },
  { id: 5, code: 'ck4013', name: 'bob', gender: '男', birthdate: '2001-04-04', phone: '13913224667', address: '深圳市南山区', email: 'bob@example.com', role: '普通员工' },
  { id: 6, code: 'ck4014', name: 'lucy', gender: '女', birthdate: '2004-05-05', phone: '13713224667', address: '杭州市西湖区', email: 'lucy@example.com', role: '经理助理' },
  { id: 7, code: 'ck4015', name: '张三', gender: '男', birthdate: '2002-06-06', phone: '13513224667', address: '成都市武侯区', email: 'zhangsan@example.com', role: '销售经理' },
  { id: 8, code: 'ck4016', name: '李四', gender: '女', birthdate: '2003-07-07', phone: '13413224667', address: '武汉市武昌区', email: 'lisi@example.com', role: '普通员工' },
  { id: 9, code: 'ck4017', name: '王五', gender: '男', birthdate: '2000-08-08', phone: '13213224667', address: '西安市雁塔区', email: 'wangwu@example.com', role: '销售经理' },
  { id: 10, code: 'ck4018', name: '赵六', gender: '女', birthdate: '2006-09-09', phone: '13113224667', address: '南京市玄武区', email: 'zhaoliu@example.com', role: '经理助理' },
  { id: 11, code: 'ck4002', name: 'Jone', gender: '女', birthdate: '2005-10-10', phone: '13801234568', address: '苏州市姑苏区', email: 'jone@example.com', role: '财务会计' },
  { id: 12, code: 'ck4003', name: 'linda', gender: '女', birthdate: '2006-11-11', phone: '13301234669', address: '重庆市渝中区', email: 'linda@example.com', role: '财务会计' }
]

const user = ref<DetailUser>({
  code: 'ck4011',
  name: '赵婷',
  gender: '女',
  birthdate: '2006-08-11',
  phone: '13601234567',
  address: '上海市宝山区',
  email: 'chaoke@sina.com',
  role: '经理助理'
})

const goBack = () => {
  router.push('/home/user')
}

onMounted(() => {
  const userId = parseInt(route.query.id as string, 10)
  if (!Number.isNaN(userId)) {
    const foundUser = users.find((item) => item.id === userId)
    if (foundUser) {
      user.value = { ...foundUser }
    }
  }
})
</script>

<style scoped>
.user-detail-container {
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

.detail-container {
  background: #fff;
  padding: 20px;
  border-radius: 4px;
  border: 1px solid #E0E0E0;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.detail-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 15px;
  margin-bottom: 20px;
}

.detail-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 0;
  border-bottom: 1px solid #F0F0F0;
}

.detail-item.full-width {
  grid-column: span 2;
}

.detail-item label {
  font-size: 14px;
  color: #666;
  font-weight: 500;
  min-width: 100px;
  white-space: nowrap;
}

.detail-item span {
  font-size: 14px;
  color: #333;
  flex: 1;
}

.detail-actions {
  display: flex;
  justify-content: flex-start;
  padding-top: 20px;
  border-top: 1px solid #E0E0E0;
}

.btn-back {
  padding: 8px 16px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.3s ease;
  background: #fff;
  color: #333;
}

.btn-back:hover {
  background: #F0F0F0;
}

@media (max-width: 768px) {
  .detail-grid {
    grid-template-columns: 1fr;
  }
  
  .detail-item.full-width {
    grid-column: span 1;
  }
  
  .detail-item {
    flex-direction: column;
    align-items: flex-start;
    gap: 5px;
  }
  
  .detail-item label {
    min-width: auto;
  }
}
</style>
