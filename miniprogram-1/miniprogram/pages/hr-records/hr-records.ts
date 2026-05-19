Page({
  data: {
    records: [] as any[],
    debugInfo: ''
  },

  onLoad() {
    wx.setNavigationBarTitle({
      title: '求职者面试记录'
    });
    this.loadRecords();
  },

  loadRecords() {
    const allRecords = wx.getStorageSync('interviewRecords') || [];
    // 展示所有带企业标签的记录（求职者开启企业配置后的面试）
    const hrRecords = allRecords.filter((r: any) => r.companyName);

    let sorted = [...hrRecords].sort((a: any, b: any) => (b.date || '').localeCompare(a.date || ''));
    sorted = sorted.map((r: any) => ({ ...r, _expanded: false }));

    this.setData({
      records: sorted,
      debugInfo: `共 ${sorted.length} 条记录`
    });
  },

  toggleExpand(e: any) {
    const idx = e.currentTarget.dataset.index;
    const key = `records[${idx}]._expanded`;
    this.setData({
      [key]: !this.data.records[idx]._expanded
    });
  }
});
