<template>
  <div class="product">
    
  </div>
</template>

<script lang="ts" setup name="product">
import { ref } from 'vue';

  const isBsite = ref(false) //是否為B網
  const bsiteLogin = ref(false) 
  const pInfo = ref(false); // 商品資料
  const isApiRequested = ref<any>(false) //取得商品資料api是否已完成
  const giftItems = ref<any>(null) //㽪品
  const accItems = ref<any>(null) //加購品資料
  const isSimpleProductCnt = ref(false) // 是否顯示簡單版商品畫面
  const myFCoin = ref(0) //使用者遠傳幣數量
  const directToCheckout = ref(0) //是否直接進入結帳頁
  const promotionId = ref<any|null>(null) // 活動ID
  const friendRecommandation = ref(false) // 是否顯示友商推薦連結
  const isPreventSoldoutNotice = ref(false) // 是否顯示缺貨補貨中
  const comboInfo = ref<any|null>(null) //組合商品資料



</script>