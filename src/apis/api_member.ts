import config from '../config/config';
import $cookies from 'vue-cookies'

const { mobileApiPath, fetchGetHeaders } = config

const api_member = {
  checkLogin(){
    let isLogin = false;
    console.log($cookies);
// const uid = $cookies.get('FEEC-B2C-UID');
// if (uid && faToken) {
//   isLogin = true;
// }
  }
}


export default api_member 