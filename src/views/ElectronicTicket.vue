<template>
  <div class="electronicTicket mb-[100px]">
    <navigation :windowY="200"></navigation>
    <div class="title bg-c_fcoin text-c_white text-center rounded=[12px] mt-5 mb-[10px] mx-[10px] shadow-[0_4px_8px_rgba(0,0,0,0.2)] p-4 relative">
      <p class="text-2xl">我的序號夾</p>
      <a class="absolute top-1/2 -translate-y-1/2 right-5 bg-gradient-to-b from-c_silver1 to-c_dove_gray text-c_white text-sm font-bold py-2 px-3 rounded-lg no-underline shadow-[0_4px_6px_rgba(0,0,0,0.2)]" :href="tools.parseUrl('/campaign/DO_241206140440221')">去逛逛</a>
    </div>
    <div v-if="isNoData" class="isNoData flex justify-center mt-[100px] text-xl font-bold">
      目前無電子序號
    </div>
    <div v-else class="electronicTicketList mt-5">
      <ul>
        <li class="ticket-card max-w-[95%] my-[10px] mx-auto shadow-[0_2px_8px_rgba(0,0,0,0.2)] rounded-lg overflow-hidden bg-c_white mb-5" v-for="(ticket, index) of ticketList" :key="index">
          <p class="ticket-header bg-c_azure_radiance text-c_white p-2 text-center font-bold text-base">{{ticket.productName}}</p>
          <div class="ticket-body p-4 text-xs font-bold">
            <div class="info flex justify-between">
              <div class="content w-3/5">
                <p class="mb-1">交易編號：{{ticket.dealId}}</p>
                <p class="mb-1">商品代碼：{{ticket.productId}}</p>
                <p class="mb-1">序號：{{ticket.sn}}</p>
                <p class="mb-1">有效期限：{{ticket.formatedPeriod}}</p>
              </div>
              <div class="image w-[32%]">
                <img class="w-full" :src="ticket.images" alt="">
              </div>
            </div>
            <div class="barcode mt-5 flex justify-center items-center flex-col" :id="`barcode-container-${ticket.dealId}-${ticket.sn}-${ticket.barcode}`">
            </div>
          </div>
        </li>
      </ul>
      <div v-if="isLookAllBtnShow" class="lookAllBtn flex justify-center">
        <!-- <a class="bg-gradient-to-b from-c_silver1 to-c_dove_gray text-c_white font-bold py-2 px-3 rounded-lg no-underline shadow-[0_4px_6px_rgba(0,0,0,0.2)] text-base" :href="tools.parseUrl('/member/tickets')">看我的全部序號</a> -->
        <RouterLink :to="{name: 'tickets'}" class="bg-gradient-to-b from-c_silver1 to-c_dove_gray text-c_white font-bold py-2 px-3 rounded-lg no-underline shadow-[0_4px_6px_rgba(0,0,0,0.2)] text-base">看我的全部序號</RouterLink>
      </div>
    </div>
    <div id="aiPromotionBottomLine"></div>
  </div>
</template>

<script lang="ts" setup name="electronicTicket">
import JsBarcode from "jsbarcode";
import tools from '@/util/tools';
import api from '@/apis/api';
import navigation from '@/components/common/navigation.vue';
import type { electronicTicket } from '@/types/electronicTicket';
import { nextTick, ref, toRefs, watch } from 'vue';
import useAtBottom from '@/hooks/useAtBottom';
import { RouterLink } from "vue-router";

const ticketList = ref<electronicTicket[] | null>(null) //電子票券資料
const isNoData = ref(false) //查無票券資料
const isApiOk = ref(false) //api是否已完成
const { isAtBottom, initScrollEvent } = useAtBottom() // 瀑布流
const page = ref(0) //頁碼
const isMaxPage = ref(false) // 是否為最大頁數(找不到資料算最大頁數)
const isLookAllBtnShow = ref(false) //看所有票券Btn

const props = defineProps(['query'])
const  { dealId, productId, sn } = toRefs(props.query)

async function init(){
  await getTicket();
  //如果第一次找不到資料顯示無資料
    if (!ticketList.value) isNoData.value = true;
    initScrollEvent();
}

//取得電子票券
async function getTicket() {
  //達到maxPage不打api
  if (isMaxPage.value) return;
  //若為訂單頁途徑則組單一票券資料
  let singleTicketInfo;
  if (dealId.value && productId.value && sn.value) {
    //直接設定到最大頁面避免下滑再出現
    isMaxPage.value = true;
    isLookAllBtnShow.value = true;
    singleTicketInfo = { dealId:dealId.value , productId:productId.value, sn:sn.value };
  }

  page.value += 1;
  isApiOk.value = false;

  let tickets = await api.member.getElectronicTicket(
    page.value,
    10,
    singleTicketInfo
  );
  if (tickets && tickets.length > 0) {
    tickets = tickets.map((ele) => ({
      ...ele,
      formatedPeriod: formatPeriod(ele.period),
      barcodeArr:
        ele.barcode?.split(",")?.filter((bc) => bc.trim() !== "") || [],
      formatBarcode: ["SVN", "FAM"].includes(ele.manufacturerCode)
        ? "CODE128"
        : "CODE39",
    }));

    if (ticketList.value) {
      ticketList.value = ticketList.value.concat(tickets);
    } else {
      ticketList.value = tickets;
    }
  } else {
    //如果打api找不到資料當作已經到達最大頁數
    isMaxPage.value = true;
  }
  await nextTick()
  appendBarCodeToTicket(tickets);
  isApiOk.value = true;
  isAtBottom.value = false;
}

//取到期
function formatPeriod(period: string) {
  if (!period) return "";
  return period?.split("-")?.[1] || period;
}

//每張票券加入barCode(傳入本次api取得的ticket)
function appendBarCodeToTicket(tickets: electronicTicket[]) {
  if (!tickets) return;
  tickets.forEach((ticket) => {
    const barcodeContainer = document.getElementById(
      `barcode-container-${ticket.dealId}-${ticket.sn}-${ticket.barcode}`
    );
    ticket.barcodeArr.forEach((barcode: any) => {
      const canvas = document.createElement("canvas");
      barcodeContainer?.appendChild(canvas);

      JsBarcode(canvas, barcode, {
        format: ticket.formatBarcode,
        displayValue: true,
        fontSize: 12,
        lineColor: "#000",
        width: 1.3, // 適合的條碼線寬
        height: 35, // 預設高度
        margin: 15, // 條碼四周間距
      });
    });
  });
}

watch(isAtBottom,(newVal)=>{
  if(ticketList.value && ticketList.value.length>0 && newVal){
    getTicket()
  }
})

init()

</script>