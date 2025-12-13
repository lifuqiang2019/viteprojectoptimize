<template>
  <div class="editor-container">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>Monaco Editor</span>
        </div>
      </template>
      <div
        ref="editorContainer"
        style="width: 100%; height: 500px; border: 1px solid #ccc"
      ></div>
    </el-card>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from "vue";
import * as monaco from "monaco-editor";

const editorContainer = ref(null);
let editorInstance = null;

onMounted(() => {
  editorInstance = monaco.editor.create(editorContainer.value, {
    value: '// Type your code here\nconsole.log("Hello Vite!");',
    language: "javascript",
    theme: "vs-dark",
  });
});

onUnmounted(() => {
  editorInstance?.dispose();
});
</script>

<style scoped>
.editor-container {
  padding: 20px;
}
</style>
