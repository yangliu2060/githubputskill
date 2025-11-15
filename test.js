const GitHubPutSkill = require('./index');

// 测试配置 - 请替换为实际值
const testConfig = {
    auth: 'your-personal-access-token', // GitHub PAT with repo scope
    owner: 'your-username',
    repo: 'test-repo',
    path: 'test.txt',
    message: 'Update test file via GitHubPutSkill',
    content: 'New content for test file',
    sha: '' // 需要先获取文件当前的 SHA
};

// 测试更新文件功能
async function testUpdateFile() {
    try {
        const skill = new GitHubPutSkill({ auth: testConfig.auth });

        // 第一步：获取文件当前的 SHA（需要先实现或手动获取）
        // const fileInfo = await skill.octokit.repos.getContent({
        //     owner: testConfig.owner,
        //     repo: testConfig.repo,
        //     path: testConfig.path
        // });
        // testConfig.sha = fileInfo.data.sha;

        // 第二步：更新文件（需要先设置好 testConfig.sha）
        // const updateResult = await skill.updateFile({
        //     owner: testConfig.owner,
        //     repo: testConfig.repo,
        //     path: testConfig.path,
        //     message: testConfig.message,
        //     content: Buffer.from(testConfig.content).toString('base64'),
        //     sha: testConfig.sha
        // });

        // console.log('文件更新成功:', updateResult);
        console.log('测试准备就绪：GitHubPutSkill 类已创建');
        console.log('请配置 testConfig 并取消注释测试代码以执行完整测试');

    } catch (error) {
        console.error('测试失败:', error.message);
    }
}

// 测试更新仓库设置功能
async function testUpdateRepoSettings() {
    try {
        const skill = new GitHubPutSkill({ auth: testConfig.auth });

        // 示例：更新仓库描述
        // const updateResult = await skill.updateRepoSettings({
        //     owner: testConfig.owner,
        //     repo: testConfig.repo,
        //     repoData: {
        //         description: 'Updated repository description via GitHubPutSkill',
        //         homepage: 'https://example.com'
        //     }
        // });

        // console.log('仓库设置更新成功:', updateResult);
        console.log('仓库设置更新功能测试准备就绪');

    } catch (error) {
        console.error('仓库设置测试失败:', error.message);
    }
}

// 执行测试
async function runTests() {
    console.log('=== GitHubPutSkill 测试开始 ===\n');

    await testUpdateFile();
    console.log('');
    await testUpdateRepoSettings();

    console.log('\n=== GitHubPutSkill 测试结束 ===');
    console.log('请根据需要修改测试配置并取消注释相关代码');
}

runTests();
