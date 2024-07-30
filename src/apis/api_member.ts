import config from '../config/config';
import tools from '../util/tools';
import memberInfo from '../mockData/memberInfo';

const { mobileApiPath, frontApiPath, fetchGetHeaders , setTicket} = config


const api_member = {
  login(){
  tools.setCookie('FEEC-B2C-UID', '63hiMqFBVEiDNYJttgytCw%3D%3D');
  tools.setCookie('_ga', 'GA1.1.794667265.1722235111');
  tools.setCookie('FEEC-FA-TOKEN', 'R2OqwvNPPPoPKkLCdhwXDSVDem5ZsQnY');
  tools.setCookie('FEEC-B2C-INFO' , encodeURIComponent(JSON.stringify((memberInfo.memInfo))))
  tools.setCookie('FEEC-B2C-INFO' , encodeURIComponent(JSON.stringify((memberInfo.memInfo))))
  alert('登入成功')
  },
  logout(){
    tools.deleteCookie('FEEC-B2C-UID')
    tools.deleteCookie('FEEC-B2C-TICKET')
    tools.deleteCookie('FEEC-FA-TOKEN')
    tools.deleteCookie('FEEC-B2C-INFO')
    tools.deleteCookie('_ga')
    alert('已登出')
  },
  checkLogin():boolean{
    let isLogin = false;
    const faToken = tools.getCookie('FEEC-FA-TOKEN');
    const uid = tools.getCookie('FEEC-B2C-UID');
    if (uid && faToken) {
      isLogin = true;
    }
    return isLogin
  },
  //取得會員資料
  async getMemberData() {
    const exHeaders = setTicket();
    const data = await fetch(`${mobileApiPath()}member/detail`, {
      ...fetchGetHeaders,
      ...exHeaders
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
  async queryVoucherBalance():Promise<number>{
    return await fetch(`${frontApiPath()}member/voucher/queryVoucherBalance`, {
      ...fetchGetHeaders,
    })
      .then((res) => res.json())
      .then((res) => {
        if (res && res.resultData) {
          return res.resultData;
        }
        return 0
      })
      .catch((err) => {
        console.error(`queryVoucherBalance faliure.`);
        console.error(err);
        return 0
      });
  },
  //查遠傳幣餘額
  async getFetCoins():Promise<number> {
    const exHeaders = setTicket(); 
    return await fetch(`${mobileApiPath('')}fcoin/queryFcoins`, {
      ...fetchGetHeaders,
      ...exHeaders
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
        console.log("queryFcoins api error");
        return 0;
      });
  },


  
}


export default api_member 