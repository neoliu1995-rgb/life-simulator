# Trae AI 快速参考指南

## 🚨 紧急情况

### 恢复代码
```powershell
# 恢复到上一个稳定版本
git reset --hard backup-before-work

# 恢复到特定快照
git reset --hard backup/snapshot-20260516-140300
```

### 查看所有备份
```powershell
git branch -a | Select-String backup
```

## 📋 每次任务开始

```powershell
# 1. 创建任务快照
. .trae\auto_protect.ps1 -Action protect -TaskId "新功能开发"

# 2. 检查工作目录
git status

# 3. 如有需要，查看备份
. .trae\auto_protect.ps1 -Action backups
```

## ⚠️ 命令风险检查

### 高风险（需二次确认）
- `git reset --hard` - 丢失未提交的更改
- `git clean -f` - 删除未跟踪文件
- `rm -rf` - 删除文件和目录
- `git push --force` - 覆盖远程历史

### 中风险（需明确目的）
- `git checkout` - 切换分支
- `npm install` - 安装依赖
- 批量文件修改

### 低风险（可自动执行）
- `git status` - 查看状态
- `git diff` - 查看差异
- `git log` - 查看历史

## 🔧 常用命令

```powershell
# 创建快照
. .trae\auto_protect.ps1 -Action protect

# 检查命令风险
. .trae\auto_protect.ps1 -Action check -TaskId "git reset --hard"

# 查看所有备份
. .trae\auto_protect.ps1 -Action backups

# 恢复版本
. .trae\auto_protect.ps1 -Action restore -RecoveryPoint "backup-before-work"
```

## 📝 操作日志

详细日志记录在: `.trae\operation_log.md`

## 🔒 安全分支

- `backup-before-work` - 永久安全备份
- `backup/snapshot-*` - 自动快照
- `backup/stable-*` - 稳定版本

## 📞 获取帮助

查看完整文档: `.trae\project_rules.md`

---

**提示**: 如遇任何问题，先创建快照再操作！
