# 面辅精灵 (MianFu Agent)

一款基于 AI 的智能面试辅助系统，帮助求职者进行模拟面试训练。支持文字对话、语音识别和简历解析，提供专业的面试评估报告。

## 功能特点

- 🎯 **岗位定制面试** - 根据目标岗位生成针对性的面试问题
- 📄 **简历智能解析** - 上传简历截图，AI 自动分析并生成开场问题
- 🎤 **语音输入支持** - 实时语音识别，模拟真实面试场景
- 📊 **面试评估报告** - 多维度能力评分 + 逐题复盘 + 改进建议
- 💾 **历史记录保存** - 本地存储面试记录，随时回顾

## 技术栈

**后端**
- Python 3.9+
- FastAPI
- 阿里云 DashScope (通义千问)

**前端**
- 微信小程序原生开发
- TypeScript

## 目录结构

```
MF_agent/
├── mianfu_backend/       # 后端服务
│   └── main.py           # FastAPI 主程序
├── miniprogram-1/        # 微信小程序
│   ├── miniprogram/      # 小程序源码
│   │   ├── pages/        # 页面
│   │   │   ├── home/     # 首页（岗位选择）
│   │   │   │   ├── index/    # 主聊天页
│   │   │   │   ├── history/  # 历史记录
│   │   │   │   ├── profile/  # 个人中心
│   │   │   │   └── hr-config/# HR 配置
│   │   ├── config/       # 配置文件
│   │   └── utils/        # 工具函数
│   └── typings/          # TypeScript 类型定义
├── .env.example          # 环境变量示例
├── requirements.txt      # Python 依赖
└── README.md
```

## 快速开始

### 1. 环境准备

```bash
# 克隆项目
git clone <repository-url>
cd MF_agent

# 创建 Python 虚拟环境（推荐）
python -m venv venv

# Windows 激活
venv\Scripts\activate

# 安装依赖
pip install -r requirements.txt
```

### 2. 配置 API Key

```bash
# 复制环境变量示例文件
cp .env.example .env

# 编辑 .env 文件，填入你的 DashScope API Key
# DASHSCOPE_API_KEY=sk-your-api-key-here
```

获取 API Key: [阿里云 DashScope 控制台](https://dashscope.console.aliyun.com/)

### 3. 启动后端服务

```bash
cd mianfu_backend

# 方式一：直接运行
python main.py

# 方式二：使用 uvicorn（支持热重载）
uvicorn main:app --reload --port 8000
```

服务启动后访问 http://localhost:8000 验证运行状态。

### 4. 运行小程序

1. 下载并安装 [微信开发者工具](https://developers.weixin.qq.com/miniprogram/dev/devtools/download.html)
2. 打开微信开发者工具，导入 `miniprogram-1` 目录
3. 在 `miniprogram/config/index.ts` 中确认 `baseUrl` 配置：
   ```typescript
   const ENV = 'development'; // 开发环境
   // 生产环境改为 'production' 并配置实际服务器地址
   ```
4. 点击编译预览

## API 接口

| 接口 | 方法 | 说明 |
|------|------|------|
| `/` | GET | 健康检查 |
| `/chat` | POST | 文字面试对话 |
| `/upload-resume` | POST | 上传简历图片 |
| `/speech-to-text` | POST | 语音转文字 |
| `/generate-report` | POST | 生成面试报告 |

### 接口详情

**POST /chat**
```json
{
  "history": [
    {"role": "user", "content": "你好"},
    {"role": "ai", "content": "你好，请介绍一下你自己"}
  ],
  "job": "前端工程师"
}
```

**POST /generate-report**
```json
{
  "history": [...],
  "job": "前端工程师"
}
```

## 配置说明

### 环境变量

| 变量名 | 必填 | 说明 |
|--------|------|------|
| `DASHSCOPE_API_KEY` | 是 | 阿里云 DashScope API Key |

### 小程序配置

修改 `miniprogram/config/index.ts`：

```typescript
const ENV = 'development'; // 'development' | 'production'

const CONFIG = {
  development: {
    baseUrl: 'http://localhost:8000'
  },
  production: {
    baseUrl: 'https://your-domain.com' // 替换为实际服务器地址
  }
};
```

## 注意事项

1. **API Key 安全** - 请勿将 API Key 提交到 Git 仓库，生产环境务必使用环境变量
2. **小程序域名配置** - 生产环境需要在微信公众平台配置服务器域名白名单
3. **开发环境调试** - 微信开发者工具中需勾选「不校验合法域名」才能连接本地后端
4. **模型配额** - DashScope 有免费额度限制，大量测试请注意用量

## 开发计划

- [ ] 支持更多 AI 模型
- [ ] 添加面试题库功能
- [ ] 支持视频面试模拟
- [ ] 优化语音识别准确率

## License

MIT License
