import { onMounted, onUnmounted,  type Ref, watch } from 'vue'
// 按需引入 ECharts 核心模块和组件，减少打包体积
import * as echarts from 'echarts/core';
import {
    BarChart,
    LineChart,
    PieChart,
    RadarChart
} from 'echarts/charts';
import {
    TitleComponent,
    TooltipComponent,
    GridComponent,
    LegendComponent,
    DatasetComponent,
    TransformComponent,
    GraphicComponent
} from 'echarts/components';
import { LabelLayout, UniversalTransition } from 'echarts/features';
import { CanvasRenderer } from 'echarts/renderers';
import type {
    ComposeOption,
} from 'echarts/core';
import type {
    BarSeriesOption,
    LineSeriesOption,
    PieSeriesOption,
    RadarSeriesOption
} from 'echarts/charts';
import type {
    TitleComponentOption,
    TooltipComponentOption,
    GridComponentOption,
    LegendComponentOption,
    DatasetComponentOption
} from 'echarts/components';

// 组合出一个只有必需组件和图表的 Option 类型
type ECOption = ComposeOption<
    | BarSeriesOption
    | LineSeriesOption
    | PieSeriesOption
    | RadarSeriesOption
    | TitleComponentOption
    | TooltipComponentOption
    | GridComponentOption
    | LegendComponentOption
    | DatasetComponentOption
>;

// 注册必须的组件
echarts.use([
    BarChart,
    LineChart,
    PieChart,
    RadarChart,
    TitleComponent,
    TooltipComponent,
    GridComponent,
    LegendComponent,
    DatasetComponent,
    TransformComponent,
    GraphicComponent,
    LabelLayout,
    UniversalTransition,
    CanvasRenderer
]);

// 优化点：明确类型定义，提升可维护性
export const useEcharts = (
    chartRef: Ref<HTMLElement | null>,
    setChartData: () => Promise<ECOption>
) => {
    // 优化：用普通变量存储实例，无需 ref（非响应式数据）
    let chartInstance: echarts.ECharts | null = null
    let resizeObserver: ResizeObserver | null = null

    // 初始化图表（增加异常捕获）
    const initCharts = async () => {
        // 双重校验：容器存在 + 实例未创建
        if (!chartRef.value || chartInstance) return

        try {
            // 初始化实例
            chartInstance = echarts.init(chartRef.value)
            // 获取配置项并渲染
            const options = await setChartData()
            chartInstance.setOption(options, true) // 第二个参数强制替换配置
        } catch (error) {
            console.error('ECharts 初始化失败：', error)
            // 初始化失败时清空实例，避免内存残留
            chartInstance = null
        }
    }

    // 窗口自适应（使用 ResizeObserver 替代 window.resize，性能更好）
    const handleResize = () => {
        if (chartInstance && !chartInstance.isDisposed()) {
            chartInstance.resize()
        }
    }

    // 手动销毁实例（抽离成独立方法，方便复用）
    const destroyChart = () => {
        // 1. 移除 ResizeObserver
        if (resizeObserver) {
            resizeObserver.disconnect()
            resizeObserver = null
        }
        // 2. 销毁 ECharts 实例，释放内存
        if (chartInstance && !chartInstance.isDisposed()) {
            chartInstance.dispose()
            chartInstance = null // 解除引用，方便垃圾回收
        }
    }

    // 挂载时初始化 + 绑定事件
    onMounted(async () => {
        // 使用 requestIdleCallback 延迟初始化，避免阻塞主线程
        if ('requestIdleCallback' in window) {
            requestIdleCallback(async () => {
                await initCharts()
                // 使用 ResizeObserver 监听容器大小变化
                if (chartRef.value) {
                    resizeObserver = new ResizeObserver(handleResize)
                    resizeObserver.observe(chartRef.value)
                }
            })
        } else {
            // 降级方案
            setTimeout(async () => {
                await initCharts()
                if (chartRef.value) {
                    resizeObserver = new ResizeObserver(handleResize)
                    resizeObserver.observe(chartRef.value)
                }
            }, 100)
        }
    })

    // 关键修复：卸载时清理
    onUnmounted(() => {
        destroyChart()
    })

    // 可选：监听容器变化，重新初始化（比如动态切换标签时）
    watch(chartRef, async (newVal, oldVal) => {
        if (newVal && newVal !== oldVal) {
            await initCharts()
        } else if (!newVal) {
            destroyChart()
        }
    })

    // 返回方法，方便组件手动控制（比如刷新数据）
    return {
        initCharts,
        destroyChart,
        getChartInstance: () => chartInstance
    }
}
