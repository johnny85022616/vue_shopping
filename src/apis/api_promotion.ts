import config from '../config/config';

const { cloudApiPath } = config;

const api_promotion = {
  // 取得目錄分類對應的曝光連結
  async getCategoryPromotionLinks(catgId = null) {
    if (!catgId) return [];

    return await fetch(`${cloudApiPath}campaign/url/${catgId}`)
      .then((r) => r.json())
      .then((r) => {
        return r?.resultData || [];
      });
  },
};

export default api_promotion;
