import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import tailwindcss from "@tailwindcss/vite";
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
import MotionResolver from 'motion-v/resolver'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    tailwindcss(),
    AutoImport({
      resolvers: [ElementPlusResolver()],
    }),
    Components({
      resolvers: [
        ElementPlusResolver(),
        MotionResolver()
      ],
    }),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    }
  },
  // 性能优化配置
  build: {
    // 启用 CSS 代码拆分
    cssCodeSplit: true,
    // 构建后是否生成 source map 文件（生产环境建议关闭）
    sourcemap: false,
    // chunk 大小警告的限制（单位：KB）
    chunkSizeWarningLimit: 1000,
    // Rollup 打包配置
    rollupOptions: {
      output: {
        // 手动分包策略
        manualChunks: {
          // Vue 全家桶
          'vue-vendor': ['vue', 'vue-router', 'pinia'],
          // Element Plus UI 库
          'element-plus': ['element-plus'],
          // ECharts 图表库
          'echarts': ['echarts/core', 'echarts/charts', 'echarts/components', 'echarts/features', 'echarts/renderers'],
          // 工具库
          'utils': ['axios', 'mockjs'],
        },
        // 静态资源分类打包
        chunkFileNames: 'js/[name]-[hash].js',
        entryFileNames: 'js/[name]-[hash].js',
        assetFileNames: (assetInfo) => {
          // 图片文件
          if (/\.(png|jpe?g|gif|svg|webp|ico)$/i.test(assetInfo.name || '')) {
            return 'images/[name]-[hash][extname]';
          }
          // 字体文件
          if (/\.(woff2?|eot|ttf|otf)$/i.test(assetInfo.name || '')) {
            return 'fonts/[name]-[hash][extname]';
          }
          // CSS 文件
          if (/\.css$/i.test(assetInfo.name || '')) {
            return 'css/[name]-[hash][extname]';
          }
          // 其他资源
          return 'assets/[name]-[hash][extname]';
        }
      }
    },
    // 压缩配置
    minify: 'terser',
    terserOptions: {
      compress: {
        // 生产环境移除 console
        drop_console: true,
        drop_debugger: true,
      }
    }
  },
  // 开发服务器优化
  server: {
    // 预热常用文件
    warmup: {
      clientFiles: [
        './src/views/dashboard/Dashboard.vue',
        './src/views/Login.vue',
        './src/components/**/*.vue',
      ]
    }
  },
  // 依赖优化
  optimizeDeps: {
    include: [
      'vue',
      'vue-router',
      'pinia',
      'element-plus',
      'axios',
      '@element-plus/icons-vue'
    ],
    // 排除不需要预构建的依赖
    exclude: ['@vueuse/core']
  }
});
