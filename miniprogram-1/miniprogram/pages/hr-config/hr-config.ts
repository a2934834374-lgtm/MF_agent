Page({
  data: {
    companyName: '',
    targetJob: ''
  },
  onLoad() {
    // 进来时先读取之前的配置
    this.setData({
      companyName: wx.getStorageSync('companyName') || '',
      targetJob: wx.getStorageSync('targetJob') || ''
    });
  },
  onCompanyInput(e: any) { this.setData({ companyName: e.detail.value }); },
  onJobInput(e: any) { this.setData({ targetJob: e.detail.value }); },

  saveConfig() {
    const { companyName, targetJob } = this.data;
    const customQuestions = wx.getStorageSync('customQuestions') || '';
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

    wx.removeStorageSync('pendingHrStart'); // 清除自动开始标记，仅保存配置

    wx.showToast({
      title: '配置已保存',
      icon: 'success'
    });
  },

  goAssessment() {
    // 提前将当前输入的企业名写入存储，确保考核配置页可读取
    wx.setStorageSync('companyName', this.data.companyName);
    wx.navigateTo({
      url: '/pages/hr-assessment/hr-assessment'
    });
  },

  viewRecords() {
    wx.navigateTo({
      url: '/pages/hr-records/hr-records?companyName=' + encodeURIComponent(this.data.companyName)
    });
  }
});