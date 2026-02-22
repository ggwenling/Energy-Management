/**
 * 性能优化工具函数
 */

/**
 * 防抖函数
 * @param fn 需要防抖的函数
 * @param delay 延迟时间（毫秒）
 * @returns 防抖后的函数
 * 
 * 使用场景：搜索框输入、窗口 resize、表单验证
 * 原理：在事件触发后延迟执行，如果在延迟期间再次触发，则重新计时
 */
export function debounce<T extends (...args: any[]) => any>(
  fn: T,
  delay: number = 300
): (...args: Parameters<T>) => void {
  let timer: number | null = null;
  
  return function(this: any, ...args: Parameters<T>) {
    if (timer) {
      clearTimeout(timer);
    }
    timer = window.setTimeout(() => {
      fn.apply(this, args);
      timer = null;
    }, delay);
  };
}

/**
 * 节流函数
 * @param fn 需要节流的函数
 * @param delay 间隔时间（毫秒）
 * @returns 节流后的函数
 * 
 * 使用场景：滚动事件、鼠标移动、按钮点击
 * 原理：在指定时间内只执行一次，无论触发多少次
 */
export function throttle<T extends (...args: any[]) => any>(
  fn: T,
  delay: number = 300
): (...args: Parameters<T>) => void {
  let lastTime = 0;
  
  return function(this: any, ...args: Parameters<T>) {
    const now = Date.now();
    if (now - lastTime >= delay) {
      fn.apply(this, args);
      lastTime = now;
    }
  };
}

/**
 * 请求动画帧节流
 * @param fn 需要节流的函数
 * @returns 节流后的函数
 * 
 * 使用场景：动画、滚动优化
 * 原理：使用 requestAnimationFrame 确保在浏览器重绘前执行
 */
export function rafThrottle<T extends (...args: any[]) => any>(
  fn: T
): (...args: Parameters<T>) => void {
  let rafId: number | null = null;
  
  return function(this: any, ...args: Parameters<T>) {
    if (rafId) return;
    
    rafId = requestAnimationFrame(() => {
      fn.apply(this, args);
      rafId = null;
    });
  };
}

/**
 * 图片懒加载
 * @param imgSelector 图片选择器
 * @param rootMargin 提前加载的距离
 * 
 * 使用方法：
 * 1. 给 img 标签添加 data-src 属性存储真实图片地址
 * 2. 调用 lazyLoadImages('.lazy-img')
 */
export function lazyLoadImages(
  imgSelector: string = 'img[data-src]',
  rootMargin: string = '50px'
): IntersectionObserver | null {
  if (!('IntersectionObserver' in window)) {
    // 不支持 IntersectionObserver 的浏览器，直接加载所有图片
    const images = document.querySelectorAll<HTMLImageElement>(imgSelector);
    images.forEach(img => {
      const src = img.dataset.src;
      if (src) {
        img.src = src;
        img.removeAttribute('data-src');
      }
    });
    return null;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target as HTMLImageElement;
          const src = img.dataset.src;
          if (src) {
            img.src = src;
            img.removeAttribute('data-src');
            observer.unobserve(img);
          }
        }
      });
    },
    { rootMargin }
  );

  const images = document.querySelectorAll<HTMLImageElement>(imgSelector);
  images.forEach(img => observer.observe(img));

  return observer;
}

/**
 * 内存优化：清理大对象
 * @param obj 需要清理的对象
 * 
 * 使用场景：组件卸载时清理大数据
 */
export function clearObject(obj: any): void {
  if (!obj || typeof obj !== 'object') return;
  
  Object.keys(obj).forEach(key => {
    delete obj[key];
  });
}

/**
 * 长列表虚拟滚动计算
 * @param scrollTop 滚动距离
 * @param itemHeight 每项高度
 * @param visibleCount 可见数量
 * @returns 开始索引和结束索引
 */
export function calculateVirtualList(
  scrollTop: number,
  itemHeight: number,
  visibleCount: number
): { startIndex: number; endIndex: number } {
  const startIndex = Math.floor(scrollTop / itemHeight);
  const endIndex = startIndex + visibleCount;
  
  return {
    startIndex: Math.max(0, startIndex - 2), // 预加载上方2项
    endIndex: endIndex + 2 // 预加载下方2项
  };
}

/**
 * 空闲时执行任务
 * @param task 需要执行的任务
 * @param timeout 超时时间
 * 
 * 使用场景：非关键任务的延迟执行
 */
export function runWhenIdle(
  task: () => void,
  timeout: number = 2000
): void {
  if ('requestIdleCallback' in window) {
    requestIdleCallback(task, { timeout });
  } else {
    setTimeout(task, timeout);
  }
}

/**
 * 预加载资源
 * @param urls 资源地址数组
 * @param type 资源类型
 */
export function preloadResources(
  urls: string[],
  type: 'image' | 'script' | 'style' = 'image'
): Promise<void[]> {
  const promises = urls.map(url => {
    return new Promise<void>((resolve, reject) => {
      if (type === 'image') {
        const img = new Image();
        img.onload = () => resolve();
        img.onerror = reject;
        img.src = url;
      } else if (type === 'script') {
        const script = document.createElement('script');
        script.onload = () => resolve();
        script.onerror = reject;
        script.src = url;
        document.head.appendChild(script);
      } else if (type === 'style') {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.onload = () => resolve();
        link.onerror = reject;
        link.href = url;
        document.head.appendChild(link);
      }
    });
  });

  return Promise.all(promises);
}


