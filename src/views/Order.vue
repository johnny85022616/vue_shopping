<template>
  <div class="order">
    order
  </div>
</template>

<script lang="ts" setup name="order">
import type { order, orderProduct } from '@/types/order';
import api from '@/apis/api';
import useAtBottom from '@/hooks/useAtBottom';
import { nextTick, ref, watch } from 'vue';
const { isAtBottom, initScrollEvent } = useAtBottom();

const orderData = ref<order | null>(null) //訂單資料
const isApiOk = ref(true) //api是否已完成
const page = ref(0) //order page 頁數
const isBottomTextShow = ref(false) //是否出現「已經到底部摟」
const isRefundDialogOpen = ref(false) //退訂popup
const choseOrder = ref<order | null>(null) //供退訂popup使用
const choseProduct = ref<orderProduct | null>(null) //選擇的商品(供問答、退訂...popup使用) 
const isQaRecordDialogOpen = ref(false) //是否開啟問答紀錄popup
const isShippingDetailDialogOpen = ref(false) //是否開啟貨態明細

const init = async () => {
  //未登入轉登入
  if (!api.member.isLogin) {
    api.member.login();
  }

  await getOrderData()
  openSmaller72UrgentOrder()
  openFirstOrder()
  initScrollEvent()
}

//取得訂單資料
async function getOrderData() {
  page.value += 1
  isApiOk.value = false
  let data = await api.order.getOrders()
  data = data.map((ele: order) => {
    ele.hasUrgent = false; //是否有警示符號
    ele.smallThan72 = false;
    ele.isDetilOpen = false;
    ele.productData.forEach((mainPrd) => {
      mainPrd.images = null;
      mainPrd.isTicketOpen = false;
      mainPrd.tickets = null;
      mainPrd.urgentText = "";
      if (mainPrd.combodata) {
        mainPrd.combodata.forEach((comboPrd: any) => {
          comboPrd.images = null;
        });
      }
      //若其中一個商品符合shipDelay is not null 或 <>'0'展和明細旁出現驚嘆號
      const { shipDelay, delayDate } = mainPrd;
      if (shipDelay && shipDelay !== "0") {
        ele.hasUrgent = true;
        mainPrd.shipDelay = shipDelay;
        if (shipDelay === "1") {
          mainPrd.urgentText =
            "很抱歉，商品無法如期出貨，系統將自動進行退訂退款";
        } else if (shipDelay === "2") {
          if (delayDate) {
            const parseObj = parseMonthAndDate(delayDate);
            mainPrd.urgentText = `商品備貨不及，將延遲至${parseObj?.month}月${parseObj?.date}日`;
          }
        }
      }
      if (smallThan72(mainPrd.timestamp.tranferDate)) {
        ele.smallThan72 = true;
      }
    });
    return {
      ...ele,
      isCoinsigneeInfoOpen: false, //info區是否開啟
      consigneeNameDetail: null, //收貨人姓名
      consigneeAddrDetail: null, //收貨人地址
      isDiscountInfoOpen: false, //折抵明細是否開啟
      discountInfoDetail: null, //折抵明細
      isGetImgAlready: false, //是否已經取得過商品圖片
    };
  });
  if (data) {
    if (orderData.value) {
      orderData.value = orderData.value.concat(data);
    } else {
      orderData.value = data;
    }
    await nextTick()
    isApiOk.value = true;
    isAtBottom.value = false;
  } else {
    isBottomTextShow.value = true;
  }
}

//預設開啟第一張(若原本有開啟過則不需再開啟)
function openFirstOrder() {
  if (!orderData.value) return
  orderData.value[0].isDetilOpen = true;
  getProductImgData(0);
}

//時間轉換為月何日
function parseMonthAndDate(transferDate: string) {
  const dateArr = new Date(transferDate).toLocaleDateString().split("/");
  return { month: dateArr[1], date: dateArr[2] };
}

//是否離現在小魚72小時
function smallThan72(transferDate: string | null) {
  if (!transferDate) return false;
  let now = new Date().getTime();
  let date2 = new Date(transferDate).getTime();
  let timeDifference = Math.abs(date2 - now);
  //1小時 = 3600000 毫秒
  let hoursDifference = timeDifference / (1000 * 3600);
  return hoursDifference < 72;
}

//展開
function openSmaller72UrgentOrder() {
  orderData.value?.forEach((order: order, idx: number) => {
    if (order.hasUrgent && order.smallThan72) {
      order.isDetilOpen = true;
      getProductImgData(idx);
    }
  });
}

//取得商品圖片
async function getProductImgData(index: number) {
  const order = orderData.value?.[index];
  if (!order.isGetImgAlready) {
    for (let mainPrd of order.productData) {
      const prdInfo = await api.product.getProducts([
        mainPrd.productId,
      ]);
      mainPrd.proofUrl = await api.order.getOrderProductProof(
        order.dealId,
        mainPrd.productId,
        mainPrd.sizeId
      );
      if (prdInfo && prdInfo[mainPrd.productId]) {
        mainPrd.images = prdInfo[mainPrd.productId].images;
        mainPrd.supplierId = prdInfo[mainPrd.productId].supplierId;
      }
      if (mainPrd.combodata) {
        for (let comboPrd of mainPrd.combodata) {
          const comboPrdInfo = await api.product.getProducts([
            comboPrd.productId,
          ]);
          if (comboPrdInfo && comboPrdInfo[comboPrd.productId]) {
            comboPrd.images = comboPrdInfo[comboPrd.productId].images;
          }
        }
      }
    }
    order.isGetImgAlready = true;
  }
}

// async function openTicketArea(order: order, product: orderProduct) {
//       product.isTicketOpen = true;
//       const singleTicketInfo = {
//         dealId: order.dealId,
//         productId: product.productId,
//       };
//       console.log(singleTicketInfo);
//       let tickets = await this.api.member.getElectronicTicket(
//         this.page,
//         10,
//         singleTicketInfo
//       );
//       if (tickets && tickets.length > 0) {
//         product.tickets = tickets;
//       }
//     }

watch(isAtBottom, async (newVal) => {
  if (orderData.value &&
    orderData.value.length > 0 &&
    isApiOk.value &&
    newVal &&
    !isBottomTextShow.value
  ) {
    await getOrderData();
    openSmaller72UrgentOrder();
  }
})

init()

</script>
