# 微信小程序代码问题修复实施计划

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 修复面辅精灵微信小程序中的所有代码问题，包括语法错误、配置错误、功能缺陷和代码质量问题。

**Architecture:** 按优先级分阶段修复：先修复阻塞性错误（语法、配置），再修复功能问题，最后优化代码质量。每个修复独立提交。

**Tech Stack:** 微信小程序原生开发 + TypeScript + WXSS

---

## 文件变更清单

| 文件 | 操作 | 责任 |
|------|------|------|
| `miniprogram/pages/profile/profile.ts` | 重写 | 修复语法结构错误 |
| `miniprogram/pages/profile/profile.wxss` | 修改 | 删除重复样式代码 |
| `miniprogram/app.json` | 修改 | 修复页面路径配置 |
| `miniprogram/sitemap.json` | 创建 | 添加必需的站点地图配置 |
| `miniprogram/pages/hr-config.ts` | 删除 | 移除重复文件 |
| `miniprogram/pages/hr-config.wxml` | 删除 | 移除重复文件 |
| `miniprogram/pages/hr-config.wxss` | 删除 | 移除重复文件 |
| `miniprogram/pages/hr-config.json` | 删除 | 移除重复文件 |
| `miniprogram/pages/home/home.ts` | 修改 | 添加缺失方法 |
| `miniprogram/pages/home/home.wxml` | 修改 | 删除无用代码 |
| `miniprogram/pages/history/history.ts` | 修改 | 修复数据初始化 |
| `miniprogram/pages/history/history.json` | 修改 | 启用下拉刷新 |
| `miniprogram/pages/index/index.ts` | 修改 | 多处修复 |
| `miniprogram/pages/logs/` | 删除 | 移除未使用的死代码 |
| `miniprogram/utils/util.ts` | 删除 | 移除未使用的工具函数 |

---

## Task 1: 修复 profile.ts 语法结构错误

**Files:**
- Modify: `miniprogram/pages/profile/profile.ts` (全文重写)

- [ ] **Step 1: 重写 profile.ts 文件**

将整个文件重写为正确的 Page 结构：

```typescript
// pages/profile/profile.ts
Page({
  data: {
    // 页面数据占位，可扩展
  },

  // 统一处理菜单点击
  handleMenuClick(e: any) {
    const type = e.currentTarget.dataset.type;

    if (type === 'resume') {
      wx.showToast({ title: '简历库正在开发中', icon: 'none' });
    } else if (type === 'settings') {
      wx.showToast({ title: '偏好设置正在开发中', icon: 'none' });
    } else if (type === 'about') {
      wx.showModal({
        title: '关于面辅精灵',
        content: '这是一个基于多模态大模型的智能面试辅助系统。打通了实时语音、视觉识别与上下文记忆，专为高校毕业生打造硬核面试训练场！',
        showCancel: false,
        confirmText: '太酷了'
      });
    }
  },

  // 清除本地缓存
  clearCache() {
    wx.showLoading({ title: '正在清理...' });

    setTimeout(() => {
      wx.hideLoading();
      wx.showToast({ title: '清理成功！', icon: 'success' });
    }, 800);
  },

  onLoad() {},

  onReady() {},

  onShow() {},

  onHide() {},

  onUnload() {},

  onPullDownRefresh() {},

  onReachBottom() {},

  onShareAppMessage() {}
});
```

- [ ] **Step 2: 验证文件创建成功**

Run: `Get-Content miniprogram/pages/profile/profile.ts | Select-Object -First 5`
Expected: 显示 `// pages/profile/profile.ts` 和 `Page({`

- [ ] **Step 3: 提交**

```bash
git add miniprogram/pages/profile/profile.ts
git commit -m "fix: 修复 profile.ts 页面结构语法错误"
```

---

## Task 2: 修复 profile.wxss 重复样式

**Files:**
- Modify: `miniprogram/pages/profile/profile.wxss:99-196`

- [ ] **Step 1: 删除重复样式代码**

删除第99行到文件末尾的所有重复代码。保留文件前98行。

修复后的文件应以下面的代码结尾（第89-98行）：
```css
.logout-btn {
  background-color: #ffffff;
  color: #ff4d4f;
  text-align: center;
  padding: 30rpx 0;
  border-radius: 20rpx;
  font-size: 32rpx;
  font-weight: bold;
  box-shadow: 0 4rpx 16rpx rgba(0,0,0,0.03);
}
```

- [ ] **Step 2: 验证文件行数**

Run: `(Get-Content miniprogram/pages/profile/profile.wxss).Count`
Expected: 98（之前是196行）

- [ ] **Step 3: 提交**

```bash
git add miniprogram/pages/profile/profile.wxss
git commit -m "fix: 删除 profile.wxss 重复样式代码"
```

---

## Task 3: 修复 app.json 页面路径配置

**Files:**
- Modify: `miniprogram/app.json:7`

- [ ] **Step 1: 修复 hr-config 页面路径**

将第7行从：
```json
"pages/hr-config"
```
改为：
```json
"pages/hr-config/hr-config"
```

- [ ] **Step 2: 验证 JSON 格式正确**

Run: `node -e "JSON.parse(require('fs').readFileSync('miniprogram/app.json'))"`
Expected: 无输出（解析成功）

- [ ] **Step 3: 提交**

```bash
git add miniprogram/app.json
git commit -m "fix: 修复 app.json 中 hr-config 页面路径配置"
```

---

## Task 4: 创建 sitemap.json 文件

**Files:**
- Create: `miniprogram/sitemap.json`

- [ ] **Step 1: 创建 sitemap.json**

在 `miniprogram/` 目录下创建 `sitemap.json`：

```json
{
  "desc": "关于本文件的更多信息，请参考文档 https://developers.weixin.qq.com/miniprogram/dev/framework/sitemap.html",
  "rules": [
    {
      "action": "allow",
      "page": "*"
    }
  ]
}
```

- [ ] **Step 2: 验证文件已创建**

Run: `Test-Path miniprogram/sitemap.json`
Expected: True

- [ ] **Step 3: 提交**

```bash
git add miniprogram/sitemap.json
git commit -m "feat: 添加 sitemap.json 站点地图配置"
```

---

## Task 5: 删除重复的 hr-config 文件

**Files:**
- Delete: `miniprogram/pages/hr-config.ts`
- Delete: `miniprogram/pages/hr-config.wxml`
- Delete: `miniprogram/pages/hr-config.wxss`
- Delete: `miniprogram/pages/hr-config.json`

- [ ] **Step 1: 删除重复文件**

```powershell
Remove-Item miniprogram/pages/hr-config.ts
Remove-Item miniprogram/pages/hr-config.wxml
Remove-Item miniprogram/pages/hr-config.wxss
Remove-Item miniprogram/pages/hr-config.json
```

- [ ] **Step 2: 删除空的 images 目录**

```powershell
Remove-Item -ErrorAction SilentlyContinue miniprogram/pages/images
```

- [ ] **Step 3: 验证 hr-config 目录仍存在**

Run: `Test-Path miniprogram/pages/hr-config/hr-config.ts`
Expected: True

- [ ] **Step 4: 验证重复文件已删除**

Run: `Test-Path miniprogram/pages/hr-config.ts`
Expected: False

- [ ] **Step 5: 提交**

```bash
git add -A
git commit -m "refactor: 删除 pages 目录下重复的 hr-config 文件"
```

---

## Task 6: 修复 home.ts 缺失方法

**Files:**
- Modify: `miniprogram/pages/home/home.ts:21`

- [ ] **Step 1: 添加 onCustomQuestionsInput 方法**

在第21行 `onCustomJobInput` 方法后面添加：

```typescript
// 监听企业专属问题输入
onCustomQuestionsInput(e: any) {
  this.setData({ customQuestions: e.detail.value });
},
```

插入位置在 `onCustomJobInput` 方法的闭合大括号 `}` 后面。

- [ ] **Step 2: 验证方法已添加**

Run: `Select-String -Path miniprogram/pages/home/home.ts -Pattern "onCustomQuestionsInput"`
Expected: 显示匹配行

- [ ] **Step 3: 提交**

```bash
git add miniprogram/pages/home/home.ts
git commit -m "fix: 添加 home.ts 缺失的 onCustomQuestionsInput 方法"
```

---

## Task 7: 清理 home.wxml 无用代码

**Files:**
- Modify: `miniprogram/pages/home/home.wxml:10-13`

- [ ] **Step 1: 删除无效的企业配置区域**

删除第10-13行的代码块：
```html
  <view wx:if="{{userRole === 'enterprise'}}" class="enterprise-config">
    <text class="config-title">📝 配置专属面试题库</text>
    <textarea class="config-input" placeholder="请输入您希望AI优先考察的专属问题，例如：1. 讲讲你遇到过最难的Bug及解决过程。 2. 如何看待加班？" bindinput="onCustomQuestionsInput"></textarea>
  </view>
```

因为此区域永远不会显示（userRole 始终为 'candidate'）。

- [ ] **Step 2: 验证代码已删除**

Run: `Select-String -Path miniprogram/pages/home/home.wxml -Pattern "enterprise-config"`
Expected: 无匹配输出

- [ ] **Step 3: 提交**

```bash
git add miniprogram/pages/home/home.wxml
git commit -m "refactor: 删除 home.wxml 中无效的企业配置区域"
```

---

## Task 8: 修复 history.ts 数据初始化

**Files:**
- Modify: `miniprogram/pages/history/history.ts:8-12`

- [ ] **Step 1: 修复 historyList 初始化**

将第8-12行：
```typescript
historyList: [
  {

  }
]
```

改为：
```typescript
historyList: []
```

- [ ] **Step 2: 实现下拉刷新**

找到 `onPullDownRefresh()` 方法（约第63行），将空实现改为：

```typescript
onPullDownRefresh() {
  const realRecords = wx.getStorageSync('interviewRecords') || [];
  this.setData({ historyList: realRecords });
  wx.stopPullDownRefresh();
},
```

- [ ] **Step 3: 验证修改**

Run: `Select-String -Path miniprogram/pages/history/history.ts -Pattern "historyList: \[\]"`
Expected: 显示匹配行

- [ ] **Step 4: 提交**

```bash
git add miniprogram/pages/history/history.ts
git commit -m "fix: 修复 history.ts 数据初始化并实现下拉刷新"
```

---

## Task 9: 启用 history 页面下拉刷新

**Files:**
- Modify: `miniprogram/pages/history/history.json`

- [ ] **Step 1: 启用下拉刷新**

将 `miniprogram/pages/history/history.json` 全部内容改为：

```json
{
  "usingComponents": {},
  "enablePullDownRefresh": true
}
```

- [ ] **Step 2: 验证 JSON 格式正确**

Run: `node -e "JSON.parse(require('fs').readFileSync('miniprogram/pages/history/history.json'))"`
Expected: 无输出（解析成功）

- [ ] **Step 3: 提交**

```bash
git add miniprogram/pages/history/history.json
git commit -m "feat: 启用 history 页面下拉刷新功能"
```

---

## Task 10: 修复 index.ts 重复 showLoading 调用

**Files:**
- Modify: `miniprogram/pages/index/index.ts:230`

- [ ] **Step 1: 删除第一个 showLoading 调用**

找到第230行：
```typescript
wx.showLoading({ title: 'AI 深度解析中...' });
wx.showLoading({ title: 'AI正在阅读简历...' });
```

删除第一行，只保留：
```typescript
wx.showLoading({ title: 'AI正在阅读简历...' });
```

- [ ] **Step 2: 验证只剩一个 showLoading**

Run: `(Select-String -Path miniprogram/pages/index/index.ts -Pattern "showLoading").Count`
Expected: 4（原来5个，删除1个）

- [ ] **Step 3: 提交**

```bash
git add miniprogram/pages/index/index.ts
git commit -m "fix: 删除 index.ts 重复的 showLoading 调用"
```

---

## Task 11: 修复 index.ts 注释语法错误

**Files:**
- Modify: `miniprogram/pages/index/index.ts:279`

- [ ] **Step 1: 修复注释语法**

找到第279行，修复格式：

**修复前：**
```typescript
data: { history: this.data.chatHistory,
  job: this.data.targetJob } ,// <--- 核心：多传一个 job 给后端！ },
```

**修复后：**
```typescript
data: {
  history: this.data.chatHistory,
  job: this.data.targetJob  // 核心：多传一个 job 给后端！
},
```

- [ ] **Step 2: 提交**

```bash
git add miniprogram/pages/index/index.ts
git commit -m "fix: 修复 index.ts 第279行注释语法错误"
```

---

## Task 12: 优化 index.ts 打字机性能

**Files:**
- Modify: `miniprogram/pages/index/index.ts:142-170`

- [ ] **Step 1: 优化打字机效果代码**

找到第142-170行的打字机效果代码，替换为优化版本：

**修复前（第142-170行）：**
```typescript
// ================= 【打字机特效核心区】 =================
// 1. 先给聊天框里塞一个"空"的 AI 气泡占位
const newMsgIndex = this.data.chatHistory.length; 
this.setData({
  chatHistory: [...this.data.chatHistory, { role: 'ai', content: '' }],
  lastMessageId: `msg-${newMsgIndex}` // 滚动到最底部
});

// 2. 开启定时器，像真人敲键盘一样，一个字一个字地往气泡里填！
let currentText = '';
let charIndex = 0;

const typeTimer = setInterval(() => {
  if (charIndex < aiReply.length) {
    currentText += aiReply[charIndex]; // 每次多拿一个字
    
    // 【神级细节】：这里不更新整个数组，只精准更新最后那条消息的内容，极大提升小程序性能！
    this.setData({
      [`chatHistory[${newMsgIndex}].content`]: currentText,
      lastMessageId: `msg-${newMsgIndex}` // 随着字数增加，保持滚动在底部
    });
    
    charIndex++;
  } else {
    // 字全打完了，关掉定时器
    clearInterval(typeTimer);
  }
}, 30); // 30毫秒打一个字，速度节奏极其舒适！
```

**修复后：**
```typescript
// ================= 【打字机特效核心区】 =================
const newMsgIndex = this.data.chatHistory.length;
this.setData({
  chatHistory: [...this.data.chatHistory, { role: 'ai', content: '' }],
  lastMessageId: `msg-${newMsgIndex}`
});

let currentText = '';
let charIndex = 0;

const typeTimer = setInterval(() => {
  if (charIndex < aiReply.length) {
    currentText += aiReply[charIndex];

    // 每3个字符批量更新一次，减少渲染频率
    if (charIndex % 3 === 0 || charIndex >= aiReply.length - 1) {
      this.setData({
        [`chatHistory[${newMsgIndex}].content`]: currentText,
        lastMessageId: `msg-${newMsgIndex}`
      });
    }
    charIndex++;
  } else {
    clearInterval(typeTimer);
  }
}, 50); // 增大到50ms，减少渲染频率
```

- [ ] **Step 2: 提交**

```bash
git add miniprogram/pages/index/index.ts
git commit -m "perf: 优化打字机效果性能，减少渲染频率"
```

---

## Task 13: 删除未使用的 logs 页面

**Files:**
- Delete: `miniprogram/pages/logs/` 整个目录

- [ ] **Step 1: 删除 logs 目录**

```powershell
Remove-Item -Recurse -Force miniprogram/pages/logs/
```

- [ ] **Step 2: 验证目录已删除**

Run: `Test-Path miniprogram/pages/logs`
Expected: False

- [ ] **Step 3: 提交**

```bash
git add -A
git commit -m "refactor: 删除未使用的 logs 页面死代码"
```

---

## Task 14: 删除未使用的 utils 目录

**Files:**
- Delete: `miniprogram/utils/` 整个目录

- [ ] **Step 1: 删除 utils 目录**

```powershell
Remove-Item -Recurse -Force miniprogram/utils/
```

- [ ] **Step 2: 验证目录已删除**

Run: `Test-Path miniprogram/utils`
Expected: False

- [ ] **Step 3: 提交**

```bash
git add -A
git commit -m "refactor: 删除未使用的 utils 工具函数"
```

---

## Task 15: 修复 project.config.json 配置

**Files:**
- Modify: `project.config.json:44`

- [ ] **Step 1: 修改基础库版本**

将第44行从：
```json
"libVersion": "trial"
```
改为：
```json
"libVersion": "3.4.0"
```

- [ ] **Step 2: 验证 JSON 格式正确**

Run: `node -e "JSON.parse(require('fs').readFileSync('project.config.json'))"`
Expected: 无输出（解析成功）

- [ ] **Step 3: 提交**

```bash
git add project.config.json
git commit -m "fix: 将基础库版本从 trial 改为稳定版 3.4.0"
```

---

## Task 16: 添加 uploadResume 错误处理

**Files:**
- Modify: `miniprogram/pages/index/index.ts:212-260`

- [ ] **Step 1: 添加 fail 回调到 wx.chooseMedia**

找到 `uploadResume` 方法（第212-260行），将整个方法替换为：

```typescript
uploadResume() {
  wx.chooseMedia({
    count: 1,
    mediaType: ['image'],
    success: (res) => {
      const tempFilePath = res.tempFiles[0].tempFilePath;
      const newMsgIndex = this.data.chatHistory.length;
      this.setData({
        chatHistory: [...this.data.chatHistory, {
          role: 'system',
          content: '✅ 视觉大模型已接收简历图像... 正在提取核心技能与过往经历... 面试引擎已就绪！'
        }],
        lastMessageId: `msg-${newMsgIndex}`
      });

      wx.showLoading({ title: 'AI正在阅读简历...' });

      wx.uploadFile({
        url: `${BASE_URL}/upload-resume`,
        filePath: tempFilePath,
        name: 'file',
        success: (uploadRes) => {
          wx.hideLoading();
          try {
            const data = JSON.parse(uploadRes.data);
            if (data.code === 200) {
              const aiReply = data.reply || "简历已收到，请做个自我介绍吧！";
              const newHistory = [...this.data.chatHistory, { role: 'ai', content: aiReply }];

              this.setData({
                chatHistory: newHistory,
                lastMessageId: `msg-${newHistory.length - 1}`
              });
            } else {
              wx.showToast({ title: '简历解析失败', icon: 'none' });
            }
          } catch (e) {
            wx.showToast({ title: '数据格式异常', icon: 'none' });
          }
        },
        fail: () => {
          wx.hideLoading();
          wx.showToast({ title: '上传图片失败', icon: 'none' });
        }
      });
    },
    fail: (err) => {
      if (err.errMsg && err.errMsg.includes('auth deny')) {
        wx.showModal({
          title: '权限提示',
          content: '请授权访问相册以上传简历',
          confirmText: '去设置',
          success: (modalRes) => {
            if (modalRes.confirm) {
              wx.openSetting();
            }
          }
        });
      } else {
        wx.showToast({ title: '选择图片失败', icon: 'none' });
      }
    }
  });
},
```

- [ ] **Step 2: 验证方法完整性**

Run: `Select-String -Path miniprogram/pages/index/index.ts -Pattern "wx.openSetting"`
Expected: 显示匹配行（新增的错误处理）

- [ ] **Step 3: 提交**

```bash
git add miniprogram/pages/index/index.ts
git commit -m "fix: 为 uploadResume 添加权限错误处理"
```

---

## Task 17: 清理调试日志

**Files:**
- Modify: `miniprogram/app.ts:13`
- Modify: `miniprogram/pages/index/index.ts:57`

- [ ] **Step 1: 清理 app.ts 中的调试日志**

找到第13行：
```typescript
console.log(res.code)
```

删除此行。

- [ ] **Step 2: 清理 index.ts 中的调试日志**

找到第57行：
```typescript
console.log("后端返回的完整字典：", asrData);
```

删除此行。

- [ ] **Step 3: 验证日志已删除**

Run: `Select-String -Path miniprogram/app.ts -Pattern "console.log"`
Expected: 无匹配输出

Run: `Select-String -Path miniprogram/pages/index/index.ts -Pattern "后端返回的完整字典"`
Expected: 无匹配输出

- [ ] **Step 4: 提交**

```bash
git add miniprogram/app.ts miniprogram/pages/index/index.ts
git commit -m "chore: 移除生产环境敏感调试日志"
```

---

## Task 18: 创建配置文件管理服务器地址

**Files:**
- Create: `miniprogram/config/index.ts`
- Modify: `miniprogram/pages/index/index.ts:7`

- [ ] **Step 1: 创建配置目录和文件**

创建 `miniprogram/config/index.ts`：

```typescript
// 环境配置
const ENV = 'development'; // 'development' | 'production'

const CONFIG = {
  development: {
    baseUrl: 'http://172.21.193.172:8000'
  },
  production: {
    baseUrl: 'https://api.your-domain.com'  // 替换为实际生产域名
  }
};

export const BASE_URL = CONFIG[ENV].baseUrl;
```

- [ ] **Step 2: 更新 index.ts 引用**

找到第7行：
```typescript
const BASE_URL = 'http://172.21.193.172:8000';
```

改为：
```typescript
import { BASE_URL } from '../../config/index';
```

- [ ] **Step 3: 验证配置文件已创建**

Run: `Test-Path miniprogram/config/index.ts`
Expected: True

- [ ] **Step 4: 提交**

```bash
git add miniprogram/config/ miniprogram/pages/index/index.ts
git commit -m "refactor: 抽取服务器地址到配置文件统一管理"
```

---

## 执行顺序总结

| 阶段 | Task | 描述 |
|------|------|------|
| 🔴 P0 | 1-5 | 修复阻塞性错误 |
| 🟡 P1 | 6-12 | 修复功能问题 |
| 🟢 P2 | 13-18 | 代码质量优化 |

---

## 最终验证清单

修复完成后，执行以下验证：

- [ ] **验证所有 TypeScript 文件语法**

Run: `Get-ChildItem -Recurse -Filter "*.ts" miniprogram/ | ForEach-Object { Write-Host $_.FullName }`
Expected: 列出所有 .ts 文件，无报错

- [ ] **验证所有 JSON 文件格式**

Run: `node -e "['app.json','sitemap.json','project.config.json'].forEach(f => { try { JSON.parse(require('fs').readFileSync('miniprogram/' + f)); console.log(f + ' OK'); } catch(e) { console.log(f + ' ERROR'); } })"`
Expected: 所有文件显示 OK

- [ ] **验证目录结构**

Run: `Get-ChildItem miniprogram/pages -Directory | Select-Object Name`
Expected: 显示 home, history, hr-config, index, profile（无 logs）

---

## 完成通知

全部修复完成后：

```bash
git add -A
git status
git log --oneline -10
```

在微信开发者工具中：
1. 刷新项目
2. 确认无编译错误
3. 测试各页面功能正常
