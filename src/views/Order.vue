<template>
  <div class="order">order</div>
</template>

<script lang="ts" setup name="order">
import type { order, orderProduct } from '@/types/order';
import api from '@/apis/api';
import useAtBottom from '@/hooks/useAtBottom';
import { nextTick, ref, watch } from 'vue';
const { isAtBottom, initScrollEvent } = useAtBottom();

const orderData = ref<order | null>(null); //訂單資料
const isApiOk = ref(true); //api是否已完成
const page = ref(0); //order page 頁數
const isBottomTextShow = ref(false); //是否出現「已經到底部摟」
const isRefundDialogOpen = ref(false); //退訂popup
const choseOrder = ref<order | null>(null); //供退訂popup使用
const choseProduct = ref<orderProduct | null>(null); //選擇的商品(供問答、退訂...popup使用)
const choseDealId = ref<string | null>(null);
const choseMemberId = ref<string | null>(null);

const isQaRecordDialogOpen = ref(false); //是否開啟問答紀錄popup
const isShippingDetailDialogOpen = ref(false); //是否開啟貨態明細
const shippingDetailInfo = ref<orderProduct | null>(null) //貨態明細所需商品資料(productData)

const init = async () => {
  //未登入轉登入
  if (!api.member.isLogin) {
    api.member.login();
  }

  await getOrderData();
  openSmaller72UrgentOrder();
  openFirstOrder();
  initScrollEvent();
};

//取得訂單資料
async function getOrderData() {
  page.value += 1;
  isApiOk.value = false;
  let data = await api.order.getOrders();
  data = data.map((ele: order) => {
    ele.hasUrgent = false; //是否有警示符號
    ele.smallThan72 = false;
    ele.isDetilOpen = false;
    ele.productData.forEach((mainPrd) => {
      mainPrd.images = null;
      mainPrd.isTicketOpen = false;
      mainPrd.tickets = null;
      mainPrd.urgentText = '';
      if (mainPrd.combodata) {
        mainPrd.combodata.forEach((comboPrd: any) => {
          comboPrd.images = null;
        });
      }
      //若其中一個商品符合shipDelay is not null 或 <>'0'展和明細旁出現驚嘆號
      const { shipDelay, delayDate } = mainPrd;
      if (shipDelay && shipDelay !== '0') {
        ele.hasUrgent = true;
        mainPrd.shipDelay = shipDelay;
        if (shipDelay === '1') {
          mainPrd.urgentText = '很抱歉，商品無法如期出貨，系統將自動進行退訂退款';
        } else if (shipDelay === '2') {
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
    await nextTick();
    isApiOk.value = true;
    isAtBottom.value = false;
  } else {
    isBottomTextShow.value = true;
  }
}

//是否為負向單
function isNegative(dealId: string) {
  return /^R/i.test(dealId);
}

//退訂成功後刷新訂單資料
async function refreshOrder() {
  page.value = 0;
  orderData.value = null;
  await getOrderData();
  openFirstOrder(); //預設開啟第一筆product區塊
}

//預設開啟第一張(若原本有開啟過則不需再開啟)
function openFirstOrder() {
  if (!orderData.value) return;
  orderData.value[0].isDetilOpen = true;
  getProductImgData(0);
}

//時間轉換為月何日
function parseMonthAndDate(transferDate: string) {
  const dateArr = new Date(transferDate).toLocaleDateString().split('/');
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

//展開72小時內
function openSmaller72UrgentOrder() {
  orderData.value?.forEach((order: order, idx: number) => {
    if (order.hasUrgent && order.smallThan72) {
      order.isDetilOpen = true;
      getProductImgData(idx);
    }
  });
}

//展合明細控制
async function openDetailBlock(index: number) {
  if (!orderData.value || (orderData.value && orderData.value.length === 0)) return;
  const order = orderData.value[index];
  order.isDetilOpen = !order.isDetilOpen;
  getProductImgData(index);
}

//開啟退訂popup
function openRefundDialog(e: any, products: orderProduct, dealId: string, memberId: string, order: order) {
  e.preventDefault();
  setChoseProduct(products);
  setChoseDealId(dealId, memberId);
  setChoseOrder(order);
  isRefundDialogOpen.value = true;
}

//關閉退訂popup
function closeRefundDialog() {
  isRefundDialogOpen.value = false;
}

//選取product設值
function setChoseProduct(products: orderProduct) {
  choseProduct.value = products;
}

//選取資料dealOd & memberId
function setChoseDealId(dealId: string, memberId: string) {
  choseDealId.value = dealId;
  choseMemberId.value = memberId;
}

//選取的訂單資料
function setChoseOrder(order: order) {
  choseOrder.value = order;
}

//開啟問答紀錄
function openQaDialog(e: any, choseProduct: orderProduct, order: order) {
  e.preventDefault();
  setChoseOrder(order);
  setChoseProduct(choseProduct);
  isQaRecordDialogOpen.value = true;
}
//關閉問答紀錄
function closeQaDialog() {
  isQaRecordDialogOpen.value = false;
}
//展開物流明細popup
function openShippingDetailDialog() {
  isShippingDetailDialogOpen.value = true;
}
//展開物流明細關閉
function closeShippingDetailDialog() {
  isShippingDetailDialogOpen.value = false;
}

//取得商品圖片
async function getProductImgData(index: number) {
  const order = orderData.value?.[index];
  if (!order.isGetImgAlready) {
    for (let mainPrd of order.productData) {
      const prdInfo = await api.product.getProducts([mainPrd.productId]);
      mainPrd.proofUrl = await api.order.getOrderProductProof(order.dealId, mainPrd.productId, mainPrd.sizeId);
      if (prdInfo && prdInfo[mainPrd.productId]) {
        mainPrd.images = prdInfo[mainPrd.productId].images;
        mainPrd.supplierId = prdInfo[mainPrd.productId].supplierId;
      }
      if (mainPrd.combodata) {
        for (let comboPrd of mainPrd.combodata) {
          const comboPrdInfo = await api.product.getProducts([comboPrd.productId]);
          if (comboPrdInfo && comboPrdInfo[comboPrd.productId]) {
            comboPrd.images = comboPrdInfo[comboPrd.productId].images;
          }
        }
      }
    }
    order.isGetImgAlready = true;
  }
}

//收貨人姓名詳
async function consigneeInfoSwitch(e: any, idx: number, orderId: number) {
  e.preventDefault();
  const order = orderData.value?.[idx];
  order.isCoinsigneeInfoOpen = true;
  //姓名
  if (!order.consigneeNameDetail) {
    const consigneeName = await api.order.getConsigneeDecode(orderId, 4);
    order.consigneeNameDetail = consigneeName;
  }

  //宅配取得收貨人地址(非宅配)
  if (!order.pickupStoreAdress && !order.consigneeAddrDetail) {
    const consigneeAddr = await api.order.getConsigneeDecode(orderId, 6);
    order.consigneeAddrDetail = consigneeAddr;
  }
}

//折抵＆退款明細詳
async function priceInfoSwitch(e: any, idx: number, dealId: number, isNegative: boolean) {
  e.preventDefault();
  const order = orderData.value?.[idx];
  order.isDiscountInfoOpen = true;
  let discountInfo = order.discountInfoDetail;
  if (!discountInfo && !isNegative) {
    discountInfo = await api.order.getOrderDiscounts(dealId);
  }
  if (!discountInfo && isNegative) {
    discountInfo = await api.order.getRefundOrderDiscounts(dealId);
  }
  order.discountInfoDetail = discountInfo;
}

//開啟電子票券區塊
async function openTicketArea(order: order, product: orderProduct) {
  product.isTicketOpen = true;
  const singleTicketInfo = {
    dealId: order.dealId,
    productId: product.productId,
  };
  console.log(singleTicketInfo);
  let tickets = await api.member.getElectronicTicket(page.value, 10, singleTicketInfo);
  if (tickets && tickets.length > 0) {
    product.tickets = tickets;
  }
}

// 購買證明
function goProofUrl(url: string) {
  if (/^https/i.test(url)) {
    window.open(url);
  } else {
    api.ui.alert.getFadeAlert(url);
  }
}

//複製
function copyNumber(content: string) {
  navigator.clipboard.writeText(content).then(() => {
    alert(`已複製${content}至剪貼簿`);
  });
}

//跳轉到貨態頁面(外部頁面)
function goLogisticUrl(num: string, url: string) {
  copyNumber(num);
  window.open(url);
}

function productPrice(price: number): string {
  return new Intl.NumberFormat().format(price);
}

//linepay在次付款轉頁
async function linePayAgain(rePayPayload: any) {
  const url = await api.order.getThirdPartyRePayUrl(rePayPayload);
  if (url) {
    location.href = url;
  }
}

//看發票
function seeInvoiceUrl(url: string) {
  window.open(url, 'invoice');
}

//查看物流明細
async function lookShippingDetail(product: orderProduct) {
  shippingDetailInfo.value = product;
  openShippingDetailDialog();
}

watch(isAtBottom, async (newVal) => {
  if (orderData.value && orderData.value.length > 0 && isApiOk.value && newVal && !isBottomTextShow.value) {
    await getOrderData();
    openSmaller72UrgentOrder();
  }
});

init();
</script>
