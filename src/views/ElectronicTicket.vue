<template>
  <div class="electronicTicket">
    <navigation :windowY="200" />
  </div>
</template>

<script lang="ts" setup name="electronicTicket">
import JsBarcode from "jsbarcode";
import api from '@/apis/api';
import navigation from '@/components/common/navigation.vue';
import type { electronicTicket } from '@/types/electronicTicket';
import { nextTick, ref, toRefs, watch } from 'vue';
import useAtBottom from '@/hooks/useAtBottom';

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