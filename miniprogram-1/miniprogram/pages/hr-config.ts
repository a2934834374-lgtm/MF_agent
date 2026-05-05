// pages/hr-config/hr-config.ts
Page({
  data: {
    targetJob: '',
    customQuestions: ''
  },

  // 页面加载时：看看之前有没有配过，有的话自动填上
  onLoad() {
    this.setData({
      targetJob: wx.getStorageSync('targetJob') || '',
      customQuestions: wx.getStorageSync('customQuestions') || ''
    });
  },

  // 监听岗位输入 (TS 中增加了 e: any 类型声明)
  onJobInput(e: any) {
    this.setData({
      targetJob: e.detail.value
    });
  },

  // 监听题库输入 (TS 中增加了 e: any 类型声明)
  onQuestionsInput(e: any) {
    this.setData({
      customQuestions: e.detail.value
    });
  },

  // 核心战略：点击保存按钮
  saveConfig() {
    const { targetJob, customQuestions } = this.data;

    // 空值拦截
    if (!targetJob.trim()) {
      wx.showToast({
        title: '岗位名称不能为空',
        icon: 'none'
      });
      return;
    }

    // 🌟 将配置写入本地缓存
    wx.setStorageSync('targetJob', targetJob);
    wx.setStorageSync('customQuestions', customQuestions);
    wx.setStorageSync('userRole', 'hr'); // 强制打上 B 端 HR 身份烙印！

    wx.showToast({
      title: '配置已生效',
      icon: 'success',
      duration: 1500,
      success: () => {
        // 延迟 1.5 秒后，跳转到你们实际的语音对话/面试页面
        // ⚠️ 统帅注意：请把下面的 url 换成您自己小程序的真实对话页面路径！
        setTimeout(() => {
          wx.navigateTo({
            url: '/pages/index/index' 
          });
        }, 1500);
      }
    });
  }
});