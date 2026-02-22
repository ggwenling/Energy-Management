<template>
  <el-tabs
      v-model="store.tabActive.name"
      type="card"
      class="tab-bar custom-card"
      @tab-click="handleClick"
      @tab-remove="remove"
  >
    <el-tab-pane
        v-for="tab in store.tabData"
        :key="tab.name"
        :label="tab.name"
        :name="tab.name"
        closable
        :url="tab.url"
    >
      <template #label>
        <span class="tab-label">
          <component :is="tab.icon" class="tab-icon"></component>
          <span>{{ tab.name }}</span>
        </span>
      </template>
    </el-tab-pane>
  </el-tabs>
</template>

<script lang="ts" setup>
import { useTabStore } from '@/store/tab.ts'
import { storeToRefs } from "pinia"
import { useRouter } from "vue-router"

const router = useRouter()
const store = useTabStore()
const { tabData } = storeToRefs(store)

const handleClick = ({ index }: { index: number }) => {
  store.setTabActive(tabData.value[index]!.name, tabData.value[index]!.url)
  router.push(tabData.value[index]!.url)
}

const remove = (name: string) => {
  if (name === store.tabActive.name) {
    const activeIndex = tabData.value.findIndex(item => item.name === name)
    if (activeIndex === 0) {
      router.push('/')
      store.removeTab(name)
    } else {
      router.push(tabData.value[activeIndex - 1]!.url)
      store.setTabActive(tabData.value[activeIndex - 1]!.name, tabData.value[activeIndex - 1]!.url)
      store.removeTab(name)
    }
  } else {
    store.removeTab(name)
  }
}
</script>

<style scoped lang="less">
.tab-bar {
  background: rgba(255, 255, 255, 0.85);
  backdrop-filter: blur(20px);
  padding: 8px 12px 0;
  border-bottom: 1px solid rgba(0, 0, 0, 0.06);
}

:deep(.el-tabs__header) {
  margin: 0;
  border: none;
}

:deep(.el-tabs__nav) {
  border: none;
  gap: 6px;
}

:deep(.el-tabs__item) {
  height: 36px;
  line-height: 36px;
  padding: 0 14px;
  border: none;
  border-radius: 20px;
  color: #666;
  font-size: 13px;
  background: transparent;
  transition: all 0.25s ease;

  &:hover {
    color: #007AFF;
    background: rgba(0, 122, 255, 0.06);
  }

  &.is-active {
    color: #007AFF;
    background: rgba(0, 122, 255, 0.12);
    font-weight: 500;
  }
}

.tab-label {
  display: flex;
  align-items: center;
  gap: 6px;
}

.tab-icon {
  width: 14px;
  height: 14px;
  transition: transform 0.25s ease;
}

:deep(.el-tabs__item:hover .tab-icon) {
  transform: scale(1.1);
}

:deep(.el-tabs__nav-prev),
:deep(.el-tabs__nav-next) {
  color: #666;
  line-height: 36px;

  &:hover {
    color: #007AFF;
  }
}

:deep(.el-icon-close) {
  margin-left: 6px;
  width: 14px;
  height: 14px;
  line-height: 14px;
  border-radius: 50%;
  transition: all 0.2s ease;

  &:hover {
    background: rgba(0, 122, 255, 0.2);
    color: #007AFF;
  }
}

:deep(.el-tabs__item.is-active .el-icon-close:hover) {
  background: rgba(0, 122, 255, 0.3);
}
</style>
