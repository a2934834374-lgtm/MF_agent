// 环境配置
const ENV = 'development'; // 'development' | 'production'

const CONFIG = {
  development: {
    baseUrl: 'http://sb6ae639.natappfree.cc'
  },
  production: {
    baseUrl: 'https://api.your-domain.com'  // 替换为实际生产域名
  }
};

export const BASE_URL = CONFIG[ENV].baseUrl;
