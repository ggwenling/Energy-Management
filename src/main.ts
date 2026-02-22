import {createApp} from 'vue'
import {createPinia} from 'pinia'
import router from "./router/index.ts"
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import App from './App.vue'
import './style.css'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import './mock/index.ts'
//全局前置守卫
import '@/router/gurd.ts'

import permission from '@/directives/permission.ts'

// 性能监控（仅开发环境）
if (import.meta.env.DEV) {
    import('@/utils/performanceMonitor').then(({ performanceMonitor }) => {
        performanceMonitor.init();
    });
}

const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)
const app = createApp(App)

// 优化：按需注册图标，而不是全部注册（如果项目中只用了部分图标）
// 如果使用的图标较多，保持全部注册；如果较少，建议按需注册
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component)
}

//全局注册v-permission指令
app.directive('permission', permission)

app.use(ElementPlus)
app.use(router)
app.use(pinia)
app.mount('#app')

