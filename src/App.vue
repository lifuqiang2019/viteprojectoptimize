<script setup>
import { computed, ref } from "vue";
import { useRoute } from "vue-router";
import {
  Monitor,
  DataLine,
  Box,
  Document,
  Edit,
} from "@element-plus/icons-vue";

const route = useRoute();
const activeIndex = computed(() => route.path);
const isCollapse = ref(false);
</script>

<template>
  <div class="common-layout">
    <el-container class="layout-container">
      <el-aside :width="isCollapse ? '64px' : '220px'" class="aside-menu">
        <div class="logo-box">
          <img src="/vite.svg" alt="logo" class="logo-img" />
          <span v-if="!isCollapse" class="logo-text">Vite Admin</span>
        </div>
        <el-menu
          :default-active="activeIndex"
          class="el-menu-vertical"
          :collapse="isCollapse"
          background-color="#304156"
          text-color="#bfcbd9"
          active-text-color="#409EFF"
          router
        >
          <el-menu-item index="/dashboard">
            <el-icon><DataLine /></el-icon>
            <template #title>Dashboard</template>
          </el-menu-item>
          <el-menu-item index="/table">
            <el-icon><Monitor /></el-icon>
            <template #title>CRUD Table</template>
          </el-menu-item>
          <el-menu-item index="/three">
            <el-icon><Box /></el-icon>
            <template #title>3D Scene</template>
          </el-menu-item>
          <el-menu-item index="/pdf">
            <el-icon><Document /></el-icon>
            <template #title>PDF Viewer</template>
          </el-menu-item>
          <el-menu-item index="/editor">
            <el-icon><Edit /></el-icon>
            <template #title>Code Editor</template>
          </el-menu-item>
        </el-menu>
      </el-aside>

      <el-container>
        <el-header class="header-bar">
          <div class="header-left">
            <el-button text @click="isCollapse = !isCollapse">
              <span class="collapse-btn">|||</span>
            </el-button>
            <el-breadcrumb separator="/">
              <el-breadcrumb-item :to="{ path: '/' }">Home</el-breadcrumb-item>
              <el-breadcrumb-item>{{ route.name }}</el-breadcrumb-item>
            </el-breadcrumb>
          </div>
          <div class="header-right">
            <el-avatar
              :size="32"
              src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png"
            />
            <span style="margin-left: 10px; font-size: 14px">Admin User</span>
          </div>
        </el-header>

        <el-main class="main-content">
          <router-view v-slot="{ Component }">
            <keep-alive>
              <component :is="Component" />
            </keep-alive>
          </router-view>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<style scoped>
.layout-container {
  height: 100vh;
  width: 100%;
}
.aside-menu {
  background-color: #304156;
  transition: width 0.3s;
  overflow-x: hidden;
  display: flex;
  flex-direction: column;
}
.logo-box {
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #2b2f3a;
  color: white;
  font-weight: bold;
}
.logo-img {
  width: 32px;
  height: 32px;
  margin-right: 8px;
}
.el-menu-vertical {
  border-right: none;
  flex: 1;
}
.header-bar {
  background-color: #fff;
  border-bottom: 1px solid #e6e6e6;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px;
}
.header-left {
  display: flex;
  align-items: center;
  gap: 20px;
}
.header-right {
  display: flex;
  align-items: center;
}
.main-content {
  background-color: #f0f2f5;
  padding: 20px;
}
</style>
