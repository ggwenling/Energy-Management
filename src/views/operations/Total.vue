<script setup lang="ts">
import {getCityList} from "@/api/userInfo.ts";
import {onMounted, reactive, ref, watch} from "vue";
import type { FormRules, TreeInstance,FormInstance} from "element-plus";
import {Check, Plus, RefreshRight, Search} from "@element-plus/icons-vue";
interface Tree {
  label: string
  children?: Tree[]
}
interface RuleFormType {
  name: string,
  service: string,
  parking: string,
  remarks: string,
  date: Array<{ date1: string, date2: string, electricity: string }>
}
const handleNodeClick = (data: any) => {
  console.log(data)
}
const dataList =ref<Tree[]>([]);

const defaultProps = {
  children: 'children',
  label: 'label',
}
onMounted(async () => {
  const  {data:{data}} = await getCityList();
  dataList.value=data
  console.log(dataList.value)
})
const ruleForm = reactive<RuleFormType>({
  name: "",
  service: "",
  parking: "",
  remarks: "",
  date: [
    { date1: "", date2: "", electricity: "" }
  ]
})
const rules = reactive<FormRules<RuleFormType>>({
  name:[
    {required:true,message:"请输入模板名称",trigger:"blur"}
  ],
  service:[
    {required:true,message:"请输入服务费",trigger:"blur"}
  ],
  parking:[
    {required:true,message:"请输入停车费",trigger:"blur"}
  ],
  remarks:[
    {required:true,message:"请输入备注",trigger:"blur"}
  ],

})
//实现表单与tree组件的模糊查询
const treeRef = ref<TreeInstance>()
const inpVal =ref('')
watch(inpVal, (val) => {
  treeRef.value!.filter(val)
})
const filterNode = (value: string, data: Tree) => {
  if (!value) return true
  return data.label.includes(value)
}
const addDate = () =>{
  ruleForm.date.push({ date1: "", date2: "", electricity: "" })
}

//右侧新增区域

const ruleFormRef = ref<FormInstance>()


//表单重置和提交

const submitForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return
  formEl.validate((valid) => {
    if (valid) {
      console.log(ruleForm)
    } else {
      console.log('error submit!')
    }
  })
}
</script>

<template>
<el-row :gutter="20" class="mt-2">
  <el-col :span="6" >
    <el-card class="search-tree-card" shadow="never">
      <div class="search-wrapper">
        <el-input
            type="text"
            placeholder="请输入关键词"
            class="search-input"
            v-model="inpVal"
            clearable
        >
          <template #prefix>
            <el-icon class="search-icon"><Search /></el-icon>
          </template>

        </el-input>
      </div>

      <div class="tree-wrapper">
        <el-tree
            check-on-click-leaf
            ref="treeRef"
            class="custom-tree"
            :data="dataList"
            :props="defaultProps"
            show-checkbox
            @node-click="handleNodeClick"
            :filter-node-method="filterNode"
            highlight-current
        />
      </div>
    </el-card>

  </el-col>
  <el-col :span="18">
    <el-card class="custom-card" shadow="hover">
      <template #header>
        <div class="card-header">
          <span class="header-title">⚡ 充电站配置</span>
          <span class="header-subtitle">设置城市电价及服务费用</span>
        </div>
      </template>

      <el-form
          :rules="rules"
          ref="ruleFormRef"
          :model="ruleForm"
          class="custom-form"
      >
        <!-- 所属城市 -->
        <el-form-item label="模板名称：" prop="name" label-width="100">
          <el-input
              v-model="ruleForm.name"
              placeholder="请输入模板名称"
              class="city-input"
          >
            <template #prefix>
              <el-icon class="text-teal-500"><Location /></el-icon>
            </template>
          </el-input>
        </el-form-item>

        <!-- 时间区间列表 -->
        <transition-group name="time-slot" tag="div">
          <el-form-item
              v-for="(item, index) in ruleForm.date"
              :key=" index"
              :label="index === 0 ? '时间区间：' : ''"
              prop="city"
              label-width="100"
              class="time-slot-item"
          >
            <div class="flex gap-3 items-center w-full time-slot-content">
              <div class="flex-1 flex gap-3 items-center bg-gray-50/50 p-3 rounded-lg border border-gray-100 hover:border-teal-300 hover:bg-teal-50/30 transition-all duration-300">
                <el-time-picker
                    v-model="item.date1"
                    placeholder="开始时间"
                    class="time-picker"
                />
                <span class="text-gray-400 font-medium">→</span>
                <el-time-picker
                    v-model="item.date2"
                    arrow-control
                    placeholder="结束时间"
                    class="time-picker"
                />
                <el-input
                    placeholder="请输入电费"
                    v-model="item.electricity"
                    class="electricity-input"
                >
                  <template #prefix>
                    <el-icon><ShoppingTrolley /></el-icon>
                  </template>
                  <template #suffix>
                    <span class="text-gray-400 text-sm">元/度</span>
                  </template>
                </el-input>

                <!-- 删除按钮 -->
                <el-button
                    v-if="ruleForm.date.length > 1"
                    type="danger"
                    circle
                    size="small"
                    class="delete-btn opacity-0 group-hover:opacity-100 transition-opacity duration-200"

                >
                  <el-icon><Delete /></el-icon>
                </el-button>
              </div>
            </div>
          </el-form-item>
        </transition-group>

        <!-- 添加时间区间按钮 -->
        <el-form-item prop="city" label-width="100" class="add-btn-item">
          <div class="w-full">
            <el-button
                type="primary"
                @click="addDate"
                class="add-time-btn"
                :icon="Plus"
            >
              添加时间区间
            </el-button>
          </div>
        </el-form-item>

        <!-- 服务费 -->
        <el-form-item label="服务费：" prop="service" label-width="100">
          <el-input
              v-model="ruleForm.service"
              placeholder="请输入服务费"
              class="fee-input"
          >
            <template #prefix>
              <el-icon class="text-orange-500"><Service /></el-icon>
            </template>
            <template #suffix>
              <span class="text-gray-400 text-sm">元</span>
            </template>
          </el-input>
        </el-form-item>

        <!-- 停车费 -->
        <el-form-item label="停车费：" prop="parking" label-width="100">
          <el-input
              v-model="ruleForm.parking"
              placeholder="请输入停车费"
              class="fee-input"
          >
            <template #prefix>
              <el-icon><Money /></el-icon>
            </template>
            <template #suffix>
              <span class="text-gray-400 text-sm">元/小时</span>
            </template>
          </el-input>
        </el-form-item>

        <!-- 特殊备注 -->
        <el-form-item label="特殊备注：" prop="remarks" label-width="100">
          <el-input
              type="textarea"
              v-model="ruleForm.remarks"
              :rows="3"
              placeholder="请输入特殊备注信息..."
              class="remark-input"
              resize="none"
          >
          <template #prefix>
            <el-icon><Finished /></el-icon>
          </template>
          </el-input>
        </el-form-item>

        <!-- 操作按钮 -->
        <el-form-item prop="remarks" label-width="100" class="action-item">
          <div class="w-full flex gap-3">
            <el-button
                @click="submitForm(ruleFormRef)"
                type="primary"
                size="large"
                class="submit-btn"
                :icon="Check"
            >
              创建配置
            </el-button>
            <el-button
                type="default"
                size="large"
                class="reset-btn"
                :icon="RefreshRight"
            >
              重置
            </el-button>
          </div>
        </el-form-item>
      </el-form>
    </el-card>
  </el-col>
</el-row>
</template>

<style scoped lang="less">
.form-col {
  animation: slideIn 0.6s ease-out;
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}


/* 头部样式 */
.card-header {
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 8px 0;
}

.header-title {
  font-size: 1.25rem;
  font-weight: 700;
  background: linear-gradient(135deg, #0d9488 0%, #14b8a6 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.header-subtitle {
  font-size: 0.875rem;
  color: #64748b;
  font-weight: 400;
}

/* 表单整体样式 */
.custom-form {
  padding: 8px 0;
}

/* 表单项间距 */
:deep(.el-form-item) {
  margin-bottom: 24px;
  transition: all 0.3s ease;
}

:deep(.el-form-item:hover) {
  transform: translateX(4px);
}

/* 输入框聚焦效果 */
.city-input,
.fee-input,
.electricity-input {
  transition: all 0.3s ease;
}

:deep(.city-input .el-input__wrapper),
:deep(.fee-input .el-input__wrapper),
:deep(.electricity-input .el-input__wrapper) {
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
  border-radius: 10px;
  transition: all 0.3s ease;
}

:deep(.city-input .el-input__wrapper:hover),
:deep(.fee-input .el-input__wrapper:hover),
:deep(.electricity-input .el-input__wrapper:hover) {
  box-shadow: 0 4px 12px rgba(13, 148, 136, 0.15);
}

:deep(.city-input .el-input__wrapper.is-focus),
:deep(.fee-input .el-input__wrapper.is-focus),
:deep(.electricity-input .el-input__wrapper.is-focus) {
  box-shadow: 0 0 0 3px rgba(13, 148, 136, 0.1), 0 4px 12px rgba(13, 148, 136, 0.2);
}

/* 时间选择器样式 */
.time-picker {
  flex: 1;
}

:deep(.time-picker .el-input__wrapper) {
  border-radius: 8px;
  transition: all 0.3s ease;
}

/* 备注框样式 */
.remark-input {
  transition: all 0.3s ease;
}

:deep(.remark-input .el-textarea__inner) {
  border-radius: 10px;
  border: 1px solid #e2e8f0;
  transition: all 0.3s ease;
  font-family: inherit;
}

:deep(.remark-input .el-textarea__inner:hover) {
  border-color: #14b8a6;
  box-shadow: 0 4px 12px rgba(13, 148, 136, 0.1);
}

:deep(.remark-input .el-textarea__inner:focus) {
  border-color: #0d9488;
  box-shadow: 0 0 0 3px rgba(13, 148, 136, 0.1);
}

/* 时间区间列表动画 */
.time-slot-item {
  position: relative;
}

.time-slot-content {
  position: relative;
  border-radius: 12px;
  transition: all 0.3s ease;
}

.time-slot-content:hover {
  transform: translateY(-2px);
}

/* Vue Transition Group 动画 */
.time-slot-enter-active,
.time-slot-leave-active {
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.time-slot-enter-from {
  opacity: 0;
  transform: translateX(-30px) scale(0.95);
}

.time-slot-leave-to {
  opacity: 0;
  transform: translateX(30px) scale(0.95);
}

.time-slot-move {
  transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

/* 添加按钮样式 */
.add-btn-item {
  margin-top: -8px;
  margin-bottom: 20px;
}

.add-time-btn {
  background: linear-gradient(135deg, #0d9488 0%, #14b8a6 100%);
  border: none;
  border-radius: 10px;
  padding: 12px 24px;
  font-weight: 500;
  transition: all 0.3s ease;
  box-shadow: 0 4px 14px rgba(13, 148, 136, 0.35);
}

.add-time-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(13, 148, 136, 0.45);
}

.add-time-btn:active {
  transform: translateY(0);
}

/* 删除按钮 */
.delete-btn {
  transition: all 0.2s ease;
}

.time-slot-content:hover .delete-btn {
  opacity: 1;
}

/* 操作按钮区域 */
.action-item {
  margin-top: 32px;
  padding-top: 24px;
  border-top: 1px solid #e2e8f0;
}

.submit-btn {
  flex: 1;
  height: 44px;
  border-radius: 10px;
  font-weight: 600;
  font-size: 1rem;
  background: linear-gradient(135deg, #0d9488 0%, #14b8a6 100%);
  border: none;
  box-shadow: 0 4px 14px rgba(13, 148, 136, 0.35);
  transition: all 0.3s ease;
}

.submit-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(13, 148, 136, 0.45);
}

.reset-btn {
  height: 44px;
  border-radius: 10px;
  font-weight: 500;
  padding: 0 32px;
  border: 2px solid #e2e8f0;
  color: #64748b;
  transition: all 0.3s ease;
}

.reset-btn:hover {
  border-color: #94a3b8;
  color: #475569;
  background: #f1f5f9;
  transform: translateY(-2px);
}

/* 标签样式优化 */
:deep(.el-form-item__label) {
  font-weight: 500;
  color: #334155;
  padding-right: 16px;
}

/* 响应式调整 */
@media (max-width: 768px) {
  .time-slot-content > div {
    flex-direction: column;
    gap: 12px;
  }

  .time-picker,
  .electricity-input {
    width: 100%;
  }
}
.search-tree-card {
  border-radius: 12px;
  border: 1px solid #e2e8f0;
  background: #ffffff;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  overflow: hidden;
}

.search-tree-card:hover {
  box-shadow: 0 10px 40px -10px rgba(0, 0, 0, 0.1);
  border-color: #cbd5e1;
}

/* 搜索区域 */
.search-wrapper {
  padding: 20px 24px;
  background: linear-gradient(180deg, #f8fafc 0%, #ffffff 100%);
  border-bottom: 1px solid #f1f5f9;
}

/* 搜索输入框 */
.search-input {
  width: 80%;
  transition: all 0.3s ease;
}

:deep(.search-input .el-input__wrapper) {
  border-radius: 10px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05), 0 1px 2px rgba(0, 0, 0, 0.03);
  border: 1px solid #e2e8f0;
  border-right: none;
  padding: 4px 12px;
  transition: all 0.3s ease;
  background: #ffffff;
}

:deep(.search-input .el-input__wrapper:hover) {
  box-shadow: 0 4px 12px rgba(13, 148, 136, 0.15);
  border-color: #14b8a6;
}

:deep(.search-input .el-input__wrapper.is-focus) {
  box-shadow: 0 0 0 3px rgba(13, 148, 136, 0.1), 0 4px 12px rgba(13, 148, 136, 0.2);
  border-color: #0d9488;
}

/* 搜索图标 */
.search-icon {
  color: #94a3b8;
  font-size: 16px;
  transition: color 0.3s ease;
}

:deep(.search-input .el-input__wrapper.is-focus) .search-icon {
  color: #0d9488;
}

/* 搜索按钮 */
:deep(.search-input .el-input-group__append) {
  background: linear-gradient(135deg, #0d9488 0%, #14b8a6 100%);
  border-radius: 0 10px 10px 0;
  border: none;
  padding: 0;
  overflow: hidden;
}

.search-btn {
  border: none;
  background: transparent;
  color: white;
  padding: 12px 20px;
  font-size: 16px;
  transition: all 0.3s ease;
}

.search-btn:hover {
  background: rgba(255, 255, 255, 0.15);
  transform: scale(1.05);
}

.search-btn:active {
  transform: scale(0.95);
}

/* 树形区域 */
.tree-wrapper {
  padding: 16px 24px 24px;
  max-height: 500px;
  overflow-y: auto;
}

/* 自定义滚动条 */
.tree-wrapper::-webkit-scrollbar {
  width: 6px;
}

.tree-wrapper::-webkit-scrollbar-track {
  background: transparent;
}

.tree-wrapper::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 3px;
}

.tree-wrapper::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}

/* 树形组件样式 */
.custom-tree {
  width: 80%;
  background: transparent;
}

/* 树节点悬浮效果 */
:deep(.custom-tree .el-tree-node__content) {
  height: 40px;
  border-radius: 8px;
  margin: 4px 0;
  padding: 0 12px;
  transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
}

:deep(.custom-tree .el-tree-node__content:hover) {
  background: linear-gradient(90deg, #f0fdfa 0%, #ccfbf1 100%);
  color: #0d9488;
  transform: translateX(4px);
}

:deep(.custom-tree .el-tree-node__content::before) {
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 3px;
  background: #14b8a6;
  transform: scaleY(0);
  transition: transform 0.25s ease;
  border-radius: 0 2px 2px 0;
}

:deep(.custom-tree .el-tree-node__content:hover::before) {
  transform: scaleY(1);
}

/* 选中节点样式 */
:deep(.custom-tree .el-tree-node.is-current > .el-tree-node__content) {
  background: linear-gradient(90deg, #ccfbf1 0%, #99f6e4 100%);
  color: #0f766e;
  font-weight: 500;
}

:deep(.custom-tree .el-tree-node.is-current > .el-tree-node__content::before) {
  transform: scaleY(1);
}

/* 复选框样式 */
:deep(.custom-tree .el-checkbox__inner) {
  border-radius: 5px;
  border-color: #cbd5e1;
  transition: all 0.2s ease;
}

:deep(.custom-tree .el-checkbox__input.is-checked .el-checkbox__inner) {
  background: #0d9488;
  border-color: #0d9488;
}

:deep(.custom-tree .el-checkbox__input.is-indeterminate .el-checkbox__inner) {
  background: #14b8a6;
  border-color: #14b8a8;
}

/* 展开/折叠图标 */
:deep(.custom-tree .el-tree-node__expand-icon) {
  color: #94a3b8;
  transition: all 0.3s ease;
  font-size: 14px;
}

:deep(.custom-tree .el-tree-node__expand-icon:hover) {
  color: #0d9488;
  transform: scale(1.2);
}

:deep(.custom-tree .el-tree-node__expand-icon.expanded) {
  transform: rotate(90deg);
  color: #0d9488;
}

/* 标签文字 */
:deep(.custom-tree .el-tree-node__label) {
  font-size: 14px;
  letter-spacing: 0.3px;
  transition: all 0.25s ease;
}

/* 加载动画 */
@keyframes nodeAppear {
  from {
    opacity: 0;
    transform: translateX(-10px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

:deep(.custom-tree .el-tree-node) {
  animation: nodeAppear 0.3s ease-out;
}

/* 空状态提示 */
:deep(.custom-tree .el-tree__empty-block) {
  padding: 40px 0;
}

:deep(.custom-tree .el-tree__empty-text) {
  color: #94a3b8;
  font-size: 14px;
}
</style>
