import { BASE_URL } from '../../config/index';

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

    // 先加载本地记录作为即时展示，再从服务端拉取完整列表
    this.loadLocalRecords(companyName);
    this.fetchRemoteRecords(companyName);
  },

  loadLocalRecords(companyName: string) {
    const localRecords = wx.getStorageSync('interviewRecords') || [];
    this.displayRecords(localRecords, companyName, '本地缓存');
  },

  fetchRemoteRecords(companyName: string) {
    wx.request({
      url: `${BASE_URL}/records`,
      method: 'GET',
      success: (res: any) => {
        if (res.data && res.data.code === 200 && res.data.records) {
          this.displayRecords(res.data.records, companyName, '服务端');
        }
      },
      fail: () => console.log('服务端记录拉取失败，仅展示本地记录')
    });
  },

  displayRecords(allRecords: any[], companyName: string, source: string) {
    // 只保留企业面试记录（滤除自行模拟面试）
    const hrRecords = allRecords.filter((r: any) => r.userRole === 'hr');
    console.log(`[hr-records] 数据来源: ${source}, 总记录数: ${allRecords.length}, 企业记录: ${hrRecords.length}`);

    const debugInfo = companyName
      ? `共 ${hrRecords.length} 条记录`
      : `共 ${hrRecords.length} 条记录`;

    let sorted = [...hrRecords].sort((a: any, b: any) => (b.date || '').localeCompare(a.date || ''));

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
