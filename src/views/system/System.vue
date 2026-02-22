<script lang="ts" setup>

//表单数据

import {onMounted, reactive, ref} from "vue";
import {getPermissionList,getAuthData} from '@/api/userInfo.ts'
import authDialog from "@/components/main/system/dialog.vue";
const visible = ref<boolean>(false)

interface searchType {
  name: string,
  department: string
}

const searchParams = ref<searchType>({
  name: "",
  department: ""
})

//默认分页
const pageInfo = reactive({
  page: 1,
  pageSize: 10
})

//获取用户数据
const loadData = async () => {
  loading.value = true
  const {data:{data}}= await getPermissionList({...pageInfo})

  tableData.value=data.list
  totals.value=data.total
  loading.value = false
}

onMounted(() => {
  loadData()
})

//表格区域
const loading = ref<boolean>(false) //加载
const tableData = ref<any>([])
const totals = ref<number>(0)

//重置功能
const  handleReset = () =>{
  searchParams.value.name=''
  searchParams.value.department=''
  pageInfo.page = 1
  pageInfo.pageSize = 10
  loadData()
}
//分页
const handleSizeChange = (val: number) => {
  pageInfo.pageSize = val
  loadData()
}
const handleCurrentChange= (val: number) => {
  pageInfo.page = val
  loadData()
}
//获取当前权限
interface MenuItem{
  name:string;
  icon:string;
  url:string;
  children?:MenuItem[]
}

//递归获取子节点
const collectUrls =(tree:MenuItem[]) =>{
  const urls:string[]=[];
  function traverse(node:MenuItem){
    if(node.url&&!node.children){
      urls.push(node.url)
    }
    if(node.children){
      node.children.forEach((child:MenuItem)=>traverse(child))
    }
  }
  tree.forEach((node:MenuItem)=>traverse(node));
  return urls
}
//整合成数组
const checkList = ref<any>([])

const btnAuth=ref<any>([])

const accountLit=ref<string>("")
const getAuth = async (pageAuthority:string,account:string) => {
  accountLit.value=account
  const {data:{data}}  = await getAuthData({pageAuthority,account})
  visible.value=true

  checkList.value=collectUrls(data.list)

  btnAuth.value=data.btn

}


</script>

<template>

  <el-card class="mt-2 custom-card">
    <el-row :gutter="20">
      <el-col :span="6">
        <el-input v-model.trim="searchParams.name" placeholder="请输入姓名">
        </el-input>
      </el-col>
      <el-col :span="6">
        <el-select placeholder="请选择部门" v-model="searchParams.department">
          <el-option label="全部" value=""></el-option>
          <el-option label="总裁办" value="总裁办"></el-option>
          <el-option label="技术部" value="技术部"></el-option>
          <el-option label="市场部" value="市场部"></el-option>
          <el-option label="维修部" value="维修部"></el-option>
          <el-option label="运营部" value="运营部"></el-option>
          <el-option label="客服部" value="客服部"></el-option>
        </el-select>
      </el-col>
      <el-col :span="6">
        <el-button type="primary" @click="loadData">查询</el-button>
        <el-button @click="handleReset">重置</el-button>
      </el-col>
    </el-row>
  </el-card>
  <el-card class="mt-2 custom-card">
    <el-table :data="tableData" v-loading="loading">
      <el-table-column type="index" label="序号" width="80" />
      <el-table-column prop="account" label="账号" width="120"></el-table-column>
      <el-table-column prop="name" label="姓名"  ></el-table-column>
      <el-table-column prop="phone" label="电话" width="120"></el-table-column>
      <el-table-column prop="idNo" label="身份证号" width="180"></el-table-column>
      <el-table-column prop="position" label="职位">
        <template #default="scope">
          <el-tag type="primary">{{ scope.row.position }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="department" label="部门"></el-table-column>
      <el-table-column prop="pageAuthority" label="页面权限">
        <template #default="scope">
          <el-tag type="success">{{ scope.row.pageAuthority }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="btnAuthority" label="按钮权限">
        <template #default="scope">
          <el-tag type="info">{{ scope.row.btnAuthority }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column  label="操作" width="280">
        <template #default="scope">
          <el-button type="primary" size="small"  @click="getAuth(scope.row.pageAuthority,scope.row.account)">
            权限设置
          </el-button>
          <el-button type="danger" size="small">
            删除
          </el-button>
          <el-button type="danger" size="small">
            禁用
          </el-button>
        </template>
      </el-table-column>
    </el-table>

     <div class="flex justify-end container mt-4">
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
  <authDialog :visible="visible" :checked-keys="checkList" :btn-auth="btnAuth" :account="accountLit" @close="visible=false" @reload="loadData"></authDialog>
</template>


