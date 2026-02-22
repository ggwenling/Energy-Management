# 动力港能源管理平台

基于 Vue 3 + TypeScript + Vite 的现代化能源管理后台系统

## 📸 项目截图

> 建议添加项目截图到 `/screenshots` 目录

## ✨ 功能特性

- 🎯 **数据可视化** - 基于 ECharts 的实时数据展示
- 🗺️ **地图集成** - 高德地图充电站位置管理
- 🔐 **权限管理** - 基于角色的访问控制（RBAC）
- 📊 **充电站监控** - 实时监控设备运行状态
- 💰 **营收统计** - 多维度营收数据分析
- 📱 **响应式设计** - 适配多种设备尺寸
- 🎨 **现代化 UI** - 精美的动画和过渡效果

## 🛠️ 技术栈

### 核心框架
- **Vue 3** - 渐进式 JavaScript 框架
- **TypeScript** - JavaScript 的超集
- **Vite** - 下一代前端构建工具

### UI 框架
- **Element Plus** - Vue 3 组件库
- **Tailwind CSS** - 原子化 CSS 框架

### 状态管理
- **Pinia** - Vue 3 官方状态管理库
- **pinia-plugin-persistedstate** - 状态持久化插件

### 数据可视化
- **ECharts** - 强大的图表库
- **高德地图** - 地图服务

### 工具库
- **Axios** - HTTP 客户端
- **Mock.js** - 数据模拟
- **Vue Router** - 路由管理

## 📦 项目结构

```
my-vue-admin/
├── src/
│   ├── api/              # API 接口
│   ├── assets/           # 静态资源
│   ├── components/       # 公共组件
│   │   ├── aside/        # 侧边栏组件
│   │   ├── main/         # 主内容区组件
│   │   └── topNavBar/    # 顶部导航栏
│   ├── directives/       # 自定义指令
│   ├── hooks/            # 组合式函数
│   │   ├── useEcharts.ts # ECharts 封装
│   │   └── useHttp.ts    # HTTP 请求封装
│   ├── mock/             # Mock 数据
│   ├── router/           # 路由配置
│   ├── store/            # 状态管理
│   ├── types/            # TypeScript 类型定义
│   ├── utils/            # 工具函数
│   │   ├── axios.ts      # Axios 配置
│   │   ├── performance.ts # 性能优化工具
│   │   └── performanceMonitor.ts # 性能监控
│   ├── views/            # 页面组件
│   │   ├── dashboard/    # 数据面板
│   │   ├── chargingstation/ # 充电站管理
│   │   ├── operations/   # 订单管理
│   │   ├── equipment/    # 会员卡管理
│   │   ├── map/          # 地图
│   │   └── User/         # 个人中心
│   ├── App.vue           # 根组件
│   └── main.ts           # 入口文件
├── public/               # 公共资源
├── PERFORMANCE.md        # 性能优化文档
├── package.json          # 项目配置
├── vite.config.ts        # Vite 配置
└── tsconfig.json         # TypeScript 配置
```

## 🚀 快速开始

### 环境要求

- Node.js >= 16.0.0
- npm >= 7.0.0 或 pnpm >= 6.0.0

### 安装依赖

```bash
npm install
# 或
pnpm install
```

### 开发环境

```bash
npm run dev
```


### 生产构建

```bash
npm run build
```

### 预览构建结果

```bash
npm run preview
```

## 👤 默认账号

```
用户名：admin
密码：任意（3-5位字符）
```

## 🎯 核心功能模块

### 1. 仪表盘（Dashboard）
- 设备运行状态实时监控
- 能源统计图表展示
- 营收数据可视化
- 故障报警时间线

### 2. 充电站管理
- 充电站列表管理
- 充电桩状态监控
- 营收统计分析
- 故障设备管理

### 3. 运营管理
- 订单列表查询
- 订单详情查看
- 营收总览统计

### 4. 地图功能
- 充电站地理位置展示
- 地图标记和交互

### 5. 权限管理
- 基于角色的访问控制
- 路由级别权限控制
- 按钮级别权限控制

### 6. 个人中心
- 个人信息管理
- 日历功能
- 待办事项

## ⚡ 性能优化

本项目已实施多项性能优化措施，详见 [PERFORMANCE.md](./PERFORMANCE.md)

### 主要优化点

- ✅ 路由懒加载 + Chunk 命名
- ✅ ECharts 按需引入（体积减少 70%）
- ✅ Vite 打包优化（手动分包）
- ✅ 请求防抖和取消机制
- ✅ ResizeObserver 替代 window.resize
- ✅ requestIdleCallback 延迟初始化
- ✅ 性能监控工具

### 性能指标（优化后）

- 首屏加载时间：< 1.5s
- FCP：< 1.8s
- LCP：< 2.5s
- 包体积：< 1.2MB

## 🔧 配置说明

### 环境变量

创建 `.env.development` 和 `.env.production` 文件：

```env
# API 基础路径
VITE_API_URL=https://api.example.com

# 高德地图 Key
VITE_AMAP_KEY=your_amap_key
```

### 代理配置

在 `vite.config.ts` 中配置开发服务器代理：

```typescript
server: {
  proxy: {
    '/api': {
      target: 'http://localhost:3000',
      changeOrigin: true,
      rewrite: (path) => path.replace(/^\/api/, '')
    }
  }
}
```

## 📝 开发规范

### 代码风格

- 使用 TypeScript 进行类型检查
- 遵循 Vue 3 Composition API 规范
- 使用 ESLint + Prettier 格式化代码

### 命名规范

- 组件名：PascalCase（如 `UserProfile.vue`）
- 文件名：kebab-case（如 `user-profile.ts`）
- 变量名：camelCase（如 `userName`）
- 常量名：UPPER_SNAKE_CASE（如 `API_BASE_URL`）

### Git 提交规范

```
feat: 新功能
fix: 修复 bug
docs: 文档更新
style: 代码格式调整
refactor: 重构
perf: 性能优化
test: 测试相关
chore: 构建/工具链相关
```

## 🐛 常见问题

### 1. 端口被占用

修改 `vite.config.ts` 中的端口配置：

```typescript
server: {
  port: 5174
}
```

### 2. Mock 数据不生效

确保 `src/mock/index.ts` 已在 `main.ts` 中引入

### 3. 路由 404

检查路由配置和组件路径是否正确

## 📄 License

MIT License

## 👥 贡献者

欢迎提交 Issue 和 Pull Request！

## 📞 联系方式

qq : 3118027323




**最后更新：** 2025-02-21
