import type { productInfo } from '@/types/productInfo';
import config from '../config/config';
import { getCampaignUI } from './campaign/campaign_util';
import tools from '../util/tools';

const { isLogin, cloudApiPath, fetchGetHeaders, fetchPostHeaders, frontApiPath, aiCmspApiPath} = config;
const { getIndexedDBCache, setIndexedDBCache } = tools;

const responseHandler = (res: any): { status: number; msg: string; code: number } => {
  const { resultData } = res;
  const { msg, resultCode } = resultData[0];
  const code = parseInt(resultCode);

  if (res.resultCode === 999) {
    return {
      status: 0,
      msg: '請先登入會員！',
      code,
    };
  }
  if (res.resultCode === 0) {
    if (parseInt(resultCode) === 0) {
      return {
        status: 1,
        msg: msg,
        code,
      };
    } else {
      return {
        status: 0,
        msg: msg,
        code,
      };
    }
  }
  return {
    status: 0,
    msg: msg,
    code,
  };
};

const api_campaign = {
  // 取活動明細
  async getCampaignDetail(campaignIds: string[]):Promise<campaignInfo[]> {
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
    const pids = info ? info[0].campaignRange?.v[9]?.split(',') : [];
    return pids;
  },

  async parseCampaignDetail(ids: string[], myCampaignIds: string[] = []): Promise<string[]> {
    if (!ids) return [];
    const detailRes = await this.getCampaignDetail(ids);

    // D9再折劵 抽出哪寫劵有綁定再折劵
    const childCampaignMapObj = detailRes
      .filter((v: campaignInfo) => v.campaignRange?.v2?.[0]) // 取出ASD開頭劵
      .reduce((map: Record<string, campaignInfo>, v: campaignInfo) => {
        const parentCampaignId = v.campaignRange?.v2?.[0];
        if (parentCampaignId) {
          map[parentCampaignId] = v; // 將parentCampaignId對應至child campaign
        }
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
      const ob = detailObj[id];
      if (ob && !ob.campaignRange?.v2?.[0]) {
        output.push(getCampaignUI(ob, myCampaignIds));
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
  // 取得個人身上有哪些活動折扣campaignId
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
  // 領取活動
  async drawCampaign(campaignId: string | (string | undefined)[] | null = null) {
    if (!isLogin) {
      return {
        status: 0,
        msg: '請先登入會員！',
      };
    }

    return await fetch(`${frontApiPath()}api/campaign/drawCampaign`, {
      ...fetchPostHeaders,
      body: JSON.stringify({
        param: {
          campaignIds: typeof campaignId === 'string' ? [campaignId] : campaignId,
        },
      }),
    })
      .then((res) => res.json())
      .then((res) => {
        window.sessionStorage.removeItem('my_campaign_count');
        return responseHandler(res);
      });
  },
  // 領取折扣碼
  async drawDiscountCode(discountCode = '') {
    if (!isLogin) {
      return {
        status: 0,
        msg: '請先登入會員！',
      };
    }
    return await fetch(`${frontApiPath()}api/campaign/drawDiscountCode`, {
      ...fetchPostHeaders,
      body: JSON.stringify({
        param: {
          password: discountCode,
        },
      }),
    })
      .then((res) => res.json())
      .then((res) => {
        window.sessionStorage.removeItem('my_campaign_count');
        return responseHandler(res);
      });
  },
  // 取得共用天 我的優惠數量 （分子）
  async getMyCampaignsCount(): Promise<number> {
    if (!isLogin) return 0;

    const conutCache = tools.getCache('my_campaign_count');
    if (conutCache) {
      return conutCache;
    }

    const campaignData = await this.getMyCampaigns(false);
    if (campaignData.length === 0) return 0;
    const count = campaignData.filter(v => /^(CD|AC|FV|BC|PC|SC|OC|UO|ED|AED|LD|ALD|ADD)/i.test(v)).length;
    tools.setCache('my_campaign_count', count, 600);
    return count;
  },
  // 取得CMS Banner設定
  async getCmsBanners(params = {
    site_id: 'BW290341',
    block_code: '',
    status: 1,
    type: 1,
    page: 1,
    per_page: 100
  }) {
    const cacheName = 'cms_banner_cache';
    const cache = await getIndexedDBCache(cacheName);
    if (cache) return cache;

    // Convert all values to string for URLSearchParams
    const stringParams: Record<string, string> = Object.fromEntries(
      Object.entries(params).map(([k, v]) => [k, String(v)])
    );

    return await fetch(
      `${aiCmspApiPath}/api/website_layout?${new URLSearchParams(
        stringParams
      ).toString()}`,
      {
        ...fetchGetHeaders,
      }
    )
      .then((res) => res.json())
      .then((res) => {
        const { resultCode, resultData } = res;
        if (resultCode === 0 && resultData) {
          // 優化：一次處理分類與排序，減少重複程式碼
          const obj: Record<string, any[]> = {};
          for (const x of resultData) {
            let key = x.block_code;
            if (/^IC/.test(key)) {
              // 取出IC後方的數字並存入 contents.id
              const match = key.match(/^IC(\d+)/);
              x.contents.id = match ? parseInt(match[1], 10) : 0;
              key = 'IC';
            }
            (obj[key] = obj[key] || []).push(x.contents);
          }
          // 只在有 IC 資料時才排序
          if (Array.isArray(obj.IC)) {
            obj.IC.sort((a, b) => a.id - b.id);
          }
          setIndexedDBCache(cacheName, obj, 60);
          return obj;
        }
        return null;
      })
      .catch(() => {
        return null;
      });
  }
};

export default api_campaign;
