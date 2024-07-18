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
  }
}


export default api_member 