<template>
  <div class="app">
    <!-- 路由视图 -->
    <router-view></router-view>
  </div>

</template>

<script setup lang="ts">
// 不需要导入 Index 组件，路由会自动处理
</script>


<!-- 样式 -->
<style scoped>
.app {
  width: 100vw;
  height: 100vh;
}
</style>
