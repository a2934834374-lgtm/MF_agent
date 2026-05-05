Page({
  data: {
    targetJob: '',
    customQuestions: ''
  },
  onLoad() {
    // 进来时先读取之前的配置
    this.setData({
      targetJob: wx.getStorageSync('targetJob') || '',
      customQuestions: wx.getStorageSync('customQuestions') || ''
    });
  },
  onJobInput(e: any) { this.setData({ targetJob: e.detail.value }); },
  onQuestionsInput(e: any) { this.setData({ customQuestions: e.detail.value }); },

  saveConfig() {
    const { targetJob, customQuestions } = this.data;
    if (!targetJob) {
      wx.showToast({ title: '请输入岗位', icon: 'none' });
      return;
    }
    // 🌟 核心：存入缓存，供面试页面调用
    wx.setStorageSync('targetJob', targetJob);
    wx.setStorageSync('customQuestions', customQuestions);
    wx.setStorageSync('userRole', 'hr');

    wx.showToast({
      title: '配置已生效',
      icon: 'success',
      success: () => {
        setTimeout(() => {
          // 🌟 关键：因为 index 是底部菜单页，必须用 switchTab
          wx.switchTab({ url: '/pages/index/index' });
        }, 1500);
      }
    });
  }
});