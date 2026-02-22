# 📤 GitHub 上传指南

## 🚀 快速上传到 GitHub

### 步骤 1：创建 GitHub 仓库

1. 登录 [GitHub](https://github.com)
2. 点击右上角的 `+` → `New repository`
3. 填写仓库信息：
   - **Repository name**: `energy-management-platform`（或你喜欢的名字）
   - **Description**: `基于 Vue 3 + TypeScript 的现代化能源管理后台系统`
   - **Public/Private**: 选择 Public（公开）
   - **不要勾选** "Initialize this repository with a README"
4. 点击 `Create repository`

### 步骤 2：初始化本地仓库

打开终端，进入项目目录：

```bash
cd d:\能源岗管理项目平台\my-vue-admin
```

### 步骤 3：初始化 Git 并提交

```bash
# 初始化 Git 仓库
git init

# 添加所有文件
git add .

# 提交
git commit -m "feat: initial commit"

# 重命名分支为 main
git branch -M main

# 添加远程仓库（替换为你的 GitHub 用户名）
git remote add origin https://github.com/your-username/energy-management-platform.git

# 推送到 GitHub
git push -u origin main
```

### 步骤 4：替换 README 中的占位符

在上传前，请替换以下文件中的占位符：

#### `README_GITHUB.md`
- `your-username` → 你的 GitHub 用户名
- `Your Name` → 你的名字
- `your.email@example.com` → 你的邮箱
- `https://your-demo-url.com` → 你的演示地址（如果有）

#### `CONTRIBUTING.md`
- `your.email@example.com` → 你的邮箱

#### `LICENSE`
- `[Your Name]` → 你的名字

### 步骤 5：重命名 README

```bash
# 删除原来的 README
rm README.md

# 重命名 GitHub 版本的 README
mv README_GITHUB.md README.md

# 提交更改
git add .
git commit -m "docs: update README for GitHub"
git push
```

### 步骤 6：添加项目截图（可选但推荐）

1. 创建 `screenshots` 目录
2. 添加项目截图：
   - `dashboard.png` - 仪表盘截图
   - `charging-station.png` - 充电站管理截图
   - `map.png` - 地图截图
   - `data-analysis.png` - 数据分析截图

```bash
# 创建截图目录
mkdir screenshots

# 添加截图后提交
git add screenshots/
git commit -m "docs: add project screenshots"
git push
```

### 步骤 7：设置 GitHub Pages（可选）

如果想要部署在线演示：

1. 进入仓库的 `Settings` → `Pages`
2. Source 选择 `GitHub Actions`
3. 创建部署工作流（已包含在 `.github/workflows/ci.yml` 中）

## 📝 上传前检查清单

- [ ] 已替换所有占位符（用户名、邮箱等）
- [ ] 已添加项目截图
- [ ] 已删除敏感信息（API Key、密码等）
- [ ] 已测试项目可以正常运行
- [ ] 已更新 package.json 中的项目信息
- [ ] 已检查 .gitignore 文件

## 🎯 推荐的仓库设置

### 添加 Topics（标签）

在仓库页面点击 `Add topics`，添加：
- `vue3`
- `typescript`
- `vite`
- `element-plus`
- `echarts`
- `admin-dashboard`
- `energy-management`
- `pinia`
- `vue-router`

### 设置 About

在仓库页面右侧的 About 部分：
- **Description**: `基于 Vue 3 + TypeScript 的现代化能源管理后台系统`
- **Website**: 你的演示地址（如果有）
- **Topics**: 添加相关标签

### 启用 Issues 和 Discussions

在 `Settings` → `General` 中：
- ✅ Issues
- ✅ Discussions（可选）

## 🔒 安全提示

### 不要上传的内容

- ❌ `.env` 文件（包含敏感信息）
- ❌ `node_modules` 目录
- ❌ API 密钥和密码
- ❌ 个人身份信息

### 如果不小心上传了敏感信息

```bash
# 从历史记录中删除文件
git filter-branch --force --index-filter \
  "git rm --cached --ignore-unmatch path/to/sensitive/file" \
  --prune-empty --tag-name-filter cat -- --all

# 强制推送
git push origin --force --all
```

## 📊 GitHub 仓库优化建议

### 1. 添加 Badges（徽章）

在 README 顶部已经包含了常用徽章：
- Vue 版本
- TypeScript 版本
- Vite 版本
- Element Plus 版本
- License

### 2. 创建 Release

当项目稳定后，创建第一个 Release：

1. 进入仓库的 `Releases` 页面
2. 点击 `Create a new release`
3. Tag version: `v1.0.0`
4. Release title: `v1.0.0 - 初始版本`
5. 描述主要功能和变更
6. 点击 `Publish release`

### 3. 设置 Branch Protection

在 `Settings` → `Branches` 中：
- 保护 `main` 分支
- 要求 PR 审核
- 要求 CI 通过

## 🎉 完成！

现在你的项目已经成功上传到 GitHub！

### 下一步

1. 分享你的项目链接
2. 邀请其他开发者贡献
3. 持续更新和维护
4. 收集用户反馈

### 推广建议

- 在社交媒体分享
- 提交到 awesome-vue 列表
- 写技术博客介绍项目
- 参与相关技术社区讨论

---

**祝你的项目获得更多 ⭐ Star！**


