@echo off
echo ========================================
echo 项目清理脚本 - 准备提交到 GitHub
echo ========================================
echo.

echo [1/5] 检查项目结构...
if exist node_modules (
    echo ✓ 发现 node_modules 目录
) else (
    echo ✓ node_modules 目录不存在
)

if exist dist (
    echo ✓ 发现 dist 目录
) else (
    echo ✓ dist 目录不存在
)

echo.
echo [2/5] 清理构建产物和缓存...
if exist dist rmdir /s /q dist
if exist dist-ssr rmdir /s /q dist-ssr
if exist .cache rmdir /s /q .cache
if exist .temp rmdir /s /q .temp
if exist .tmp rmdir /s /q .tmp
echo ✓ 清理完成

echo.
echo [3/5] 清理日志文件...
if exist logs rmdir /s /q logs
del /q *.log 2>nul
echo ✓ 日志清理完成

echo.
echo [4/5] 检查 .gitignore 文件...
if exist .gitignore (
    echo ✓ .gitignore 文件存在
) else (
    echo ✗ 警告: .gitignore 文件不存在！
)

echo.
echo [5/5] 项目大小统计...
echo 正在计算项目大小（不含 node_modules）...
powershell -Command "Get-ChildItem -Recurse -File | Where-Object {$_.FullName -notlike '*node_modules*' -and $_.FullName -notlike '*.git*'} | Measure-Object -Property Length -Sum | Select-Object @{Name='Size(MB)';Expression={[math]::Round($_.Sum/1MB,2)}}"

echo.
echo ========================================
echo 清理完成！
echo ========================================
echo.
echo 下一步操作：
echo 1. 检查是否有敏感信息（密码、API Key 等）
echo 2. 运行 npm run build 确保项目可以正常构建
echo 3. 使用 git status 查看将要提交的文件
echo 4. 使用 git add . 添加文件
echo 5. 使用 git commit -m "feat: initial commit" 提交
echo.
pause

