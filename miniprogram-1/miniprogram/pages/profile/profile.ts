import { BASE_URL } from '../../config/index';

Page({
  data: {
    // 页面数据占位，可扩展
  },

  // 统一处理菜单点击
  handleMenuClick(e: any) {
    const type = e.currentTarget.dataset.type;

    if (type === 'resume') {
      wx.showToast({ title: '简历库正在开发中', icon: 'none' });
    } else if (type === 'settings') {
      wx.showToast({ title: '偏好设置正在开发中', icon: 'none' });
    } else if (type === 'about') {
      wx.showModal({
        title: '关于面辅精灵',
        content: '这是一个基于多模态大模型的智能面试辅助系统。打通了实时语音、视觉识别与上下文记忆，专为高校毕业生打造硬核面试训练场！',
        showCancel: false,
        confirmText: '太酷了'
      });
    }
  },

  // 清除本地缓存 + 服务端记录
  clearCache() {
    wx.showModal({
      title: '确认清除',
      content: '将清除所有面试记录和配置数据，确定吗？',
      success: (res) => {
        if (res.confirm) {
          wx.clearStorageSync();
          // 同步清除服务端记录
          wx.request({
            url: `${BASE_URL}/records`,
            method: 'DELETE',
            fail: () => console.log('服务端记录清除失败（不影响本地）')
          });
          wx.showToast({ title: '已清除所有缓存', icon: 'success' });
        }
      }
    });
  },

  onLoad() {},

  onReady() {},

  onShow() {},

  onHide() {},

  onUnload() {},

  onPullDownRefresh() {},

  onReachBottom() {},

  onShareAppMessage() {}
});
