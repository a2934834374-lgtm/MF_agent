// pages/home/home.ts
Page({
  data: {
   
    userRole: 'candidate', 
    customQuestions: '',
    // 预设的面试岗位库
    jobList: ['前端开发工程师', '后端开发工程师', '产品经理', 'UI/UX设计师', '新媒体运营','自定义岗位 ✍️'],
    jobIndex: 0,
    customJob: '' // 新增：用来临时存用户手写的岗位名字
  },
  // ... 上面是您原有的其他代码 ...
  switchRole() {
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

  // 跳转时，把岗位变成 URL 参数传走！
  goToInterview() {
    let selectedJob = this.data.jobList[this.data.jobIndex];
    wx.setStorageSync('userRole', this.data.userRole);
    wx.setStorageSync('customQuestions', this.data.customQuestions);
    

    // ================= 核心拦截逻辑 =================
    // 如果用户选了最后一项“自定义岗位”
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

 