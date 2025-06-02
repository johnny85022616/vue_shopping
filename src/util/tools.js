import configs from '../config/config';
const fetchPostHeaders = {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
};
const fetchGetHeaders = {
  method: 'GET',
  headers: {
    'Content-Type': 'application/json',
  },
};

const indexedDBHelper = {
  dbName: 'toolFuncsDB',
  storeName: 'cacheStore',
  async initDB() {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, 1);
      request.onupgradeneeded = (event) => {
        const db = event.target.result;
        if (!db.objectStoreNames.contains(this.storeName)) {
          db.createObjectStore(this.storeName, { keyPath: 'name' });
        }
      };
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  },
  async setItem(name, value) {
    const db = await this.initDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(this.storeName, 'readwrite');
      const store = transaction.objectStore(this.storeName);
      const request = store.put(value);
      request.onsuccess = () => resolve(true);
      request.onerror = () => reject(request.error);
    });
  },
  async getItem(name) {
    const db = await this.initDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(this.storeName, 'readonly');
      const store = transaction.objectStore(this.storeName);
      const request = store.get(name);
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  },
  async removeItem(name) {
    const db = await this.initDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(this.storeName, 'readwrite');
      const store = transaction.objectStore(this.storeName);
      const request = store.delete(name);
      request.onsuccess = () => resolve(true);
      request.onerror = () => reject(request.error);
    });
  },
  async clear() {
    const db = await this.initDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(this.storeName, 'readwrite');
      const store = transaction.objectStore(this.storeName);
      const request = store.clear();
      request.onsuccess = () => resolve(true);
      request.onerror = () => reject(request.error);
    });
  },
};

const Url = {
  // public method for url encoding
  encode: function (string) {
    return escape(this._utf8_encode(string));
  },
  // public method for url decoding
  decode: function (string) {
    return this._utf8_decode(unescape(string));
  },
  // private method for UTF-8 encoding
  _utf8_encode: function (string) {
    string = string.replace(/\r\n/g, '\n');
    var utftext = '';
    for (var n = 0; n < string.length; n++) {
      var c = string.charCodeAt(n);
      if (c < 128) {
        utftext += String.fromCharCode(c);
      } else if (c > 127 && c < 2048) {
        utftext += String.fromCharCode((c >> 6) | 192);
        utftext += String.fromCharCode((c & 63) | 128);
      } else {
        utftext += String.fromCharCode((c >> 12) | 224);
        utftext += String.fromCharCode(((c >> 6) & 63) | 128);
        utftext += String.fromCharCode((c & 63) | 128);
      }
    }
    return utftext;
  },
  // private method for UTF-8 decoding
  _utf8_decode: function (utftext) {
    var string = '';
    var i = 0,
      c2,
      c3;
    var c = (c2 = 0);
    while (i < utftext.length) {
      c = utftext.charCodeAt(i);
      if (c < 128) {
        string += String.fromCharCode(c);
        i++;
      } else if (c > 191 && c < 224) {
        c2 = utftext.charCodeAt(i + 1);
        string += String.fromCharCode(((c & 31) << 6) | (c2 & 63));
        i += 2;
      } else {
        c2 = utftext.charCodeAt(i + 1);
        c3 = utftext.charCodeAt(i + 2);
        string += String.fromCharCode(((c & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63));
        i += 3;
      }
    }
    return string;
  },
};

const getVideoId = (url) => {
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^"#&?]*).*/;
  const match = url.match(regExp);

  return match && match[2].length === 11 ? match[2] : null;
};

const getYoutubeIframe = (vid) => {
  const docWidth = document.body.clientWidth;
  const videoHeight = Math.floor(docWidth / 1.77);
  return `<iframe width="100%" height="${videoHeight}" src="https://www.youtube.com/embed/${vid}" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>`;
};

// 商品連結
const productionProductPage = 'https://m.shopping.friday.tw/product';

export default {
  isFetnetSource: () => {
    return (
      /(mg_id|fetmc|FET|fetnetestore)/i.test(location.search) ||
      /A23001877/i.test(location.href) ||
      /(channel_id7|fetnet_session|isFetnet%22%3A1)/i.test(document.cookie)
    );
  },
  version() {
    const versionDate = new Date();
    return (
      versionDate.getMonth() +
      1 +
      '' +
      versionDate.getDate() +
      '' +
      versionDate.getHours() +
      '' +
      versionDate.getMinutes()
    );
  },
  checkInAppSessions() {
    if (/FEEC-B2C-DEVICE=APP/i.test(document.cookie)) {
      return true;
    }
    return false;
  },
  checkInSuperAppSessions() {
    if (/FEEC-B2C-DEVICE=SUPER-APP/i.test(document.cookie)) {
      return true;
    }
    if (/WT\.mg_id=fetmc_appbutton_coffee/i.test(location.search)) {
      document.cookie = 'FEEC-B2C-DEVICE=SUPER-APP; max-age=3600;';
      return true;
    }
    if (/WT\.mg_id=fetmc_/i.test(location.search)) {
      return true;
    }
    return false;
  },
  getYoutubeId(url) {
    return getVideoId(url);
  },
  isMobile() {
    return /mobi(le)?/i.test(navigator.userAgent);
  },
  stopBack() {
    window.onhashchange = function () {
      window.history.forward();
    };
    if (!document.referrer) {
      window.history.pushState(null, document.title, location.href + '#superapp');
      setTimeout(function () {
        document.body.click();
      }, 500);
    }
  },
  checkMweb(path) {
    if (!/(localhost|127)/i.test(location.host) && location.protocol === 'http:') {
      window.location.replace(location.href.replace('http:', 'https:'));
      return;
    }

    const pathname = path ? path : '';
    const userAgent = navigator.userAgent;
    if (!/(android|iphone)/i.test(userAgent) && !/localhost/i.test(location.origin)) {
      if (/ysdt\.com\.tw/i.test(location.host)) {
        window.location.href = `https://${location.hostname}/${pathname}${location.search}`;
      } else {
        const localSub = location.origin.match(/ec(2|3)-m(sit2|sit|uat2|uat|stage)/i);
        let dsub = '';
        if (localSub && localSub[1]) {
          dsub = `ec${localSub[1]}-${localSub[2]}.`;
        }
        const cloudSub = location.origin.match(/(ec-m(-uat)?)/i);
        if (cloudSub && cloudSub[1]) {
          dsub = cloudSub[1].replace('m', 'w') + '.';
        }
        window.location.href = `https://${dsub}shopping.friday.tw${pathname}${location.search}`;
      }
    }
  },
  openExternalFromLine() {
    let href = window.location.href;

    const u = navigator.userAgent;
    const isLineApp = u.indexOf('Line') > -1; // Line 內建瀏覽器
    // const ua = navigator.userAgent.toLowerCase()
    // const isFbApp = u.indexOf('FBAV') > -1 // FB App 內建瀏覽器
    // const isWeixinApp = ua.match(/MicroMessenger/i) == 'micromessenger' // 微信內建瀏覽器

    if (isLineApp) {
      if (href.indexOf('openExternalBrowser') < 0) {
        // http 網址才處理
        if (href.indexOf('http') != 0 || href.indexOf('//') < 0) {
          return;
        }
        // 網址沒有參數 ? 時, 直接加參數
        if (href.indexOf('?') < 0) {
          href += '?openExternalBrowser=1';
        } else {
          // 網址有參數 ? 時, 用 & 加參數
          href += '&openExternalBrowser=1';
        }

        window.location.href = href;
      }
    }
  },
  isLighthouse: (() => {
    return /lighthouse/i.test(navigator.userAgent) ? true : false;
  })(),
  priceFormat(x) {
    return x ? x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') : x;
    // 每三個數字的位置中間加入 ,
  },
  getProductPageLink(o, exUrl) {
    return productionProductPage + `?sid=${o.sid}&cid=${o.cid}&pid=${o.pid}&mid=${o.mid}${exUrl}`;
  },
  urlSearchToObj() {
    const pairs = window.location.search.substring(1).split('&');
    let obj = {};
    let pair, i;
    for (i in pairs) {
      if (pairs[i] === '') continue;

      pair = pairs[i].split('=');
      obj[decodeURIComponent(pair[0])] = decodeURIComponent(pair[1]).replace(/</g, '&lt;').replace(/>/g, '&gt;');
    }
    return obj;
  },
  replaceLineBreak(str) {
    let content = str;
    return content.replace(/\\r\\n/g, '');
  },
  replaceTplImagePath(str) {
    let content = str;
    if (content) {
      content = content.replace(/"http:\/\/img.gohappy\.com\.tw\/tpl/gi, '"https://img.shopping.friday.tw/tpl');
      content = content.replace(/("\/tpl)/gi, '"https://img.shopping.friday.tw/tpl');
    }
    return content;
  },
  replaceWidthAndHeight(str) {
    let content = str;
    if (content) {
      content = content.replace(/height:\s?\d+px;?/gi, '');
      content = content.replace(/(width):\s?\d+px;?/gi, 'width:100%;');
      content = content.replace(/(height="(\d+)")/gi, '');
      content = content.replace(/(width="(\d+)")/gi, 'width="100%"');
    }
    return content;
  },
  figureToIframe(content) {
    const figureAry = content.match(/<figure(.*?)>(.*?)<\/figure>/gi);
    if (!figureAry || figureAry.length === 0) return content;

    figureAry.forEach((str) => {
      const vId = getVideoId(str);
      if (vId) {
        content = content.replace(str, getYoutubeIframe(vId));
        // content += getYoutubeIframe(vId);
      }
    });

    return content;
  },
  // 金額顯示 依幣金或是純現金
  displayProductPrice(info) {
    let price = 0;
    price = info.price;

    // 幣金顯示處理
    if (info.rewardPointInfo) {
      // 純幣
      if (info.rewardPointInfo.lifeExchangePoint) {
        price = 0;
      }
      // 幣+金
      if (info.rewardPointInfo.lifePartialPoint && info.rewardPointInfo.lifePartialPrice) {
        price = info.rewardPointInfo.lifePartialPrice;
      }
    }
    if (info.salePrice) {
      price = info.salePrice;
    }
    if (info.lifeProduct) {
      price = info.lifePartialPrice;
    }
    return parseInt(price);
  },
  getCookie(name) {
    var mycookie = document.cookie.split('; ');
    for (var i = 0; i < mycookie.length; i++) {
      var cookie1 = mycookie[i].split('=');
      if (cookie1[0] === name) {
        return Url.decode(cookie1[1]);
      }
    }
    return null;
  },
  setCookie(name, value, days) {
    var expires = '';
    if (days) {
      var date = new Date();
      date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
      expires = '; expires=' + date.toUTCString();
    }
    document.cookie = name + '=' + (value || '') + expires + '; path=/';
  },
  deleteCookie(name) {
    // 设置 cookie 的过期时间为一个过去的日期
    document.cookie = name + '=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
  },
  //將api時間格式轉為date格式
  apiTimeFormat(apiDate) {
    if (typeof apiDate !== 'string') {
      return null;
    }
    let dateArr = apiDate.split(' ');
    let datePieces = dateArr[0].split('/');
    let timePieces = dateArr[1].split(':');
    let formatDate = new Date(
      datePieces[0],
      datePieces[1] - 1,
      timePieces[2],
      timePieces[0],
      timePieces[1],
      timePieces[2]
    );
    return this.isValidDate(formatDate) ? formatDate : apiDate;
  },
  isValidDate(d) {
    return d instanceof Date && !isNaN(d);
  },

  //姓名防呆
  checkName(name) {
    let nameAlert = '';
    var otherChar = name.replace(/[A-Za-z-\s*\u4e00-\u9fa5]/g, ''); //取代非特殊字元正則
    var tabChar = name.search(/\t/); //存在tab正則
    var onlyChinese = name.replace(/[A-Za-z-\s*]/g, ''); //英文取代正則
    console.log(onlyChinese);

    //是否為空值
    if (null == name || name.trim().length <= 0) {
      nameAlert += '本欄位不可為空';
    }
    //不可存在-特殊字元
    else if (otherChar != '') {
      nameAlert += '不可輸入數字或特殊字元';
    }
    //不可存在-TAB鍵(\t)
    else if (tabChar != -1) {
      nameAlert += '不可輸入特殊字元';
    }
    //當英文被取代掉時候 應只剩下中文
    else if (onlyChinese.length < 2 && onlyChinese.length != 0) {
      nameAlert += '不可中英夾雜';
    }
    //不可輸入超過20個字
    else if (name.length > 20) {
      nameAlert += '不可輸入超過20個字';
    }
    return nameAlert;
  },

  //手機防呆
  checkMoblie(phone) {
    let phoneAlert = '';
    var re = /^09/; //09開頭正則

    if (phone.length != 0) {
      if (/[^0-9x*]/g.test(phone)) {
        phoneAlert += '不可包含其他字元';
      } else if (null == phone || phone.length < 10) {
        phoneAlert += '字數不足';
      } else if (phone.match(re) == null) {
        phoneAlert += '必須為09開頭';
      }
    } else {
      phoneAlert += '請填寫手機號碼';
    }
    return phoneAlert;
  },

  //市話防呆
  checkTel(tel) {
    let telAlert = '';
    if (tel.length > 0) {
      var telFormat = /^(0\d{1,3})?-?\d{5,8}(#\d{1,6})?$/;
      if (tel.length != 0 && telFormat.test(tel) == false) {
        telAlert += '格式錯誤';
      }
    }
    return telAlert;
  },
  //email防呆
  checkEmail(val) {
    let msg = '';
    if (val !== '') {
      const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      msg = regex.test(val) ? '' : '請輸入正確信箱格式';
    }
    return msg;
  },

  // //email防呆
  // checkEmail(email) {
  //   let emailAlert = '';
  //   //開頭第一個字一定要為英文或數字，第一字之後可為多個英數字.號-號組合(ex: ab-c@、ab.c-1234@、abc.123-acv@)，@為必要，＠後最後一個.前接多個.或-加上英數字組合但第一字一定要為英數字(ex: @abc.a-c.com.tw、＠c-sdf-fds-w.c.com.tw)
  //   var emailRule = /^\w+((-\w+)|(\.\w+)|(\+\w+))*@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z]+$/;

  //   if (null == email || email.length <= 0) {
  //     emailAlert = '本欄位不可為空';
  //   } else if (email != '' && email.search(emailRule) == -1) {
  //     emailAlert += '信箱格式錯誤';
  //   }
  //   return emailAlert;
  // },

  //地址防呆
  checkAddress(city, region, road) {
    let addressAlert = '';
    var addrFormat = new RegExp('[路街道號]'); //街道正則
    var otherChar = road.replace(/[\w-\s\u4e00-\u9fa5]/g, ''); //非特殊字元取代

    //縣市
    if (city === '') {
      addressAlert = '縣市錯誤,本欄位不可為空';
    }
    //區域
    else if (region === '') {
      addressAlert = '區域錯誤,本欄位不可為空';
    }
    //街道
    else if (null == road || road.trim().length <= 0) {
      addressAlert += '地址錯誤,請輸入地址';
    } else if (addrFormat.test(road) == false) {
      addressAlert += '地址錯誤,須包含路、街、道、號其中一個字元';
    } else if (otherChar != '') {
      addressAlert += '地址錯誤,不可輸入特殊字元';
    }
    return addressAlert;
  },
  checkCreditCardInfo(number) {
    let errorMessage = '';

    // 檢查卡號
    if (!number.length) {
      errorMessage = '請輸入信用卡卡號';
      return errorMessage;
    } else {
      // 長度檢查
      if (number.length < 16) {
        errorMessage = '請輸入16碼信用卡卡號';
        return errorMessage;
      }

      // 必須為數字
      if (isNaN(parseInt(number))) {
        errorMessage = '錯誤的信用卡卡號格式,請重新輸入';
        return errorMessage;
      }

      // 不可使用的卡別（第一碼 為3/4/5以外的卡。)
      if (!number.startsWith('3') && !number.startsWith('4') && !number.startsWith('5')) {
        errorMessage = '輸入卡片資料無效/無法使用,請重新輸入或更換卡片';
        return errorMessage;
      }
    }
    return errorMessage;
  },
  checkCreditExpire(year, month) {
    let errorMessage = '';
    // 檢查到期日資料長度
    if (month.length < 2 || year.length < 2) {
      errorMessage = '請輸入有效期限';
      return errorMessage;
    } else {
      year = '20' + year;
      console.log('year', year);
      // 檢查到期日
      var today = new Date();
      if (today.getFullYear() > year || (today.getFullYear() == year && today.getMonth() + 1 > month)) {
        errorMessage = '有效期限已過期,請重新輸入';
        return errorMessage;
      }

      if (month < 0 || month > 12) {
        errorMessage = '錯誤的有效期限,請重新輸入';
        return errorMessage;
      }
    }
    return errorMessage;
  },
  getCookies(cname) {
    var mycookie = document.cookie.split('; ');
    for (var i = 0; i < mycookie.length; i++) {
      var cookie1 = mycookie[i].split('=');
      if (cookie1[0] == cname) {
        return decodeURIComponent(cookie1[1]);
      }
    }
    return null;
  },
  // 站台ID
  aiUserId() {
    // AI API target_value
    // 設定 ai api target_value
    let aiUserId = '0';
    const gaCookie = this.getCookies('_ga');
    if (gaCookie) {
      aiUserId = gaCookie.match(/(\d+)\.(\d+)$/gi)[0];
    }
    return aiUserId;
  },
  getCache: (name) => {
    if (!name || typeof name !== 'string') return null;

    const cache = window.sessionStorage.getItem(name);
    if (!cache) return null;

    const obj = JSON.parse(cache);
    const { data, expires } = obj;
    if (data && expires > new Date().getTime()) {
      return obj.data;
    } else {
      return null;
    }
  },
  setCache: (name, value, plusSeconds) => {
    if (!name || !value || !plusSeconds) return false;

    const now = new Date();
    if (typeof plusSeconds === 'number') {
      now.setSeconds(now.getSeconds() + plusSeconds);
    }

    window.sessionStorage.setItem(
      name,
      JSON.stringify({
        data: value,
        expires: now.getTime(),
      })
    );
  },
  strlen(str) {
    return str.replace(/[^\\x00-\\xff]/g, 'xx').length;
  },

  /**
   * AI API 共用filter參數 doc: https://docs.google.com/document/d/1xAfd9Z5iIoxQ7nLhWYGTRX1edlmtGuOeIUi1a5sEU7Y/edit?usp=sharing
   k 第 1 位元 supplier_id: 只有0,1。0代表沒有，1代表正向 ([ ]  的 範例:"45510", 可以多個)
   k 第 2 位元 supplier_id: 只有0,1。0代表沒有，1代表負向 ([ ]  的 範例:"44219", 可以多個)
   k 第 3 位元 分類: 有0,1,2。0代表沒有，1代表正向，2代表負向 ([ ]  的 範例:"M0010", 可以多個)
   k 第 4 位元 關鍵字: 有0,1,2。0代表沒有，1代表有(一定是正向)，2代表負向  ([ ]  的 範例: "原子筆,蘋果", 可以多個) **若要排除請在關鍵字加!!   ex: "!!原子筆,蘋果"
   k 第 5 位元 0: 0 是原本的。1是 使用最低價格機制 , ([ ]  的 範例只能是: "") 
   * @param  {...any} argument 
   * @returns Object
   */
  composeaiApiFilter(...argument) {
    const argLen = argument.length < 4 ? 4 : argument.length;
    const tag = Array(argLen).fill(0);
    const tagStr = Array(argLen).fill('');

    tag.forEach((ele, idx) => {
      if (argument[idx]) {
        if (/^!!/.test(argument[idx])) {
          tagStr[idx] = argument[idx].replace(/^!!/, '');
          tag[idx] = 2;
        } else {
          tag[idx] = 1;
          tagStr[idx] = argument[idx];
        }
      }
    });

    const k = tag.join('');
    const v = [...tagStr];
    return { k: k, v: v };
  },
  /**
   * AI API 共用FUNC
   * @param {String} aiType AI API類型
   * @param {Object} payload AI API POST RAW 參數
   * @returns
   */
  async getAiData(aiType, payload) {
    // 加入不願意曝光在其他地方的供應商Id
    payload = this.exceptSupplierTag(payload);

    // 設定 target_value (user id)
    const postData = Object.assign({
      target_value: this.aiUserId(),
      ...payload,
    });

    // 從CACHE取siteId，避免B網換頁取API資料時有掉siteId的情境
    const navigationCache = this.getCache('supplier_cache');
    if (navigationCache && aiType !== 'getalist') {
      postData.site_id = navigationCache.siteId;
    }

    // 部份上運的AI API判斷
    const apiUrl = /get(a|k|v|w)list/i.test(aiType) ? configs.aiCloudApiPath : configs.aiApiPath;
    const data = await fetch(`${apiUrl}/api/${aiType}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(postData),
    })
      .then((res) => res.json())
      .then(async (res) => {
        let d;
        if (res && res[0]) {
          const data = res[0];
          if (['getalist', 'getwlist'].includes(aiType)) {
            if (data.pids && data.pids.length > 0) {
              const prdInfo = await this.getPidsInfo(data.pids.map((v) => v.pid));
              d = data.pids.map((ele) => {
                return {
                  ...ele,
                  ...prdInfo[ele.pid],
                };
              });
              if (!this.getCache('supplier_cache')) {
                d = d.filter((e) => e.price !== null);
              }
            }
          } else if (aiType === 'getvlist') {
            const l_pattern = data.l_pattern;
            if (l_pattern) {
              this.setCache(`l_pattern`, l_pattern, 300);
            }
            d = data;
          } else {
            d = data;
          }
        }
        return d || null;
      })
      .catch((err) => {
        console.error(`get aiapi ${aiType} faliure.`);
        console.error(err);
      });
    return data;
  },
  // 加入不願意曝光在其他地方的供應商Id
  exceptSupplierTag(payload) {
    if (window.siteData || window.fridaySiteData) {
      if (payload.filter) {
        const { unShowSupplierIds } = window.siteData || window.fridaySiteData;
        payload.filter.v[1] = [payload.filter.v[1]].concat(unShowSupplierIds).join(',');
        const filterK = payload.filter.k.split('');
        filterK[1] = '1';
        payload.filter.k = filterK.join('');
      }
    }
    return payload;
  },
  goProductPage(e, pid, extendData, target = '_self', searchDataCount = 0, searchClickedIndex = 0) {
    if (e) {
      e.preventDefault();
    }

    let exSearchParams = '';

    // extendData 如果帶整個商品資料 則放sessionStorage來加速轉入商品頁的圖片出現速度
    if (typeof extendData === 'object') {
      const { pid, name, image_url, img, price, id3, exSearch, discount } = extendData;
      if (pid && name && (image_url || img) && price) {
        let imgPath = image_url;
        if (img) {
          imgPath = img;
        }
        window.sessionStorage.setItem(
          'cache_' + pid,
          JSON.stringify({
            pid: pid,
            name: name,
            sampleImages: [imgPath],
            price: price,
            discount,
          })
        );
      }

      if (id3) {
        exSearchParams = `?WT.me_id=${id3}`;
      }
      if (exSearch) {
        exSearchParams += exSearch;
      }
    }

    let { keyword } = this.urlSearchToObj();
    if (!keyword) keyword = '';
    keyword = encodeURIComponent(keyword);

    // let url = `/product/${pid}${exSearchParams.replace('?', '&')}${keyword ? `&kw=${keyword}` : ''}`;
    let url = '';
    let urlSuffix = '';
    if (window.siteData) {
      urlSuffix = `/${window.siteData?.urlSuffix}`;
    }

    // BSite商品頁網址不同

    url = `${urlSuffix}/product/${pid}${exSearchParams}${
      keyword ? `${exSearchParams.includes('?') ? '&' : '?'}kw=${keyword}` : ''
    }`;

    // 搜尋結果頁點擊商品來的資料 搜尋結果總筆數
    if (searchDataCount > 0) {
      url += `&kwc=${searchDataCount}&kwi=${searchClickedIndex}&kwts=${Math.round(new Date().getTime() / 1000)}`;
    }

    window.open(url);
  },
  genProductUrl(pid, extendData) {
    let exSearchParams = '';

    // extendData 如果帶整個商品資料 則放sessionStorage來加速轉入商品頁的圖片出現速度
    if (typeof extendData === 'object') {
      const { id3, exSearch } = extendData;

      if (id3) {
        exSearchParams = `?WT.me_id=${id3}`;
      }
      if (exSearch) {
        exSearchParams += exSearch;
      }
    }

    let url = `/ec2/product?pid=${pid}${exSearchParams.replace('?', '&')}`;

    // BSite商品頁網址不同
    if (window.siteData) {
      url = `/${window.siteData.urlSuffix}/product/${pid}${exSearchParams}`;
    }

    return url;
  },
  //從網址取得供應商代號
  getSiteCode() {
    let siteCode;

    if (window.isLocal) {
      const param = this.urlSearchToObj();
      siteCode = param.siteCode;
    } else {
      const s = location.pathname.split('/');
      if (s && s.length > 1) siteCode = s[1];
    }
    return siteCode;
  },
  //取得bsite資料
  async getBSiteData(siteCode = '') {
    let queryStr = `urlSuffix=${siteCode}&version=1`;
    if (/m.shopping|ec3-mstage/.test(location.host)) {
      queryStr = 'siteId=BW290341';
    }
    return await fetch(`${configs.bconfigApiPath()}bWeb/config?${queryStr}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((res) => res.json())
      .then((res) => {
        if (res && res.resultData && typeof res.resultData === 'object' && res.resultData.length > 0) {
          let result = res.resultData[0];
          return result;
        } else {
          location.href = '/';
        }
      })
      .catch((err) => {
        console.error(`getSiteId faliure`);
        console.error(err);
      });
  },
  //取得多商品價格資料
  async getPidsInfo(pids) {
    return await fetch(`${configs.frontCloudApiPath()}product/v2/productinfo`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        requestId: new Date().toLocaleString(),
        param: {
          productIdList: pids,
        },
      }),
    })
      .then((res) => res.json())
      .then((res) => {
        if (res && res.resultData && res.resultData.length > 0) {
          const o = {};
          res.resultData.forEach((v) => {
            o[v.productId] = v;
            o[v.productId].image_url = v.images;
            o[v.productId].img = v.images;
            o[v.productId].price = v.price || null;
            o[v.productId].soldout = !v.isQuantity;
          });
          return o;
        } else {
          return null;
        }
      })
      .catch((err) => {
        console.error(`getPidsPrice faliure`);
        console.error(err);
      });
  },
  /**
   * * 主題館api
   * @param {Number} rows 取數量
   * @param {String} categoryId 目錄ID lid || mid || bid
   * @returns 商品集合資料
   */
  async getYstdThemeData(rows = 500, categoryId = '', siteData) {
    const { siteId, b4Info } = siteData ? siteData : window.siteData;
    const { kws, supplierIds, prodFlag } = b4Info;
    const keyword = kws || '';
    const suIds = supplierIds ? supplierIds.toString() : '';
    //取得不要曝光的id
    let unShowSid;
    if (window.siteData || window.fridaySiteData) {
      unShowSid = window.siteData?.unShowSupplierIds || window.fridaySiteData?.unShowSupplierIds;
      unShowSid = unShowSid.join(',');
    }
    const filterObj = this.composeaiApiFilter(suIds, unShowSid, categoryId, keyword, '', '', prodFlag || '');

    return await fetch(`${configs.aiCloudApiPath}/api/getalist`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        type: 3,
        target_value: this.aiUserId(),
        q1_x: 0.5,
        supplier_y: 1,
        filter: filterObj,
        list_num: rows,
        site_id: siteId,
      }),
    })
      .then((res) => res.json())
      .then(async (res) => {
        let d;
        if (res && res[0]) {
          const data = res[0];
          if (data.pids && data.pids.length > 0) {
            const prdInfo = await this.getPidsInfo(data.pids.map((v) => v.pid));
            d = data.pids.map((ele) => {
              return {
                ...ele,
                ...prdInfo[ele.pid],
              };
            });
            if (!this.getCache('supplier_cache')) {
              d = d.filter((e) => e.price !== null);
            }
          }
        }
        return d || null;
      })
      .catch((err) => {
        console.error(`getYstdThemeData faliure`);
        console.error(err);
      });
  },
  // 取得ai開店 建立虛擬資料
  async getDemoSiteData(siteCode) {
    return await fetch(`${configs.ysdtDomain()}/FetchDemo/config/${siteCode}`)
      .then((res) => res.json())
      .then((res) => {
        if (res && res.msg === 'OK' && res.data.ws_title && res.data.ws_logo) {
          return {
            siteId: '-',
            siteOwnerNo: siteCode,
            supplierId: null,
            siteName: res.data.ws_title,
            urlSuffix: siteCode,
            agentId: '102',
            isAType: 'N',
            siteType: 'B1',
            paymentType: 'ALL',
            isUnderCounstruction: 'N',
            isExposeToOthers: 'N',
            isOthersExposeToMe: 'Y',
            profitProvided: '0',
            profitGet: '0',
            fixedMarginRate: '6',
            paymentFee: '2',
            contactName: 'None',
            contactPhone: 'None',
            discountFlag: 'N',
            discountName: res.data.ws_title,
            logo: res.data.ws_logo,
            logoMobile: res.data.ws_logo,
            headerColor: null,
            favicon: null,
            b2Info: {},
            isEligible: 'Y',
            unShowSupplierIds: [],
            websiteGoogleDescription: '',
          };
        } else {
          location.href = '/';
        }
      });
  },
  // 是否為BSite Domain
  isBsite() {
    return /(localhost:3000\/\w+|ysdt\.com\.tw\/\w+|\?siteCode=)/i.test(location.href);
  },
  //供應商取得資料流程
  async processSupplier() {
    if (this.isBsite()) {
      return await this.ai4Supplier();
    } else {
      await this.fridaySupplier();
    }
  },
  async ai4Supplier() {
    // sessionStorage.removeItem('supplier_cache')
    let cacheData = null;
    const siteCode = this.getSiteCode();
    const navigationCache = this.getCache('supplier_cache');
    if (
      !/^(mobileweb|category|aisearch|search|product|aiPromotion|favorite|brands|brandPromotion|website|member|onsale|order_otp|login|intro|discount|happygo)$/i.test(
        siteCode
      )
    ) {
      if (siteCode) {
        let supplierData = null;
        if (/^DW(\d{6,})/.test(siteCode)) {
          supplierData = await this.getDemoSiteData(siteCode);
        } else {
          supplierData = await this.getBSiteData(siteCode);
        }

        if (supplierData) {
          var p = sessionStorage.getItem('preview');
          const { preview } = this.urlSearchToObj();

          if (supplierData.isUnderCounstruction === 'Y') {
            if (preview || p) {
              sessionStorage.setItem('preview', '1');
            } else {
              window.location.href = '/consturction';
            }
          }

          cacheData = supplierData;
          this.setCache('supplier_cache', cacheData, 86400);
        }
      } else if (navigationCache) {
        cacheData = navigationCache;
      }
    } else {
      if (navigationCache) {
        cacheData = navigationCache;
      }
    }

    if (cacheData) {
      cacheData.isOneSite = cacheData.siteType === 'B1' || cacheData.siteType === 'b1' ? false : true; // 是否為B型廠商+主站（hty) 或 自主站（friday or 員購網）
      window['siteData'] = cacheData;
    }
    console.log('now site data:', cacheData);
    console.log('version 1.1');

    return cacheData;
  },
  async fridaySupplier() {
    let fridayCacheData = null;
    const fridayNavigationCache = this.getCache('friday_supplier_cache');

    if (fridayNavigationCache) {
      fridayCacheData = fridayNavigationCache;
    } else {
      fridayCacheData = await this.getBSiteData('fridayshoppingmall');
      this.setCache('friday_supplier_cache', fridayCacheData, 86400);
    }

    if (fridayCacheData) {
      window['fridaySiteData'] = fridayCacheData;
    }
  },
  //判斷背景色為深淺色系
  isDarkColor(color) {
    var red = parseInt(color.substring(1, 3), 16);
    var green = parseInt(color.substring(3, 5), 16);
    var blue = parseInt(color.substring(5, 7), 16);

    // 計算亮度
    var brightness = (0.299 * red + 0.587 * green + 0.114 * blue) / 255;

    if (brightness <= 0.5) {
      return true; // 深色系
    } else {
      return false; // 浅色系
    }
  },
  //色碼hex轉rgb
  hexToRgb(hex) {
    //除去hex前面的＃
    hex = hex.replace('#', '');

    var red = parseInt(hex.substring(0, 2), 16);
    var green = parseInt(hex.substring(2, 4), 16);
    var blue = parseInt(hex.substring(4, 6), 16);

    return `rgb(${red},${green}, ${blue})`;
  },
  //bweb api
  async getBwebApiData(method, urlSuffix, payload) {
    const option = {
      method,
      headers: {
        'Content-Type': 'application/json',
      },
    };
    if (/^(POST|PUT)$/i.test(method) && payload) {
      option.body = JSON.stringify({
        payload,
      });
    }
    const data = await fetch(`${configs.bconfigApiPath()}bWeb${urlSuffix}`, option)
      .then((res) => res.json())
      .then((res) => {
        return res && res.resultData ? res.resultData : null;
      })
      .catch((err) => {
        console.error(`get bweb ${urlSuffix} faliure.`);
        console.error(err);
      });
    return data;
  },
  async getImgJsonData(urlSuffix) {
    const data = await fetch(`${configs.imgJsonDomain}${urlSuffix}`, {
      method: 'GET',
    })
      .then((res) => res.json())
      .then((res) => {
        if (res) {
          return res;
        }
      })
      .catch((err) => {
        console.error(err);
      });
    return data;
  },
  //filter組成
  composeBListFilter(supplierId = '', exSid = '', category = '', keyword = '') {
    let kStr = '';
    const v = [];
    v[0] = supplierId ? supplierId : '';
    v[1] = exSid ? exSid : '';
    v[2] = category ? category : '';
    v[3] = keyword ? keyword : '';

    v.forEach((flag) => {
      if (flag === '') {
        kStr += '0';
      } else {
        kStr += '1';
      }
    });

    return { k: kStr, v: v };
  },
  checkEmail(val) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(val);
  },
  goBsiteLoginUrl() {
    const { urlSuffix, siteType } = window.siteData;
    let targetUrl = '';
    if (siteType === 'B2') {
      // Email 登入
      targetUrl = `/login?em=1&sc=${urlSuffix}&redirectUrl=${encodeURIComponent(location.href)}`;
    } else {
      // 手機 登入
      targetUrl = `/login?sc=${urlSuffix}&redirectUrl=${encodeURIComponent(location.href)}`;
    }
    window.location.href = targetUrl;
  },
  //確認是否為遠傳導購
  getFetCode() {
    const fetCode = /mg_id=fetuser/.test(location.search);
    const CHANNEL_ID7 = this.getCookies('CHANNEL_ID7');
    if (fetCode) {
      const seachParm = this.urlSearchToObj();
      return seachParm['WT.mg_id'];
    }
    return CHANNEL_ID7 === 'fetuser' ? CHANNEL_ID7 : null;
  },
  /**
   * 取得曝光目錄B型資料 回傳一連串pid
   * @param {String} promotionId 曝光目錄ID
   * @returns Array
   */
  async getPromotionGatherApi(promotionId) {
    return await fetch(`${configs.frontApiPath()}ai/promotion/gather/${promotionId}`, fetchGetHeaders)
      .then((res) => res.json())
      .then((res) => {
        if (res && res.resultData) {
          return res.resultData;
        }
        return null;
      })
      .catch(() => {
        return null;
      });
  },
  /**
   *
   * @param {Array} rawPids 商品pid組合 [{pid: xxx, cid: 0}]
   * @returns Array
   */
  async getProductBatchApi(rawPids) {
    return await fetch(`${configs.mserviceApiPath()}product/batch`, {
      ...fetchPostHeaders,
      body: JSON.stringify(
        rawPids.map((p) => {
          return { pid: p };
        })
      ),
    })
      .then((res) => res.json())
      .then((res) => {
        const data = Object.values(res);
        if (data.length > 0) {
          return data.map((v) => {
            const { price, list_price, promo_price } = v;
            const cheapest = promo_price ? promo_price : price;
            const ratio = Math.floor((price / list_price) * Math.pow(10, 2)) / Math.pow(10, 2);
            const discount = ratio * ((ratio * 100) % 10 === 0 ? 10 : 100);
            return {
              pid: v.pid,
              promotion: v.promotion,
              name: v.name,
              img: v.image_url,
              image_url: v.image_url,
              price: v.price,
              list_price: v.list_price,
              discount: discount === 10 ? null : discount,
              cheapest: this.priceFormat(cheapest),
            };
          });
        } else {
          return [];
        }
      })
      .catch(() => {
        return [];
      });
  },
  // 取得指定網站的目錄
  async getCategorys() {
    const siteData = window['siteData'];
    const postData = {
      target: 'pseudoid',
      list_fun: 'allCategory',
      list_args: 'content',
      list_remote: 'b01',
      if_bWeb: '1',
      site_id: '-',
    };
    if (siteData) {
      const siteId = siteData.siteId || '-';
      postData.site_id = siteId;

      const findCache1 = this.getCache(`ai_category_${siteId}_cache1`);
      const findCache2 = this.getCache(`ai_category_${siteId}_cache2`);
      const findCache = this.getCache(`ai_category_${siteId}_cache`);
      if (findCache1 || findCache2 || findCache) return;
      const data = await this.getAiData('getvlist', postData);
      const { catg1, catg2, groupings } = data;
      // 有供應商所產生的[本站的樹]
      if (catg1) {
        console.log('有供應商所產生的[本站的樹]', catg1);
        this.setCache(`ai_category_${siteId}_cache1`, catg1, 300);
      }
      // 有供應商所產生的[聯合曝光的樹]
      if (catg2) {
        console.log('有供應商所產生的[聯合曝光的樹]', catg2);
        this.setCache(`ai_category_${siteId}_cache2`, catg2, 300);
      }
      if (groupings) {
        console.log('有供應商 catg1 & catg2 都是null 時,提供給網站使用的default 樹 ', groupings);
        this.setCache(`ai_category_${siteId}_cache`, groupings, 300);
      }
    } else {
      const findCache = this.getCache(`ai_category_-_cache`);
      if (findCache) return;
      const data = await this.getAiData('getvlist', postData);
      const { groupings } = data;
      // 沒有供應商 catg1 & catg2 都是null 時,提供給網站使用的default 樹 (或者是site id 傳入"-")
      if (groupings) {
        console.log('沒有供應商 catg1 & catg2 都是null 時,提供給網站使用的default 樹 ', groupings);
        this.setCache(`ai_category_-_cache`, groupings, 300);
      }
    }
  },
  //取得url上的目錄結構
  getUrlCategoryConstruction(path) {
    if (!window.isLocal) {
      const catConstruction = path.match(/category\/([^?]+)/)?.[1];
      if (catConstruction) {
        const catArr = catConstruction.split('/');
        return catArr;
      }
    }
    const { category } = this.urlSearchToObj();
    if (category) {
      const catArr = category.split(',');
      return catArr;
    }
  },
  // base64 encode function
  base64Encode(str) {
    const bytes = new TextEncoder().encode(str);
    const binString = String.fromCodePoint(...bytes);
    return btoa(binString);
  },
  //取得會員資料
  async getMemeberData() {
    const ticket = this.getCookie('FEEC-B2C-TICKET');
    const data = await fetch(`${configs.apiPath()}api/member/detail`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        authorization: 'Bearer' + ticket,
      },
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
  async getMemeberStatus() {
    const ticket = this.getCookie('FEEC-B2C-TICKET');
    const data = await fetch(`${configs.apiPath()}api/member/memberStatus`, {
      method: 'GET',
      headers: {
        authorization: 'Bearer' + ticket,
      },
    })
      .then((res) => res.json())
      .then((res) => {
        console.log(res);
      })
      .catch((err) => {
        console.error(`getMemeberStatus faliure.`);
        console.error(err);
      });
    return data;
  },
  //遠傳幣餘額
  async getFcoin() {
    const ticket = this.getCookie('FEEC-B2C-TICKET');
    return fetch(`${configs.apiPath()}fcoin/queryFcoins`, {
      method: 'GET',
      headers: {
        authorization: 'Bearer' + ticket,
      },
    })
      .then((res) => res.json())
      .then((res) => {
        if (res && res.payload && res.payload.length > 0) {
          return res.payload[0].amount;
        }
      })
      .catch((err) => {
        console.error(`getFcoin faliure.`);
        console.error(err);
      });
  },
  //可用的折價券數
  async getCouponAmount() {
    const ticket = this.getCookie('FEEC-B2C-TICKET');
    return fetch(`${configs.apiPath()}api/coupon/available/amount`, {
      method: 'GET',
      headers: {
        authorization: 'Bearer' + ticket,
      },
    })
      .then((res) => res.json())
      .then((res) => {
        if (res && res.message === 'OK' && res.data && res.data.length > 0) {
          return res.data[0].couponCount;
        }
      })
      .catch((err) => {
        console.error(`getCouponAmount faliure.`);
        console.error(err);
      });
  },
  //查購物金
  async queryVoucherBalance() {
    const faToken = this.getCookie('FEEC-FA-TOKEN');
    const data = await fetch(`${configs.frontApiPath()}member/voucher/queryVoucherBalance`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        authorization: 'Bearer ' + faToken,
      },
    })
      .then((res) => res.json())
      .then((res) => {
        if (res && res.resultData) {
          return res.resultData;
        }
      })
      .catch((err) => {
        console.error(`queryVoucherBalance faliure.`);
        console.error(err);
      });
    return data;
  },
  // url前綴判斷
  parseUrl(url = '/') {
    if (window.siteData && window.siteData.urlSuffix) {
      url = '/' + window.siteData.urlSuffix + url;
    }
    return url;
  },
  // ------------------------------------- indexDB -------------------------------------
  async getIndexedDBCache(name) {
    if (!name || typeof name !== 'string') return null;

    const cache = await indexedDBHelper.getItem(name);
    if (!cache) return null;

    const { data, expires } = cache;
    if (data !== null && expires > new Date().getTime()) {
      return data;
    } else {
      return null;
    }
  },
  async setIndexedDBCache(name, value, plusSeconds) {
    if (!name || value === undefined || !plusSeconds) return false;

    const now = new Date();
    if (typeof plusSeconds === 'number') {
      now.setSeconds(now.getSeconds() + plusSeconds);
    }

    const cacheObject = {
      name,
      data: value,
      expires: now.getTime(),
    };

    await indexedDBHelper.setItem(name, cacheObject);
  },
  async removeIndexedDBCache(name) {
    if (!name || typeof name !== 'string') return false;

    const cache = await indexedDBHelper.getItem(name);
    if (cache) {
      await indexedDBHelper.removeItem(name);
      return true;
    } else {
      return false;
    }
  },
  async clearIndexedDBCache() {
    await indexedDBHelper.clear();
  },
};
