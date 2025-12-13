<script setup>
import { computed } from "vue";
import { useRoute } from "vue-router";

const route = useRoute();
const activeIndex = computed(() => route.path);
</script>

<template>
  <div class="common-layout">
    <el-container>
      <el-header>
        <div class="header-content">
          <h1>Vite Admin Demo</h1>
          <el-menu
            :default-active="activeIndex"
            mode="horizontal"
            router
            background-color="#545c64"
            text-color="#fff"
            active-text-color="#ffd04b"
          >
            <el-menu-item index="/dashboard">Dashboard (Echarts)</el-menu-item>
            <el-menu-item index="/table">Table (CRUD)</el-menu-item>
            <el-menu-item index="/three">3D Scene (Three)</el-menu-item>
            <el-menu-item index="/pdf">PDF Viewer</el-menu-item>
            <el-menu-item index="/editor">Code Editor</el-menu-item>
          </el-menu>
        </div>
      </el-header>
      <el-main>
        <router-view v-slot="{ Component }">
          <keep-alive>
            <component :is="Component" />
          </keep-alive>
        </router-view>
      </el-main>
    </el-container>
  </div>
</template>

<style>
/* Global reset override if needed */
body {
  margin: 0;
  font-family: "Helvetica Neue", Helvetica, "PingFang SC", "Hiragino Sans GB",
    "Microsoft YaHei", "微软雅黑", Arial, sans-serif;
}
.el-header {
  padding: 0;
  background-color: #545c64;
}
.header-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px;
}
.header-content h1 {
  color: white;
  margin: 0;
  font-size: 1.2rem;
}
.el-main {
  background-color: #f0f2f5;
  min-height: calc(100vh - 60px);
  padding: 20px;
}
</style>
