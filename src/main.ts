import { createApp } from 'vue'
import './style.css'
// 导入根组件
import App from './App.vue'
// 导入路由
import router from './router/index'
// 创建应用实例
const app = createApp(App)
// 使用路由
app.use(router)
// 挂载页面文件index.html中id号为app的元素
app.mount('#app')
