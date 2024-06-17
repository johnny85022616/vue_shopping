import config from '../config/config';
const {mobileApiPath, fetchGetHeaders} = config

const api_cart = {
  async getEcCart() {
    // this.axios
    //   .get('shoppingcart', {
    //     withCredentials: true,
    //   })
    //   .then((res) => {
    //     const data = res.data;
    //     if (data.response.status === 'OK') {
    //       const { bagcount, shoppingCartDetails } = data.payload;

    //       this.cartCount = bagcount;
    //       shoppingCartDetails.forEach((v) => {
    //         if (v.count > 0) {
    //           this.cartTypeNum += 1;
    //         }
    //       });

    //       if (data.payload.DOOR_TO_DOOR === 0 && data.payload.DOOR_TO_STORE === 0) {
    //         this.cartType = 3;
    //       } else if (data.payload.DOOR_TO_DOOR === 0 && data.payload.EXPRESS === 0) {
    //         this.cartType = 2;
    //       }
    //     }
    //   });



      const cartData = await fetch(`${mobileApiPath('')}shoppingcart`)
      .then((res) => res.json()).then(res=>{
        const {response , payload} = res
        if(res && res.response.status === 'OK'){
          const { bagcount, shoppingCartDetails } = payload;
        }
      })
      
  },
}


export default api_cart 