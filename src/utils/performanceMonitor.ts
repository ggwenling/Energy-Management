/**
 * 性能监控工具
 * 用于监控页面性能指标
 */

interface PerformanceMetrics {
  FCP?: number;  // First Contentful Paint
  LCP?: number;  // Largest Contentful Paint
  FID?: number;  // First Input Delay
  CLS?: number;  // Cumulative Layout Shift
  TTFB?: number; // Time to First Byte
  domReady?: number;
  loadComplete?: number;
}

class PerformanceMonitor {
  private metrics: PerformanceMetrics = {};

  /**
   * 初始化性能监控
   */
  init() {
    if (typeof window === 'undefined') return;

    // 监听页面加载完成
    if (document.readyState === 'complete') {
      this.collectMetrics();
    } else {
      window.addEventListener('load', () => {
        this.collectMetrics();
      });
    }

    // 监听 FCP
    this.observeFCP();
    
    // 监听 LCP
    this.observeLCP();
    
    // 监听 FID
    this.observeFID();
    
    // 监听 CLS
    this.observeCLS();
  }

  /**
   * 收集基础性能指标
   */
  private collectMetrics() {
    const perfData = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
    
    if (perfData) {
      this.metrics.TTFB = perfData.responseStart - perfData.requestStart;
      this.metrics.domReady = perfData.domContentLoadedEventEnd - perfData.fetchStart;
      this.metrics.loadComplete = perfData.loadEventEnd - perfData.fetchStart;
    }

    // 延迟输出，确保所有指标都收集完成
    setTimeout(() => {
      this.reportMetrics();
    }, 3000);
  }

  /**
   * 监听 FCP (First Contentful Paint)
   */
  private observeFCP() {
    if (!('PerformanceObserver' in window)) return;

    try {
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.name === 'first-contentful-paint') {
            this.metrics.FCP = entry.startTime;
            observer.disconnect();
          }
        }
      });
      observer.observe({ entryTypes: ['paint'] });
    } catch (e) {
      console.warn('FCP monitoring failed:', e);
    }
  }

  /**
   * 监听 LCP (Largest Contentful Paint)
   */
  private observeLCP() {
    if (!('PerformanceObserver' in window)) return;

    try {
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const lastEntry = entries[entries.length - 1] as any;
        this.metrics.LCP = lastEntry.renderTime || lastEntry.loadTime;
      });
      observer.observe({ entryTypes: ['largest-contentful-paint'] });
    } catch (e) {
      console.warn('LCP monitoring failed:', e);
    }
  }

  /**
   * 监听 FID (First Input Delay)
   */
  private observeFID() {
    if (!('PerformanceObserver' in window)) return;

    try {
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          const fidEntry = entry as any;
          this.metrics.FID = fidEntry.processingStart - fidEntry.startTime;
          observer.disconnect();
        }
      });
      observer.observe({ entryTypes: ['first-input'] });
    } catch (e) {
      console.warn('FID monitoring failed:', e);
    }
  }

  /**
   * 监听 CLS (Cumulative Layout Shift)
   */
  private observeCLS() {
    if (!('PerformanceObserver' in window)) return;

    try {
      let clsValue = 0;
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          const layoutShift = entry as any;
          if (!layoutShift.hadRecentInput) {
            clsValue += layoutShift.value;
            this.metrics.CLS = clsValue;
          }
        }
      });
      observer.observe({ entryTypes: ['layout-shift'] });
    } catch (e) {
      console.warn('CLS monitoring failed:', e);
    }
  }

  /**
   * 上报性能指标
   */
  private reportMetrics() {
    console.group('📊 性能监控报告');
    console.log('FCP (首次内容绘制):', this.formatTime(this.metrics.FCP), this.getScore('FCP', this.metrics.FCP));
    console.log('LCP (最大内容绘制):', this.formatTime(this.metrics.LCP), this.getScore('LCP', this.metrics.LCP));
    console.log('FID (首次输入延迟):', this.formatTime(this.metrics.FID), this.getScore('FID', this.metrics.FID));
    console.log('CLS (累积布局偏移):', this.metrics.CLS?.toFixed(3), this.getScore('CLS', this.metrics.CLS));
    console.log('TTFB (首字节时间):', this.formatTime(this.metrics.TTFB));
    console.log('DOM Ready:', this.formatTime(this.metrics.domReady));
    console.log('Load Complete:', this.formatTime(this.metrics.loadComplete));
    console.groupEnd();

    // 这里可以将数据上报到服务器
    // this.sendToServer(this.metrics);
  }

  /**
   * 格式化时间
   */
  private formatTime(time?: number): string {
    if (time === undefined) return '未测量';
    return `${time.toFixed(2)}ms`;
  }

  /**
   * 获取性能评分
   */
  private getScore(metric: string, value?: number): string {
    if (value === undefined) return '';

    const thresholds: Record<string, { good: number; needsImprovement: number }> = {
      FCP: { good: 1800, needsImprovement: 3000 },
      LCP: { good: 2500, needsImprovement: 4000 },
      FID: { good: 100, needsImprovement: 300 },
      CLS: { good: 0.1, needsImprovement: 0.25 }
    };

    const threshold = thresholds[metric];
    if (!threshold) return '';

    if (value <= threshold.good) {
      return '✅ 优秀';
    } else if (value <= threshold.needsImprovement) {
      return '⚠️ 需要改进';
    } else {
      return '❌ 较差';
    }
  }

  /**
   * 获取内存使用情况
   */
  getMemoryUsage(): string {
    if ('memory' in performance) {
      const memory = (performance as any).memory;
      const used = (memory.usedJSHeapSize / 1048576).toFixed(2);
      const total = (memory.totalJSHeapSize / 1048576).toFixed(2);
      const limit = (memory.jsHeapSizeLimit / 1048576).toFixed(2);
      return `使用: ${used}MB / 总计: ${total}MB / 限制: ${limit}MB`;
    }
    return '浏览器不支持内存监控';
  }

  /**
   * 监控内存使用
   */
  monitorMemory(interval: number = 5000) {
    setInterval(() => {
      console.log('💾 内存使用:', this.getMemoryUsage());
    }, interval);
  }
}

// 导出单例
export const performanceMonitor = new PerformanceMonitor();

// 自动初始化（仅在开发环境）
if (import.meta.env.DEV) {
  performanceMonitor.init();
  // performanceMonitor.monitorMemory(); // 取消注释以启用内存监控
}


