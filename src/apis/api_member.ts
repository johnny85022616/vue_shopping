import config from '../config/config';
import tools from '../util/tools';

const { mobileApiPath, fetchGetHeaders} = config


const api_member = {
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
  async getMemeberData() {
    const ticket = tools.getCookie('FEEC-B2C-TICKET');
    const data = await fetch(`${mobileApiPath()}member/detail`, {
      ...fetchGetHeaders,
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
  
}


export default api_member 