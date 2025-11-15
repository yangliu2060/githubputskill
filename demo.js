#!/usr/bin/env node

const GitHubPutSkill = require('./index');
const fs = require('fs');
const path = require('path');

// 提示用户输入GitHub令牌
console.log('请输入您的GitHub个人访问令牌（需要repo权限）：');

// 读取用户输入
process.stdin.once('data', (data) => {
    const authToken = data.toString().trim();

    // 初始化技能
    const skill = new GitHubPutSkill({ auth: authToken });

    // 配置示例
    const repoConfig = {
        name: 'test-githubputskill-repo', // 请修改为唯一的仓库名称
        description: '由GitHubPutSkill自动创建的测试仓库',
        isPrivate: false // 是否私有
    };

    // 示例文档列表
    const projectDocs = [
        {
            path: 'README.md',
            content: `# 测试仓库

这是一个由 GitHubPutSkill 自动创建和初始化的测试仓库。

## 功能特性
- 自动创建GitHub仓库
- 批量上传项目文档
- 支持自定义提交信息
- 兼容个人和组织仓库

## 使用说明
1. 获取GitHub个人访问令牌
2. 初始化GitHubPutSkill
3. 配置仓库信息
4. 准备文档列表
5. 执行创建和上传操作`
        },
        {
            path: 'docs/快速开始.md',
            content: `# 快速开始

## 安装依赖
npm install

## 配置环境
1. 创建 .env 文件
2. 配置 GitHub 令牌

## 运行项目
npm start`
        },
        {
            path: '.gitignore',
            content: `# 依赖目录
node_modules/

# 日志文件
logs/
*.log

# 配置文件
.env
.env.local

# 编译输出
dist/
build/`
        }
    ];

    // 执行完整流程
    console.log('\n正在执行仓库创建和文档上传...');
    skill.createRepoAndUploadDocs({
        repoConfig,
        docs: projectDocs,
        commitMessage: 'Initialize project with auto-generated documentation'
    })
    .then(result => {
        if (result.success) {
            console.log('✅ 操作成功！');
            console.log('📦 仓库地址：', result.repoInfo.repoUrl);
            console.log('📄 上传文档数量：', result.uploadInfo.successCount);
            console.log('📝 提交信息：', 'Initialize project with auto-generated documentation');
            console.log('\n🎉 仓库已准备就绪，可以开始使用了！');
        } else {
            console.error('❌ 操作失败：', result.error.message);
        }
    })
    .catch(error => {
        console.error('❌ 发生错误：', error.message);
    });
});
