import config from '../config/config';

const { cloudApiPath, fetchGetHeaders, fetchPostHeaders, setTicket } = config;

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
};

export default api_campaign;
