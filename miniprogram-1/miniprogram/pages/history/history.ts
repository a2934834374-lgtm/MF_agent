Page({
  data: {
    activeTab: 0,
    selfRecords: [],
    companyRecords: []
  },

  loadAndSplitRecords() {
    const records = wx.getStorageSync('interviewRecords') || [];
    const addExpand = (r: any) => ({ ...r, _expanded: false });

    const selfRecords = records
      .filter((r: any) => r.userRole !== 'hr')
      .sort((a: any, b: any) => (b.date || '').localeCompare(a.date || ''))
      .map(addExpand);

    const companyRecords = records
      .filter((r: any) => r.userRole === 'hr')
      .sort((a: any, b: any) => (b.date || '').localeCompare(a.date || ''))
      .map(addExpand);

    this.setData({ selfRecords, companyRecords });
  },

  onShow() {
    this.loadAndSplitRecords();
  },

  onPullDownRefresh() {
    this.loadAndSplitRecords();
    wx.stopPullDownRefresh();
  },

  switchTab(e: any) {
    const tab = parseInt(e.currentTarget.dataset.tab, 10);
    this.setData({ activeTab: tab });
  },

  toggleExpand(e: any) {
    const listKey = this.data.activeTab === 0 ? 'selfRecords' : 'companyRecords';
    const idx = e.currentTarget.dataset.index;
    const key = `${listKey}[${idx}]._expanded`;
    this.setData({
      [key]: !this.data[listKey][idx]._expanded
    });
  }
});
