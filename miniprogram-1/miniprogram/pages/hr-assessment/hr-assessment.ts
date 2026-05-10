const DEFAULT_CATEGORIES = [
  {
    name: '代码能力',
    enabled: false,
    expanded: false,
    items: [
      { label: 'Python', checked: false },
      { label: 'Java', checked: false },
      { label: 'Go', checked: false },
      { label: 'C++', checked: false },
      { label: 'JavaScript/TypeScript', checked: false },
      { label: '数据库/SQL', checked: false }
    ]
  },
  {
    name: '系统设计',
    enabled: false,
    expanded: false,
    items: [
      { label: '高并发架构', checked: false },
      { label: '微服务拆分', checked: false },
      { label: '数据库设计', checked: false },
      { label: 'API/接口设计', checked: false }
    ]
  },
  {
    name: '沟通与协作',
    enabled: false,
    expanded: false,
    items: [
      { label: '团队协作', checked: false },
      { label: '跨部门沟通', checked: false },
      { label: '技术方案汇报', checked: false },
      { label: '需求分析与理解', checked: false }
    ]
  },
  {
    name: '抗压与应变',
    enabled: false,
    expanded: false,
    items: [
      { label: '紧急项目交付', checked: false },
      { label: '线上故障处理', checked: false },
      { label: '多任务并行', checked: false },
      { label: '需求变更应对', checked: false }
    ]
  },
  {
    name: '项目与业务',
    enabled: false,
    expanded: false,
    items: [
      { label: '项目架构深度', checked: false },
      { label: '技术选型考量', checked: false },
      { label: '业务理解与落地', checked: false },
      { label: '难点攻克经验', checked: false }
    ]
  }
];

function computeCount(cats: any[]) {
  return cats.map((cat: any) => ({
    ...cat,
    selectedCount: cat.items.filter((i: any) => i.checked).length
  }));
}

Page({
  data: {
    categories: [] as any[]
  },

  onLoad() {
    const saved = wx.getStorageSync('assessmentConfig');
    if (saved && saved.length > 0) {
      this.setData({ categories: computeCount(saved) });
    } else {
      this.setData({ categories: computeCount(JSON.parse(JSON.stringify(DEFAULT_CATEGORIES))) });
    }
  },

  toggleEnabled(e: any) {
    const idx = e.currentTarget.dataset.index;
    this.setData({
      [`categories[${idx}].enabled`]: !this.data.categories[idx].enabled
    });
  },

  toggleExpand(e: any) {
    const idx = e.currentTarget.dataset.index;
    this.setData({
      [`categories[${idx}].expanded`]: !this.data.categories[idx].expanded
    });
  },

  toggleItem(e: any) {
    const { catIdx, itemIdx } = e.currentTarget.dataset;
    const key = `categories[${catIdx}].items[${itemIdx}].checked`;
    this.setData({ [key]: !this.data.categories[catIdx].items[itemIdx].checked });

    // 更新选中计数
    const wasChecked = this.data.categories[catIdx].items[itemIdx].checked;
    const newCount = wasChecked
      ? this.data.categories[catIdx].selectedCount - 1
      : this.data.categories[catIdx].selectedCount + 1;
    this.setData({
      [`categories[${catIdx}].selectedCount`]: newCount
    });
  },

  saveConfig() {
    const categories = this.data.categories;

    // 保存完整配置
    wx.setStorageSync('assessmentConfig', categories);

    // 生成文本摘要写入 customQuestions，兼容现有面试流程
    const lines: string[] = [];
    for (const cat of categories) {
      if (!cat.enabled) continue;
      const selected = cat.items.filter((i: any) => i.checked).map((i: any) => i.label);
      if (selected.length > 0) {
        lines.push(`${cat.name}（重点考核：${selected.join('、')}）`);
      }
    }

    const summary = lines.length > 0
      ? '考核重点配置：\n' + lines.join('\n')
      : '';

    wx.setStorageSync('customQuestions', summary);

    wx.showToast({
      title: '配置已保存',
      icon: 'success',
      success: () => {
        setTimeout(() => {
          wx.navigateBack();
        }, 1500);
      }
    });
  }
});
