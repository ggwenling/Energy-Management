<template>
  <div class="sidebar">
    <div class="logo">
      <img :src="logo" alt="logo">
      <span>动力港</span>
    </div>
    <el-menu
        :router="true"
        :default-active="activeMenu"
        class="menu"
    >
      <MenuItem
          v-for="item in menu"
          :key="item.name"
          :item="item"
      />
    </el-menu>
  </div>
</template>

<script setup lang="ts">
import MenuItem from '@/components/aside/menuItem.vue'
import { useUserStore } from "@/store/user.ts"
import logo from "@/assets/logo.png"
import {computed} from "vue";
import { useRoute} from "vue-router";
const route = useRoute();
const userStore = useUserStore()
const menu = userStore.menulist


//常用的
const activeMenu = computed(() => {
  const path = route.path

  // 如果是详情页，固定返回父级路径
  if (path.startsWith('/operations/detail')) {
    return '/operations/detail'
  }

  // 其他路由正常匹配
  return path
})
</script>

<style scoped lang="less">
.sidebar {
  height: 100vh;
  background: rgba(255, 255, 255, 0.85);
  backdrop-filter: blur(20px);

}

.logo {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  padding: 24px 0;

  img {
    width: 35px;
    height: 35px;
  }

  span {
    font-size: 20px;
    font-weight: 600;
    color: #1d1d1f;
  }
}

.menu {
  background: transparent;
  border: none;
  padding: 0 12px;
}

:deep(.el-menu-item),
:deep(.el-sub-menu__title) {
  height: 44px;
  line-height: 44px;
  margin: 4px 0;
  border-radius: 10px;
  color: #333;
  transition: all 0.25s ease;

  &:hover {
    background: rgba(0, 122, 255, 0.08);
    color: #007AFF;
  }

  .el-icon {
    margin-right: 10px;
    transition: transform 0.25s ease;
  }
}

:deep(.el-menu-item.is-active) {
  background: rgba(0, 122, 255, 0.12);
  color: #007AFF;
  font-weight: 500;

  &::before {
    content: '';
    position: absolute;
    left: 0;
    top: 50%;
    transform: translateY(-50%);
    width: 3px;
    height: 18px;
    background: #007AFF;
    border-radius: 0 2px 2px 0;
  }
}

:deep(.el-sub-menu.is-opened) {
  .el-sub-menu__title {
    color: #007AFF;
  }

  .el-sub-menu__icon-arrow {
    transform: rotate(180deg);
  }
}

:deep(.el-sub-menu .el-menu) {
  background: transparent;
  padding-left: 16px;

  .el-menu-item {
    height: 38px;
    line-height: 38px;
    font-size: 13px;
    color: #666;

    &:hover,
    &.is-active {
      color: #007AFF;
    }
  }
}

:deep(.el-menu-item:hover .el-icon),
:deep(.el-sub-menu__title:hover .el-icon) {
  transform: scale(1.1);
}
</style>
