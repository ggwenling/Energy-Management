<script setup lang="ts">
import {onMounted, reactive, ref, unref, watch} from "vue";
import {getOrderList,batchDelete} from "@/api/userInfo.ts";
import {useRoute, useRouter} from "vue-router";
const router = useRouter();
const route = useRoute();
import {ElMessage} from "element-plus";
import {useTabStore} from "@/store/tab.ts";
//导出excel文件
import *as XLSX from "xlsx";
import {saveAs} from 'file-saver'
const store = useTabStore();
const pageInfo = reactive({
  page: 1,
  pageSize: 10
})

interface SearchType {
  orderNo: string,
  status: number,
  no: string,
  name: string,
  startDate: string,
  endDate: string
}

interface SelectionListType{
  orderNo:string,
  equipmentNo:string,
  date:string,
  startTime:string,
  endTime:string,
  money:string,
  pay:string,
  status:number
}
const date = ref()
const searchParams = ref<SearchType>({
  orderNo: "",
  status: 1,
  no: "",
  name: "",
  startDate: "",
  endDate: ""
})

//获取表格数据
const dataList=ref<any[]>([])
const totals = ref<number>(0)
const loading = ref<boolean>(false)
const loadList = async () => {
  loading.value = true
  const {data:{data:{list,total}}} = await getOrderList({ ...pageInfo,...unref(searchParams)})
  loading.value = false
  dataList.value=list
  totals.value=total

  console.log(list,total)
}
onMounted(() => {
  loadList()

})
const handleChange = (val: any) => {
  console.log(val)
  searchParams.value.startDate = val[0]
  searchParams.value.endDate = val[1]
}
//分页功能
const handleSizeChange = (val:any) =>{
  pageInfo.pageSize =val
  loadList()

}
const handleCurrentChange = (val:any) =>{
  pageInfo.page = val
  loadList()
}
const handleSelectionChange = (val:any) =>{
  selectData.value = val

}

const handleDetail = (val:any) =>{
  console.log(val)

    store.addTab('订单详情','/operations/detail','Share')
    //改变标签
  store.setTabActive('订单详情','/operations/detail')

   router.push(`/operations/detail/${val}`)
}
//查询功能
const search = () =>{
  loadList()
}
//选择功能
const selectData = ref<SelectionListType[]>([])
//重置功能
const handleReset=()=> {
  date.value = ""
  searchParams.value = {
    orderNo: "",
    status: 1,
    no: "",
    name: "",
    startDate: "",
    endDate: ""
  }
  loadList()
}
//批量删除功能
const handleBatchDelete =async () =>{

  try{
    const {data} = await batchDelete(selectData.value.map((item:SelectionListType)=>item.orderNo))
    if(data.code===200){
      loadList()
      ElMessage({
        message: data.data,
        type: 'success',
      })
    }
  }
  catch (error){
    console.log(error)
  }



}
watch(() =>route.name,(newValue,oldValue)=>{

  if(newValue==='orders'&&oldValue!=='detail'){
    loadList()
  }
})

//导出文件
const exportExcel = () =>{
  const excel =XLSX.utils.json_to_sheet(selectData.value) //数据转成excel格式
  const book = XLSX.utils.book_new(); //生成新的工作薄
  XLSX.utils.book_append_sheet(book,excel,'Sheet') //工作薄添加到工作表中
  const wbout = XLSX.write(book,{bookType:'xlsx',type:'array'})
  const blob = new Blob([wbout],{type: "application/octet-steam"})
  saveAs(blob,'新Excel.xlsx')


}
</script>

<template>
  <el-card class="custom-card">
    <el-row :gutter="20">
      <el-col :span="6">
        <el-input placeholder="请输入订单号" v-model="searchParams.orderNo"/>
      </el-col>
      <el-col :span="6">
        <el-select placeholder="订单状态" v-model="searchParams.status">
          <el-option label="全部" :value="1"></el-option>
          <el-option label="进行中" :value="2"></el-option>
          <el-option label="已完成" :value="3"></el-option>
          <el-option label="异常" :value="4"></el-option>
        </el-select>
      </el-col>
      <el-col :span="6">
        <el-input placeholder="设备编号" v-model="searchParams.no"/>
      </el-col>
      <el-col :span="6">
        <el-button type="primary" @click="search">查询</el-button>
        <el-button @click="handleReset">重置</el-button>
      </el-col>
      <el-col :span="6" class="mt">
        <el-input placeholder="请输入站点名称" v-model="searchParams.name"/>
      </el-col>
      <el-col :span="6" class="mt">
        <el-date-picker
            v-model="date"
            type="daterange"
            range-separator="/"
            start-placeholder="开始时间"
            end-placeholder="结束时间"
            @change="handleChange"
            value-format="YYYY-MM-DD"
        />
      </el-col>
    </el-row>
  </el-card>
  <el-card class="mt-2 custom-card" >
    <el-button type="danger" :disabled="!selectData.length" @click="handleBatchDelete">批量删除</el-button>
    <el-button type="primary" icon="Download" :disabled="!selectData.length"  @click="exportExcel">导出订单数据到Excel</el-button>
  </el-card>
    <el-card class="mt-2 custom-card">
      <el-table :data="dataList" v-loading="loading" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column type="index" label="序号" width="80"></el-table-column>
        <el-table-column label="订单号" prop="orderNo"></el-table-column>
        <el-table-column label="设备编号" prop="equipmentNo"></el-table-column>
        <el-table-column label="订单日期" prop="date"></el-table-column>
        <el-table-column label="开始时间" prop="startTime"></el-table-column>
        <el-table-column label="结束时间" prop="endTime"></el-table-column>
        <el-table-column label="金额" prop="money"></el-table-column>
        <el-table-column label="支付方式" prop="pay"></el-table-column>
        <el-table-column label="订单状态" prop="status">
          <template #default="scope">
            <el-tag type="success" v-if="scope.row.status==2">进行中</el-tag>
            <el-tag type="primary" v-else-if="scope.row.status==3">已完成</el-tag>
            <el-tag type="warning" v-else-if="scope.row.status==4">异常</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="200">
          <template #default="scope">
            <div>
              <el-button type="primary" size="small" @click="handleDetail(scope.row.orderNo)">详情</el-button>
              <el-button type="danger" size="small">删除</el-button>
            </div>
          </template>
        </el-table-column>
      </el-table>
    <div class="flex justify-end w-full mt-4">
      <el-pagination
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
</template>

<style>

.custom-card {
  border-radius: 20px;
  border: none;
  background: linear-gradient(145deg, #ffffff 0%, #f8fafc 100%);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08), 0 1px 3px rgba(0, 0, 0, 0.04);
  transition: all 0.3s ease;
}

.custom-card:hover {
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.12), 0 2px 8px rgba(0, 0, 0, 0.06);
}
</style>
