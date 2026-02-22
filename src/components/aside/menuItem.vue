<script lang="ts">
import {defineComponent, type PropType} from 'vue';
import type {menuType} from "@/types/user";
import {useUserStore} from "@/store/user.ts";
import {useTabStore} from "@/store/tab.ts";


export default defineComponent({

  name: "myMenu",
  props: {
    item: {
      type: Object as PropType<menuType>,
      required: true

    }
  },
  setup() {
    const userStore = useUserStore();
    // 将 userStore 暴露给模板使用
    const tabStore = useTabStore()
    const add = (name: string,url: string, icon: string) =>{
      tabStore.addTab(name,url,icon)
      //改变标签
      tabStore.setTabActive(name,url)

    }

    return {userStore, tabStore,add};
  }


})

</script>


<template>
  <!--  采用递归的方式动态渲染菜单列表-->
  <el-sub-menu v-if="item.children" :index="item.url">
    <template #title>
      <el-icon>
        <!--   component动态渲染标签元素，is属性     /-->
        <component :is="item.icon"></component>

      </el-icon>
      <span>{{ item.name }}</span>
    </template>
    <my-menu v-for="children in item.children" :key="children.name" :item="children"></my-menu>
  </el-sub-menu>

  <el-menu-item v-else :index="item.url" @click="add(item.name,item.url,item.icon)">
    <el-icon>
      <component :is="item.icon"></component>
    </el-icon>
    <span>{{ item.name }}</span>
  </el-menu-item>

</template>

<style scoped lang="less">

</style>
