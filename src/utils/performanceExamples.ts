/**
 * 性能优化使用示例
 * 展示如何在实际项目中使用性能优化工具
 */

import { ref, onMounted, onUnmounted } from 'vue'
import { debounce, throttle, rafThrottle, lazyLoadImages, runWhenIdle } from '@/utils/performance'

// ============================================
// 示例 1：搜索框防抖
// ============================================
export function useSearchDebounce() {
  const keyword = ref('')
  const searchResults = ref([])
  const loading = ref(false)

  // 防抖搜索函数
  const handleSearch = debounce(async (value: string) => {
    if (!value) {
      searchResults.value = []
      return
    }
    
    loading.value = true
    try {
      // 模拟 API 请求
      const response = await fetch(`/api/search?q=${value}`)
      searchResults.value = await response.json()
    } catch (error) {
      console.error('搜索失败:', error)
    } finally {
      loading.value = false
    }
  }, 300) // 300ms 防抖

  return {
    keyword,
    searchResults,
    loading,
    handleSearch
  }
}

// ============================================
// 示例 2：滚动事件节流
// ============================================
export function useScrollThrottle() {
  const scrollTop = ref(0)
  const isScrolling = ref(false)

  // 节流滚动处理
  const handleScroll = throttle(() => {
    scrollTop.value = window.scrollY || document.documentElement.scrollTop
    isScrolling.value = true
    
    // 滚动停止后重置状态
    setTimeout(() => {
      isScrolling.value = false
    }, 150)
  }, 100) // 100ms 节流

  onMounted(() => {
    window.addEventListener('scroll', handleScroll, { passive: true })
  })

  onUnmounted(() => {
    window.removeEventListener('scroll', handleScroll)
  })

  return {
    scrollTop,
    isScrolling
  }
}

// ============================================
// 示例 3：动画优化（RAF 节流）
// ============================================
export function useAnimationOptimization() {
  const position = ref({ x: 0, y: 0 })

  // 使用 RAF 节流优化鼠标移动
  const handleMouseMove = rafThrottle((event: MouseEvent) => {
    position.value = {
      x: event.clientX,
      y: event.clientY
    }
  })

  onMounted(() => {
    document.addEventListener('mousemove', handleMouseMove)
  })

  onUnmounted(() => {
    document.removeEventListener('mousemove', handleMouseMove)
  })

  return {
    position
  }
}

// ============================================
// 示例 4：图片懒加载
// ============================================
export function useImageLazyLoad() {
  let observer: IntersectionObserver | null = null

  onMounted(() => {
    // 延迟初始化懒加载，避免阻塞首屏渲染
    runWhenIdle(() => {
      observer = lazyLoadImages('img[data-src]', '100px')
    })
  })

  onUnmounted(() => {
    if (observer) {
      observer.disconnect()
    }
  })
}

// ============================================
// 示例 5：表格分页优化
// ============================================
export function useTablePagination() {
  const tableData = ref([])
  const loading = ref(false)
  const pagination = ref({
    page: 1,
    pageSize: 10,
    total: 0
  })

  // 防抖加载数据
  const loadData = debounce(async () => {
    loading.value = true
    try {
      const response = await fetch(`/api/table?page=${pagination.value.page}&size=${pagination.value.pageSize}`)
      const data = await response.json()
      tableData.value = data.list
      pagination.value.total = data.total
    } catch (error) {
      console.error('加载失败:', error)
    } finally {
      loading.value = false
    }
  }, 300)

  const handlePageChange = (page: number) => {
    pagination.value.page = page
    loadData()
  }

  const handleSizeChange = (size: number) => {
    pagination.value.pageSize = size
    pagination.value.page = 1 // 重置到第一页
    loadData()
  }

  onMounted(() => {
    loadData()
  })

  return {
    tableData,
    loading,
    pagination,
    handlePageChange,
    handleSizeChange
  }
}

// ============================================
// 示例 6：按钮防抖（防止重复提交）
// ============================================
export function useButtonDebounce() {
  const submitting = ref(false)

  const handleSubmit = debounce(async (formData: any) => {
    if (submitting.value) return
    
    submitting.value = true
    try {
      await fetch('/api/submit', {
        method: 'POST',
        body: JSON.stringify(formData)
      })
      // 提交成功
    } catch (error) {
      console.error('提交失败:', error)
    } finally {
      submitting.value = false
    }
  }, 500) // 500ms 防抖，防止重复点击

  return {
    submitting,
    handleSubmit
  }
}

// ============================================
// 示例 7：窗口 resize 优化
// ============================================
export function useWindowResize() {
  const windowSize = ref({
    width: window.innerWidth,
    height: window.innerHeight
  })

  // 使用节流优化 resize 事件
  const handleResize = throttle(() => {
    windowSize.value = {
      width: window.innerWidth,
      height: window.innerHeight
    }
  }, 200)

  onMounted(() => {
    window.addEventListener('resize', handleResize, { passive: true })
  })

  onUnmounted(() => {
    window.removeEventListener('resize', handleResize)
  })

  return {
    windowSize
  }
}

// ============================================
// 示例 8：数据预加载
// ============================================
export function useDataPreload() {
  onMounted(() => {
    // 在浏览器空闲时预加载数据
    runWhenIdle(async () => {
      try {
        // 预加载用户常访问的数据
        await fetch('/api/preload/dashboard')
        await fetch('/api/preload/user-info')
        console.log('数据预加载完成')
      } catch (error) {
        console.error('预加载失败:', error)
      }
    }, 2000)
  })
}

// ============================================
// 示例 9：长列表虚拟滚动（简化版）
// ============================================
export function useVirtualScroll(itemHeight: number, visibleCount: number) {
  const scrollTop = ref(0)
  const allData = ref<any[]>([])
  const visibleData = ref<any[]>([])

  const updateVisibleData = throttle(() => {
    const startIndex = Math.floor(scrollTop.value / itemHeight)
    const endIndex = startIndex + visibleCount
    visibleData.value = allData.value.slice(
      Math.max(0, startIndex - 2),
      endIndex + 2
    )
  }, 100)

  const handleScroll = (event: Event) => {
    const target = event.target as HTMLElement
    scrollTop.value = target.scrollTop
    updateVisibleData()
  }

  return {
    visibleData,
    handleScroll,
    setAllData: (data: any[]) => {
      allData.value = data
      updateVisibleData()
    }
  }
}

// ============================================
// 示例 10：组件卸载清理
// ============================================
export function useCleanup() {
  const timers: number[] = []
  const observers: IntersectionObserver[] = []
  const eventListeners: Array<{
    target: EventTarget
    event: string
    handler: EventListener
  }> = []

  // 添加定时器
  const addTimer = (timer: number) => {
    timers.push(timer)
  }

  // 添加观察器
  const addObserver = (observer: IntersectionObserver) => {
    observers.push(observer)
  }

  // 添加事件监听
  const addEventListener = (
    target: EventTarget,
    event: string,
    handler: EventListener
  ) => {
    target.addEventListener(event, handler)
    eventListeners.push({ target, event, handler })
  }

  // 组件卸载时清理所有资源
  onUnmounted(() => {
    // 清理定时器
    timers.forEach(timer => clearTimeout(timer))
    
    // 清理观察器
    observers.forEach(observer => observer.disconnect())
    
    // 清理事件监听
    eventListeners.forEach(({ target, event, handler }) => {
      target.removeEventListener(event, handler)
    })
    
    console.log('资源清理完成')
  })

  return {
    addTimer,
    addObserver,
    addEventListener
  }
}


