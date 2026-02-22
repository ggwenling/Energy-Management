<script setup lang="ts">
import {onMounted, reactive, ref} from 'vue'
import type {RowType} from '@/types/charge/tabe.ts'
import {getStationList,deleteStationList} from "@/api/userInfo.ts";
import ChargeDialog from '@/components/main/chargeStations/chargeDialog.vue'
import {useStationStore} from "@/store/chargeStations.ts";
import {ElMessage} from "element-plus";


const stationStore = useStationStore()
const formParams = reactive({
  input: "",
  value: 1
})
const select = ref<string>("name");

//默认分页
const pageInfo = reactive({
  page: 1,
  pageSize: 10
})
const totals = ref<number>(0)


//创建表格数据
const tableData = ref<RowType[]>([]);

const loading = ref<boolean>(false);

//获取表格数据
const loadList = async () => {
  loading.value = true;
  const {data: {data: {list, total}}} = await getStationList({
    ...pageInfo,
    status: formParams.value,
    [select.value]: formParams.input
  })
  tableData.value = list
  totals.value = total
  loading.value = false;
}

//查询功能
const search = () => {
  loadList()
}

//重置功能
const reload = () => {
  formParams.input = "",
      formParams.value = 1,
      pageInfo.page = 1,
      pageInfo.pageSize = 10
  select.value = "name"
  loadList()
}
//分页功能
const handleCurrentChange = (newpage: number) => {
  pageInfo.page = newpage
  loadList()
}
const handleSizeChange = (pageSize: number) => {
  console.log(pageSize)
  pageInfo.pageSize = pageSize
  loadList()
}

//控制dialog区域
const visible = ref(false);

//编辑功能
const edit = (row: RowType) => {
  visible.value = true
  console.log(row)
  stationStore.setRuleForm(row)
  console.log(stationStore.ruleForm)
}
onMounted(() => {
  loadList()
})
//删除功能
const remove = async (id:string) => {
  const res = await deleteStationList(id)
  console.log(res)
  if(res.data.code===200){
    ElMessage({
      message: '删除成功',
      type: 'success',
    })
    loadList()
  }
}


</script>

<template>
<div>
  <el-card class="mt-2 custom-card min-w-3xl">
    <el-row :gutter="20">
      <el-col :span="6">
        <el-input v-model.trim="formParams.input" placeholder="请输入站点名称、ID">
          <template #append>
            <el-select v-model="select" style="width: 115px">
              <el-option label="按名称查询" value="name"/>
              <el-option label="按ID查询" value="id"/>
            </el-select>
          </template>
        </el-input>
      </el-col>
      <el-col :span="6">
        <el-select placeholder="充电站状态" v-model="formParams.value">
          <el-option label="全部" :value="1"></el-option>
          <el-option label="使用中" :value="2"></el-option>
          <el-option label="空闲中" :value="3"></el-option>
          <el-option label="维护中" :value="4"></el-option>
          <el-option label="待维修" :value="5"></el-option>
        </el-select>
      </el-col>
      <el-col :span="6">
        <div class="flex justify-end">
          <el-button type="primary" @click="search">查询</el-button>
          <el-button @click="reload">重置</el-button>
        </div>

      </el-col>
    </el-row>
  </el-card>
  <el-card class="mt-2 custom-card min-w-3xl">
    <el-row>
      <el-col :span="6">
        <el-statistic title="累计充电量(度)" :value="268900"/>
      </el-col>
      <el-col :span="6">
        <el-statistic title="累计充电次数(次)" :value="1389"></el-statistic>
      </el-col>
      <el-col :span="6">
        <el-statistic title="服务区域(个)" :value="88"/>
      </el-col>
      <el-col :span="6">
        <el-statistic title="累计效益(元)" :value="5622178"></el-statistic>
      </el-col>
    </el-row>
  </el-card>
  <el-card class="mt-2 custom-card ">
    <el-button type="primary" icon="Plus" @click="visible=true">新增充电站</el-button>
  </el-card>
  <el-card class="mt-2 custom-card">
    <el-table :data="tableData" style="width: 100%" v-loading="loading">
      <el-table-column type="index" width="80" label="序号"/>
      <el-table-column prop="name" width="200" label="站点名称"/>
      <el-table-column prop="id"   label="站点ID"/>
      <el-table-column prop="city" width="80"  label="所属城市"/>
      <el-table-column prop="fast" width="80"  label="快充数"/>
      <el-table-column prop="slow" width="80"  label="慢充数"/>
      <el-table-column prop="status" label="充电站状态">
        <template #default="scope">
          <el-tag v-if="scope.row.status == 2" type="primary">使用中</el-tag>
          <el-tag v-if="scope.row.status == 3" type="success">空闲中</el-tag>
          <el-tag v-if="scope.row.status == 4" type="warning">维护中</el-tag>
          <el-tag v-if="scope.row.status == 5" type="danger">待维修</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="now" width="80" label="正在充电"/>
      <el-table-column prop="fault"  width="80" label="故障数"/>
      <el-table-column prop="person" width="80" label="站点负责人"/>
      <el-table-column prop="tel" label="负责人电话"/>
      <el-table-column label="操作">
        <template #default="scope">
          <el-button type="primary" size="small" @click="edit(scope.row)" >编辑</el-button>
          <el-popconfirm title="确定要删除当前站点吗？" @confirm="remove(scope.row.id)">
            <template #reference>
              <el-button type="danger" size="small">删除</el-button>
            </template>
          </el-popconfirm>

        </template>
      </el-table-column>
    </el-table>
    <div class="w-full flex justify-end mt-8">
      <el-pagination
          class="fr mt mb"
          v-model:current-page="pageInfo.page"
          v-model:page-size="pageInfo.pageSize"
          :page-sizes="[10, 20, 30, 40]"
          layout="sizes, prev, pager, next, jumper,total"
          :total="totals"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          background
      />
    </div>
  </el-card>

  <ChargeDialog :dialog-visible="visible" @close="visible=false" @reload="loadList()"></ChargeDialog>
</div>
</template>

<style scoped lang="less">
:deep(.cell){
  display: flex;
  justify-content: center;
}
</style>
