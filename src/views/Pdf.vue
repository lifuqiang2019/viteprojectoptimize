<template>
  <div class="pdf-container">
    <el-card>
      <div class="controls">
        <el-button @click="page > 1 ? page-- : null">Prev</el-button>
        <span>Page {{ page }}</span>
        <el-button @click="page++">Next</el-button>
      </div>
      <!-- Using a public sample PDF -->
      <VuePdfEmbed :source="source" :page="page" />
    </el-card>
  </div>
</template>

<script setup>
import { ref } from "vue";
import VuePdfEmbed from "vue-pdf-embed";

const source =
  "https://raw.githubusercontent.com/mozilla/pdf.js/ba2edeae/examples/learning/helloworld.pdf";
const page = ref(1);
</script>

<style scoped>
.pdf-container {
  padding: 20px;
}
.controls {
  margin-bottom: 20px;
}
</style>
