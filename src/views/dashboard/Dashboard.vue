<script setup lang="ts">
import flash from '@/assets/flash.png'
import flash2 from '@/assets/flash2.png'
import repair from '@/assets/repair.png'
import daily from '@/assets/daily.png'
import progress from '@/assets/progress.png'
import total from '@/assets/total.png'
import money from '@/assets/money.png'
import remain from '@/assets/remain.png'
// import flash3 from '@/assets/flash3.png'
import logo from '@/assets/logo.png'
import {useEcharts} from "@/hooks/useEcharts.ts";
import {reactive, ref} from "vue";
import {getChart2,getChart3,getChart4} from "@/api/userInfo.ts";

// 创建ref实例挂载echarts
const chart1 = ref(null)
const chart2 = ref(null)
const chart3 = ref(null)

const setChartData1 = async () => {
  const chartOptions: any = reactive({
    title: {
      text: '电量统计',
    },
    tooltip: {
      trigger: 'axis',
    },
    legend: {
      data: []
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: ['13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00', '21:00']
    },
    yAxis: {
      type: 'value',
      axisLabel: {
        formatter: '{value}kw'
      }
    },
    series: [
      {
        name: '',
        type: 'line',
        data: [],
        lineStyle: {
          width: 4
        },
        itemStyle: {
          color: "purple",
          shadowBlur: 5,
          shadowColor: 'rgba(0,255,0,0.5)'
        },
        smooth: true
      },
      {
        name: '',
        type: 'line',
        data: [],
        lineStyle: {
          width: 4
        },
        itemStyle: {
          color: "lightgreen",
          shadowBlur: 5,
          shadowColor: 'rgba(0,255,0,0.5)'
        },
        smooth: true
      },
      {
        name: '',
        type: 'line',
        data: [],
        lineStyle: {
          width: 4
        },
        itemStyle: {
          color: "skyblue",
          shadowBlur: 5,
          shadowColor: 'rgba(0,255,0,0.5)'
        },
        smooth: true
      },

    ]
  });
  //获取图表2
  const {data} = await getChart2();

  chartOptions.legend.data = data.data.list.map((item: any) => item.name)
  for (let i = 0; i < chartOptions.series.length; i++) {

    chartOptions.series[i].data = data.data.list[i].data
    chartOptions.series[i].name = data.data.list[i].name
  }
  return chartOptions
}
//获取图表3
const setChartData3 = async () => {
  const chartOptions = reactive({
    radar: {
      // shape: 'circle',
      indicator: [
        { name: '闲置数', max: 65 },
        { name: '使用数', max: 160 },
        { name: '故障数', max: 300 },
        { name: '维修数', max: 380 },
        { name: '更换数', max: 520 },
        { name: '报废数', max: 250 }
      ]
    },
    series: [
      {
        name: '设备总览',
        type: 'radar',
        data: [
          {
            value: [],
            name: '设备总览'
          },

        ]
      }
    ]
  })
  const {data} = await getChart3()
  chartOptions.series[0]!.data[0]!.value = data.data.list
  console.log(chartOptions)
  return chartOptions
}
//获取饼图
const setChartData4 = async () => {
  const chartOptions = reactive({
    tooltip: {
      trigger: 'item'
    },
    legend: {
      top: '5%',
      left: 'center'
    },
    // 使用 graphic 在中间添加文字
    graphic: [
      {
        type: 'text',
        left: 'center',
        top: 'center',
        style: {
          text: '营收占比',
          textAlign: 'center',
          fill: '#333',
          fontSize: 20,
          fontWeight: 'bold'
        }
      }
    ],
    series: [
      {
        name: '占比',
        type: 'pie',
        radius: ['40%', '70%'],
        avoidLabelOverlap: false,
        itemStyle: {
          borderRadius: 10,
          borderColor: '#fff',
          borderWidth: 2
        },
        label: {
          show: false,
          position: 'center'
        },

        labelLine: {
          show: false
        },
        data: [
        ]
      }
    ]
  })
  const res = await getChart4()
  console.log(res.data.data.list)
  chartOptions.series[0]!.data = res.data.data.list
  return chartOptions
}


useEcharts(chart2, setChartData1);
useEcharts(chart3, setChartData3);
useEcharts(chart1, setChartData4);
</script>

<template>
  <el-row :gutter="20" class="mt-3">
    <el-col :span="18">
      <!--      第一部分 运行状态区域-->
      <el-card class="custom-card">
        <div>
          <!--          标题区域-->
          <div class="title flex items-end gap-4 ">
            <h1 class="font-bold text-base ">今日设备运行状态</h1>
            <div class="flex items-center ">
              <p class="text-gray-500 text-xs  font-semibold">更新时间:&nbsp 2025年12月22日</p>
              <el-icon color="gray">
                <Refresh/>
              </el-icon>
            </div>

          </div>
          <!--          充电桩区域-->
          <div class="flex justify-around mt-5">
            <div class="item flex flex-col gap-6 mt-5 w-3xs">
              <img :src="flash2" alt="" width="50px" height="50px">
              <div class="statistic-card">
                <el-statistic :value="72" class="font-bold">
                  <template #title>
                    <div style="display: inline-flex; align-items: center">
                      异常设备

                      <el-tooltip
                          effect="dark"
                          content="Number of users who logged into the product in one day"
                          placement="top"
                      >
                        <el-icon style="margin-left: 4px" :size="12">
                          <Warning/>
                        </el-icon>
                      </el-tooltip>
                    </div>
                    <p>9</p>
                  </template>
                  <template #suffix>
                    <p class="font-bold text-3xl">/95</p>
                  </template>
                </el-statistic>
                <div class="statistic-footer">
                  <div class="footer-item">
                    <span class="text-xs">相较昨日</span>
                    <span class="green text-xs">
                 24%
              <el-icon color="green">
                <CaretTop/>
              </el-icon>
            </span>
                  </div>
                </div>
              </div>
            </div>
            <div class="item flex flex-col gap-6 mt-5  w-3xs">
              <img :src="flash" alt="" width="50px" height="50px">
              <div class="statistic-card">
                <el-statistic :value="72" class="font-bold">
                  <template #title>
                    <div style="display: inline-flex; align-items: center">
                      异常设备

                      <el-tooltip
                          effect="dark"
                          content="Number of users who logged into the product in one day"
                          placement="top"
                      >
                        <el-icon style="margin-left: 4px" :size="12">
                          <Warning/>
                        </el-icon>
                      </el-tooltip>
                    </div>
                    <p>9</p>
                  </template>
                  <template #suffix>
                    <p class="font-bold text-3xl">/95</p>
                  </template>
                </el-statistic>
                <div class="statistic-footer">
                  <div class="footer-item">
                    <span class="text-xs">相较昨日</span>
                    <span class="green text-xs">
                 24%
              <el-icon color="green">
                <CaretTop/>
              </el-icon>
            </span>
                  </div>
                </div>
              </div>
            </div>
            <div class="item flex flex-col gap-6 mt-5  w-3xsa">
              <img :src="flash" alt="" width="50px" height="50px">
              <div class="statistic-card">
                <el-statistic :value="72" class="font-bold">
                  <template #title>
                    <div style="display: inline-flex; align-items: center">
                      异常设备

                      <el-tooltip
                          effect="dark"
                          content="Number of users who logged into the product in one day"
                          placement="top"
                      >
                        <el-icon style="margin-left: 4px" :size="12">
                          <Warning/>
                        </el-icon>
                      </el-tooltip>
                    </div>
                    <p>9</p>
                  </template>
                  <template #suffix>
                    <p class="font-bold text-3xl">/95</p>
                  </template>
                </el-statistic>
                <div class="statistic-footer">
                  <div class="footer-item">
                    <span class="text-xs">相较昨日</span>
                    <span class="green text-xs">
                 24%
              <el-icon color="green">
                <CaretTop/>
              </el-icon>
            </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>


      </el-card>
      <!--      第二部分 第二部分导航区域 -->
      <el-card class="mt-2 custom-card">
        <el-row class="nav-grid">
          <el-col :span="4" class="nav-item">
            <img :src="repair" alt="" width="40px" height="40px" class="nav-icon">
            <p class="nav-text">设备维修</p>
          </el-col>
          <el-col :span="4" class="nav-item">
            <img :src="daily" alt="" width="40px" height="40px" class="nav-icon">
            <p class="nav-text">每日日报</p>
          </el-col>
          <el-col :span="4" class="nav-item">
            <img :src="progress" alt="" width="40px" height="40px" class="nav-icon">
            <p class="nav-text">任务进度</p>
          </el-col>
          <el-col :span="4" class="nav-item">
            <img :src="total" alt="" width="40px" height="40px" class="nav-icon">
            <p class="nav-text">营收占比</p>
          </el-col>
          <el-col :span="4" class="nav-item">
            <img :src="money" alt="" width="40px" height="40px" class="nav-icon">
            <p class="nav-text">营收统计</p>
          </el-col>
          <el-col :span="4" class="nav-item">
            <img :src="remain" alt="" width="40px" height="40px" class="nav-icon">
            <p class="nav-text">待办事项</p>
          </el-col>
        </el-row>
      </el-card>
      <!--      第三部分 能源统计区域-->
      <el-card class="mt-2 custom-card">
        <template #header>
          <div class="card-header">
            <span> 能源统计</span>
          </div>
        </template>
        <el-row>
          <el-col :span="6">
            <div style="width: 100%;height: 400px" ref="chart1"></div>
          </el-col>
          <el-col :span="18">
            <div style="width: 100%;height: 400px" ref="chart2"></div>
          </el-col>
        </el-row>
      </el-card>

     <div style="width: 100%" class="flex justify-center text-gray-600 mt-20 flex-col items-center">
       <p>充电设施智能管理平台 · 数据可视化系统</p>
       <img :src="logo" alt="" width="80px" height="80px" class="block mt-4">
     </div>



    </el-col>
    <el-col :span="6">

      <el-card class="custom-card">
        <template #header>
          <div class="card-header">
            <span> 设备总览</span>
          </div>
        </template>
        <div ref="chart3" style="width: 100%;height: 191px"></div>
      </el-card>
      <el-card class="mt-2 custom-card min-w-80">
        <template #header>
          <div class="card-heder">
            <h1>营收统计表</h1>
          </div>
        </template>
        <ul class="ranking-list">
          <li class="ranking-item">
            <span class="rank" style="background-color: rgb(103, 194, 58);color: #fff;">1</span>
            <span class="store-name">广州</span>
            <span class="sales">52,457</span>
            <span style="margin-left:50px">
                            24%
                            <el-icon color="green">
                                <CaretTop />
                            </el-icon>
                        </span>
          </li>
          <li class="ranking-item">
            <span class="rank" style="background-color:rgb(64, 158, 255) ;color: #fff ;">2</span>
            <span class="store-name">上海</span>
            <span class="sales">323,234</span>
            <span style="margin-left: 50px;">
                            24%
                            <el-icon color="red">
                                <CaretBottom />
                            </el-icon>
                        </span>
          </li>
          <li class="ranking-item">
            <span class="rank" style="background-color:rgb(230, 162, 60) ;color: #fff ;">3</span>
            <span class="store-name">佛山</span>
            <span class="sales">192,255</span>
            <span style="margin-left: 50px;">
                            24%
                            <el-icon color="red">
                                <CaretBottom />
                            </el-icon>
                        </span>
          </li>
          <li class="ranking-item">
            <span class="rank">4</span>
            <span class="store-name">珠海</span>
            <span class="sales">17,540</span>
            <span style="margin-left: 50px;">
                            24%
                            <el-icon color="green">
                                <CaretTop />
                            </el-icon>
                        </span>
          </li>
          <li class="ranking-item">
            <span class="rank">5</span>
            <span class="store-name">深圳</span>
            <span class="sales">662,337</span>
            <span style="margin-left: 50px;">
                            24%
                            <el-icon color="red">
                                <CaretBottom />
                            </el-icon>
                        </span>
          </li>
          <li class="ranking-item">
            <span class="rank">6</span>
            <span class="store-name">厦门</span>
            <span class="sales">22,941</span>
            <span style="margin-left: 50px;">
                            24%
                            <el-icon color="green">
                                <CaretTop />
                            </el-icon>
                        </span>
          </li>
          <li class="ranking-item">
            <span class="rank">7</span>
            <span class="store-name">长沙</span>
            <span class="sales">565,221</span>
            <span style="margin-left: 50px;">
                            24%
                            <el-icon color="green">
                                <CaretTop />
                            </el-icon>
                        </span>
          </li>
        </ul>
      </el-card>
      <el-card class="mt-2 custom-card">
        <template #header>
          <div class="card-heder">
            <h1>故障报警</h1>
          </div>
        </template>
        <el-timeline style="max-width: 600px">
          <el-timeline-item timestamp="2024/4/12" placement="top" :hollow="true" type="danger">
            <el-card class="custom-card">
              <h4>矿业北路通讯中断</h4>
            </el-card>
          </el-timeline-item>
          <el-timeline-item timestamp="2024/2/3" placement="top" :hollow="true" type="warning">
            <el-card clas="custom-card">
              <h4>黄河南路超出服务区域</h4>

            </el-card>
          </el-timeline-item>
          <el-timeline-item timestamp="2024/5/17" placement="top" :hollow="true" type="danger">
            <el-card class="custom-card">
              <h4>6号机组异常断电</h4>

            </el-card>
          </el-timeline-item>
        </el-timeline>
      </el-card>
    </el-col>

  </el-row>
</template>

<style scoped lang="less">
// 页面整体进入动画
.mt-3 {
  animation: pageEnter 0.6s ease-out;
}

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

// 卡片悬停效果
.custom-card {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  border-radius: 8px;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 12px 24px rgba(0, 0, 0, 0.12);
  }
}

// 统计卡片区域
.item {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);

  &:hover {
    transform: translateY(-6px);

    img {
      transform: scale(1.15) rotate(5deg);
      filter: drop-shadow(0 8px 12px rgba(0, 0, 0, 0.2));
    }
  }

  img {
    transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
    filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.1));
  }
}

// 统计数字动画
.statistic-card {
  transition: all 0.3s ease;
}

:deep(.el-statistic__number) {
  font-weight: bold;
  font-size: 30px;
  transition: all 0.3s ease;
}

:deep(.el-statistic) {
  &:hover .el-statistic__number {
    color: #409eff;
    transform: scale(1.08);
  }
}

// 标题区域动画
.title {
  h1 {
    transition: color 0.3s ease;

    &:hover {
      color: #409eff;
    }
  }

  .el-icon {
    transition: all 0.3s ease;
    cursor: pointer;

    &:hover {
      transform: rotate(180deg);
      color: #409eff !important;
    }
  }
}

// 导航区域样式
.nav-grid {
  .nav-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 16px 0;
    cursor: pointer;
    border-radius: 8px;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
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

    .nav-icon {
      transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
      filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.1));
    }

    .nav-text {
      font-size: 12px;
      margin-top: 8px;
      color: #606266;
      transition: all 0.3s ease;
      font-weight: 500;
    }

    &:hover {
      background-color: #f5f7fa;
      transform: translateY(-6px);
      box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);

      &::before {
        left: 100%;
      }

      .nav-icon {
        transform: scale(1.2) rotate(10deg);
      }

      .nav-text {
        color: #409eff;
        transform: scale(1.05);
      }
    }

    &:active {
      transform: translateY(-3px);
    }
  }
}

// 营收统计表样式
.ranking-list {
  list-style: none;
  padding: 0;
  margin: 0;

  .ranking-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 12px 10px;
    cursor: pointer;
    border-radius: 6px;
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

    .rank {
      display: inline-block;
      font-weight: bold;
      color: #666;
      width: 30px;
      height: 30px;
      border-radius: 50%;
      text-align: center;
      line-height: 30px;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }

    .store-name {
      flex-grow: 1;
      padding: 0 10px;
      transition: all 0.3s ease;
      font-weight: 500;
    }

    .sales {
      color: #666;
      transition: all 0.3s ease;
      font-weight: 600;
    }

    &:hover {
      background-color: #ecf5ff !important;
      transform: translateX(8px);
      box-shadow: 0 4px 12px rgba(64, 158, 255, 0.2);

      &::before {
        transform: scaleY(1);
      }

      .rank {
        transform: scale(1.2) rotate(360deg);
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
      }

      .store-name {
        color: #409eff;
        transform: translateX(4px);
      }

      .sales {
        color: #409eff;
        transform: scale(1.08);
      }
    }

    &:active {
      transform: translateX(4px);
    }
  }

  .ranking-item:nth-child(even) {
    background-color: rgb(253, 246, 236);
  }
}

// 时间线动画
:deep(.el-timeline) {
  .el-timeline-item {
    transition: all 0.3s ease;

    &:hover {
      transform: translateX(6px);

      .el-card {
        box-shadow: 0 8px 16px rgba(0, 0, 0, 0.15);

        h4 {
          color: #409eff;
        }
      }
    }
  }

  .el-timeline-item__node {
    transition: all 0.3s ease;
  }

  .el-timeline-item:hover .el-timeline-item__node {
    transform: scale(1.3);
    box-shadow: 0 0 0 4px rgba(64, 158, 255, 0.2);
  }

  .el-card {
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);

    h4 {
      margin: 0;
      transition: color 0.3s ease;
    }
  }
}

// 卡片标题动画
:deep(.card-header) {
  span {
    position: relative;
    transition: color 0.3s ease;

    &::after {
      content: '';
      position: absolute;
      bottom: -4px;
      left: 0;
      width: 0;
      height: 2px;
      background: #409eff;
      transition: width 0.3s ease;
    }
  }

  &:hover span {
    color: #409eff;

    &::after {
      width: 100%;
    }
  }
}

:deep(.card-heder) {
  h1 {
    position: relative;
    transition: color 0.3s ease;

    &::after {
      content: '';
      position: absolute;
      bottom: -4px;
      left: 0;
      width: 0;
      height: 2px;
      background: #409eff;
      transition: width 0.3s ease;
    }
  }

  &:hover h1 {
    color: #409eff;

    &::after {
      width: 100%;
    }
  }
}

// 底部 Logo 动画
.flex.justify-center.text-gray-600 {
  p {
    transition: all 0.3s ease;
  }

  img {
    transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
    filter: grayscale(0.3);
    cursor: pointer;
  }

  &:hover {
    p {
      color: #409eff;
      transform: scale(1.05);
    }

    img {
      transform: rotate(360deg) scale(1.1);
      filter: grayscale(0);
    }
  }
}

// 百分比图标动画
:deep(.el-icon) {
  transition: all 0.3s ease;
}

.footer-item {
  .el-icon:hover {
    transform: scale(1.3);
  }
}
</style>
