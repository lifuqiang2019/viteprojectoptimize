<template>
  <div class="table-container">
    <el-card>
      <div class="filter-container">
        <el-input
          v-model="search"
          placeholder="Search name"
          style="width: 200px; margin-right: 10px"
        />
        <el-date-picker
          v-model="dateRange"
          type="daterange"
          range-separator="To"
          start-placeholder="Start date"
          end-placeholder="End date"
          style="margin-right: 10px"
        />
        <el-button type="primary" @click="handleSearch">Search</el-button>
        <el-button type="success" @click="handleAdd">Add Item</el-button>
      </div>

      <el-table
        :data="tableData"
        style="width: 100%; margin-top: 20px"
        stripe
        border
      >
        <el-table-column prop="date" label="Date" width="180">
          <template #default="scope">
            {{ formatDate(scope.row.date) }}
          </template>
        </el-table-column>
        <el-table-column prop="name" label="Name" width="180" />
        <el-table-column prop="address" label="Address" />
        <el-table-column label="Operations">
          <template #default="scope">
            <el-button size="small" @click="handleEdit(scope.$index, scope.row)"
              >Edit</el-button
            >
            <el-button
              size="small"
              type="danger"
              @click="handleDelete(scope.$index, scope.row)"
              >Delete</el-button
            >
          </template>
        </el-table-column>
      </el-table>

      <el-pagination
        background
        layout="prev, pager, next"
        :total="100"
        style="margin-top: 20px; justify-content: flex-end; display: flex"
      />
    </el-card>

    <el-dialog
      v-model="dialogVisible"
      :title="dialogType === 'add' ? 'Add Item' : 'Edit Item'"
    >
      <el-form :model="form" label-width="120px">
        <el-form-item label="Name">
          <el-input v-model="form.name" />
        </el-form-item>
        <el-form-item label="Date">
          <el-date-picker
            v-model="form.date"
            type="date"
            placeholder="Pick a date"
            style="width: 100%"
          />
        </el-form-item>
        <el-form-item label="Address">
          <el-input v-model="form.address" />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">Cancel</el-button>
          <el-button type="primary" @click="handleSave">Confirm</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive } from "vue";
import dayjs from "dayjs";
import { ElMessage } from "element-plus";

const search = ref("");
const dateRange = ref([]);
const tableData = ref([
  {
    date: "2024-05-02",
    name: "Tom",
    address: "No. 189, Grove St, Los Angeles",
  },
  {
    date: "2024-05-04",
    name: "John",
    address: "No. 189, Grove St, Los Angeles",
  },
  {
    date: "2024-05-01",
    name: "Morgan",
    address: "No. 189, Grove St, Los Angeles",
  },
  {
    date: "2024-05-03",
    name: "Jessy",
    address: "No. 189, Grove St, Los Angeles",
  },
]);

const dialogVisible = ref(false);
const dialogType = ref("add"); // 'add' or 'edit'
const form = reactive({
  name: "",
  date: "",
  address: "",
});
let editingIndex = -1;

const formatDate = (date) => {
  return dayjs(date).format("YYYY-MM-DD HH:mm");
};

const handleSearch = () => {
  ElMessage.success("Search triggered (Mock)");
};

const handleAdd = () => {
  dialogType.value = "add";
  form.name = "";
  form.date = "";
  form.address = "";
  dialogVisible.value = true;
};

const handleEdit = (index, row) => {
  dialogType.value = "edit";
  editingIndex = index;
  form.name = row.name;
  form.date = row.date;
  form.address = row.address;
  dialogVisible.value = true;
};

const handleDelete = (index, row) => {
  tableData.value.splice(index, 1);
  ElMessage.success("Deleted");
};

const handleSave = () => {
  if (dialogType.value === "add") {
    tableData.value.push({ ...form });
  } else {
    tableData.value[editingIndex] = { ...form };
  }
  dialogVisible.value = false;
  ElMessage.success("Saved");
};
</script>

<style scoped>
.table-container {
  padding: 20px;
}
.filter-container {
  display: flex;
  align-items: center;
}
</style>
