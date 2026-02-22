<script setup lang="ts">
import MapContainer from "@/components/main/map/MapContainer.vue";
import {getMapList} from "@/api/userInfo.ts";
import {onMounted, reactive} from "vue";

onMounted(async () => {
  const res = await getMapList();
  console.log(res)
})

const form = reactive({
  name: "",
  region: "",
  location1: "",
  location2: "",
  now: "",
  remarks: ""
})
</script>

<template>
  <div class="map-page">
    <el-row :gutter="24" class="main-row">
      <!-- 左侧区域 -->
      <el-col :xs="24" :lg="8" class="left-col">
        <!-- 数据统计卡片 -->
        <el-card class="stats-card h-3/12">
          <div class="stats-header">
            <div class="stats-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M3 3v18h18"/>
                <path d="M18.7 8l-5.1 5.2-2.8-2.7L7 14.3"/>
              </svg>
            </div>
            <h2 class="stats-title">数据概览</h2>
          </div>

          <div class="stats-list">
            <div class="stat-item" v-for="(item, index) in [
              { label: '累计充电站数量', value: '34个', icon: 'station' },
              { label: '单省份最多充电桩', value: '北京(4个)', icon: 'province' },
              { label: '充电站遍及省份', value: '14个', icon: 'map' },
              { label: '暂无充电站省份', value: '22个', icon: 'empty' },
              { label: '累计充电站', value: '北京(4个)', icon: 'total' },
              { label: '单日营收最高', value: '北京西单充电站', icon: 'high' },
              { label: '单日营收最低', value: '南宁青秀山充电站', icon: 'low' },
              { label: '故障率最高', value: '兰州黄河桥充电站', icon: 'warning' }
            ]" :key="index" :style="{ animationDelay: `${index * 0.06}s` }">
              <div class="stat-icon" :class="`icon-${item.icon}`">
                <svg v-if="item.icon === 'station'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <rect x="4" y="4" width="16" height="16" rx="2"/>
                  <path d="M9 9h6v6H9z"/>
                  <path d="M9 1v3M15 1v3M9 20v3M15 20v3M20 9h3M20 15h3M1 9h3M1 15h3"/>
                </svg>
                <svg v-else-if="item.icon === 'province'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M12 2L2 7l10 5 10-5-10-5z"/>
                  <path d="M2 17l10 5 10-5"/>
                  <path d="M2 12l10 5 10-5"/>
                </svg>
                <svg v-else-if="item.icon === 'map'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6"/>
                  <line x1="8" y1="2" x2="8" y2="18"/>
                  <line x1="16" y1="6" x2="16" y2="22"/>
                </svg>
                <svg v-else-if="item.icon === 'empty'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <circle cx="12" cy="12" r="10"/>
                  <line x1="8" y1="12" x2="16" y2="12"/>
                </svg>
                <svg v-else-if="item.icon === 'total'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
                </svg>
                <svg v-else-if="item.icon === 'high'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/>
                  <polyline points="17 6 23 6 23 12"/>
                </svg>
                <svg v-else-if="item.icon === 'low'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <polyline points="23 18 13.5 8.5 8.5 13.5 1 6"/>
                  <polyline points="17 18 23 18 23 12"/>
                </svg>
                <svg v-else-if="item.icon === 'warning'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
                  <line x1="12" y1="9" x2="12" y2="13"/>
                  <line x1="12" y1="17" x2="12.01" y2="17"/>
                </svg>
              </div>
              <div class="stat-content">
                <span class="stat-label">{{ item.label }}</span>
                <span class="stat-value">{{ item.value }}</span>
              </div>
            </div>
          </div>
        </el-card>

        <!-- 新增站点表单 -->
        <el-card class="form-card">
          <template #header>
            <div class="form-header">
              <div class="form-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <circle cx="12" cy="12" r="10"/>
                  <line x1="12" y1="8" x2="12" y2="16"/>
                  <line x1="8" y1="12" x2="16" y2="12"/>
                </svg>
              </div>
              <h2>新增站点</h2>
            </div>
          </template>

          <el-form :model="form" class="site-form" label-width="90px">
            <el-form-item label="站点名称">
              <div class="input-wrapper">
                <el-input
                    placeholder="请输入站点名称"
                    v-model="form.name"
                    class="custom-input">
                  <template #prefix>
                    <svg class="input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                      <circle cx="12" cy="7" r="4"/>
                    </svg>
                  </template>
                </el-input>
              </div>
            </el-form-item>

            <el-form-item label="站点地址">
              <div class="input-wrapper">
                <el-input
                    placeholder="请输入站点地址"
                    v-model="form.region"
                    class="custom-input">
                  <template #prefix>
                    <svg class="input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                      <circle cx="12" cy="10" r="3"/>
                    </svg>
                  </template>
                </el-input>
              </div>
            </el-form-item>

            <el-form-item label="经度">
              <div class="input-wrapper">
                <el-input
                    placeholder="请输入经度"
                    v-model="form.location1"
                    class="custom-input">
                  <template #prefix>
                    <svg class="input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <circle cx="12" cy="12" r="10"/>
                      <path d="M2 12h20"/>
                      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
                    </svg>
                  </template>
                </el-input>
              </div>
            </el-form-item>

            <el-form-item label="纬度">
              <div class="input-wrapper">
                <el-input
                    placeholder="请输入纬度"
                    v-model="form.location2"
                    class="custom-input">
                  <template #prefix>
                    <svg class="input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <circle cx="12" cy="12" r="10"/>
                      <path d="M12 2v20"/>
                      <path d="M2 12h20"/>
                      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
                    </svg>
                  </template>
                </el-input>
              </div>
            </el-form-item>

            <el-form-item label="立即使用">
              <div class="switch-wrapper">
                <el-switch
                    v-model="form.now"
                    class="custom-switch"
                    active-text="启用"
                    inactive-text="停用"/>
              </div>
            </el-form-item>

            <el-form-item label="备注">
              <div class="input-wrapper">
                <el-input
                    placeholder="请输入备注"
                    type="textarea"
                    v-model="form.remarks"
                    :rows="3"
                    class="custom-textarea"/>
              </div>
            </el-form-item>

            <el-form-item class="form-actions">
              <el-button type="primary" class="btn-primary">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
                创建
              </el-button>
              <el-button class="btn-default">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                </svg>
                清空
              </el-button>
            </el-form-item>
          </el-form>
        </el-card>
      </el-col>

      <!-- 右侧地图区域 -->
      <el-col :xs="24" :lg="16" class="right-col">
        <el-card class="map-card">
          <div class="map-header">
            <div class="map-title">
              <div class="map-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6"/>
                  <line x1="8" y1="2" x2="8" y2="18"/>
                  <line x1="16" y1="6" x2="16" y2="22"/>
                </svg>
              </div>
              <h2>站点分布地图</h2>
            </div>
            <div class="map-badge">
              <span class="badge-dot"></span>
              实时数据
            </div>
          </div>
          <div class="map-container-wrapper">
            <MapContainer></MapContainer>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<style scoped lang="less">
// 变量定义
@primary-color: #3b82f6;
@success-color: #10b981;
@warning-color: #f59e0b;
@danger-color: #ef4444;
@purple-color: #8b5cf6;

// 动画
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(15px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes slideInLeft {
  from {
    opacity: 0;
    transform: translateX(-20px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

@keyframes slideInRight {
  from {
    opacity: 0;
    transform: translateX(20px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

@keyframes pulse {
  0%, 100% {
    opacity: 1;
    box-shadow: 0 0 0 0 rgba(59, 130, 246, 0.4);
  }
  50% {
    opacity: 0.8;
    box-shadow: 0 0 0 8px rgba(59, 130, 246, 0);
  }
}

// 页面容器
.map-page {
  padding: 8px;
  background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
  min-height: 100vh;
}

.main-row {
  margin: 0 !important;
}

// 卡片基础样式
:deep(.el-card) {
  border-radius: 20px;
  border: none;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05), 0 4px 12px rgba(0, 0, 0, 0.03);
  transition: all 0.35s cubic-bezier(0.4, 0, 0.2, 1);
  overflow: hidden;

  &:hover {
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.06), 0 16px 32px rgba(0, 0, 0, 0.04);
  }

  .el-card__header {
    border-bottom: 1px solid #f3f4f6;
    padding: 18px 24px;
    background: linear-gradient(180deg, #fafbfc 0%, #ffffff 100%);
  }

  .el-card__body {
    padding: 24px;
  }
}

// 左侧列
.left-col {
  animation: slideInLeft 0.5s ease forwards;

  > * + * {
    margin-top: 20px;
  }
}

// 数据统计卡片
.stats-card {
  background: linear-gradient(135deg, #ffffff 0%, #fafbfc 100%);

  .stats-header {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 20px;

    .stats-icon {
      width: 44px;
      height: 44px;
      border-radius: 14px;
      background: linear-gradient(135deg, @primary-color 0%, #60a5fa 100%);
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 4px 12px rgba(59, 130, 246, 0.25);

      svg {
        width: 22px;
        height: 22px;
        stroke: white;
      }
    }

    .stats-title {
      font-size: 18px;
      font-weight: 600;
      color: #1f2937;
      margin: 0;
    }
  }

  .stats-list {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }

  .stat-item {
    display: flex;
    align-items: center;
    gap: 14px;
    padding: 12px 14px;
    border-radius: 12px;
    background: #f9fafb;
    transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
    animation: fadeInUp 0.4s ease forwards;
    opacity: 0;

    &:hover {
      background: #f3f4f6;
      transform: translateX(4px);
    }

    .stat-icon {
      width: 36px;
      height: 36px;
      border-radius: 10px;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
      transition: all 0.3s ease;

      svg {
        width: 18px;
        height: 18px;
        stroke: white;
      }

      &.icon-station {
        background: linear-gradient(135deg, @primary-color 0%, #60a5fa 100%);
      }
      &.icon-province {
        background: linear-gradient(135deg, @success-color 0%, #34d399 100%);
      }
      &.icon-map {
        background: linear-gradient(135deg, @purple-color 0%, #a78bfa 100%);
      }
      &.icon-empty {
        background: linear-gradient(135deg, #9ca3af 0%, #d1d5db 100%);
      }
      &.icon-total {
        background: linear-gradient(135deg, #f59e0b 0%, #fbbf24 100%);
      }
      &.icon-high {
        background: linear-gradient(135deg, #10b981 0%, #34d399 100%);
      }
      &.icon-low {
        background: linear-gradient(135deg, #6366f1 0%, #818cf8 100%);
      }
      &.icon-warning {
        background: linear-gradient(135deg, @danger-color 0%, #f87171 100%);
      }
    }

    .stat-content {
      flex: 1;
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 10px;

      .stat-label {
        font-size: 13px;
        color: #6b7280;
        font-weight: 500;
      }

      .stat-value {
        font-size: 13px;
        font-weight: 600;
        color: @primary-color;
        background: rgba(59, 130, 246, 0.08);
        padding: 4px 10px;
        border-radius: 20px;
        transition: all 0.2s ease;

        &:hover {
          background: rgba(59, 130, 246, 0.15);
          transform: scale(1.02);
        }
      }
    }
  }
}

// 表单卡片
.form-card {
  background: linear-gradient(135deg, #ffffff 0%, #fafbfc 100%);
  animation: fadeInUp 0.5s ease 0.2s forwards;
  opacity: 0;

  .form-header {
    display: flex;
    align-items: center;
    gap: 12px;

    .form-icon {
      width: 36px;
      height: 36px;
      border-radius: 10px;
      background: linear-gradient(135deg, @success-color 0%, #34d399 100%);
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 4px 10px rgba(16, 185, 129, 0.25);

      svg {
        width: 18px;
        height: 18px;
        stroke: white;
      }
    }

    h2 {
      font-size: 16px;
      font-weight: 600;
      color: #1f2937;
      margin: 0;
    }
  }

  .site-form {
    :deep(.el-form-item) {
      margin-bottom: 18px;

      &:last-child {
        margin-bottom: 0;
      }

      .el-form-item__label {
        font-size: 13px;
        font-weight: 500;
        color: #4b5563;
        padding-right: 12px;
      }
    }

    .input-wrapper {
      width: 100%;
    }

    .custom-input {
      :deep(.el-input__wrapper) {
        border-radius: 12px;
        box-shadow: 0 0 0 1px #e5e7eb inset;
        padding: 0 4px 0 12px;
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);

        &:hover {
          box-shadow: 0 0 0 1px #d1d5db inset;
        }

        &.is-focus {
          box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.2) inset, 0 0 0 1px @primary-color inset;
        }

        .el-input__inner {
          height: 42px;
          font-size: 13px;
        }

        .el-input__prefix {
          margin-right: 8px;
        }
      }

      .input-icon {
        width: 18px;
        height: 18px;
        stroke: #9ca3af;
        transition: all 0.3s ease;
      }

      &:hover .input-icon,
      :deep(.el-input__wrapper.is-focus) .input-icon {
        stroke: @primary-color;
      }
    }

    .custom-textarea {
      :deep(.el-textarea__inner) {
        border-radius: 12px;
        padding: 12px 16px;
        font-size: 13px;
        border-color: #e5e7eb;
        transition: all 0.3s ease;

        &:hover {
          border-color: #d1d5db;
        }

        &:focus {
          border-color: @primary-color;
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
        }
      }
    }

    .switch-wrapper {
      display: flex;
      align-items: center;
      height: 42px;

      .custom-switch {
        :deep(.el-switch__core) {
          border-radius: 20px;

          .el-switch__action {
            border-radius: 50%;
          }
        }

        :deep(.el-switch__label) {
          font-size: 12px;
          font-weight: 500;
        }
      }
    }

    .form-actions {
      margin-top: 24px;
      padding-top: 20px;
      border-top: 1px solid #f3f4f6;

      :deep(.el-form-item__content) {
        gap: 12px;
      }

      .btn-primary,
      .btn-default {
        display: flex;
        align-items: center;
        gap: 6px;
        padding: 10px 24px;
        border-radius: 10px;
        font-size: 13px;
        font-weight: 600;
        transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);

        svg {
          width: 16px;
          height: 16px;
        }

        &:hover {
          transform: translateY(-2px);
        }

        &:active {
          transform: translateY(0);
        }
      }

      .btn-primary {
        background: linear-gradient(135deg, @primary-color 0%, #60a5fa 100%);
        border: none;
        box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);

        &:hover {
          background: linear-gradient(135deg, #2563eb 0%, #3b82f6 100%);
          box-shadow: 0 6px 16px rgba(59, 130, 246, 0.4);
        }
      }

      .btn-default {
        border-color: #e5e7eb;
        color: #6b7280;
        background: #ffffff;

        &:hover {
          border-color: #d1d5db;
          background: #f9fafb;
          color: #374151;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
        }
      }
    }
  }
}

// 右侧列
.right-col {
  animation: slideInRight 0.5s ease 0.1s forwards;
  opacity: 0;
}

// 地图卡片
.map-card {
  height: 100%;
  background: linear-gradient(135deg, #ffffff 0%, #fafbfc 100%);
  display: flex;
  flex-direction: column;

  :deep(.el-card__body) {
    flex: 1;
    display: flex;
    flex-direction: column;
    padding: 0;
  }

  .map-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 18px 24px;
    border-bottom: 1px solid #f3f4f6;
    background: linear-gradient(180deg, #fafbfc 0%, #ffffff 100%);

    .map-title {
      display: flex;
      align-items: center;
      gap: 12px;

      .map-icon {
        width: 40px;
        height: 40px;
        border-radius: 12px;
        background: linear-gradient(135deg, @purple-color 0%, #a78bfa 100%);
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: 0 4px 12px rgba(139, 92, 246, 0.25);

        svg {
          width: 20px;
          height: 20px;
          stroke: white;
        }
      }

      h2 {
        font-size: 16px;
        font-weight: 600;
        color: #1f2937;
        margin: 0;
      }
    }

    .map-badge {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 12px;
      font-weight: 500;
      color: @success-color;
      background: rgba(16, 185, 129, 0.1);
      padding: 6px 12px;
      border-radius: 20px;

      .badge-dot {
        width: 8px;
        height: 8px;
        border-radius: 50%;
        background: @success-color;
        animation: pulse 2s infinite;
      }
    }
  }

  .map-container-wrapper {
    flex: 1;
    min-height: 500px;
    padding: 20px;

    > * {
      width: 100%;
      height: 100%;
      border-radius: 16px;
      overflow: hidden;
    }
  }
}

// 响应式
@media (max-width: 992px) {
  .left-col {
    margin-bottom: 20px;
  }

  .map-card {
    .map-container-wrapper {
      min-height: 400px;
    }
  }
}

@media (max-width: 768px) {
  .map-page {
    padding: 12px;
  }

  :deep(.el-card .el-card__body) {
    padding: 16px;
  }

  .stats-card {
    .stat-item {
      padding: 10px 12px;

      .stat-content {
        flex-direction: column;
        align-items: flex-start;
        gap: 4px;
      }
    }
  }

  .site-form {
    :deep(.el-form-item__label) {
      float: none;
      display: block;
      text-align: left;
      margin-bottom: 6px;
    }

    :deep(.el-form-item__content) {
      margin-left: 0 !important;
    }
  }

  .map-card {
    .map-header {
      flex-direction: column;
      gap: 12px;
      align-items: flex-start;
    }

    .map-container-wrapper {
      min-height: 300px;
      padding: 12px;
    }
  }
}
</style>
