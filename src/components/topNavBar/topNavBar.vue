<script setup lang="ts">
import {useRouter} from "vue-router";
import {useUserStore} from "@/store/user.ts";

const store = useUserStore();
const router = useRouter();
const exit = (): void => {
  localStorage.removeItem("userInfo");
  store.clearUserInfo()
  router.push("/login");
}

</script>

<template>
  <div class="header flex justify-end gap-4" >
    <div class="budge flex items-center">
      <el-badge is-dot class="item">
        <el-icon size="20px" class="bell-icon">
          <Bell/>
        </el-icon>
      </el-badge>
    </div>
    <el-avatar
        class="avatar-item"
        src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png"
    />

    <div class="drop flex items-center">
      <el-dropdown>
        <span class="el-dropdown-link cursor-pointer">
          欢迎登录<el-icon class="el-icon--right"><arrow-down/></el-icon>
        </span>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item icon="User" @click="router.push('/personal')">个人中心</el-dropdown-item>
            <el-dropdown-item icon="SwitchButton" @click="exit">退出</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
  </div>
  <svg style="display:none">
    <filter id="distort" x="0%" y="0%" width="100%" height="100%">
      <feTurbulence type="fractalNoise" baseFrequency="0.008" numOctaves="2" result="noise"/>
      <feGaussianBlur in="noise" stdDeviation="2" result="blurred"/>
      <feDisplacementMap in="SourceGraphic" in2="blurred" scale="70" xChannelSelector="R" yChannelSelector="G"/>
    </filter>
  </svg>
</template>

<style scoped lang="less">
// 导航栏整体样式
.header {
  padding: 0 20px;
  animation: slideDown 0.5s ease-out;
  position: relative;
  
  &::before {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 1px;
    background: linear-gradient(90deg, transparent, rgba(64, 158, 255, 0.3), transparent);
  }
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

// 通知铃铛动画
.budge {
  transition: all 0.3s ease;
  cursor: pointer;
  padding: 8px;
  border-radius: 50%;
  position: relative;
  
  &:hover {
    background-color: rgba(64, 158, 255, 0.1);
    transform: scale(1.1);
    
    .bell-icon {
      animation: bellRing 0.5s ease-in-out;
      color: #409eff;
    }
  }
}

.bell-icon {
  transition: all 0.3s ease;
}

@keyframes bellRing {
  0%, 100% {
    transform: rotate(0deg);
  }
  10%, 30%, 50%, 70%, 90% {
    transform: rotate(-10deg);
  }
  20%, 40%, 60%, 80% {
    transform: rotate(10deg);
  }
}

// 徽章点动画
:deep(.el-badge__content.is-dot) {
  animation: pulse 2s ease-in-out infinite;
}

@keyframes pulse {
  0%, 100% {
    transform: scale(1);
    opacity: 1;
  }
  50% {
    transform: scale(1.3);
    opacity: 0.8;
  }
}

// 头像动画
.avatar-item {
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  cursor: pointer;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  
  &:hover {
    transform: scale(1.15) rotate(5deg);
    box-shadow: 0 8px 20px rgba(64, 158, 255, 0.4);
  }
  
  &:active {
    transform: scale(1.05);
  }
}

// 下拉菜单样式
.drop {
  .el-dropdown-link {
    display: flex;
    align-items: center;
    padding: 8px 16px;
    border-radius: 20px;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    font-weight: 500;
    color: #606266;
    position: relative;
    overflow: hidden;
    
    &::before {
      content: '';
      position: absolute;
      top: 0;
      left: -100%;
      width: 100%;
      height: 100%;
      background: linear-gradient(90deg, transparent, rgba(64, 158, 255, 0.1), transparent);
      transition: left 0.5s ease;
    }
    
    &:hover {
      background-color: rgba(64, 158, 255, 0.1);
      color: #409eff;
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(64, 158, 255, 0.2);
      
      &::before {
        left: 100%;
      }
      
      .el-icon {
        transform: rotate(180deg);
      }
    }
    
    &:active {
      transform: translateY(0);
    }
  }
  
  .el-icon {
    transition: transform 0.3s ease;
    margin-left: 4px;
  }
}

// 下拉菜单项动画
:deep(.el-dropdown-menu) {
  animation: dropdownSlide 0.3s ease-out;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
  border-radius: 8px;
  overflow: hidden;
}

@keyframes dropdownSlide {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

:deep(.el-dropdown-menu__item) {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    left: 0;
    top: 0;
    height: 100%;
    width: 3px;
    background: #409eff;
    transform: scaleY(0);
    transition: transform 0.3s ease;
  }
  
  &:hover {
    background-color: rgba(64, 158, 255, 0.1);
    color: #409eff;
    padding-left: 24px;
    
    &::before {
      transform: scaleY(1);
    }
    
    .el-icon {
      transform: scale(1.2) rotate(10deg);
    }
  }
  
  .el-icon {
    transition: all 0.3s ease;
  }
}

// Header 背景效果
:deep(.el-header) {
  backdrop-filter: url(#distort) blur(3px) saturate(200%);
  transition: all 0.3s ease;
}

// 响应式优化
@media (max-width: 768px) {
  .header {
    gap: 8px;
  }
  
  .el-dropdown-link {
    font-size: 14px;
    padding: 6px 12px;
  }
}
</style>
