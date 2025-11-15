# GitHubPutSkill Claude Code 技能

这是一个用于实现 GitHub API 操作的 Claude Code 技能，支持自动创建仓库、批量上传文档等完整流程，基于 Octokit 库开发。

## 版本

v2.0.0 - 新增仓库创建和批量上传功能

## 功能特性

### ✅ 核心功能
- **创建 GitHub 仓库**：支持个人和组织仓库创建
- **批量上传文件**：一次性上传多个项目文档
- **文件操作**：创建或更新单个文件
- **仓库管理**：修改仓库设置、议题和拉取请求

### 🔧 增强特性
- **完整流程自动化**：一句指令完成从仓库创建到文档上传的全流程
- **自动 Base64 编码**：无需手动处理文件内容编码
- **清晰的错误处理**：提供详细的操作结果和错误信息
- **兼容旧版 API**：保留 updateFile 方法以保证向后兼容

## 安装依赖

```bash
npm install
```

## 使用方法

### 基本使用

```javascript
const GitHubPutSkill = require('./index');

// 初始化技能
const skill = new GitHubPutSkill({
    auth: 'your-personal-access-token' // GitHub 个人访问令牌（需要 repo 权限）
});
```

### 🎯 完整流程：创建仓库并上传文档

```javascript
// 配置仓库信息
const repoConfig = {
    name: 'your-repo-name', // 唯一的仓库名称
    description: '仓库描述',
    private: false // 是否私有
};

// 准备文档列表
const projectDocs = [
    {
        path: 'README.md',
        content: '# 项目名称\n这是项目介绍'
    },
    {
        path: 'docs/快速开始.md',
        content: '# 快速开始\n安装依赖: npm install'
    },
    {
        path: '.gitignore',
        content: 'node_modules/\n.env'
    }
];

// 执行完整流程
async function createAndUpload() {
    try {
        const result = await skill.createRepoAndUploadDocs({
            repoConfig,
            docs: projectDocs,
            commitMessage: 'Initialize project with documentation'
        });

        console.log('操作成功:', result.message);
        console.log('仓库地址:', result.repoInfo.repoUrl);
        console.log('上传文件数:', result.uploadInfo.successCount);
    } catch (error) {
        console.error('操作失败:', error);
    }
}

createAndUpload();
```

### 📁 创建 GitHub 仓库

```javascript
async function createRepository() {
    try {
        const result = await skill.createRepo({
            name: 'new-repo',
            description: '新仓库描述',
            private: true,
            // org: 'your-organization' // 组织仓库（可选）
        });

        console.log('仓库创建成功:', result.repoUrl);
    } catch (error) {
        console.error('仓库创建失败:', error);
    }
}
```

### 📄 批量上传文件

```javascript
async function batchUpload() {
    try {
        const result = await skill.batchUploadFiles({
            owner: 'your-username',
            repo: 'your-repo',
            files: [
                {
                    path: 'docs/api.md',
                    content: '# API 文档'
                },
                {
                    path: 'src/index.js',
                    content: 'console.log("Hello World");'
                }
            ],
            message: '批量上传项目文件'
        });

        console.log('上传成功:', result.successCount);
        console.log('总文件数:', result.total);
    } catch (error) {
        console.error('上传失败:', error);
    }
}
```

### 📝 创建/更新单个文件

```javascript
async function createOrUpdate() {
    try {
        const result = await skill.createOrUpdateFile({
            owner: 'your-username',
            repo: 'your-repo',
            path: 'new-file.txt',
            message: 'Create new file',
            content: '文件内容'
        });

        console.log('操作成功:', result.data);
    } catch (error) {
        console.error('操作失败:', error);
    }
}
```

## 命令行工具

项目包含一个演示脚本，可直接运行体验完整功能：

```bash
node demo.js
```

## 安全提示

- 请勿将 GitHub 个人访问令牌（PAT）硬编码到代码中
- 在实际使用中建议通过环境变量 `GITHUB_TOKEN` 管理令牌
- 确保令牌仅包含必要的权限范围（推荐：`repo`、`public_repo`）

## 依赖说明

- `@octokit/rest`：GitHub API 的 Node.js 客户端库
- 其他依赖请参考 `package.json` 文件

## 许可证

ISC
