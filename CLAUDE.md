# CLAUDE.md

本文件为 Claude Code (claude.ai/code) 在处理本仓库代码时提供指导。

## 仓库概述
本仓库包含 `githubputskill` Claude Code 技能，用于实现 GitHub PUT API 功能。

## 目录结构
```
/skill/
└── githubputskill/     # 主技能实现目录
```

## 技能要求
`githubputskill` 技能必须满足以下要求：
1. 使用 Octokit 实现 GitHub API PUT 功能
2. 支持更新仓库中的文件
3. 支持更新仓库设置
4. 正确处理身份验证
5. 提供清晰的错误处理
6. 模块化且易于测试
7. 与用户交流时必须使用中文进行汇报和沟通

## 开发命令
- 初始化 npm 项目：`npm init -y`（在 `githubputskill/` 目录下运行）
- 安装依赖：`npm install @octokit/rest`（在 `githubputskill/` 目录下运行）
- 运行测试：`npm test`（待实现）
- 构建：本 Node.js 技能无需构建步骤

## 关键实现说明
- 使用 Octokit 库进行 GitHub API 交互
- 为不同的 GitHub PUT 操作实现模块化函数
- 遵循 Node.js 最佳实践
- 若适用，包含 TypeScript 类型定义
- 使用个人访问令牌测试实际 GitHub 仓库（避免提交令牌）
