<template>
  <div class="dashboard-container">
    <el-card class="box-card">
      <template #header>
        <div class="card-header">
          <span>Sales Dashboard</span>
          <el-button class="button" text>Operation button</el-button>
        </div>
      </template>
      <div ref="chartRef" style="width: 100%; height: 400px"></div>
    </el-card>

    <div style="margin-top: 20px; display: flex; gap: 20px">
      <el-card style="flex: 1">
        <h3>Total Visits</h3>
        <p style="font-size: 24px; font-weight: bold">125,123</p>
      </el-card>
      <el-card style="flex: 1">
        <h3>Revenue</h3>
        <p style="font-size: 24px; font-weight: bold">$45,231</p>
      </el-card>
      <el-card style="flex: 1">
        <h3>Orders</h3>
        <p style="font-size: 24px; font-weight: bold">1,234</p>
      </el-card>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from "vue";
import * as echarts from "echarts";

const chartRef = ref(null);
let chartInstance = null;

onMounted(() => {
  chartInstance = echarts.init(chartRef.value);

  const option = {
    title: {
      text: "Monthly Sales",
    },
    tooltip: {},
    legend: {
      data: ["Sales", "Profit"],
    },
    xAxis: {
      data: [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
      ],
    },
    yAxis: {},
    series: [
      {
        name: "Sales",
        type: "bar",
        data: [5, 20, 36, 10, 10, 20, 15, 25, 30, 45, 50, 60],
      },
      {
        name: "Profit",
        type: "line",
        data: [2, 10, 15, 6, 8, 12, 10, 18, 22, 35, 40, 50],
      },
    ],
  };

  chartInstance.setOption(option);

  window.addEventListener("resize", resizeHandler);
});

onUnmounted(() => {
  window.removeEventListener("resize", resizeHandler);
  if (chartInstance) {
    chartInstance.dispose();
  }
});

const resizeHandler = () => {
  chartInstance?.resize();
};
</script>

<style scoped>
.dashboard-container {
  padding: 20px;
}
</style>
