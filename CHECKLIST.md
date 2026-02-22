# ✅ GitHub 提交前检查清单

## 📋 必须完成的项目

### 1. 文件清理
- [ ] 已删除 `node_modules` 目录
- [ ] 已删除 `dist` 目录
- [ ] 已删除所有 `.log` 文件
- [ ] 已删除 `.cache`、`.temp`、`.tmp` 目录

### 2. 配置文件
- [ ] `.gitignore` 文件已配置正确
- [ ] 已检查 `.gitignore` 包含 `node_modules`
- [ ] 已检查 `.gitignore` 包含 `dist`
- [ ] 已检查 `.gitignore` 包含 `.env` 文件

### 3. 敏感信息检查
- [ ] 已删除所有 API 密钥
- [ ] 已删除所有密码
- [ ] 已删除所有 Token
- [ ] 已检查 `.env` 文件不会被提交
- [ ] 已检查代码中没有硬编码的敏感信息

### 4. 代码质量
- [ ] 已删除所有 `console.log`（或确认生产环境会自动删除）
- [ ] 已删除所有 `debugger` 语句
- [ ] 已删除注释掉的代码
- [ ] 代码格式化完成

### 5. 文档完善
- [ ] README.md 已更新
- [ ] 已替换 README 中的占位符（用户名、邮箱等）
- [ ] 已添加项目描述
- [ ] 已添加安装和运行说明

### 6. 项目测试
- [ ] 运行 `npm install` 成功
- [ ] 运行 `npm run dev` 成功
- [ ] 运行 `npm run build` 成功
- [ ] 构建后的项目可以正常运行

### 7. Git 配置
- [ ] 已配置 Git 用户名：`git config user.name`
- [ ] 已配置 Git 邮箱：`git config user.email`
- [ ] 已初始化 Git 仓库：`git init`

### 8. 项目大小
- [ ] 项目大小（不含 node_modules）< 50MB
- [ ] 已优化大图片文件
- [ ] 已删除未使用的资源文件

---

## 🚀 提交步骤

### 步骤 1：运行清理脚本
```bash
# Windows
cleanup.bat

# Mac/Linux
chmod +x cleanup.sh
./cleanup.sh
```

### 步骤 2：检查将要提交的文件
```bash
git status
```

### 步骤 3：查看文件大小
```bash
# Windows PowerShell
Get-ChildItem -Recurse -File | Where-Object {$_.FullName -notlike "*node_modules*"} | Measure-Object -Property Length -Sum

# Mac/Linux
du -sh --exclude=node_modules .
```

### 步骤 4：添加文件
```bash
git add .
```

### 步骤 5：检查暂存区
```bash
git status
git diff --cached --stat
```

### 步骤 6：提交
```bash
git commit -m "feat: initial commit - 能源管理平台 v1.0.0"
```

### 步骤 7：添加远程仓库
```bash
git remote add origin https://github.com/your-username/energy-management-platform.git
```

### 步骤 8：推送到 GitHub
```bash
git branch -M main
git push -u origin main
```

---

## ⚠️ 常见问题

### Q: 提示文件太大无法提交？
**A:** GitHub 单个文件限制 100MB，仓库建议 < 1GB
- 检查是否有大文件：`find . -size +50M`
- 使用 Git LFS 管理大文件
- 或删除大文件

### Q: 不小心提交了 node_modules？
**A:** 
```bash
# 从 Git 中删除但保留本地文件
git rm -r --cached node_modules
git commit -m "chore: remove node_modules"
git push
```

### Q: 不小心提交了敏感信息？
**A:** 
```bash
# 从历史记录中删除
git filter-branch --force --index-filter \
  "git rm --cached --ignore-unmatch path/to/file" \
  --prune-empty --tag-name-filter cat -- --all

# 强制推送
git push origin --force --all
```

---

## 📊 项目大小参考

### 理想大小（不含 node_modules）
- ✅ **优秀**: < 10MB
- ⚠️ **良好**: 10-30MB
- ⚠️ **可接受**: 30-50MB
- ❌ **需要优化**: > 50MB

### 如果项目过大，检查：
1. `src/assets` - 图片是否压缩
2. `src/mock/index.ts` - Mock 数据是否过大
3. 是否有未使用的文件
4. 是否有视频或大型资源文件

---

## 🎯 最终确认

在推送前，确认以下命令都成功：

```bash
# 1. 安装依赖
npm install

# 2. 开发环境运行
npm run dev

# 3. 生产环境构建
npm run build

# 4. 预览构建结果
npm run preview
```

如果以上都成功，就可以放心提交了！

---

**准备好了吗？开始提交吧！** 🚀

