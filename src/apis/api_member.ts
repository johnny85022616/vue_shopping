import config from '../config/config';
import tools from '../util/tools';
import memberInfo from '../mockData/memberInfo';
import uiAlert from './ui_alert';
import type { electronicTicket } from '@/types/electronicTicket';

const { isLogin, mobileApiPath, frontApiPath, fetchGetHeaders, fetchPostHeaders, setTicket } = config;

const api_member = {
  isLogin,
  login() {
    tools.setCookie('FEEC-B2C-UID', '63hiMqFBVEiDNYJttgytCw%3D%3D');
    tools.setCookie('_ga', 'GA1.1.794667265.1722235111');
    tools.setCookie('FEEC-FA-TOKEN', 'R2OqwvNPPPoPKkLCdhwXDSVDem5ZsQnY');
    tools.setCookie('FEEC-B2C-TICKET', 'MCwCFCnFlF3X4soUtzkD2OL5GJu5gIiUAhQIDWoYxozb2ZKt_QguZpb4nrJiyg');
    tools.setCookie('FEEC-B2C-INFO', encodeURIComponent(JSON.stringify(memberInfo.memInfo)));
    alert('登入成功');
  },
  logout() {
    tools.deleteCookie('FEEC-B2C-UID');
    tools.deleteCookie('FEEC-B2C-TICKET');
    tools.deleteCookie('FEEC-FA-TOKEN');
    tools.deleteCookie('FEEC-B2C-INFO');
    tools.deleteCookie('_ga');
    alert('已登出');
  },
  checkLogin(): boolean {
    let isLogin = false;
    const faToken = tools.getCookie('FEEC-FA-TOKEN');
    const uid = tools.getCookie('FEEC-B2C-UID');
    if (uid && faToken) {
      isLogin = true;
    }
    return isLogin;
  },
  //取得會員資料
  async getMemberData() {
    const exHeaders = setTicket();
    const data = await fetch(`${mobileApiPath()}member/detail`, {
      ...fetchGetHeaders,
      ...exHeaders,
    })
      .then((res) => res.json())
      .then((res) => {
        if (res && res.data) {
          return res.data[0];
        }
      })
      .catch((err) => {
        console.error(`getMemeberData faliure.`);
        console.error(err);
      });
    return data;
  },
  //查購物金餘額
  async queryVoucherBalance(): Promise<number> {
    return await fetch(`${frontApiPath()}member/voucher/queryVoucherBalance`, {
      ...fetchGetHeaders,
    })
      .then((res) => res.json())
      .then((res) => {
        if (res && res.resultData) {
          return res.resultData;
        }
        return 0;
      })
      .catch((err) => {
        console.error(`queryVoucherBalance faliure.`);
        console.error(err);
        return 0;
      });
  },
  //查遠傳幣餘額
  async getFetCoins(): Promise<number> {
    const exHeaders = setTicket();
    return await fetch(`${mobileApiPath('')}fcoin/queryFcoins`, {
      ...fetchGetHeaders,
      ...exHeaders,
    })
      .then((res) => res.json())
      .then((res) => {
        // const res = JSON.parse('{"payload":[{"amount":485}],"code":"0000","message":"OK"}');
        if (res && res.message === 'OK') {
          return res.payload[0].amount;
        }
        return 0;
      })
      .catch(() => {
        console.log('queryFcoins api error');
        return 0;
      });
  },
  //取得電子票券
  async getElectronicTicket(
    pageNumber = 1,
    pageRow = 100,
    singleTicketInfo: any
  ): Promise<electronicTicket[] | never[]> {
    let postData: any = {};
    //若只取單張票券不需頁數相關參數
    if (!singleTicketInfo) {
      postData.pageNumber = pageNumber;
      postData.pageRow = pageRow;
    }
    //取單一票券
    if (singleTicketInfo) {
      postData = { ...postData, ...singleTicketInfo };
    }
    return await fetch(`${frontApiPath()}member/ticket`, {
      ...fetchPostHeaders,
      body: JSON.stringify(postData),
    })
      .then((res) => res.json())
      .then((res) => {
        let { resultCode, resultData, resultMsg } = res || {};
        // if(pageNumber === 1){
        //   resultData = [
        //     {
        //       dealId: "20241203297936", // 交易編號
        //       productId: "8792779", // 商品代碼
        //       productName: "7-11茶葉蛋10元抵用券", // 品名
        //       images:
        //         "https://img.shopping.friday.tw/images/product/293/8792779/8792779_3_1.webp?707554",
        //       manufacturerCode: "SVN",
        //       sn: "SQR63CXPJ8K8", // 序號
        //       barcode: "7500070322391964,44HGFSKY", // 逗點分隔, 最多3個值, 有值的轉碼
        //       period: "2024/10/01-2024/12/31", // 到期區間, 只要留後面的日期
        //     },
        //     {
        //       dealId: "20241126146969",
        //       productId: "8901259",
        //       productName: "全家_維力炸醬麵(碗)23元折價券",
        //       images:
        //         "https://img.shopping.friday.tw/images/product/296/8901259/8901259_3_1.webp",
        //       manufacturerCode: "FAM",
        //       sn: "DAINTALYOFWWIM28TT8",
        //       barcode: "DAINTALYOFWWIM28TT8",
        //       period: "2024/11/12-2024/12/31",
        //     },
        //   ]
        // }
        // if(pageNumber === 2){
        //   resultData = [
        //     {
        //       dealId: "20241203297937", // 交易編號
        //       productId: "8792779", // 商品代碼
        //       productName: "7-11茶葉蛋10元抵用券", // 品名
        //       images:
        //         "https://img.shopping.friday.tw/images/product/293/8792779/8792779_3_1.webp?707554",
        //       manufacturerCode: "SVN",
        //       sn: "SQR63CXPJ8K8", // 序號
        //       barcode: "7500070322391964,44HGFSKY", // 逗點分隔, 最多3個值, 有值的轉碼
        //       period: "2024/10/01-2024/12/31", // 到期區間, 只要留後面的日期
        //     },
        //     {
        //       dealId: "20241126146960",
        //       productId: "8901259",
        //       productName: "全家_維力炸醬麵(碗)23元折價券",
        //       images:
        //         "https://img.shopping.friday.tw/images/product/296/8901259/8901259_3_1.webp",
        //       manufacturerCode: "FAM",
        //       sn: "DAINTALYOFWWIM28TT8",
        //       barcode: "DAINTALYOFWWIM28TT8",
        //       period: "2024/11/12-2024/12/31",
        //     },
        //   ]
        // }
        if (resultCode === 0 && resultData) {
          return resultData;
        }
        if (resultCode === 800) {
          return [];
        }
        uiAlert.getFadeAlert(resultMsg);
      })
      .catch(() => {
        uiAlert.getFadeAlert('取得電子票券發生錯誤');
        return [];
      });
  },
};

export default api_member;
