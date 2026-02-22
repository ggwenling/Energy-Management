<script lang="ts" setup>
import {useUserStore} from "@/store/user.ts";
import {ref} from "vue";


const userStore = useUserStore()
const store = userStore
const props = defineProps<{ visible: boolean, checkedKeys: string[], btnAuth: string[], account: string }>()
const emit = defineEmits(["close", "reload"])
//递归
const transformMenu = (nodes: any) => {
  return nodes.map((node: any) => {
    const newNode: any = {
      label: node.name,
      url: node.url,
    }
    if (node.children) {
      newNode.children = transformMenu(node.children);
    }
    ;
    return newNode
  })
}
const treeData:any = ref(transformMenu(store.menulist))
console.log(treeData)
//tree动态选中节点

const treeRef = ref()

const initBtnAuth = ref<string[]>([])
//open事件


const handleOpen = () => {
  treeRef.value.setCheckedKeys(props.checkedKeys)
  initBtnAuth.value = props.btnAuth
}
const handleClose = () => {
  emit("close")
}


</script>

<template>


  <el-dialog title="权限设置" width="600px" :model-value="visible" @open="handleOpen" @close="handleClose">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>页面权限</span>
        </div>
      </template>
      <el-tree ref="treeRef" style="max-width: 600px;" show-checkbox :data="treeData" node-key="url"></el-tree>
    </el-card>
    <el-card class="mt">
      <template #header>
        <div class="card-header">
          <span>按钮权限</span>
        </div>
      </template>
      <el-checkbox-group v-model="initBtnAuth" class="mt">
        <el-checkbox label="全部" value="all"/>
        <el-checkbox label="添加" value="add"/>
        <el-checkbox label="编辑" value="edit"/>
        <el-checkbox label="删除" value="delete"/>
      </el-checkbox-group>
    </el-card>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="$emit('close')">取消</el-button>
        <el-button type="primary">
          确认
        </el-button>
      </div>
    </template>
  </el-dialog>

</template>
