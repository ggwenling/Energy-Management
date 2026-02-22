# 🧹 项目清理和优化指南

## 📊 提交前检查清单

### 1️⃣ 删除不必要的文件

#### 自动生成的文件（不需要提交）
```bash
# 删除 node_modules（最大的目录）
rm -rf node_modules

# 删除构建产物
rm -rf dist
rm -rf dist-ssr

# 删除日志文件
rm -rf logs
rm *.log

# 删除缓存
rm -rf .cache
rm -rf .temp
rm -rf .tmp
```

#### 检查大文件
```bash
# 查找大于 1MB 的文件
find . -type f -size +1M -not -path "./node_modules/*" -not -path "./.git/*"

# 或使用 PowerShell（Windows）
Get-ChildItem -Recurse -File | Where-Object {$_.Length -gt 1MB -and $_.FullName -notlike "*node_modules*" -and $_.FullName -notlike "*.git*"} | Select-Object FullName, @{Name="Size(MB)";Expression={[math]::Round($_.Length/1MB,2)}}
```

### 2️⃣ 优化资源文件

#### 图片优化
- 压缩 PNG/JPG 图片（使用 TinyPNG 或 ImageOptim）
- 转换为 WebP 格式
- 删除未使用的图片

#### 检查 assets 目录
```bash
# 查看 assets 目录大小
du -sh src/assets

# Windows PowerShell
Get-ChildItem -Path "src/assets" -Recurse | Measure-Object -Property Length -Sum | Select-Object @{Name="Size(MB)";Expression={[math]::Round($_.Sum/1MB,2)}}
```

### 3️⃣ 清理代码

#### 删除调试代码
- 删除 `console.log`（生产环境会自动删除）
- 删除 `debugger` 语句
- 删除注释掉的代码

#### 删除未使用的依赖
```bash
# 安装依赖分析工具
npm install -g depcheck

# 检查未使用的依赖
depcheck

# 删除未使用的依赖
npm uninstall package-name
```

### 4️⃣ 检查敏感信息

#### 确保没有提交敏感信息
- ❌ API 密钥
- ❌ 密码
- ❌ Token
- ❌ 数据库连接字符串
- ❌ 个人身份信息

#### 检查方法
```bash
# 搜索可能的敏感信息
grep -r "password" --exclude-dir=node_modules .
grep -r "api_key" --exclude-dir=node_modules .
grep -r "secret" --exclude-dir=node_modules .
```

---

## 📦 项目大小优化

### 当前项目结构分析

#### 主要占用空间的部分：
1. **node_modules** - 约 200-500MB（不会提交）
2. **dist** - 约 5-20MB（不会提交）
3. **src/assets** - 图片和静态资源
4. **src/mock** - Mock 数据（可能较大）

### 优化建议

#### 1. Mock 数据优化
如果 `src/mock/index.ts` 文件过大（> 1MB）：

```typescript
// 方案 1：拆分 Mock 文件
// src/mock/user.ts
// src/mock/dashboard.ts
// src/mock/charging.ts

// 方案 2：使用外部 Mock 服务
// 使用 Mock Server 而不是内联数据
```

#### 2. 图片资源优化
```bash
# 压缩图片（推荐工具）
# - TinyPNG: https://tinypng.com/
# - ImageOptim (Mac): https://imageoptim.com/
# - Squoosh: https://squoosh.app/

# 或使用命令行工具
npm install -g imagemin-cli
imagemin src/assets/*.{jpg,png} --out-dir=src/assets/optimized
```

#### 3. 删除未使用的文件
```bash
# 查找可能未使用的文件
# 检查 src/assets 中是否有未引用的图片
```

---

## 🚀 提交前最终检查

### 运行以下命令确保项目正常：

```bash
# 1. 清理并重新安装依赖
rm -rf node_modules
npm install

# 2. 类型检查
npm run build

# 3. 检查项目大小（不包括 node_modules）
du -sh . --exclude=node_modules

# Windows PowerShell
Get-ChildItem -Recurse -File | Where-Object {$_.FullName -notlike "*node_modules*"} | Measure-Object -Property Length -Sum | Select-Object @{Name="Size(MB)";Expression={[math]::Round($_.Sum/1MB,2)}}
```

### 预期项目大小（不含 node_modules）

- ✅ **优秀**: < 10MB
- ⚠️ **可接受**: 10-50MB
- ❌ **需要优化**: > 50MB

---

## 📋 提交步骤

### 1. 初始化 Git（如果还没有）
```bash
git init
```

### 2. 检查将要提交的文件
```bash
# 查看状态
git status

# 查看将要提交的文件大小
git ls-files | xargs du -h | sort -h
```

### 3. 添加文件
```bash
# 添加所有文件
git add .

# 或选择性添加
git add src/
git add public/
git add package.json
git add vite.config.ts
# ... 其他必要文件
```

### 4. 检查暂存区
```bash
# 查看暂存的文件
git diff --cached --stat

# 查看暂存区大小
git count-objects -vH
```

### 5. 提交
```bash
git commit -m "feat: initial commit - 能源管理平台 v1.0.0"
```

---

## 🔍 常见问题

### Q1: 如何查看哪些文件最大？
```bash
# Linux/Mac
find . -type f -not -path "./node_modules/*" -not -path "./.git/*" -exec du -h {} + | sort -rh | head -20

# Windows PowerShell
Get-ChildItem -Recurse -File | Where-Object {$_.FullName -notlike "*node_modules*" -and $_.FullName -notlike "*.git*"} | Sort-Object Length -Descending | Select-Object -First 20 FullName, @{Name="Size(MB)";Expression={[math]::Round($_.Length/1MB,2)}}
```

### Q2: 如何删除 Git 历史中的大文件？
```bash
# 使用 BFG Repo-Cleaner
# 下载: https://rtyley.github.io/bfg-repo-cleaner/

# 删除大于 10MB 的文件
java -jar bfg.jar --strip-blobs-bigger-than 10M .git

# 清理
git reflog expire --expire=now --all
git gc --prune=now --aggressive
```

### Q3: Mock 数据文件太大怎么办？
```bash
# 方案 1：拆分文件
# 将 src/mock/index.ts 拆分为多个小文件

# 方案 2：使用外部 Mock 服务
# 使用 json-server 或其他 Mock 服务

# 方案 3：减少 Mock 数据量
# 只保留必要的测试数据
```

---

## ✅ 最终检查清单

提交前确保：

- [ ] 已删除 `node_modules` 目录
- [ ] 已删除 `dist` 目录
- [ ] 已删除所有日志文件
- [ ] 已优化图片资源
- [ ] 已删除未使用的文件
- [ ] 已检查没有敏感信息
- [ ] 已测试项目可以正常运行
- [ ] 项目大小 < 50MB（不含 node_modules）
- [ ] `.gitignore` 配置正确
- [ ] 已更新 README.md

---

## 📊 项目大小参考

### 正常的 Vue 3 项目大小（不含 node_modules）：

```
src/              5-15 MB
public/           1-5 MB
配置文件          < 1 MB
文档              < 1 MB
----------------------------
总计              10-25 MB
```

### 如果超过 50MB，检查：
- 是否有大的图片/视频文件
- Mock 数据是否过大
- 是否有未使用的资源文件

---

**准备好后，就可以提交到 GitHub 了！** 🚀

