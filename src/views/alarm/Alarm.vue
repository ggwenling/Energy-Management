<script setup lang="ts">
import {onMounted, reactive, ref} from 'vue'
import {getAlarmList} from "@/api/userInfo.ts";
import type {FormInstance} from "element-plus";
import {
  WarningFilled,
  CircleCloseFilled,
  User,
  Phone,
  Message,
  Document,
  OfficeBuilding,
  SetUp,
  Tools,
  TrendCharts,
  Money,
  UserFilled,
  PhoneFilled,
  ArrowLeft,
  ArrowRight,
  Check
} from '@element-plus/icons-vue'
const radio1 = ref<number>(0)

interface AlarmListType {
  description: string,
  address: string,
  equNo: string,
  level: number,//1严重 2紧急 3一般
  time: string,
  code: number,//故障代码
  status: number,//1待指派 2处理中 处理异常
}

//定义数据列表
const alarmList = ref<AlarmListType[]>([])
onMounted(async () => {
  const {data: {data}} = await getAlarmList()
  alarmList.value = data
  console.log(alarmList.value)
})
//根据数组的key返会对应的文字<映射表>
const fieldLabelMap:Record<string,string>={
  description: "故障描述",
  address: "设备地址",
  equNo: "设备号",
  level: "告警级别",//1严重 2紧急 3一般
  time: "故障时间",
  code: "故障代码",//故障代码
  status: "当前状态",//1待指派 2处理中 处理异常
}

const getLabel=(key:string):string=>{
  return fieldLabelMap[key] || key
}
//抽屉区域
const visible = ref<boolean>(false)

//表单
const ruleFormRef1 = ref<FormInstance>()
const ruleFormRef2 = ref<FormInstance>()
const ruleFormRef3 = ref<FormInstance>()
const formData=reactive({
  basicInfo:{
    name:"",
    email:"",
    tel:"",
    no:"",
    urgent:true,
    other:[],
    remarks:""
  },
  shenpi:{
    a:"",
    b:""
  },
  info:{
    person:"",
    tel:""
  }
})
//steps步骤条
const active = ref<number>(0)
const next = () => {

    if(active.value===0){
      submitForm(ruleFormRef1.value)
    }
  if(active.value===1){
    submitForm(ruleFormRef2.value)
  }else{
    submitForm(ruleFormRef3.value)
  }
}
const prev = () =>{
  active.value--
}
//校验规则
const basicRules={
  name:[
    {required:true,message:"请输入姓名",trigger:"blur"}
  ],
  email:[
    {required:true,message:"请输入邮箱",trigger:"blur"}
  ],
  tel:[
    {required:true,message:"请输入电话",trigger:"blur"}
  ],
  no:[
    {required:true,message:"请输入工号",trigger:"blur"}
  ]
}
const shenpiRules={
  a:[
    {required:true,message:"不能为空",trigger:"blur"}
  ],
  b:[
    {required:true,message:"不能为空",trigger:"blur"}
  ],
}
const infoRules={
  person:[
    {required:true,message:"不能为空",trigger:"blur"}
  ],
  tel:[
    {required:true,message:"不能为空",trigger:"blur"}
  ],
}
const submitForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return
  formEl.validate((valid) => {
    if (valid) {
      active.value++
      console.log('submit!')
    } else {
      console.log('error submit!')
    }
  })
}
</script>

<template>
  <el-card class="custom-card mt-2">
    <el-radio-group v-model="radio1" size="large" class="mt">
      <el-radio-button label="严重告警" :value="1"></el-radio-button>
      <el-radio-button label="紧急告警" :value="2"></el-radio-button>
      <el-radio-button label="重要告警" :value="3"></el-radio-button>
      <el-radio-button label="一般告警" :value="4"></el-radio-button>
    </el-radio-group>
  </el-card>

<el-row :gutter="20">
  <el-col :span="12" v-for="item in alarmList" :key="item.address">
    <el-card class="custom-card mt-2" >
      <el-alert :title="`${item.address}充电桩异常`" type="warning" />
      <el-descriptions :border="true" :column="4" direction="vertical" class="mt">
        <el-descriptions-item v-for="(val,key) in item" :label="getLabel(key)">
          <el-tag v-if="key=='level'" :type="val==1?'danger':(val==2?'warning':'info')">
            {{ val==1?'严重':(val==2?'紧急':'一般') }}
          </el-tag>
          <el-text  type="danger" v-else-if="key=='status'">
            {{ val==1?"待指派":(val==2?"处理中":"处理异常") }}
          </el-text>
          <span v-else>{{ val }}</span>
        </el-descriptions-item>
        <el-descriptions-item label="操作">
          <el-button  :type="item.status==2?'warning':'primary'" @click="visible=true"> {{ item.status==1?"指派":(item.status==2?"催办":"查看") }} </el-button>
        </el-descriptions-item>
      </el-descriptions>
    </el-card>
  </el-col>
</el-row>
<!--抽屉区域-->

    <!-- ... 前面代码保持不变 ... -->

    <!-- 抽屉区域 -->
    <el-drawer
        v-model="visible"
        :show-close="false"
        size="640px"
        class="alarm-drawer"
    >
      <template #header="{ close, titleId, titleClass }">
        <div class="flex items-center gap-3 w-full">
          <div class="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-lg shadow-orange-200">
            <el-icon class="text-white text-xl"><WarningFilled /></el-icon>
          </div>
          <h4 :id="titleId" :class="titleClass" class="!mb-0 text-lg font-bold text-gray-800">报警任务指派列表</h4>
          <el-button
              type="danger"
              circle
              class="ml-auto hover:rotate-90 transition-transform duration-300"
              @click="close"
          >
            <el-icon><CircleCloseFilled /></el-icon>
          </el-button>
        </div>
      </template>

      <div class="h-full flex flex-col p-6">
        <!-- 步骤条 -->
        <div class="mb-8">
          <el-steps
              :active="active"
              finish-status="success"
              align-center
              class="custom-steps"
          >
            <el-step title="基本信息" />
            <el-step title="审批信息" />
            <el-step title="负责人信息" />
          </el-steps>
        </div>

        <!-- 表单内容区 -->
        <div class="flex-1 overflow-y-auto px-2">
          <transition name="form-fade" mode="out-in">
            <!-- 步骤1：基本信息 -->
            <div v-if="active===0" key="step1" class="space-y-5">
              <el-form
                  ref="ruleFormRef1"
                  :model="formData.basicInfo"
                  :rules="basicRules"
                  label-position="right"
                  label-width="120px"
                  class="space-y-4"
              >
                <el-form-item label="姓名" prop="name" class="form-item-animated">
                  <el-input
                      v-model="formData.basicInfo.name"
                      placeholder="请输入姓名"
                      class="w-4/5"
                      :prefix-icon="User"
                  />
                </el-form-item>

                <el-form-item label="电话" prop="tel" class="form-item-animated" style="animation-delay: 50ms">
                  <el-input
                      v-model="formData.basicInfo.tel"
                      placeholder="请输入电话"
                      class="w-4/5"
                      :prefix-icon="Phone"
                  />
                </el-form-item>

                <el-form-item label="邮箱" prop="email" class="form-item-animated" style="animation-delay: 100ms">
                  <el-input
                      v-model="formData.basicInfo.email"
                      placeholder="请输入邮箱"
                      class="w-4/5"
                      :prefix-icon="Message"
                  />
                </el-form-item>

                <el-form-item label="工号" prop="no" class="form-item-animated" style="animation-delay: 150ms">
                  <el-input
                      v-model="formData.basicInfo.no"
                      placeholder="请输入工号"
                      class="w-32"
                      :prefix-icon="Document"
                  />
                </el-form-item>

                <el-form-item label="是否加急：" class="form-item-animated" style="animation-delay: 200ms">
                  <div class="flex items-center h-full">
                    <el-switch
                        v-model="formData.basicInfo.urgent"
                        active-text="是"
                        inactive-text="否"
                        inline-prompt
                        class="custom-switch"
                    />
                  </div>
                </el-form-item>

                <el-form-item label="其他选项：" class="form-item-animated max-h-14" style="animation-delay: 250ms">
                  <el-checkbox-group v-model="formData.basicInfo.other" class="flex flex-wrap gap-3">
                    <el-checkbox value="1" class="custom-checkbox">更换设备</el-checkbox>
                    <el-checkbox value="2" class="custom-checkbox">仅维修</el-checkbox>
                    <el-checkbox value="3" class="custom-checkbox">需拍照片</el-checkbox>
                    <el-checkbox value="4" class="custom-checkbox">需报备</el-checkbox>
                  </el-checkbox-group>
                </el-form-item>

                <el-form-item label="其他备注信息：" class="form-item-animated" style="animation-delay: 300ms">
                  <el-input
                      v-model="formData.basicInfo.remarks"
                      type="textarea"
                      :rows="3"
                      placeholder="请输入备注信息..."
                      class="w-4/5"
                  />
                </el-form-item>
              </el-form>
            </div>

            <!-- 步骤2：审批信息 -->
            <div v-else-if="active===1" key="step2" class="space-y-5 pt-4">
              <el-form
                  :model="formData.shenpi"
                  ref="ruleFormRef2"
                  :rules="shenpiRules"
                  label-position="right"
                  label-width="120px"
                  class="space-y-6"
              >
                <el-form-item label="审批部门" prop="a" class="form-item-animated">
                  <el-select
                      placeholder="请选择审批部门"
                      v-model="formData.shenpi.a"
                      class="w-4/5"
                      :suffix-icon="OfficeBuilding"
                  >
                    <el-option label="总裁办" value="1">
                      <div class="flex items-center gap-2">
                        <el-icon class="text-amber-500"><OfficeBuilding /></el-icon>
                        <span>总裁办</span>
                      </div>
                    </el-option>
                    <el-option label="运营部" value="2">
                      <div class="flex items-center gap-2">
                        <el-icon class="text-blue-500"><SetUp /></el-icon>
                        <span>运营部</span>
                      </div>
                    </el-option>
                    <el-option label="维修部" value="3">
                      <div class="flex items-center gap-2">
                        <el-icon class="text-green-500"><Tools /></el-icon>
                        <span>维修部</span>
                      </div>
                    </el-option>
                    <el-option label="市场部" value="4">
                      <div class="flex items-center gap-2">
                        <el-icon class="text-purple-500"><TrendCharts /></el-icon>
                        <span>市场部</span>
                      </div>
                    </el-option>
                    <el-option label="财务部" value="5">
                      <div class="flex items-center gap-2">
                        <el-icon class="text-red-500"><Money /></el-icon>
                        <span>财务部</span>
                      </div>
                    </el-option>
                  </el-select>
                </el-form-item>

                <el-form-item label="抄送部门" prop="b" class="form-item-animated" style="animation-delay: 100ms">
                  <el-select
                      placeholder="请选择抄送部门"
                      v-model="formData.shenpi.b"
                      class="w-4/5"
                  >
                    <el-option label="总裁办" value="1" />
                    <el-option label="运营部" value="2" />
                    <el-option label="维修部" value="3" />
                    <el-option label="市场部" value="4" />
                    <el-option label="财务部" value="5" />
                  </el-select>
                </el-form-item>
              </el-form>
            </div>

            <!-- 步骤3：负责人信息 -->
            <div v-else-if="active===2" key="step3" class="space-y-5 pt-4">
              <el-form
                  :model="formData.info"
                  :rules="infoRules"
                  ref="ruleFormRef3"
                  label-position="right"
                  label-width="120px"
                  class="space-y-6"
              >
                <el-form-item label="负责人姓名：" prop="person" class="form-item-animated">
                  <el-input
                      v-model="formData.info.person"
                      placeholder="请输入负责人姓名"
                      class="w-4/5"
                      :prefix-icon="UserFilled"
                  />
                </el-form-item>

                <el-form-item label="负责人电话：" prop="tel" class="form-item-animated" style="animation-delay: 100ms">
                  <el-input
                      v-model="formData.info.tel"
                      placeholder="请输入负责人电话"
                      class="w-4/5"
                      :prefix-icon="PhoneFilled"
                  />
                </el-form-item>
              </el-form>
            </div>
          </transition>
        </div>

        <!-- 底部按钮 -->
        <div class="flex justify-center gap-4 pt-6 mt-4 border-t border-gray-100">
          <el-button
              @click="prev"
              :disabled="active===0"
              class="px-8 h-11 rounded-lg transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
          >
            <el-icon class="mr-1"><ArrowLeft /></el-icon>
            上一步
          </el-button>
          <el-button
              @click="next"
              type="primary"
              class="px-8 h-11 rounded-lg bg-gradient-to-r from-teal-500 to-teal-600 border-none shadow-lg shadow-teal-200 transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-teal-300"
          >
            {{active<2?'下一步':'提交'}}
            <el-icon class="ml-1"><ArrowRight v-if="active<2" /><Check v-else /></el-icon>
          </el-button>
        </div>
      </div>
    </el-drawer>
  </template>


<style scoped lang="less">
.custom-card {
  border-radius: 20px;
  border: none;
  background: linear-gradient(145deg, #ffffff 0%, #f8fafc 100%);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08), 0 1px 3px rgba(0, 0, 0, 0.04);
  transition: all 0.3s ease;
}

.custom-card:hover{
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.12), 0 2px 8px rgba(0, 0, 0, 0.06);
}

// 抽屉样式
.alarm-drawer {
  :deep(.el-drawer__header) {
    margin-bottom: 0;
    padding: 20px 24px;
    border-bottom: 1px solid #f3f4f6;
    background: linear-gradient(to right, #fffbeb, #ffffff);
  }

  :deep(.el-drawer__body) {
    padding: 0;
    background: #fafafa;
  }
}

// 步骤条自定义样式
.custom-steps {
  :deep(.el-step__head) {
    &.is-process {
      color: #0d9488;
      border-color: #0d9488;

      .el-step__icon {
        background: linear-gradient(135deg, #0d9488 0%, #14b8a6 100%);
        color: white;
        box-shadow: 0 4px 12px rgba(13, 148, 136, 0.3);
      }
    }

    &.is-success {
      color: #10b981;
      border-color: #10b981;
    }

    &.is-wait {
      color: #d1d5db;
    }
  }

  :deep(.el-step__title) {
    font-size: 14px;
    font-weight: 500;

    &.is-process {
      color: #0d9488;
      font-weight: 600;
    }
  }

  :deep(.el-step__line) {
    background-color: #e5e7eb;
    height: 2px;

    .el-step__line-inner {
      border-width: 0 !important;
      height: 2px;
      background: linear-gradient(90deg, #0d9488 0%, #14b8a6 100%);
      transition: width 0.4s ease;
    }
  }
}

// 表单切换动画
.form-fade-enter-active,
.form-fade-leave-active {
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.form-fade-enter-from {
  opacity: 0;
  transform: translateX(30px);
}

.form-fade-leave-to {
  opacity: 0;
  transform: translateX(-30px);
}

// 表单项入场动画
.form-item-animated {
  animation: slideInUp 0.5s ease-out backwards;
}

@keyframes slideInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

// 输入框样式
:deep(.el-input__wrapper) {
  border-radius: 10px;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
  border: 1px solid #e5e7eb;
  transition: all 0.3s ease;

  &:hover {
    border-color: #14b8a6;
    box-shadow: 0 4px 12px rgba(13, 148, 136, 0.15);
  }

  &.is-focus {
    border-color: #0d9488;
    box-shadow: 0 0 0 3px rgba(13, 148, 136, 0.1), 0 4px 12px rgba(13, 148, 136, 0.2);
  }
}

// 选择器样式
:deep(.el-select) {
  .el-input__wrapper {
    border-radius: 10px;
  }
}

// 开关样式
.custom-switch {
  :deep(.el-switch__core) {
    border-radius: 20px;

    .el-switch__action {
      border-radius: 50%;
    }
  }

  :deep(.el-switch__label) {
    font-weight: 500;

    &.is-active {
      color: #0d9488;
    }
  }
}

// 复选框样式
.custom-checkbox {
  :deep(.el-checkbox__input) {
    .el-checkbox__inner {
      border-radius: 6px;
      width: 18px;
      height: 18px;
      transition: all 0.2s ease;

      &:hover {
        border-color: #0d9488;
      }
    }

    &.is-checked .el-checkbox__inner {
      background-color: #0d9488;
      border-color: #0d9488;
      box-shadow: 0 2px 8px rgba(13, 148, 136, 0.3);

      &::after {
        border-width: 2px;
        left: 6px;
        top: 3px;
      }
    }
  }

  :deep(.el-checkbox__label) {
    font-size: 14px;
    padding-left: 8px;
  }

  &:hover {
    :deep(.el-checkbox__label) {
      color: #0d9488;
    }
  }
}

// 文本域样式
:deep(.el-textarea__inner) {
  border-radius: 10px;
  border: 1px solid #e5e7eb;
  transition: all 0.3s ease;
  font-family: inherit;

  &:hover {
    border-color: #14b8a6;
  }

  &:focus {
    border-color: #0d9488;
    box-shadow: 0 0 0 3px rgba(13, 148, 136, 0.1);
  }
}

// 标签样式
:deep(.el-form-item__label) {
  font-weight: 500;
  color: #374151;
  padding-right: 16px;
}

// 按钮点击效果
:deep(.el-button) {
  position: relative;
  overflow: hidden;

  &::after {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    width: 0;
    height: 0;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.3);
    transform: translate(-50%, -50%);
    transition: width 0.6s, height 0.6s;
  }

  &:active::after {
    width: 300px;
    height: 300px;
  }
}
</style>
