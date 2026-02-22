<script setup lang="ts">
import { ref} from 'vue'
import {ElNotification, type FormInstance} from "element-plus";
//日历

const dateValue = ref(new Date())

//步骤条
const active = ref<number>(1)

const next = () => {
  if (active.value++ > 2) active.value = 0
}
//信息修改表单收集
const form1=ref<FormInstance>()
const form2=ref<FormInstance>()

const formData = ref({
  basicInfo: {
    name: "",
    address: "",
    tel: ""
  },
  job: {
    status: ""
  }
})



//表单提交
const handleSubmit=() =>{
  console.log("表单数据",formData.value)
  ElNotification({
    title: 'Success',
    message: '个人数据修改成功',
    type: 'success',
  })
}
</script>

<template>
  <div class="user-page">
    <el-row :gutter="20">
      <!--   左半部分-->
      <el-col :span="12">

        <!--     个人信息简介-->
        <el-card class="custom-card mt-2 fade-in-up" style="animation-delay: 0.1s">
          <el-descriptions direction="vertical" border style="margin-top: 20px">
            <el-descriptions-item :rowspan="2" :width="140" label="个人头像" align="center">
              <el-image
                class="avatar-image"
                style="width: 100px; height: 100px"
                src="https://api.dicebear.com/7.x/miniavs/svg?seed=9"/>
            </el-descriptions-item>
            <el-descriptions-item label="姓名">赖军</el-descriptions-item>
            <el-descriptions-item label="电话">18100000000</el-descriptions-item>
            <el-descriptions-item label="地址">北京市朝阳区</el-descriptions-item>
            <el-descriptions-item label="个人标签">
              <el-tag type="primary" class="mr-2 tag-item">认真</el-tag>
              <el-tag type="success" class="mr-2 tag-item">工作狂</el-tag>
              <el-tag type="info" class="mr-2 tag-item">与人和善</el-tag>
              <el-tag type="warning" class="mr-2 tag-item">代码洁癖</el-tag>
            </el-descriptions-item>
          </el-descriptions>
        </el-card>

        <!--      日历信息-->
        <el-card class="mt-2 custom-card fade-in-up" style="animation-delay: 0.2s">
          <el-calendar v-model="dateValue"/>
        </el-card>

        <el-card class="mt-2 custom-card fade-in-up" style="animation-delay: 0.3s">
          <el-steps style="max-width: 600px" :active="active" finish-status="success">
            <el-step title="修改个人信息" ></el-step>
           <el-step title="工作状态" ></el-step>
          </el-steps>

          <transition name="slide-fade" mode="out-in">
            <div v-if="active===1" key="step1" class="mt-2 form-container">
              <el-form :model="formData.basicInfo" ref="form1" >
                <el-form-item label="姓名">
                  <el-input v-model="formData.basicInfo.name"/>
                </el-form-item>
                <el-form-item label="电话">
                  <el-input v-model="formData.basicInfo.tel"/>
                </el-form-item>
                <el-form-item label="地址">
                  <el-input v-model="formData.basicInfo.address"/>
                </el-form-item>
              </el-form>
            </div>
            <div v-else key="step2" class="mt-2 form-container">
              <el-form :model="formData.job" ref="form2">
                <el-form-item label="在职状态">
                  <el-select placeholder="请选择在职状态" v-model="formData.job.status" style="width: 100%">
                    <el-option label="工作中" value="1"></el-option>
                    <el-option label="请假中" value="2"></el-option>
                    <el-option label="出差中" value="3"></el-option>
                    <el-option label="年假中" value="4"></el-option>
                  </el-select>
                </el-form-item>
              </el-form>
            </div>
          </transition>

         <div class="container mt-3 button-group">
           <el-button @click="next" :disabled="active===2">下一步</el-button>
           <transition name="fade">
             <el-button type="primary" v-if="active===2" @click="handleSubmit">提交</el-button>
           </transition>
         </div>

        </el-card>
      </el-col>
  <!--    右侧部分-->
      <el-col :span="12">
        <el-card class="mt-2 custom-card fade-in-up badge-card" style="animation-delay: 0.15s">
          <div class="badge-container">
            <el-badge :value="12" class="mr-2 badge-item">
              <el-button>待办事项</el-button>
            </el-badge>
            <el-badge :value="3" class="mr-2 badge-item">
              <el-button>指派给我</el-button>
            </el-badge>
            <el-badge :value="12" class="mr-2 badge-item">
              <el-button>部门公告</el-button>
            </el-badge>
            <el-badge :value="3" class="mr-2 badge-item">
              <el-button>站内信</el-button>
            </el-badge>
            <el-badge :value="1" class="mr-2 badge-item" type="primary">
              <el-button>我指派的</el-button>
            </el-badge>
          </div>
        </el-card>

        <el-card class="mt-2 custom-card fade-in-up" style="animation-delay: 0.25s">
          <el-collapse>
            <el-collapse-item title="账号注销通知！" name="1" >
              <div class="collapse-content">
                <h3 class="text-gray-700 font-semibold">员工离职，账号需要注销，请及时处理！</h3>
                <el-button type="primary" size="small" class="mr action-btn" v-permission="'admin'">去处理</el-button>
              </div>
            </el-collapse-item>
            <el-collapse-item title="权限变更通知！" name="2">
              <div class="collapse-content">
                <h3 class="text-gray-700 font-semibold">王丽丽因部门调动账号权限需调整！</h3>
                <el-button type="primary" size="small" class="mr action-btn" v-permission="'user'">去处理</el-button>
              </div>
            </el-collapse-item>
            <el-collapse-item title="财务放款通知！" name="3">
              <div class="collapse-content">
                <h3 class="text-gray-700 font-semibold">北京充电站充电桩维修放款！</h3>
                <el-button type="primary" size="small" class="mr action-btn">去处理</el-button>
              </div>
            </el-collapse-item>
            <el-collapse-item title="人员调动通知！" name="4">
              <div class="collapse-content">
                <h3 class="text-gray-700 font-semibold">李继维由行政部转为维修部，需要办理！</h3>
                <el-button type="primary" size="small" class="mr action-btn">去处理</el-button>
              </div>
            </el-collapse-item>
            <el-collapse-item title="出差费用报销审批" name="5">
              <div class="collapse-content">
                <h3 class="text-gray-700 font-semibold">运营部7人出差，报销费用8700元需审批</h3>
                <el-button type="primary" size="small" class="mr action-btn">去处理</el-button>
              </div>
            </el-collapse-item>
            <el-collapse-item title="财务放款通知！" name="6">
              <div class="collapse-content">
                <h3 class="text-gray-700 font-semibold">北京充电站充电桩维修放款！</h3>
                <el-button type="primary" size="small" class="mr action-btn">去处理</el-button>
              </div>
            </el-collapse-item>
            <el-collapse-item title="人员调动通知！" name="7">
              <div class="collapse-content">
                <h3 class="text-gray-700 font-semibold">李继维由行政部转为维修部，需要办理！</h3>
                <el-button type="primary" size="small" class="mr action-btn">去处理</el-button>
              </div>
            </el-collapse-item>
            <el-collapse-item title="出差费用报销审批" name="8">
              <div class="collapse-content">
                <h3 class="text-gray-700 font-semibold">运营部7人出差，报销费用8700元需审批</h3>
                <el-button type="primary" size="small" class="mr action-btn">去处理</el-button>
              </div>
            </el-collapse-item>
            <el-collapse-item title="账号注销通知！" name="9">
              <div class="collapse-content">
                <h3 class="text-gray-700 font-semibold">员工离职，账号需要注销，请及时处理</h3>
                <el-button type="primary" size="small" class="mr action-btn">去处理</el-button>
              </div>
            </el-collapse-item>
            <el-collapse-item title="权限变更通知！" name="10">
              <div class="collapse-content">
                <h3 class="text-gray-700 font-semibold">王丽丽因部门调动账号权限需调整！</h3>
                <el-button type="primary" size="small" class="mr action-btn">去处理</el-button>
              </div>
            </el-collapse-item>
            <el-collapse-item title="财务放款通知！" name="11">
              <div class="collapse-content">
                <h3 class="text-gray-700 font-semibold">北京充电站充电桩维修放款！</h3>
                <el-button type="primary" size="small" class="mr action-btn">去处理</el-button>
              </div>
            </el-collapse-item>
          </el-collapse>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<style scoped lang="less">
.user-page {
  animation: pageEnter 0.6s ease-out;
}

// 页面进入动画
@keyframes pageEnter {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

// 卡片淡入上移动画
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.fade-in-up {
  animation: fadeInUp 0.6s ease-out backwards;
}

// 卡片悬停效果
.custom-card {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  border-radius: 8px;
  overflow: hidden;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 12px 24px rgba(0, 0, 0, 0.12);
  }
}

// 头像悬停效果
.avatar-image {
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  border-radius: 50%;
  cursor: pointer;

  &:hover {
    transform: scale(1.1) rotate(5deg);
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.15);
  }
}

// 标签动画
.tag-item {
  transition: all 0.3s ease;
  cursor: pointer;

  &:hover {
    transform: translateY(-2px) scale(1.05);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
  }
}

// 表单切换动画
.slide-fade-enter-active {
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.slide-fade-leave-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.slide-fade-enter-from {
  transform: translateX(20px);
  opacity: 0;
}

.slide-fade-leave-to {
  transform: translateX(-20px);
  opacity: 0;
}

.form-container {
  min-height: 200px;
}

// 按钮淡入动画
.fade-enter-active {
  transition: all 0.3s ease;
}

.fade-leave-active {
  transition: all 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: scale(0.9);
}

// 按钮组
.button-group {
  display: flex;
  gap: 12px;

  :deep(.el-button) {
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);

    &:hover:not(:disabled) {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(64, 158, 255, 0.3);
    }

    &:active:not(:disabled) {
      transform: translateY(0);
    }
  }
}

// 徽章容器
.badge-card {
  .badge-container {
    display: flex;
    flex-wrap: wrap;
    gap: 12px;
  }

  .badge-item {
    transition: all 0.3s ease;

    &:hover {
      transform: translateY(-3px);

      :deep(.el-button) {
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
      }
    }

    :deep(.el-badge__content) {
      transition: all 0.3s ease;
    }

    &:hover :deep(.el-badge__content) {
      transform: scale(1.15);
    }
  }
}

// 折叠面板内容
.collapse-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 0;
  animation: slideDown 0.3s ease-out;

  h3 {
    margin: 0;
    transition: color 0.3s ease;
  }

  &:hover h3 {
    color: #409eff;
  }
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

// 操作按钮
.action-btn {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);

  &:hover {
    transform: translateX(-3px);
    box-shadow: 0 4px 12px rgba(64, 158, 255, 0.4);
  }
}

// 折叠面板优化
:deep(.el-collapse-item__header) {
  transition: all 0.3s ease;

  &:hover {
    background-color: #f5f7fa;
    padding-left: 16px;
  }
}

:deep(.el-collapse-item__wrap) {
  transition: all 0.3s ease;
}

// 日历优化
:deep(.el-calendar) {
  .el-calendar__header {
    transition: all 0.3s ease;
  }

  .el-calendar-day {
    transition: all 0.2s ease;

    &:hover {
      background-color: #f0f9ff;
      transform: scale(1.05);
    }
  }
}

// 步骤条优化
:deep(.el-steps) {
  .el-step__head {
    transition: all 0.3s ease;

    &:hover {
      transform: scale(1.1);
    }
  }
}

// 输入框聚焦效果
:deep(.el-input__wrapper) {
  transition: all 0.3s ease;

  &:hover {
    box-shadow: 0 0 0 1px #c0c4cc inset;
  }

  &.is-focus {
    box-shadow: 0 0 0 1px #409eff inset, 0 2px 8px rgba(64, 158, 255, 0.2);
  }
}

:deep(.el-select) {
  .el-input__wrapper {
    transition: all 0.3s ease;
  }
}

// 描述列表优化
:deep(.el-descriptions) {
  .el-descriptions__cell {
    transition: background-color 0.3s ease;
  }

  .el-descriptions__label {
    font-weight: 500;
  }
}
</style>
