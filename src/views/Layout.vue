<script setup lang="ts">
import Menu from '@/components/aside/menu.vue'
import topNavBar from '@/components/topNavBar/topNavBar.vue'
import TabBar from '@/components/main/tabBar.vue'
</script>

<template>
  <div class="common-layout">
    <el-container>
      <el-aside width="200px">
        <Menu></Menu>
      </el-aside>
      <el-container>
        <el-header>
          <div class="header mt-3">
            <topNavBar></topNavBar>
          </div>

        </el-header>
        <el-main>
          <TabBar></TabBar>
<!--          //订单页面缓存功能-->
          <router-view v-slot="{Component}">
            <keep-alive>
              <component :is="Component" :Key="$route.name" v-if="$route.meta.keepAlive"></component>
            </keep-alive>
            <component :is="Component" :Key="$route.name" v-if="!$route.meta.keepAlive"></component>
          </router-view>
        </el-main>
      </el-container>
    </el-container>
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

.el-aside {
  height: 100vh;
  background: white;
  box-shadow: 10px 0 8px -2px rgba(0, 0, 0, 0.2);
  border-radius: 0 40px 40px 0 !important;
}

.el-main {
  height: 80vh;
  overflow: auto;
}

.el-header {

  background-color: rgba(255, 255, 255, 0.25);
  backdrop-filter: blur(6px);
  -webkit-backdrop-filter: blur(6px);
  border: 0.666667px solid rgba(255, 255, 255, 0.18);
  box-shadow: rgba(142, 142, 142, 0.19) 0px 6px 15px 0px;
  -webkit-box-shadow: rgba(142, 142, 142, 0.19) 0px 6px 15px 0px;
  border-radius: 12px;
  -webkit-border-radius: 12px;
  color: rgba(255, 255, 255, 0.75);

}

</style>
