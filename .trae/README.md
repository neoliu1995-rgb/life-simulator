# Trae AI 项目保护系统

## 简介

这是一个为你的项目设计的自动保护系统，确保所有操作都有备份、可追溯、可恢复。

## 核心功能

### 1. 🛡️ 自动快照
每个任务开始前自动创建Git快照，即使搞砸了也能一键恢复。

### 2. ⚠️ 风险评估
自动检测危险命令，在执行前警告并要求确认。

### 3. 🔄 快速恢复
多种恢复方式，支持恢复到任意历史版本。

### 4. 📋 操作日志
所有重要操作都有记录，方便追溯和审计。

## 快速开始

### 首次使用
系统已自动初始化，可以直接使用。

### 日常使用

#### 创建任务快照
```powershell
. .trae\auto_protect.ps1 -Action protect -TaskId "新功能开发"
```

#### 查看所有备份
```powershell
. .trae\auto_protect.ps1 -Action backups
```

#### 恢复版本
```powershell
# 恢复到安全备份
. .trae\auto_protect.ps1 -Action restore -RecoveryPoint "backup-before-work"

# 恢复到特定快照
. .trae\auto_protect.ps1 -Action restore -RecoveryPoint "backup/snapshot-20260516-140556"
```

#### 检查命令风险
```powershell
. .trae\auto_protect.ps1 -Action check -TaskId "git reset --hard"
```

## 文件结构

```
.trae/
├── project_rules.md        # 完整的保护规则和执行规范
├── protection_config.json  # 保护配置（可自定义）
├── auto_protect.ps1        # 自动保护脚本
├── snapshots.log          # 快照日志
├── operation_log.md       # 操作日志
├── task_checklist.md     # 任务检查清单
└── QUICK_REFERENCE.md    # 快速参考指南
```

## 风险等级

### 🔴 高风险（需二次确认）
- `git reset --hard`
- `git clean -f`
- `rm -rf`
- `git push --force`
- 删除文件或目录

### 🟡 中风险（需明确目的）
- `git checkout`
- `npm install`
- 修改配置文件
- 批量文件操作

### 🟢 低风险（可自动执行）
- `git status`
- `git diff`
- `git log`
- 查看操作

## 备份分支

- **backup-before-work** - 永久安全备份点
- **backup/snapshot-*** - 自动创建的快照分支

## 保护策略

1. **严格模式（默认）**：所有操作前检查
2. **标准模式**：危险操作前检查
3. **宽松模式**：仅自动备份

可在 `protection_config.json` 中修改模式。

## 自定义配置

编辑 `.trae/protection_config.json` 来自定义：

- 风险命令列表
- 白名单命令
- 备份保留策略
- 通知设置

## 常见问题

### Q: 如何禁用保护系统？
A: 将 `protection_config.json` 中的 `"enabled"` 改为 `false`

### Q: 快照会自动清理吗？
A: 默认保留30天，可在配置中修改

### Q: 能否恢复到远程仓库的版本？
A: 可以，使用 `git fetch` 拉取远程分支，然后恢复

### Q: 操作日志在哪里？
A: `.trae/operation_log.md`

## 最佳实践

1. **每个任务都创建快照**
2. **危险操作前手动确认**
3. **定期检查备份完整性**
4. **保持操作日志更新**

## 紧急情况

### 代码损坏怎么办？
```powershell
# 一键恢复到安全备份
git reset --hard backup-before-work
```

### 想查看所有可恢复的版本？
```powershell
. .trae\auto_protect.ps1 -Action backups
```

### 想查看最近的Git操作？
```powershell
git reflog
```

## 反馈与支持

如有问题或建议，请：
1. 查看 `.trae/project_rules.md` 获取详细文档
2. 查看 `.trae/QUICK_REFERENCE.md` 获取快速参考
3. 查看 `.trae/task_checklist.md` 获取任务执行模板

---

**版本**: 1.0
**创建日期**: 2026-05-16
**状态**: ✅ 已激活
