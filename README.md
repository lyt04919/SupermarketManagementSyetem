# 超市后台管理系统

基于 `Vue 3 + TypeScript + Vite` 的课程作业项目，当前包含商品管理、订单管理、供应商管理，以及登录、用户、密码修改等页面，并带有本地 mock 数据服务。

## 运行方式

```bash
npm install
npm run server
npm run dev
```

默认地址：

- 前端：`http://127.0.0.1:5173`
- 模拟接口：`http://127.0.0.1:3001`

## 目录结构

```text
mydemo/
├── src/
│   ├── api/              # 接口请求封装
│   ├── assets/
│   │   └── icons/        # 页面图标资源
│   ├── router/           # 路由配置
│   ├── views/            # 页面组件
│   ├── App.vue
│   └── main.ts
├── package.json
└── vite.config.ts
```

## 说明

- 模拟数据库文件位于 `db.json`
- 商品、订单、供应商模块已接入本地 mock 服务
- 若需要切换接口地址，可通过 `VITE_API_BASE_URL` 配置
