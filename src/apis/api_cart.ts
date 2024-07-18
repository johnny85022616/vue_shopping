import config from '../config/config';
const { mobileApiPath, fetchGetHeaders } = config

const api_cart = {
  async getEcCart() {
    return await fetch(`${mobileApiPath('')}shoppingcart`)
      .then((res) => res.json()).then(res => {
        const { response, payload } = res || {}
        if (response.status === 'OK' && payload) {
          const { bagcount, shoppingCartDetails, DOOR_TO_DOOR , DOOR_TO_STORE , EXPRESS} = payload
          let cartTypeNum = 0
          let cartType = 1
          
          const cartCount = bagcount

          shoppingCartDetails.forEach((v: any) => {
            if (v.count > 0) {
              cartTypeNum += 1;
            }
          });
          
          if (DOOR_TO_DOOR === 0 && DOOR_TO_STORE === 0) {
            cartType = 3;
          } else if (DOOR_TO_DOOR === 0 && EXPRESS === 0) {
            cartType = 2;
          }
          return {cartCount ,cartTypeNum , cartType}
        }
      }).catch((err) => {
        console.error(err)
        return null
      })
  },
}


export default api_cart 