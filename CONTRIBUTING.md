# 贡献指南

感谢你考虑为本项目做出贡献！

## 🤝 如何贡献

### 报告 Bug

如果你发现了 Bug，请创建一个 Issue 并包含以下信息：

- Bug 的详细描述
- 复现步骤
- 预期行为
- 实际行为
- 截图（如果适用）
- 环境信息（浏览器、操作系统等）

### 提出新功能

如果你有新功能的想法，请创建一个 Issue 并描述：

- 功能的详细说明
- 为什么需要这个功能
- 可能的实现方案

### 提交代码

1. **Fork 项目**
   ```bash
   # 点击 GitHub 页面右上角的 Fork 按钮
   ```

2. **克隆你的 Fork**
   ```bash
   git clone https://github.com/your-username/energy-management-platform.git
   cd energy-management-platform
   ```

3. **创建特性分支**
   ```bash
   git checkout -b feature/your-feature-name
   # 或
   git checkout -b fix/your-bug-fix
   ```

4. **进行修改**
   - 遵循项目的代码规范
   - 添加必要的注释
   - 确保代码通过 ESLint 检查

5. **提交更改**
   ```bash
   git add .
   git commit -m "feat: add some feature"
   ```

   提交信息格式：
   - `feat:` 新功能
   - `fix:` 修复 Bug
   - `docs:` 文档更新
   - `style:` 代码格式调整
   - `refactor:` 重构
   - `perf:` 性能优化
   - `test:` 测试相关
   - `chore:` 构建/工具链相关

6. **推送到你的 Fork**
   ```bash
   git push origin feature/your-feature-name
   ```

7. **创建 Pull Request**
   - 访问你的 Fork 页面
   - 点击 "New Pull Request"
   - 填写 PR 描述
   - 等待审核

## 📝 代码规范

### TypeScript

- 使用 TypeScript 严格模式
- 避免使用 `any` 类型
- 为函数参数和返回值添加类型注解

### Vue 组件

- 使用 Composition API
- 使用 `<script setup>` 语法
- 组件名使用 PascalCase

### 命名规范

- 组件文件：PascalCase（如 `UserProfile.vue`）
- 工具函数文件：camelCase（如 `formatDate.ts`）
- 常量：UPPER_SNAKE_CASE（如 `API_BASE_URL`）

### 代码格式

```bash
# 运行 ESLint 检查
npm run lint

# 自动修复格式问题
npm run lint:fix
```

## ✅ Pull Request 检查清单

在提交 PR 之前，请确保：

- [ ] 代码通过 ESLint 检查
- [ ] 代码通过 TypeScript 类型检查
- [ ] 添加了必要的注释
- [ ] 更新了相关文档
- [ ] 测试了所有改动
- [ ] 提交信息符合规范

## 🎯 开发建议

- 保持 PR 的小而专注
- 一个 PR 只做一件事
- 及时响应 Review 意见
- 保持代码整洁和可读性

## 📞 联系方式

如有任何问题，欢迎通过以下方式联系：

- 创建 Issue
- 发送邮件至 your.email@example.com

再次感谢你的贡献！🎉


