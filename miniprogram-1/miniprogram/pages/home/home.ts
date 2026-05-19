Page({
  data: {
    userRole: 'candidate',
    customQuestions: '',
    candidateName: '',
    jobList: ['前端开发工程师', '后端开发工程师', '产品经理', 'UI/UX设计师', '新媒体运营', '自定义岗位 ✍️'],
    jobIndex: 0,
    customJob: '',
    companies: [] as any,
    companyIndex: 0,
    useCompany: false,
    interviewCount: 0,
    avgScore: '--'
  },

  switchToCandidate() {
    this.setData({ userRole: 'candidate' });
  },

  switchToHr() {
    wx.vibrateShort({ type: 'medium' });
    wx.navigateTo({
      url: '/pages/hr-config/hr-config'
    });
  },

  toggleCompany() {
    this.setData({ useCompany: !this.data.useCompany });
  },

  onNameInput(e: any) {
    this.setData({ candidateName: e.detail.value });
  },

  onCustomJobInput(e: any) {
    this.setData({ customJob: e.detail.value });
  },

  onCustomQuestionsInput(e: any) {
    this.setData({ customQuestions: e.detail.value });
  },

  onJobChange(e: any) {
    this.setData({ jobIndex: e.detail.value });
  },

  onCompanyChange(e: any) {
    const idx = e.detail.value;
    const companies = this.data.companies;
    if (!companies || !companies[idx]) return;
    const company = companies[idx];
    this.setData({ companyIndex: idx });

    const jobIdx = this.data.jobList.indexOf(company.targetJob);
    if (jobIdx >= 0) {
      this.setData({ jobIndex: jobIdx });
    } else {
      this.setData({
        jobIndex: this.data.jobList.length - 1,
        customJob: company.targetJob
      });
    }
  },

  goToInterview() {
    let selectedJob = this.data.jobList[this.data.jobIndex];
    let customQuestions = this.data.customQuestions;
    const userRole = this.data.userRole;

    // 仅当求职者开启了"使用企业配置"时才使用企业岗位
    if (userRole === 'candidate' && this.data.useCompany && this.data.companies.length > 0) {
      const selectedCompany = this.data.companies[this.data.companyIndex];
      if (selectedCompany) {
        selectedJob = selectedCompany.targetJob;
        customQuestions = selectedCompany.customQuestions || '';
      }
    }

    wx.setStorageSync('userRole', userRole);
    wx.setStorageSync('customQuestions', customQuestions);

    // 候选人使用企业配置时，补存 companyName 和 candidateName
    if (userRole === 'candidate' && this.data.useCompany && this.data.companies.length > 0) {
      wx.setStorageSync('companyName', this.data.companies[this.data.companyIndex].companyName);
      wx.setStorageSync('candidateName', this.data.candidateName);
    } else {
      wx.removeStorageSync('candidateName');
      wx.removeStorageSync('companyName');
    }

    // 如果选了自定义岗位
    if (selectedJob === '自定义岗位 ✍️') {
      if (!this.data.customJob || this.data.customJob.trim() === '') {
        wx.showToast({ title: '请先填写岗位名称哦！', icon: 'none' });
        return;
      }
      selectedJob = this.data.customJob;
    }

    // 跳转到面试页（index 不是 tab 页，用 navigateTo）
    wx.setStorageSync('pendingJob', selectedJob);
    wx.navigateTo({ url: '/pages/index/index' });
  },

  computeStats() {
    const records = wx.getStorageSync('interviewRecords') || [];
    const count = records.length;
    let avg = '--';
    if (count > 0) {
      const total = records.reduce((sum: number, r: any) => sum + (r.score || 0), 0);
      avg = (total / count).toFixed(0);
    }
    this.setData({ interviewCount: count, avgScore: avg });
  },

  onLoad() {
    const companies = wx.getStorageSync('companies') || [];
    this.setData({
      companies,
      companyIndex: 0,
      useCompany: companies.length > 0
    });
    this.computeStats();
  },

  onShow() {
    const companies = wx.getStorageSync('companies') || [];
    this.setData({ companies, companyIndex: 0 });
    this.computeStats();
  }
});
