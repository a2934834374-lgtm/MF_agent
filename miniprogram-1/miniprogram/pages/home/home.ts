// pages/home/home.ts
Page({
  data: {

    userRole: 'candidate',
    customQuestions: '',
    // 预设的面试岗位库
    jobList: ['前端开发工程师', '后端开发工程师', '产品经理', 'UI/UX设计师', '新媒体运营','自定义岗位 ✍️'],
    jobIndex: 0,
    customJob: '',
    // 企业列表
    companies: [] as any,
    companyIndex: 0
  },
  // ... 上面是您原有的其他代码 ...
  switchRole(e : any) {
    wx.vibrateShort({ type: 'medium' });
    wx.navigateTo({
      url: '/pages/hr-config/hr-config'
    });
  },
  // 新增：监听自定义岗位的输入
  onCustomJobInput(e: any) {
    this.setData({ customJob: e.detail.value });
  },
  // 监听企业专属问题输入
  onCustomQuestionsInput(e: any) {
    this.setData({ customQuestions: e.detail.value });
  },

  // 切换岗位时触发
  onJobChange(e: any) {
    this.setData({ jobIndex: e.detail.value });
  },

  // 切换目标企业
  onCompanyChange(e: any) {
    const idx = e.detail.value;
    const companies = this.data.companies;
    if (!companies || !companies[idx]) return;
    const company = companies[idx];
    this.setData({ companyIndex: idx });

    // 自动匹配该企业的岗位到岗位选择器
    const jobIdx = this.data.jobList.indexOf(company.targetJob);
    if (jobIdx >= 0) {
      this.setData({ jobIndex: jobIdx });
    } else {
      // 如果企业的岗位不在预设列表，尝试用自定义岗位
      this.setData({
        jobIndex: this.data.jobList.length - 1, // 切到"自定义岗位"
        customJob: company.targetJob
      });
    }
  },

  // 跳转时，把岗位变成 URL 参数传走！
  goToInterview() {
    let selectedJob = this.data.jobList[this.data.jobIndex];
    let customQuestions = this.data.customQuestions;
    const userRole = this.data.userRole;

    // 如果求职者选了企业，使用企业的岗位和题库
    if (userRole === 'candidate' && this.data.companies.length > 0) {
      const selectedCompany = this.data.companies[this.data.companyIndex];
      if (selectedCompany) {
        selectedJob = selectedCompany.targetJob;
        customQuestions = selectedCompany.customQuestions || '';
      }
    }

    wx.setStorageSync('userRole', userRole);
    wx.setStorageSync('customQuestions', customQuestions);

    // ================= 核心拦截逻辑 =================
    // 如果用户选了最后一项"自定义岗位"
    if (selectedJob === '自定义岗位 ✍️') {
      // 检查他是不是什么都没填就点开始了
      if (!this.data.customJob || this.data.customJob.trim() === '') {
        wx.showToast({ title: '请先填写岗位名称哦！', icon: 'none' });
        return; // 强行拦截，不让跳转
      }
      // 狸猫换太子：把要传给 AI 的岗位，换成用户手写的！
      selectedJob = this.data.customJob;

    }
    // ================================================

    wx.navigateTo({
      url: `/pages/index/index?job=${selectedJob}`,
      success: () => { console.log("跳转成功！"); }
    })
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad() {
    // 加载企业列表
    const companies = wx.getStorageSync('companies') || [];
    this.setData({ companies, companyIndex: 0 });
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {
    // 每次显示时刷新企业列表（HR 配置后返回能看到新企业）
    const companies = wx.getStorageSync('companies') || [];
    this.setData({ companies, companyIndex: 0 });
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  }
})

 