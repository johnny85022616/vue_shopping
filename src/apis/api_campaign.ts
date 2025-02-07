import type { productInfo } from '@/types/productInfo';
import config from '../config/config';
import { getCampaignUI } from './campaign/campaign_util';

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
  // 取活動明細 （少productRange版本
  async getCampaignBasicDetail(campaignIds: string[]) {
    return await fetch(`${cloudApiPath}campaign/getInfo`, {
      ...fetchPostHeaders,
      body: JSON.stringify({
        campaignIds: campaignIds,
        type: 2,
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

  async parseCampaignDetail(ids: string[], myCampaignIds = []): Promise<string[]> {
    if (!ids) return [];
    const detailRes = await this.getCampaignBasicDetail(ids);

    // D9再折劵 抽出哪寫劵有綁定再折劵
    const childCampaignMapObj = detailRes
      .filter((v: campaignInfo) => /^ASD_/i.test(v.campaignId)) // 取出ASD開頭劵
      .reduce((map: any, v: campaignInfo) => {
        const parentCampaignIds = v.offerContents?.v?.productRange?.v2[0]?.split(',') || [];
        parentCampaignIds.forEach((id: string) => (map[id] = v)); // 將parentCampaignId對應至child campaign
        return map;
      }, {});

    const detailObj = detailRes.reduce((p: { [key: string]: campaignInfo }, c: campaignInfo) => {
      if (c && c.campaignId) {
        p[c.campaignId] = c;
      }
      return p;
    }, {});

    const output: any[] = [];
    ids.forEach((id) => {
      //排除母券是ASD的
      if (/^ASD_/i.test(id)) {
        return;
      }
      if (detailObj[id]) {
        // const campaignIds = myCampaignIds.length === 0 ? ids : myCampaignIds;
        output.push(getCampaignUI(detailObj[id], myCampaignIds));
      } else if (/print=1/i.test(location.search)) {
        console.log(id + '取不到資料');
      }
    });

    // 判斷是否有再折劵
    return Object.keys(childCampaignMapObj).length === 0
      ? output
      : output.map((v) => {
          // 若有再折劵，再折劵對應母campaignId，塞回母劵
          if (childCampaignMapObj[v.campaignId]) {
            v['childCampaignInfo'] = getCampaignUI(childCampaignMapObj[v.campaignId], myCampaignIds);
          }
          return v;
        });
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
        if (returnDetail && ids.length > 0) {
          let ui = await this.parseCampaignDetail(ids, ids);

          if (/print=1/i.test(location.search)) console.log('getMyCampaigns', JSON.parse(JSON.stringify(ui)));

          return ui;
        }
        return ids;
      });
  },
};

export default api_campaign;
