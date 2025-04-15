<template>
  <div class="order text-[15px] mb-[80px]">
    <navigation :windowY="200" />
    <div class="order__notice inline-flex justify-center items-center py-1 px-3 mt-5">
      <p class="text-c_red text-xs">提醒您:本公司不會主動打電話告知您任何有關付款修改的問題，若接到可疑電話請拒絕回應。</p>
    </div>
    <div class="order__list bg-c_background mt-5">
      <template v-if="orderData && orderData.length > 0">
        <ul class="bigOrder">
          <li class="bigOrderWrap bg-c_white my-4 mx-2 rounded-[10px] shadow-[0_0_8px_0_rgba(0,0,0,0.3)] first-of-type:mt-0"
          v-for="(order, index) of orderData"
            :key="index">
            <div class="head p-4 text-c_heavy_metal">
              <template v-if="!isNegative(order.dealId)">
                <p class="mb-1">交易編號：{{ order.dealId }}</p>
                <p class="mb-1">訂購時間：{{ order.orderDate }} {{ order.orderTime }}</p>
                <p class="mb-1">配送方式：{{ order.shippingType }}</p>
                <p class="mb-1">付款方式：{{ order.payType }} ({{ order.payment.status }})</p>
                <p v-if="order.bankInfo" class="mb-1">&emsp;&emsp;&emsp;&emsp;&emsp;{{ order.bankInfo }}</p>
                <p v-if="order.rePayPayload" class="linePayAgain text-c_dodger_blue mb-1" @click="linePayAgain(order.rePayPayload)">
                  &emsp;&emsp;&emsp;&emsp;&emsp;(再次付款)
                </p>
                <div class="flex mb-1">
                  <p class="red">實付金額：${{ productPrice(order.dealPayAmount) }}</p>
                  <div class="detail-link ml-2">
                    <a href="#" class="mr-2 underline text-c_dodger_blue"
                      @click="(e) => priceInfoSwitch(e, index, order.dealId, isNegative(order.dealId))">折抵明細</a>
                    <!-- <a v-if="order.invoiceUrl" href="#" class="underline text-c_dodger_blue" @click.prevent="seeInvoiceUrl(order.invoiceUrl)">看發票</a> -->
                  </div>
                </div>
                <div class="arrowBorder" v-if="order.isDiscountInfoOpen">
                  <p class="box-title font-bold">折抵明細</p>
                  <p v-for="(detail, index) in order.discountInfoDetail" :key="index">
                    {{ detail.amountItem }}：{{ detail.amount }}
                  </p>
                </div>
                <div>
                  <div class="flex mb-1">
                    <p>收件人資訊：</p>
                    (<a href="" class="underline text-c_dodger_blue" @click="(e) => consigneeInfoSwitch(e, index, order.productData[0].orderId)">詳</a>)
                  </div>
                  <div v-if="order.isCoinsigneeInfoOpen">
                    <template v-if="order.pickupStoreName">
                      <p class="mb-1" v-if="order.consigneeNameDetail">收貨人：{{ order.consigneeNameDetail }}</p>
                      <p class="mb-1" v-if="order.pickupStoreName">門市名稱：{{ order.pickupStoreName }}</p>
                      <p class="mb-1" v-if="order.pickupStoreAdress">門市地址：{{ order.pickupStoreAdress }}</p>
                    </template>
                    <template v-else>
                      <p class="mb-1" v-if="order.consigneeNameDetail">收貨人：{{ order.consigneeNameDetail }}</p>
                      <p class="mb-1" v-if="order.consigneeAddrDetail">收貨人地址：{{ order.consigneeAddrDetail }}</p>
                    </template> 
                  </div>
                </div>
                <div class="switch flex justify-between items-center mt-5">
                  <div class="flex items-center" @click="openDetailBlock(Number(index))">
                    <p class="text-c_sliver mb-0" v-if="!order.isDetilOpen">展合明細</p>
                    <span :class="['next_arrow inline-block w-[14px] h-[14px] bg-nextArrow-icon bg-center bg-100% bg-no-repeat', { 'rotate-90': order.isDetilOpen }]"></span>
                    <span v-if="order.hasUrgent" class="urgent font-bold ml-2 text-c_red animate-blink">( ! )</span>
                  </div>
                  <div class="flex items-center">
                    <a v-if="order.canReturn" href="" class="underline text-c_dodger_blue"
                      @click="(e) => openRefundDialog(e, order.productData, order.dealId, order.memberId, order)">退訂</a>
                    <a class="underline text-c_dodger_blue" href="" @click="(e) => openQaDialog(e, null, order)">交易提問</a>
                  </div>
                </div>
              </template>
              <template v-else>
                <p class="mb-1">退訂編號：{{ order.dealId }}</p>
                <p class="mb-1">退訂時間：{{ order.orderDate }} {{ order.orderTime }}</p>
                <p class="mb-1">退訂方式：{{ order.shippingType }}</p>
                <div class="flex">
                  <p>退款方式：{{ order.payType }}</p>
                  <p v-if="order.payment.status" class="gray">({{ order.payment.status }})</p>
                </div>
                <div class="flex mb-1">
                  <p class="mb10 text-c_red">退款金額：${{ productPrice(order.dealPayAmount) }}</p>
                  <div class="detail-link ml-2">
                    <a href="" class="underline text-c_dodger_blue"
                      @click="(e) => priceInfoSwitch(e, index, order.dealId, isNegative(order.dealId))">退款明細</a>
                  </div>
                </div>
                <div class="arrowBorder" v-if="order.isDiscountInfoOpen">
                  <p class="box-title font-bold">退款明細</p>
                  <p v-for="(detail, index) in order.discountInfoDetail" :key="index">
                    {{ detail.amountItem }}：{{ detail.amount }}
                  </p>
                </div>
                <div>
                  <div class="flex mb-1">
                    <p>收件人資訊：</p>
                    (<a href="" class="underline text-c_dodger_blue" @click="(e) => consigneeInfoSwitch(e, index, order.productData[0].orderId)">詳</a>)
                  </div>
                  <div v-if="order.isCoinsigneeInfoOpen">
                    <template v-if="order.pickupStoreName">
                      <p class="mb-1" v-if="order.consigneeNameDetail">收貨人：{{ order.consigneeNameDetail }}</p>
                      <p class="mb-1" v-if="order.pickupStoreName">門市名稱：{{ order.pickupStoreName }}</p>
                      <p class="mb-1" v-if="order.pickupStoreAdress">門市地址：{{ order.pickupStoreAdress }}</p>
                    </template>
                    <template v-else>
                      <p class="mb-1" v-if="order.consigneeNameDetail">收貨人：{{ order.consigneeNameDetail }}</p>
                      <p class="mb-1" v-if="order.consigneeAddrDetail">收貨人地址：{{ order.consigneeAddrDetail }}</p>
                    </template>
                  </div>
                </div>
                <div class="switch flex justify-between items-center mt-5">
                  <div class="flex items-center" @click="openDetailBlock(index)">
                    <p v-if="!order.isDetilOpen" class="text-c_sliver mb-0">展合明細</p>
                    <span :class="['next_arrow inline-block w-[14px] h-[14px] bg-nextArrow-icon bg-center bg-100% bg-no-repeat', { 'rotate-90': order.isDetilOpen }]"></span>
                  </div>
                  <div><a href="" class="underline text-c_dodger_blue" @click="(e) => openQaDialog(e, null, order)">交易提問</a></div>
                </div>
              </template>
            </div>
            <div class="body border-t border-solid border-c_alto" v-if="order.isDetilOpen">
              <ul class="smallOrder pb-2">
                <li class="smallOrderWrap border-t border-solid border-c_alto first:border-t-0" v-for="(product, idx) of order.productData" :key="idx">
                  <div class="productArea relative p-4">
                    <div class="mainPrd flex justify-between items-center">
                      <a class="flex max-w-1/5 w-1/5 aspect-69/43" :href="`/product/${product.productId}`">
                        <img class="w-full" :src="product.images|| ''" alt="" />
                      </a>
                      <div class="info flex flex-col justify-between w-[78%]">
                        <div class="top flex justify-between mb-1">
                          <p class="w-4/5 line-clamp-2 text-ellipsis font-normal">
                            <a class="flex text-c_heavy_metal no-underline" :href="`/product/${product.productId}`">
                              {{ product.productName }}
                            </a>
                          </p>
                          <a class="underline text-c_dodger_blue" v-if="!siteData" href="" @click="(e) => openQaDialog(e, product, order)">問問題</a>
                        </div>
                        <div class="flex flex-space-between">
                          <p v-if="product.colorName">規格： {{ product.colorName }}</p>
                        </div>
                      </div>
                    </div>
                    <template v-if="product.giftdata">
                      <p class="giftBox" v-for="(item, idx) in product.giftdata" :key="idx">
                        <span class="giftTag text-xs mr-1 text-c_special">贈品</span>{{ item.productName }}
                      </p>
                    </template>
                    <template v-if="product.combodata && product.combodata.length > 0">
                      <p class="comboText text-c_sliver font-bold text-sm my-2">-組合商品-</p>
                      <div class="comboPrd flex flex-space-between flex-align-center mb10"
                        v-for="(comboPrd, idx) in product.combodata" :key="idx">
                        <a class="flex max-w-1/5 w-1/5 aspect-69/43" :href="`/product/${comboPrd.productId}`">
                          <img class="w-full" :src="comboPrd.images" alt="" />
                        </a>
                        <div class="info flex flex-col justify-between w-[78%]">
                          <div class="top flex justify-between mb-1">
                            <p class="w-4/5 line-clamp-2 text-ellipsis font-normal">{{ comboPrd.productName }}</p>
                          </div>
                          <div class="flex justify-between">
                            <p v-if="comboPrd.colorName">規格： {{ comboPrd.colorName }}</p>
                          </div>
                        </div>
                      </div>
                    </template>
                  </div>
                  <div class="detail-bar grid grid-cols-3 p-2">
                    <a class="text-center" v-if="!isNegative(order.dealId)" href="#" @click.prevent="goProofUrl(product.proofUrl || '')">購買證明</a>
                    <div v-if="product.productDiscount">
                      <p class="text-center">單價：{{ tools.priceFormat(product.productDiscountedPrice) }}</p>
                      <p class="gray text-center">(折扣後)</p>
                    </div>
                    <p v-else class="text-center">單價：{{ tools.priceFormat(product.price) }}</p>
                    <p class="text-center">
                      數量：{{ tools.priceFormat(product.quantity) }} &nbsp;<a
                        :href="'javascript:window.Android.openChat(' + product.productId + ', ' + order.dealId + ');'"
                        style="color: white">&nbsp;</a>
                    </p>
                  </div>
                  <!-- <div class="iconArea">
                  <span class="storeIcon">超商取貨</span>
                </div> -->
                  <template v-if="order.isShowProcessStatusBar && product.deliverProcess">
                    <statusBar :order="order" :product="product" :needLookShippingDetail="true"
                      @lookShippingDetail="lookShippingDetail"></statusBar>
                  </template>
                  <div class="urgentText flex items-start py-2 px-4 text-c_heavy_metal text-sm">
                    <div v-if="product.shipDelay === '2'" class="circle w-3 h-3 rounded-[50%] bg-c_red mr-2 flex-shrink-0 mt-1 animate-blink"></div>
                    <div v-if="product.shipDelay === '1'" class="cross w-5 h-5 mr-1 bg-close-icon bg-100% bg-center bg-no-repeat invert-[75%] sepia-[100%] saturate-[500%] hue-rotate-[-55deg] flex-shrink-0 animate-blink"></div>
                    <p>{{ product.urgentText }}</p>
                  </div>
                  <!-- 電子序號區塊(咖啡券不顯示) -->
                  <div v-if="
                    !isNegative(order.dealId) &&
                    product.isIntangible === '1' &&
                    ![7863457, 7863324, 7863465].includes(product.productId)
                  " class="elecTicket-bar m-[10px] p-[10px] flex items-center border border-solid border-c_alto rounded-[5px]">
                    <template v-if="product.isTicketOpen">
                      <p class="label w-[18%]">序號：</p>
                      <ul v-if="product.tickets" class="w-[82%] list-none">
                        <li v-for="(ticket, idx) of product.tickets" :key="idx" class="flex">
                          <RouterLink :to="{name:'tickets', query:{
                            dealId:order.dealId,
                            productId: product.productId,
                            sn: ticket.sn
                          }}" class="inline-block w-full whitespace-nowrap overflow-hidden text-ellipsis my-0 mx-auto text-c_dodger_blue underline">{{ ticket.sn }}</RouterLink>
                        </li>
                      </ul>
                      <p v-else>查無序號</p>
                    </template>
                    <a v-else class="my-0 mx-auto text-c_dodger_blue underline" href="" @click.prevent="openTicketArea(order, product)">查看序號</a>
                  </div>
                </li>
              </ul>
            </div>
          </li>
        </ul>
        <!-- <refundDialog v-if="isRefundDialogOpen" @closeRefundDialog="closeRefundDialog" :products="choseRefundProduct"
          :dealId="choseDealId" :memberId="choseMemberId" :order="choseOrder" @refreshOrder="refreshOrder">
        </refundDialog> -->
        <qaDialog v-if="isQaRecordDialogOpen && choseOrder" @closeQaDialog="closeQaDialog" :choseProduct="choseProduct"
          :choseOrder="choseOrder"></qaDialog>
        <shippingDetailDialog v-if="isShippingDetailDialogOpen && shippingDetailInfo" :product="shippingDetailInfo"
          @closeShippingDetailDialog="closeShippingDetailDialog"></shippingDetailDialog>
        <p class="bottomText" v-if="isBottomTextShow">- 已經到底摟 -</p>
        <div id="aiPromotionBottomLine"></div>
      </template>
      <p v-else-if="orderData && orderData.length === 0" class="noDataMessage">查無訂單資料</p>
    </div>
  </div>
</template>

<script lang="ts" setup name="order">
import navigation from '@/components/common/navigation.vue';
import statusBar from '@/components/order/statusBar.vue';
import shippingDetailDialog from '@/components/order/shippingDetailDialog.vue';
import qaDialog from '@/components/order/qaDialog.vue';
import tools from '@/util/tools';
import type { order, orderProduct } from '@/types/order';
import api from '@/apis/api';
import useAtBottom from '@/hooks/useAtBottom';
import { useBsiteStore } from '@/stores/bsiteStore';
import { computed, nextTick, provide, ref, watch } from 'vue';
import { storeToRefs } from 'pinia';
import { RouterLink } from 'vue-router';
const { isAtBottom, initScrollEvent } = useAtBottom();

const orderData = ref<order[] | null>(null); //訂單資料
const isApiOk = ref(true); //api是否已完成
const page = ref(0); //order page 頁數
const isBottomTextShow = ref(false); //是否出現「已經到底部摟」
const isRefundDialogOpen = ref(false); //退訂popup
const choseOrder = ref<order | null>(null); //供退訂popup使用
const choseProduct = ref<orderProduct | null>(null); //選擇的商品(供問答popup使用)
const choseRefundProduct = ref<orderProduct[] | null>(null) //選擇的商品(供退訂popup使用)
const choseDealId = ref<string | null>(null);
const choseMemberId = ref<string | null>(null);
const isQaRecordDialogOpen = ref(false); //是否開啟問答紀錄popup
const isShippingDetailDialogOpen = ref(false); //是否開啟貨態明細
const shippingDetailInfo = ref<orderProduct | null>(null) //貨態明細所需商品資料(productData)

const bsiteStore = useBsiteStore()
const { siteData } = storeToRefs(bsiteStore)
const isFridaySite = computed(() => !siteData.value) //是否為主站

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
function openRefundDialog(e: any, products: orderProduct[], dealId: string, memberId: string, order: order) {
  e.preventDefault();
  setChoseRefundProduct(products);
  setChoseDealId(dealId, memberId);
  setChoseOrder(order);
  isRefundDialogOpen.value = true;
}

//關閉退訂popup
function closeRefundDialog() {
  isRefundDialogOpen.value = false;
}

//設定問答紀錄product
function setChoseProduct(products: orderProduct | null) {
  choseProduct.value = products;
}

//設定退訂product
function setChoseRefundProduct(products: orderProduct[] | null) {
  choseRefundProduct.value = products;
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
function openQaDialog(e: any, choseProduct: orderProduct | null, order: order) {
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
  if (order && !order.isGetImgAlready) {
    for (let mainPrd of order.productData) {
      const prdInfo = await api.product.getProducts([mainPrd.productId]);
      mainPrd.proofUrl = await api.order.getOrderProductProof(order.dealId, mainPrd.productId, mainPrd.sizeId);
      if (prdInfo && prdInfo[mainPrd.productId]) {
        mainPrd.images = prdInfo[mainPrd.productId].images || "";
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
async function consigneeInfoSwitch(e: any, idx: number, orderId: string) {
  e.preventDefault();
  const order = orderData.value?.[idx];
  if (!order) return
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
async function priceInfoSwitch(e: any, idx: number, dealId: string, isNegative: boolean) {
  e.preventDefault();
  const order = orderData.value?.[idx];
  if (!order) return
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
  if(!product) return 
  shippingDetailInfo.value = product;
  openShippingDetailDialog();
}

watch(isAtBottom, async (newVal) => {
  if (orderData.value && orderData.value.length > 0 && isApiOk.value && newVal && !isBottomTextShow.value) {
    await getOrderData();
    openSmaller72UrgentOrder();
  }
});

provide('closeQaDialog',closeQaDialog)
provide('closeShippingDetailDialog',closeShippingDetailDialog)
init();
</script>
