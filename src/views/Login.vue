<template>
  <div class="bg">
    <div class="box flex justify-center">
      <div class="login bg-gray-50 rounded-2xl">
        <div class="logo flex justify-center items-center text-center gap-4 text-lg mb-10">
          <img :src="logo" alt="" width="50px" height="50px" class="logo-img"/>
          <h1 class="text-sky-600 font-semibold logo-title">动力港能源管理平台</h1>
        </div>

        <!--      用户登录区域-->
        <el-form
            ref="ruleFormRef"
            style="max-width: 600px"
            :model="ruleForm"
            :rules="rules"
            label-width="auto"
            class="login-form"
        >
          <el-form-item prop="username" class="mt-5 form-item">
            <el-input v-model="ruleForm.username" placeholder="请输入用户名" prefix-icon="User" class="input-field"/>
          </el-form-item>
          <el-form-item prop="password" class="form-item">
            <el-input v-model="ruleForm.password" placeholder="请输入密码" prefix-icon="Lock" type="password" class="input-field"/>
          </el-form-item>
          <el-form-item class="form-item">
            <el-button type="primary" size="large" round class="w-3xs login-btn" @click="submitForm">登录</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>


<script setup lang="ts">
import logo from "@/assets/logo.png"
import {ref, reactive} from "vue";
import {type FormRules, type FormInstance} from 'element-plus'
import {useUserStore} from "@/store/user.ts";
import {useRouter,type Router} from "vue-router";
const router:Router = useRouter();

const userStore = useUserStore();


interface RuleForm {
  username: string;
  password: string;
}

const ruleFormRef = ref<FormInstance>()
const ruleForm: RuleForm = reactive({
  username: "",
  password: "",
})

//表单校验规则
const rules = reactive<FormRules<RuleForm>>({
  username: [
    {required: true, message: '账号名不能为空', trigger: 'blur'},
    {min: 3, max: 5, message: 'Length should be 3 to 5', trigger: 'blur'},
  ],
  password: [
    {
      required: true,
      message: '密码不能为空',
      trigger: 'blur',
    },
  ],
})

//登录案件触发逻辑
const submitForm = () => {
  ruleFormRef.value?.validate(async (valid: boolean) => {
    if (valid) {
      userStore.UserLogin(ruleForm,router)
    } else {
      console.log("错了老弟")
    }
  })
}
</script>

<style scoped lang="less">
// 背景动画
.bg {
  background-image: url('@/assets/bg.png');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  height: 100vh;
  position: relative;
  overflow: hidden;
  
  // 背景渐变叠加层
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(135deg, rgba(64, 158, 255, 0.1) 0%, rgba(103, 194, 58, 0.1) 100%);
    animation: gradientShift 10s ease infinite;
  }
  
  @keyframes gradientShift {
    0%, 100% {
      opacity: 0.3;
    }
    50% {
      opacity: 0.6;
    }
  }

  .box {
    position: absolute;
    top: 50%;
    margin-top: -200px;
    width: 100vw;
    animation: fadeIn 0.8s ease-out;
    z-index: 1;

    .login {
      width: 500px;
      height: 300px;
      padding: 50px;
      text-align: center;
      background-color: rgba(255, 255, 255, 0.1);
      backdrop-filter: blur(8px);
      -webkit-backdrop-filter: blur(8px);
      border: 0.666667px solid rgba(255, 255, 255, 0.18);
      box-shadow: rgba(142, 142, 142, 0.19) 0px 6px 15px 0px;
      -webkit-box-shadow: rgba(142, 142, 142, 0.19) 0px 6px 15px 0px;
      border-radius: 25px;
      -webkit-border-radius: 25px;
      color: rgba(255, 255, 255, 0.3);
      animation: slideUp 0.8s cubic-bezier(0.4, 0, 0.2, 1);
      transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
      
      &:hover {
        transform: translateY(-8px);
        box-shadow: rgba(142, 142, 142, 0.3) 0px 12px 30px 0px;
        border: 0.666667px solid rgba(255, 255, 255, 0.3);
      }
    }
  }
}

// 页面淡入动画
@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

// 登录框上滑动画
@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(50px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

// Logo 区域动画
.logo {
  animation: logoFadeIn 1s ease-out 0.3s backwards;
  
  .logo-img {
    transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
    filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.1));
    
    &:hover {
      transform: rotate(360deg) scale(1.1);
      filter: drop-shadow(0 8px 16px rgba(64, 158, 255, 0.4));
    }
  }
  
  .logo-title {
    transition: all 0.3s ease;
    position: relative;
    
    &::after {
      content: '';
      position: absolute;
      bottom: -4px;
      left: 50%;
      transform: translateX(-50%);
      width: 0;
      height: 2px;
      background: linear-gradient(90deg, #409eff, #67c23a);
      transition: width 0.4s ease;
    }
    
    &:hover {
      transform: scale(1.05);
      
      &::after {
        width: 100%;
      }
    }
  }
}

@keyframes logoFadeIn {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

// 表单项动画
.login-form {
  .form-item {
    animation: formItemSlide 0.6s ease-out backwards;
    
    &:nth-child(1) {
      animation-delay: 0.4s;
    }
    
    &:nth-child(2) {
      animation-delay: 0.5s;
    }
    
    &:nth-child(3) {
      animation-delay: 0.6s;
    }
  }
}

@keyframes formItemSlide {
  from {
    opacity: 0;
    transform: translateX(-30px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

// 输入框样式优化
.input-field {
  :deep(.el-input__wrapper) {
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    background-color: rgba(255, 255, 255, 0.9);
    
    &:hover {
      background-color: rgba(255, 255, 255, 1);
      box-shadow: 0 2px 8px rgba(64, 158, 255, 0.2);
      transform: translateY(-2px);
    }
    
    &.is-focus {
      background-color: rgba(255, 255, 255, 1);
      box-shadow: 0 4px 12px rgba(64, 158, 255, 0.3);
      transform: translateY(-2px);
    }
  }
  
  :deep(.el-input__prefix) {
    transition: all 0.3s ease;
  }
  
  &:hover :deep(.el-input__prefix) {
    transform: scale(1.2);
    color: #409eff;
  }
}

// 登录按钮动画
.login-btn {
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(64, 158, 255, 0.3);
  
  &::before {
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
  
  &:hover {
    transform: translateY(-4px) scale(1.05);
    box-shadow: 0 8px 20px rgba(64, 158, 255, 0.5);
    
    &::before {
      width: 300px;
      height: 300px;
    }
  }
  
  &:active {
    transform: translateY(-2px) scale(1.02);
  }
}

// 表单验证错误动画
:deep(.el-form-item__error) {
  animation: errorShake 0.5s ease;
}

@keyframes errorShake {
  0%, 100% {
    transform: translateX(0);
  }
  10%, 30%, 50%, 70%, 90% {
    transform: translateX(-5px);
  }
  20%, 40%, 60%, 80% {
    transform: translateX(5px);
  }
}

// 响应式优化
@media (max-width: 768px) {
  .bg .box .login {
    width: 90%;
    padding: 30px;
    
    &:hover {
      transform: translateY(-4px);
    }
  }
}
</style>
