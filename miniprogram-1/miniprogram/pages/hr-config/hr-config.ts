Page({
  data: {
    companyName: '',
    targetJob: '',
    customQuestions: ''
  },
  onLoad() {
    // 进来时先读取之前的配置
    this.setData({
      companyName: wx.getStorageSync('companyName') || '',
      targetJob: wx.getStorageSync('targetJob') || '',
      customQuestions: wx.getStorageSync('customQuestions') || ''
    });
  },
  onCompanyInput(e: any) { this.setData({ companyName: e.detail.value }); },
  onJobInput(e: any) { this.setData({ targetJob: e.detail.value }); },
  onQuestionsInput(e: any) { this.setData({ customQuestions: e.detail.value }); },

  saveConfig() {
    const { companyName, targetJob, customQuestions } = this.data;
    if (!companyName.trim()) {
      wx.showToast({ title: '请输入企业名称', icon: 'none' });
      return;
    }
    if (!targetJob.trim()) {
      wx.showToast({ title: '请输入面试岗位', icon: 'none' });
      return;
    }
    // 保存当前配置到缓存（兼容已有流程）
    wx.setStorageSync('companyName', companyName);
    wx.setStorageSync('targetJob', targetJob);
    wx.setStorageSync('customQuestions', customQuestions);
    wx.setStorageSync('userRole', 'hr');

    // 将配置保存到企业列表，供求职者选择
    const companies = wx.getStorageSync('companies') || [];
    const idx = companies.findIndex((c: any) => c.companyName === companyName);
    const config = { companyName, targetJob, customQuestions };
    if (idx >= 0) {
      companies[idx] = config; // 覆盖已有企业
    } else {
      companies.push(config);
    }
    wx.setStorageSync('companies', companies);

    wx.setStorageSync('pendingHrStart', true); // 标记：跳转后自动开始面试

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