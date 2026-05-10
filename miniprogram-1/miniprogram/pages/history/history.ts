Page({
  data: {
    historyList: []
  },

  onShow() {
    const records = wx.getStorageSync('interviewRecords') || [];
    // 按日期从新到旧排序，添加展开标记
    const sorted = [...records].sort((a: any, b: any) => (b.date || '').localeCompare(a.date || ''));
    this.setData({
      historyList: sorted.map((r: any) => ({ ...r, _expanded: false }))
    });
  },

  onPullDownRefresh() {
    const records = wx.getStorageSync('interviewRecords') || [];
    const sorted = [...records].sort((a: any, b: any) => (b.date || '').localeCompare(a.date || ''));
    this.setData({
      historyList: sorted.map((r: any) => ({ ...r, _expanded: false }))
    });
    wx.stopPullDownRefresh();
  },

  toggleExpand(e: any) {
    const idx = e.currentTarget.dataset.index;
    const key = `historyList[${idx}]._expanded`;
    this.setData({
      [key]: !this.data.historyList[idx]._expanded
    });
  }
});
