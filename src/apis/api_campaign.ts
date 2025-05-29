import type { productInfo } from '@/types/productInfo';
import config from '../config/config';
import { getCampaignUI } from './campaign/campaign_util';
import tools from '../util/tools';
import api from './api';

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

  async parseCampaignDetail(ids: string[], myCampaignIds: string[] = [], needProductImg = false) {
    if (!ids) return [];
    let detailRes = await this.getCampaignDetail(ids);

    const payload = {
      q1_x: 0.5,
      list_num: 1,
      type: 1,
      supplier_y: 1,
    };
    //排除子券
    detailRes = detailRes.filter(v => (!v.campaignRange?.v2?.[0]));
    if (/print=1/i.test(location.search)) console.log('detailRes', detailRes);

    // 用 Promise.all 等待所有 async forEach 完成
    await Promise.all(
      detailRes.map(async (v) => {
        // 如果campaignRange.v[9]為空格，則無需打getalist
        if (v.campaignRange?.v[9] === ' ') {
          const data = {
            ...payload,
            filter: {
              k: v.campaignRange?.k,
              v: v.campaignRange?.v,
            },
          };
          const res = await api.ai.getAiData('getalist', data);
          if (res?.[0]?.image_url) v.productImg = res?.[0].image_url;
        }
      })
    );

    const childCampaignIdsArr:string [] = [] ;
    const campaignUi = detailRes.map(v=>{
      if (v.childCampaignIds && v.childCampaignIds.length > 0) {
        const childCampaignId = v.childCampaignIds[0];
        childCampaignIdsArr.push(childCampaignId);
      }
      return {...getCampaignUI(v, myCampaignIds), childCampaignId: v.childCampaignIds?.[0]};
    });
    if (/print=1/i.test(location.search)) console.log('campaignUi', campaignUi);
    if (/print=1/i.test(location.search)) console.log('childCampaignIdsArr', childCampaignIdsArr);

    //子券cmapaignInfo
    let childDtailRes = await this.getCampaignDetail(childCampaignIdsArr);
    //子券UI
    const childCampaignUI = childDtailRes.map((v) => {
      return getCampaignUI(v, myCampaignIds);
    })
    if (/print=1/i.test(location.search)) console.log('childCampaignUI', childCampaignUI);

    const output = campaignUi.map((v:any) => {
      if(v.childCampaignId){
        //若有子券，則塞回母券
        const childCampaignInfo = childCampaignUI.find(c => c.campaignId === v.childCampaignId);
        if(childCampaignInfo){
          v.childCampaignInfo = childCampaignInfo;
        }
      }
      return v
    })

    //取得活動第一個商品圖
    if(output && needProductImg){
      const pids = output.map(v=>v.pid)
      const products = await api.product.getProducts(pids)
      output.forEach((v) => {
        if (!v.productImg) {
          const product = products?.[v.pid]
            v.productImg = product?.image_url || 'https://img.shopping.friday.tw/images/product/272/8168822/8168822_3_1.webp?853171'
        }
      })
    }
    if (/print=1/i.test(location.search)) console.log('output', output);

    // 判斷是否有再折劵
    return output
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
