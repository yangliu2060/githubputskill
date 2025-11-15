const { Octokit } = require('@octokit/rest');

class GitHubPutSkill {
    /**
     * 初始化 GitHubPutSkill
     * @param {Object} options - 配置选项
     * @param {string} options.auth - GitHub 个人访问令牌 (PAT)
     * @param {Object} [options.octokit] - 已配置的 Octokit 实例（可选）
     */
    constructor(options) {
        if (!options.auth && !options.octokit) {
            throw new Error('必须提供 GitHub 个人访问令牌或已配置的 Octokit 实例');
        }

        this.octokit = options.octokit || new Octokit({
            auth: options.auth,
            userAgent: 'GitHubPutSkill/2.0.0',
            baseUrl: 'https://api.github.com'
        });
    }

    /**
     * 创建 GitHub 仓库
     * @param {Object} params - 参数对象
     * @param {string} params.name - 仓库名称（必填）
     * @param {string} [params.description] - 仓库描述
     * @param {boolean} [params.isPrivate=false] - 是否私有
     * @param {string} [params.org] - 组织名称（可选，创建到组织）
     * @param {boolean} [params.auto_init=false] - 是否自动初始化
     * @returns {Promise<Object>} - 创建结果
     */
    async createRepo(params) {
        try {
            if (!params.name) {
                throw new Error('仓库名称是必填项');
            }

            const { name, description = '', isPrivate = false, org, auto_init = false } = params;

            // 根据是否有组织选择不同的创建方法
            const createMethod = org
                ? this.octokit.repos.createInOrg
                : this.octokit.repos.createForAuthenticatedUser;

            const response = await createMethod({
                name,
                description,
                private: isPrivate,
                auto_init,
                ...(org && { org })
            });

            return {
                success: true,
                data: response.data,
                repoUrl: response.data.html_url,
                cloneUrl: response.data.clone_url,
                owner: response.data.owner.login,
                repo: response.data.name
            };
        } catch (error) {
            return {
                success: false,
                error: {
                    message: error.message,
                    status: error.status,
                    details: error.response?.data?.errors || []
                }
            };
        }
    }

    /**
     * 创建或更新文件（兼容新旧文件）
     * @param {Object} params - 参数对象
     * @param {string} params.owner - 仓库所有者
     * @param {string} params.repo - 仓库名称
     * @param {string} params.path - 文件路径
     * @param {string} params.message - 提交信息
     * @param {string} params.content - 文件内容（Base64 编码或普通字符串）
     * @param {string} [params.sha] - 当前文件 SHA（更新时需要）
     * @returns {Promise<Object>} - 操作结果
     */
    async createOrUpdateFile(params) {
        try {
            // 如果内容不是 Base64 编码，则自动编码
            const content = typeof params.content === 'string' && !Buffer.from(params.content, 'base64').toString('base64') === params.content
                ? Buffer.from(params.content).toString('base64')
                : params.content;

            const response = await this.octokit.repos.createOrUpdateFileContents({
                owner: params.owner,
                repo: params.repo,
                path: params.path,
                message: params.message,
                content: content,
                sha: params.sha
            });

            return {
                success: true,
                data: response.data,
                commit: response.data.commit,
                content: response.data.content
            };
        } catch (error) {
            return {
                success: false,
                error: {
                    message: error.message,
                    status: error.status,
                    details: error.response?.data?.errors || []
                }
            };
        }
    }

    /**
     * 批量上传文件
     * @param {Object} params - 参数对象
     * @param {string} params.owner - 仓库所有者
     * @param {string} params.repo - 仓库名称
     * @param {Array<Object>} params.files - 文件列表 [{ path, content }]
     * @param {string} params.message - 提交信息
     * @returns {Promise<Object>} - 批量上传结果
     */
    async batchUploadFiles(params) {
        try {
            const { owner, repo, files, message } = params;

            if (!Array.isArray(files) || files.length === 0) {
                throw new Error('文件列表不能为空');
            }

            const results = [];

            for (const file of files) {
                const { path, content, sha } = file;

                if (!path) {
                    throw new Error('每个文件必须包含 path 属性');
                }
                if (!content) {
                    throw new Error('每个文件必须包含 content 属性');
                }

                const result = await this.createOrUpdateFile({
                    owner,
                    repo,
                    path,
                    message: file.message || message,
                    content,
                    sha
                });

                results.push({
                    path,
                    result
                });
            }

            return {
                success: true,
                total: files.length,
                successCount: results.filter(r => r.result.success).length,
                results
            };
        } catch (error) {
            return {
                success: false,
                error: {
                    message: error.message,
                    status: error.status
                }
            };
        }
    }

    /**
     * 完整流程：创建仓库 + 上传项目文档
     * @param {Object} params - 参数对象
     * @param {Object} params.repoConfig - 仓库配置（同 createRepo）
     * @param {Array<Object>} params.docs - 文档列表 [{ path, content }]
     * @param {string} [params.commitMessage] - 提交信息
     * @returns {Promise<Object>} - 完整流程结果
     */
    async createRepoAndUploadDocs(params) {
        try {
            const { repoConfig, docs, commitMessage = 'Initialize project with documentation' } = params;

            // 步骤1：创建仓库
            const repoResult = await this.createRepo(repoConfig);
            if (!repoResult.success) {
                return repoResult;
            }

            const { owner, repo } = repoResult;

            // 步骤2：上传文档
            const uploadResult = await this.batchUploadFiles({
                owner,
                repo,
                files: docs,
                message: commitMessage
            });

            if (!uploadResult.success) {
                return uploadResult;
            }

            return {
                success: true,
                repoInfo: repoResult,
                uploadInfo: uploadResult,
                message: `仓库创建并上传文档成功：${repoResult.repoUrl}`
            };
        } catch (error) {
            return {
                success: false,
                error: {
                    message: error.message,
                    status: error.status
                }
            };
        }
    }

    /**
     * 更新仓库中的文件
     * @deprecated 使用 createOrUpdateFile 替代
     */
    async updateFile(params) {
        return this.createOrUpdateFile(params);
    }

    /**
     * 更新仓库设置
     * @param {Object} params - 参数对象
     * @param {string} params.owner - 仓库所有者
     * @param {string} params.repo - 仓库名称
     * @param {Object} params.repoData - 仓库设置数据
     * @returns {Promise<Object>} - 更新后的仓库信息
     */
    async updateRepoSettings(params) {
        try {
            const response = await this.octokit.repos.update({
                owner: params.owner,
                repo: params.repo,
                ...params.repoData
            });

            return {
                success: true,
                data: response.data
            };
        } catch (error) {
            return {
                success: false,
                error: {
                    message: error.message,
                    status: error.status
                }
            };
        }
    }

    /**
     * 更新议题
     * @param {Object} params - 参数对象
     * @param {string} params.owner - 仓库所有者
     * @param {string} params.repo - 仓库名称
     * @param {number} params.issueNumber - 议题编号
     * @param {Object} params.issueData - 议题数据
     * @returns {Promise<Object>} - 更新后的议题信息
     */
    async updateIssue(params) {
        try {
            const response = await this.octokit.issues.update({
                owner: params.owner,
                repo: params.repo,
                issue_number: params.issueNumber,
                ...params.issueData
            });

            return {
                success: true,
                data: response.data
            };
        } catch (error) {
            return {
                success: false,
                error: {
                    message: error.message,
                    status: error.status
                }
            };
        }
    }

    /**
     * 更新拉取请求
     * @param {Object} params - 参数对象
     * @param {string} params.owner - 仓库所有者
     * @param {string} params.repo - 仓库名称
     * @param {number} params.prNumber - 拉取请求编号
     * @param {Object} params.prData - 拉取请求数据
     * @returns {Promise<Object>} - 更新后的拉取请求信息
     */
    async updatePullRequest(params) {
        try {
            const response = await this.octokit.pulls.update({
                owner: params.owner,
                repo: params.repo,
                pull_number: params.prNumber,
                ...params.prData
            });

            return {
                success: true,
                data: response.data
            };
        } catch (error) {
            return {
                success: false,
                error: {
                    message: error.message,
                    status: error.status
                }
            };
        }
    }
}

module.exports = GitHubPutSkill;
