Page({
  data: {
    companyName: '',
    records: [] as any[],
    debugInfo: ''
  },

  onLoad(options: any) {
    const companyName = options.companyName || '';
    wx.setNavigationBarTitle({
      title: '求职者面试记录'
    });

    const allRecords = wx.getStorageSync('interviewRecords') || [];

    console.log('[hr-records] 总记录数:', allRecords.length);
    console.log('[hr-records] 筛选企业名:', companyName);
    if (allRecords.length > 0) {
      console.log('[hr-records] 记录中的企业名:', allRecords.map((r: any) => r.companyName));
    }

    // 不再按 companyName 过滤，显示全部记录
    // 卡片上会显示企业标签，HR 可以直观识别
    const debugInfo = companyName
      ? `共 ${allRecords.length} 条记录`
      : `共 ${allRecords.length} 条记录`;

    // 为每条记录添加展开标记，按日期从新到旧排序
    let sorted = [...allRecords].sort((a, b) => (b.date || '').localeCompare(a.date || ''));

    sorted = sorted.map((r: any) => ({
      ...r,
      _expanded: false
    }));

    this.setData({
      companyName,
      records: sorted,
      debugInfo
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
