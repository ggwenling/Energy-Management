<script setup lang="ts">
import free from '@/assets/free.png'
import {computed, onMounted, ref} from "vue";
import {getCurrentList} from "@/api/userInfo.ts";
import outline from "@/assets/outline.png";
import ing from "@/assets/ing.png"

// 获取充电桩数据
const currentList = ref<any>([])
const dataList = ref<any>([])
const searchName = ref<string>('北京西单充电站')
const radioVal = ref<number>(0)
const show = ref<boolean>(false)

const getStatus = (num: number) => {
  if (num == 1) {
    return '空闲中'
  }
  if (num == 2) {
    return '充电中'
  }
  if (num == 3) {
    return '连接中'
  }
  if (num == 4) {
    return '排队中'
  }
  if (num == 5) {
    return '已预约'
  }
  if (num == 6) {
    return '故障/离线'
  }
}

const loadList = async () => {
  show.value = true
  const {data} = await getCurrentList(searchName);
  show.value = false
  currentList.value = data.data
  dataList.value = data.data.filter((item: any) => item.name === searchName.value)[0]?.list || []
  console.log(dataList.value)
  console.log(checkStatus(2))
}

onMounted(() => {
  loadList()
})

// 查询功能
const selectVal = ref('')
const search = () => {
  searchName.value = selectVal.value
  loadList()
}

// 显示状态区域
const checkStatus = (num: number) => {
  return dataList.value.filter((item: any) => item.status === num).length
}

const total = computed(() => {
  return dataList.value.length
})
</script>

<template>
  <div class="charging-page">
    <!-- 站点选择卡片 -->
    <el-card class="search-card">
      <div class="search-wrapper">
        <div class="search-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/>
            <circle cx="12" cy="9" r="2.5"/>
          </svg>
        </div>
        <el-select
            class="site-select"
            placeholder="北京西单充电站"
            v-model="selectVal"
            @change="search"
            filterable>
          <el-option
              v-for="item in currentList"
              :key="item.id"
              :value="item.name"
              :label="item.name">
          </el-option>
        </el-select>
      </div>
    </el-card>

    <!-- 状态筛选卡片 -->
    <el-card class="filter-card">
      <el-radio-group size="large" v-model="radioVal" class="status-filter">
        <el-radio-button :label="`全部(${total})`" :value="0" class="status-btn"/>
        <el-radio-button :label="`空闲中(${checkStatus(1)})`" :value="1" class="status-btn status-free"/>
        <el-radio-button :label="`充电中(${checkStatus(2)})`" :value="2" class="status-btn status-charging"/>
        <el-radio-button :label="`连接中(${checkStatus(3)})`" :value="3" class="status-btn status-connecting"/>
        <el-radio-button :label="`排队中(${checkStatus(4)})`" :value="4" class="status-btn status-queue"/>
        <el-radio-button :label="`已预约(${checkStatus(5)})`" :value="5" class="status-btn status-reserved"/>
        <el-radio-button :label="`故障/离线(${checkStatus(6)})`" :value="6" class="status-btn status-offline"/>
      </el-radio-group>
    </el-card>

    <!-- 充电桩列表卡片 -->
    <el-card class="list-card">
      <el-row :gutter="24" v-loading="show" class="charging-grid">
        <el-col
            :xs="24"
            :sm="12"
            :md="8"
            :lg="6"
            v-for="(item, index) in dataList"
            :key="item.id"
            :style="{ animationDelay: `${index * 0.08}s` }">
          <div class="charging-card" :class="`status-${item.status}`">
            <!-- 状态指示条 -->
            <div class="status-bar"></div>

            <!-- 卡片头部 -->
            <div class="card-header">
              <div class="device-id">#{{ item.id }}</div>
              <div class="status-badge" :class="`badge-${item.status}`">
                <span class="status-dot"></span>
                {{ getStatus(item.status) }}
              </div>
            </div>

            <!-- 主内容区 -->
            <div class="card-body">
              <!-- 状态图标 -->
              <div class="icon-section">
                <div class="icon-wrapper" :class="`icon-bg-${item.status}`">
                  <img
                      :src="item.status == 1 ? free : (item.status == 6 ? outline : ing)"
                      alt="状态图标"
                      class="status-icon"/>
                </div>
                <div class="progress-ring" v-if="item.status === 2">
                  <svg viewBox="0 0 36 36" class="circular-chart">
                    <path class="circle-bg" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"/>
                    <path class="circle" stroke-dasharray="80, 100" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"/>
                  </svg>
                  <span class="progress-text">80%</span>
                </div>
              </div>

              <!-- 参数信息 -->
              <div class="params-section">
                <div class="param-item">
                  <span class="param-label">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/>
                    </svg>
                    电压
                  </span>
                  <span class="param-value">{{ item.voltage }}</span>
                </div>
                <div class="param-item">
                  <span class="param-label">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <circle cx="12" cy="12" r="10"/>
                      <path d="M12 6v6l4 2"/>
                    </svg>
                    电流
                  </span>
                  <span class="param-value">{{ item.current }}</span>
                </div>
                <div class="param-item">
                  <span class="param-label">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M18.36 6.64a9 9 0 1 1-12.73 0"/>
                      <path d="M12 2v10"/>
                    </svg>
                    功率
                  </span>
                  <span class="param-value">{{ item.power }}</span>
                </div>
                <div class="param-item">
                  <span class="param-label">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M14 14.76V3.5a2.5 2.5 0 0 0-5 0v11.26a4.5 4.5 0 1 0 5 0z"/>
                    </svg>
                    温度
                  </span>
                  <span class="param-value" :class="{ 'temp-high': parseFloat(item.tem) > 60 }">{{ item.tem }}</span>
                </div>
              </div>
            </div>

            <!-- 底部操作区 -->
            <div class="card-footer">
              <div class="warning-info">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                  <polyline points="22 4 12 14.01 9 11.01"/>
                </svg>
                <span>暂无预警</span>
              </div>
              <div class="action-buttons">
                <el-button size="small" class="btn-record">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                    <polyline points="14 2 14 8 20 8"/>
                    <line x1="16" y1="13" x2="8" y2="13"/>
                    <line x1="16" y1="17" x2="8" y2="17"/>
                    <polyline points="10 9 9 9 8 9"/>
                  </svg>
                  维保记录
                </el-button>

                <el-popover placement="right" :width="320" trigger="click" popper-class="timeline-popover">
                  <template #reference>
                    <el-button size="small" type="primary" class="btn-history">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <circle cx="12" cy="12" r="10"/>
                        <polyline points="12 6 12 12 16 14"/>
                      </svg>
                      使用记录
                    </el-button>
                  </template>
                  <div class="popover-header">
                    <h3>使用记录</h3>
                  </div>
                  <el-timeline class="custom-timeline">
                    <el-timeline-item timestamp="12:08:17" class="timeline-item">
                      <div class="timeline-content">
                        <span class="timeline-value">充电80度,</span>
                        <span class="timeline-cost">花费¥80</span>
                      </div>
                    </el-timeline-item>
                    <el-timeline-item class="timeline-item">
                      <div class="timeline-content">
                        <span class="timeline-value">充电50度,</span>
                        <span class="timeline-cost">花费¥50</span>
                      </div>
                    </el-timeline-item>
                    <el-timeline-item timestamp="13:15:22" class="timeline-item">
                      <div class="timeline-content">
                        <span class="timeline-value">充电60度,</span>
                        <span class="timeline-cost">花费¥60</span>
                      </div>
                    </el-timeline-item>
                    <el-timeline-item timestamp="16:22:33" class="timeline-item">
                      <div class="timeline-content">
                        <span class="timeline-value">充电70度,</span>
                        <span class="timeline-cost">花费¥70</span>
                      </div>
                    </el-timeline-item>
                    <el-timeline-item timestamp="17:27:17" class="timeline-item">
                      <div class="timeline-content">
                        <span class="timeline-value">充电100度,</span>
                        <span class="timeline-cost">花费¥100</span>
                      </div>
                    </el-timeline-item>
                    <el-timeline-item timestamp="18:08:33" class="timeline-item">
                      <div class="timeline-content">
                        <span class="timeline-value">充电80度,</span>
                        <span class="timeline-cost">花费¥80</span>
                      </div>
                    </el-timeline-item>
                  </el-timeline>
                </el-popover>
              </div>
            </div>
          </div>
        </el-col>
      </el-row>

      <!-- 空状态 -->
      <div v-if="!show && dataList.length === 0" class="empty-state">
        <div class="empty-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
            <rect x="2" y="7" width="20" height="14" rx="2" ry="2"/>
            <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>
          </svg>
        </div>
        <p>暂无充电桩数据</p>
      </div>
    </el-card>
  </div>
</template>

<style scoped lang="less">
// 变量定义
@primary-color: #3b82f6;
@success-color: #10b981;
@warning-color: #f59e0b;
@danger-color: #ef4444;
@info-color: #6b7280;
@purple-color: #8b5cf6;

// 状态颜色
@status-free: #10b981;
@status-charging: #3b82f6;
@status-connecting: #8b5cf6;
@status-queue: #f59e0b;
@status-reserved: #ec4899;
@status-offline: #6b7280;

// 动画
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}

@keyframes shimmer {
  0% {
    background-position: -200% 0;
  }
  100% {
    background-position: 200% 0;
  }
}

@keyframes float {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-5px);
  }
}

// 页面容器
.charging-page {
  padding: 8px;
  background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
  min-height: 100vh;
}

// 卡片基础样式
:deep(.el-card) {
  border-radius: 16px;
  border: none;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05), 0 4px 12px rgba(0, 0, 0, 0.03);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);

  &:hover {
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05), 0 10px 20px rgba(0, 0, 0, 0.04);
  }

  .el-card__body {
    padding: 20px;
  }
}

// 搜索卡片
.search-card {
  margin-bottom: 20px;
  background: linear-gradient(135deg, #ffffff 0%, #fafbfc 100%);

  .search-wrapper {
    display: flex;
    align-items: center;
    gap: 12px;
  }

  .search-icon {
    width: 40px;
    height: 40px;
    border-radius: 12px;
    background: linear-gradient(135deg, @primary-color 0%, #60a5fa 100%);
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;

    svg {
      width: 20px;
      height: 20px;
      stroke: white;
    }
  }

  .site-select {
    flex: 1;
    max-width: 400px;

    :deep(.el-input__wrapper) {
      border-radius: 12px;
      box-shadow: 0 0 0 1px #e5e7eb inset;
      transition: all 0.3s ease;

      &:hover, &.is-focus {
        box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.2) inset;
      }
    }
  }
}

// 筛选卡片
.filter-card {
  margin-bottom: 20px;
  background: linear-gradient(135deg, #ffffff 0%, #fafbfc 100%);

  .status-filter {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;

    :deep(.el-radio-button__inner) {
      border-radius: 10px !important;
      border: 1px solid #e5e7eb;
      background: #ffffff;
      color: #374151;
      font-size: 13px;
      font-weight: 500;
      padding: 10px 18px;
      transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);

      &:hover {
        background: #f9fafb;
        transform: translateY(-1px);
      }
    }

    :deep(.el-radio-button.is-active .el-radio-button__inner) {
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
      transform: translateY(-1px);
    }

    // 各状态激活样式
    :deep(.status-free.is-active .el-radio-button__inner) {
      background: linear-gradient(135deg, @status-free 0%, #34d399 100%);
      border-color: @status-free;
      color: white;
      box-shadow: 0 4px 14px rgba(16, 185, 129, 0.35);
    }

    :deep(.status-charging.is-active .el-radio-button__inner) {
      background: linear-gradient(135deg, @status-charging 0%, #60a5fa 100%);
      border-color: @status-charging;
      color: white;
      box-shadow: 0 4px 14px rgba(59, 130, 246, 0.35);
    }

    :deep(.status-connecting.is-active .el-radio-button__inner) {
      background: linear-gradient(135deg, @status-connecting 0%, #a78bfa 100%);
      border-color: @status-connecting;
      color: white;
      box-shadow: 0 4px 14px rgba(139, 92, 246, 0.35);
    }

    :deep(.status-queue.is-active .el-radio-button__inner) {
      background: linear-gradient(135deg, @status-queue 0%, #fbbf24 100%);
      border-color: @status-queue;
      color: white;
      box-shadow: 0 4px 14px rgba(245, 158, 11, 0.35);
    }

    :deep(.status-reserved.is-active .el-radio-button__inner) {
      background: linear-gradient(135deg, @status-reserved 0%, #f472b6 100%);
      border-color: @status-reserved;
      color: white;
      box-shadow: 0 4px 14px rgba(236, 72, 153, 0.35);
    }

    :deep(.status-offline.is-active .el-radio-button__inner) {
      background: linear-gradient(135deg, @status-offline 0%, #9ca3af 100%);
      border-color: @status-offline;
      color: white;
      box-shadow: 0 4px 14px rgba(107, 114, 128, 0.35);
    }
  }
}

// 列表卡片
.list-card {
  background: linear-gradient(135deg, #ffffff 0%, #fafbfc 100%);

  :deep(.el-loading-mask) {
    border-radius: 16px;
    background: rgba(255, 255, 255, 0.8);
    backdrop-filter: blur(4px);
  }
}

// 充电桩网格
.charging-grid {
  .el-col {
    animation: fadeInUp 0.5s ease forwards;
    opacity: 0;
  }
}

// 充电桩卡片
.charging-card {
  background: #ffffff;
  border-radius: 16px;
  border: 1px solid #f3f4f6;
  overflow: hidden;
  margin-bottom: 24px;
  transition: all 0.35s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 12px 24px rgba(0, 0, 0, 0.08), 0 4px 8px rgba(0, 0, 0, 0.04);
    border-color: transparent;
  }

  // 状态指示条
  .status-bar {
    height: 4px;
    width: 100%;
    transition: all 0.3s ease;
  }

  &.status-1 .status-bar { background: linear-gradient(90deg, @status-free, #34d399); }
  &.status-2 .status-bar { background: linear-gradient(90deg, @status-charging, #60a5fa); }
  &.status-3 .status-bar { background: linear-gradient(90deg, @status-connecting, #a78bfa); }
  &.status-4 .status-bar { background: linear-gradient(90deg, @status-queue, #fbbf24); }
  &.status-5 .status-bar { background: linear-gradient(90deg, @status-reserved, #f472b6); }
  &.status-6 .status-bar { background: linear-gradient(90deg, @status-offline, #9ca3af); }

  // 卡片头部
  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 14px 16px 10px;

    .device-id {
      font-size: 12px;
      font-weight: 600;
      color: #9ca3af;
      letter-spacing: 0.5px;
    }

    .status-badge {
      display: flex;
      align-items: center;
      gap: 6px;
      font-size: 12px;
      font-weight: 600;
      padding: 5px 10px;
      border-radius: 20px;
      background: #f3f4f6;
      color: #6b7280;
      transition: all 0.3s ease;

      .status-dot {
        width: 6px;
        height: 6px;
        border-radius: 50%;
        background: currentColor;
        animation: pulse 2s infinite;
      }

      &.badge-1 { background: rgba(16, 185, 129, 0.12); color: @status-free; }
      &.badge-2 { background: rgba(59, 130, 246, 0.12); color: @status-charging; }
      &.badge-3 { background: rgba(139, 92, 246, 0.12); color: @status-connecting; }
      &.badge-4 { background: rgba(245, 158, 11, 0.12); color: @status-queue; }
      &.badge-5 { background: rgba(236, 72, 153, 0.12); color: @status-reserved; }
      &.badge-6 { background: rgba(107, 114, 128, 0.12); color: @status-offline; }
    }
  }

  // 卡片主体
  .card-body {
    display: flex;
    padding: 0 16px 16px;
    gap: 16px;

    .icon-section {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 10px;

      .icon-wrapper {
        width: 72px;
        height: 72px;
        border-radius: 16px;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: all 0.3s ease;

        &.icon-bg-1 { background: linear-gradient(135deg, rgba(16, 185, 129, 0.15) 0%, rgba(52, 211, 153, 0.1) 100%); }
        &.icon-bg-2 { background: linear-gradient(135deg, rgba(59, 130, 246, 0.15) 0%, rgba(96, 165, 250, 0.1) 100%); }
        &.icon-bg-3 { background: linear-gradient(135deg, rgba(139, 92, 246, 0.15) 0%, rgba(167, 139, 250, 0.1) 100%); }
        &.icon-bg-4 { background: linear-gradient(135deg, rgba(245, 158, 11, 0.15) 0%, rgba(251, 191, 36, 0.1) 100%); }
        &.icon-bg-5 { background: linear-gradient(135deg, rgba(236, 72, 153, 0.15) 0%, rgba(244, 114, 182, 0.1) 100%); }
        &.icon-bg-6 { background: linear-gradient(135deg, rgba(107, 114, 128, 0.15) 0%, rgba(156, 163, 175, 0.1) 100%); }

        &:hover {
          transform: scale(1.05);
        }

        .status-icon {
          width: 44px;
          height: 44px;
          object-fit: contain;
        }
      }

      // 进度环
      .progress-ring {
        position: relative;
        width: 50px;
        height: 50px;

        .circular-chart {
          width: 100%;
          height: 100%;

          .circle-bg {
            fill: none;
            stroke: #e5e7eb;
            stroke-width: 3;
          }

          .circle {
            fill: none;
            stroke: @status-charging;
            stroke-width: 3;
            stroke-linecap: round;
            animation: progress 1s ease-out forwards;
          }
        }

        .progress-text {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          font-size: 11px;
          font-weight: 700;
          color: @status-charging;
        }
      }
    }

    // 参数区域
    .params-section {
      flex: 1;
      display: flex;
      flex-direction: column;
      gap: 8px;

      .param-item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 6px 10px;
        background: #f9fafb;
        border-radius: 8px;
        transition: all 0.2s ease;

        &:hover {
          background: #f3f4f6;
        }

        .param-label {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 12px;
          color: #6b7280;

          svg {
            width: 14px;
            height: 14px;
            stroke: #9ca3af;
          }
        }

        .param-value {
          font-size: 12px;
          font-weight: 600;
          color: #374151;

          &.temp-high {
            color: @danger-color;
          }
        }
      }
    }
  }

  // 卡片底部
  .card-footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 12px 16px;
    border-top: 1px solid #f3f4f6;
    background: linear-gradient(180deg, #fafbfc 0%, #ffffff 100%);

    .warning-info {
      display: flex;
      align-items: center;
      gap: 6px;
      font-size: 12px;
      color: @success-color;
      font-weight: 500;

      svg {
        width: 16px;
        height: 16px;
        stroke: @success-color;
      }
    }

    .action-buttons {
      display: flex;
      gap: 8px;

      .btn-record,
      .btn-history {
        display: flex;
        align-items: center;
        gap: 5px;
        border-radius: 8px;
        font-size: 12px;
        font-weight: 500;
        transition: all 0.25s ease;

        svg {
          width: 14px;
          height: 14px;
        }

        &:hover {
          transform: translateY(-1px);
        }
      }

      .btn-record {
        border-color: #e5e7eb;
        color: #6b7280;
        background: #ffffff;

        &:hover {
          border-color: #d1d5db;
          background: #f9fafb;
          color: #374151;
        }
      }

      .btn-history {
        background: linear-gradient(135deg, @primary-color 0%, #60a5fa 100%);
        border: none;
        box-shadow: 0 2px 8px rgba(59, 130, 246, 0.25);

        &:hover {
          background: linear-gradient(135deg, #2563eb 0%, #3b82f6 100%);
          box-shadow: 0 4px 12px rgba(59, 130, 246, 0.35);
        }
      }
    }
  }
}

// 空状态
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
  color: #9ca3af;

  .empty-icon {
    width: 80px;
    height: 80px;
    margin-bottom: 16px;
    opacity: 0.5;

    svg {
      width: 100%;
      height: 100%;
    }
  }

  p {
    font-size: 14px;
  }
}

// 时间线弹窗样式
:deep(.timeline-popover) {
  border-radius: 16px;
  padding: 0;
  overflow: hidden;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);

  .popover-header {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 16px 20px;
    background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
    border-bottom: 1px solid #e5e7eb;

    .popover-icon {
      width: 32px;
      height: 32px;
      border-radius: 10px;
      background: linear-gradient(135deg, @primary-color 0%, #60a5fa 100%);
      display: flex;
      align-items: center;
      justify-content: center;

      svg {
        width: 16px;
        height: 16px;
        stroke: white;
      }
    }

    h3 {
      margin: 0;
      font-size: 15px;
      font-weight: 600;
      color: #374151;
    }
  }

  .custom-timeline {
    padding: 20px;

    .timeline-item {
      .el-timeline-item__node {
        background: @success-color;
        box-shadow: 0 0 0 4px rgba(16, 185, 129, 0.2);
      }

      .el-timeline-item__tail {
        border-left-color: #e5e7eb;
      }

      .el-timeline-item__timestamp {
        font-size: 12px;
        color: #9ca3af;
        font-weight: 500;
      }

      .timeline-content {
        display: flex;
        align-items: center;
        gap: 12px;
        padding: 8px 0;

        .timeline-value {
          font-size: 13px;
          color: #374151;
          font-weight: 500;
        }

        .timeline-cost {
          font-size: 13px;
          color: @success-color;
          font-weight: 600;
          background: rgba(16, 185, 129, 0.1);
          padding: 3px 10px;
          border-radius: 12px;
        }
      }
    }
  }
}

// 响应式
@media (max-width: 768px) {
  .charging-page {
    padding: 12px;
  }

  .filter-card {
    .status-filter {
      :deep(.el-radio-button__inner) {
        padding: 8px 12px;
        font-size: 12px;
      }
    }
  }

  .charging-card {
    .card-body {
      flex-direction: column;
      align-items: center;

      .params-section {
        width: 100%;
      }
    }

    .card-footer {
      flex-direction: column;
      gap: 12px;

      .action-buttons {
        width: 100%;
        justify-content: center;
      }
    }
  }
}
</style>
