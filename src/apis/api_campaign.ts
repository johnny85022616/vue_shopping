import type { productInfo } from '@/types/productInfo';
import config from '../config/config';

const { isLogin, cloudApiPath, fetchGetHeaders, fetchPostHeaders, frontApiPath } = config;

const api_campaign = {
  // 取活動明細
  async getCampaignDetail(campaignIds: string[]) {
    return await fetch(`${cloudApiPath}campaign/getInfo`, {
      ...fetchPostHeaders,
      body: JSON.stringify({
        campaignIds: campaignIds,
      }),
    })
      .then((res) => res.json())
      .then((res) => {
        const { resultCode, resultData } = res;
        return resultCode === 0 ? resultData : [];
      });
  },
  // 取得遠傳手機館熱銷排行資料
  async getHotRankingInfo() {
    const info = await this.getCampaignDetail(['DO_241007175822515']);
    const pids = info ? info[0].campaignRange.v[9]?.split(',') : [];
    return pids;
  },

  async getMyCampaigns(returnDetail = false): Promise<string[]> {
    if (!isLogin) return [];
    return await fetch(`${frontApiPath()}api/campaign/memCampaign`, {
      ...fetchPostHeaders,
      body: JSON.stringify({}),
    })
      .then((res) => res.json())
      .then(async (res) => {
        const { resultCode, resultData } = res;
        const ids = resultCode === 0 ? resultData.campaignIds : [];
        // if (returnDetail && ids.length > 0) {
        //   let ui = await this.parseCampaignDetail(ids, ids);

        //   if (/print=1/i.test(location.search)) console.log('getMyCampaigns', JSON.parse(JSON.stringify(ui)));

        //   return ui;
        // }
        return ids;
      });
  },
};

export default api_campaign;
