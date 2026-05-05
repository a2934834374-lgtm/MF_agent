// pages/history/history.ts
Page({

  /**
   * 页面的初始数据
   */
  data: {
    historyList: []
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
  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {
    // 每次用户点进“历史”页面，立刻去手机本地的保险柜里取真实数据！
    const realRecords = wx.getStorageSync('interviewRecords') || [];
    
    // 把真实数据塞给页面渲染
    this.setData({
      historyList: realRecords
    });
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
    const realRecords = wx.getStorageSync('interviewRecords') || [];
    this.setData({ historyList: realRecords });
    wx.stopPullDownRefresh();
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