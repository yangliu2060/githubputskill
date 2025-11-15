const GitHubPutSkill = require('./index');

// 注意：本测试需要GitHub令牌和实际测试环境
// 请在运行前设置环境变量或修改以下配置
const testConfig = {
    auth: process.env.GITHUB_TOKEN || 'your-personal-access-token',
    testRepoName: `test-githubputskill-${Date.now()}`,
    testOwner: 'your-username'
};

// 创建测试实例
const skill = new GitHubPutSkill({ auth: testConfig.auth });

// 测试顺序：createRepo -> batchUploadFiles -> createRepoAndUploadDocs

async function runAllTests() {
    console.log('=== GitHubPutSkill 完整功能测试开始 ===\n');

    try {
        // 测试1：创建仓库
        console.log('测试1：创建仓库...');
        const repoResult = await skill.createRepo({
            name: testConfig.testRepoName,
            description: '测试仓库',
            isPrivate: true
        });

        if (!repoResult.success) {
            throw new Error(`创建仓库失败：${repoResult.error.message}`);
        }
        console.log(`✅ 仓库创建成功：${repoResult.repoUrl}\n`);

        // 测试2：批量上传文件
        console.log('测试2：批量上传文件...');
        const uploadResult = await skill.batchUploadFiles({
            owner: repoResult.owner,
            repo: repoResult.repo,
            files: [
                {
                    path: 'README.md',
                    content: '# 测试仓库'
                },
                {
                    path: 'test.txt',
                    content: '测试内容'
                }
            ],
            message: '批量上传测试文件'
        });

        if (!uploadResult.success) {
            throw new Error(`批量上传失败：${uploadResult.error.message}`);
        }
        console.log(`✅ 文件上传成功，共上传 ${uploadResult.successCount}/${uploadResult.total} 个文件\n`);

        // 测试3：完整流程
        console.log('测试3：完整流程 - 创建仓库并上传文档...');
        const completeResult = await skill.createRepoAndUploadDocs({
            repoConfig: {
                name: `${testConfig.testRepoName}-complete`,
                description: '完整流程测试仓库',
                isPrivate: true
            },
            docs: [
                {
                    path: 'README.md',
                    content: '# 完整流程测试'
                },
                {
                    path: 'docs/test.md',
                    content: '测试文档'
                }
            ]
        });

        if (!completeResult.success) {
            throw new Error(`完整流程失败：${completeResult.error.message}`);
        }
        console.log(`✅ 完整流程成功：${completeResult.repoInfo.repoUrl}\n`);

        console.log('=== GitHubPutSkill 完整功能测试通过！===');
        console.log('\n测试总结：');
        console.log('1. 仓库创建功能正常');
        console.log('2. 批量上传文件功能正常');
        console.log('3. 完整流程功能正常');
        console.log('\n注意：请手动清理测试创建的仓库');

    } catch (error) {
        console.error('=== GitHubPutSkill 测试失败 ===');
        console.error('错误信息：', error.message);
        console.error('错误详情：', error);
    }
}

// 执行测试
runAllTests();
