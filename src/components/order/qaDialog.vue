<template>
  <div class="qaDialog">
    <transition name="slide">
      <fullscreenDialog :closeKey="'closeQaDialog'">
        <template v-slot:header></template>
        <template v-slot:body>
          <section class="qaRecord relative h-[calc(100vh-46px-10px)]">
            <div v-if="choseProduct && !isMessageOpen" class="productArea mb-3">
              <div class="mainPrd flex justify-between p-2 bg-c_concretesolid">
                <img class="w-1/5 aspect-square border border-solid border-c_alto mr-2" :src="choseProduct.images || ''"
                  alt="">
                <div class="info w-[78%] flex flex-col justify-center">
                  <p class="dealId">交易編號： {{ choseOrder.dealId }}</p>
                  <p class="name line-clamp-1">品名： {{ choseProduct.productName }}</p>
                  <div class="spec flex justify-between" v-if="true">
                    <p class="line-clamp-1">規格： {{ choseProduct.colorName }}</p>
                    <p>x{{ choseProduct.quantity }}</p>
                  </div>
                </div>
              </div>
            </div>
            <section v-if="!isMessageOpen" class="input__box w-full bg-c_mercuryApprox py-5 px-4">
              <div class="categoryBlock mb-2">
                <select id="category" name="category" class="selbox p-1 rounded-[5px] w-[63%] mb-1 text-center"
                  v-model="qaCategory">
                  <option value="9">請選擇類別</option>
                  <option v-for="(item, idx) in categoryList" :value="item.categoryId" :key="idx">{{ item.categoryName
                    }}
                  </option>
                </select>
                <p class="text-c_gray">(選擇類別，有助於平台回答問題)</p>
              </div>
              <div class="textAreaBlock flex items-end justify-between">
                <textarea v-model="clientInput" ref="autoGrowTextarea"
                  class="min-h-[100px] overflow-scroll w-4/5 py-1 px-2" rows="1" @keypress="handleKeydown"
                  placeholder="請輸入問題"></textarea>
                <button class="sendBtn w-[15%] border-0 rounded-[5px] p-1 bg-c_dodger_blue text-c_white"
                  @click="submitQuestion">送出</button>
              </div>
            </section>
            <div class="switch inline-flex items-center mt-4" @click="setSwitchStatus">
              <img class="mr-1 w-5 h-5" src="../../assets/icons/communications.png" alt="">
              <p class="text-c_dodger_blue">問答紀錄</p>
            </div>
            <section v-if="isMessageOpen"
              class="content pb-2 px-4 h-[83.5vh] overflow-auto mt-2 rounded-[5px] border border-solid border-c_gray bg-c_white relative">
              <template v-if="conversationInfo && conversationInfo.length > 0">
                <div v-for="(v, idx) in conversationInfo" :key="idx" class="content__box py-2">
                  <div v-if="v.replyId && v.reply"
                    class="content__box-service flex flex-row items-start relative w-full mt-4">
                    <img class="w-[10%] mr-4" src="../../assets/icons/xiuwu.png" />
                    <p
                      class="service-text bg-c_concretesolid shadow-[1px_2px_3px_rgba(173,173,173,1)] relative break-all max-w-[70%] py-2 px-4 rounded-[8px]">
                      {{
                        v.reply }}<span class="right-0 absolute -bottom-[18px] text-xs min-w-[100px] text-right">{{ v.formatDate }}</span>
                    </p>
                  </div>
                  <div v-else-if="!v.replyId && v.question"
                    class="content__box-client flex flex-col items-end relative w-full mt-4">
                    <p
                      class="client-text bg-c_light_blue shadow-[-1px_2px_3px_rgba(173,173,173,1)] relative break-all max-w-[70%] py-2 px-4 rounded-[8px]">
                      {{ v.question
                      }}<span class="right-0 absolute -bottom-[18px] text-xs min-w-[100px] text-right">{{ v.formatDate }}</span></p>
                  </div>
                </div>
              </template>
              <p class="content__noCoversation absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-lg"
                v-else>查無問答紀錄</p>
            </section>
            <section v-if="!isMessageOpen" class="notice bg-c_white text-sm p-2 rounded-[5px]">
              <p class="notice__title border-b border-solid border-b-c_sliver pb-1 mb-2 text-c_sliver">特別提醒您：</p>
              <p class="text-c_sliver">遠傳friDay購物不會主動以電話通知您因誤設分期，要求您提供信用卡卡號/銀行資料，或要求您前往ATM操作設定，若接到可疑電話，請拒絕回應... <a
                  class="text-c_dodger_blue underline" href="https://shopping.friday.tw/ec2/anti_grift">了解更多</a></p>
              <div class="fridayNotice mt-2">
                <p class="text-sm text-c_sliver">注意事項</p>
                <ul class="list-disc list-inside mt-1 text-c_sliver">
                  <li>問答紀錄保留您近6個月發問內容及回覆結果。</li>
                  <li>如有其他需要服務之處，您可再次發問。</li>
                </ul>
              </div>
            </section>
          </section>
        </template>
      </fullscreenDialog>
    </transition>
  </div>
</template>


<script lang="ts" setup name="qaDialog">
import fullscreenDialog from '@/components/common/fullscreenDialog.vue';
import type { order, orderProduct, qaCategory, qaInfo } from '@/types/order';
import api from '@/apis/api';

import { inject, ref, toRefs } from 'vue';

const clientInput = ref('') //問答回覆框中使用者輸入框
const conversationInfo = ref<qaInfo[] | null>(null) //問答回覆框中資料
const isMessageOpen = ref(false) //是否開啟問答回覆框
const categoryList = ref<qaCategory[] | null>(null) //下拉資料
const qaCategory = ref("9") //下拉選擇值

const props = defineProps<{ choseOrder: order, choseProduct?: orderProduct | null }>()
const { choseOrder, choseProduct } = toRefs(props)
const closeQaDialog:any = inject('closeQaDialog')

function init() {
  getCategoryData();
  getConversationInfo()
}

//取得category資料
async function getCategoryData() {
  const data = await api.order.getQuestionTypeCategory();
  categoryList.value = data;
}

//取得問答紀錄
async function getConversationInfo() {
  const data = await api.order.queryQaRecord(
    formatDealId(choseOrder.value.dealId),
    choseProduct.value?.sizeId
  );
  if (data) {
    conversationInfo.value = data;
  }
}

function formatDealId(dealId: string) {
  if (dealId && !/^R/.test(dealId)) return dealId;
  let result = dealId.slice(1);
  result = result.split("-")?.[0] || dealId;
  return result;
}

//手動按下問答紀錄switch
function setSwitchStatus() {
  isMessageOpen.value = !isMessageOpen.value;
  if (isMessageOpen.value) {
    getConversationInfo();
  }
}
function handleKeydown(event: any) {
  // shift+enter不送出
  if (event.key === "Enter") {
    if (!event.shiftKey) {
      event.preventDefault();
      submitQuestion();
    }
  }
}

function confirmClick() {
  closeQaDialog()
}

// 送出問題 
//TODO
function submitQuestion() {
  // if (this.clientInput === "") return;
  // const now = new Date();
  // const formatDate = now.toLocaleString("zh-TW", {
  //   hour: "numeric",
  //   minute: "numeric",
  //   hour12: false,
  // });
  // //手動加入
  // this.conversationInfo.unshift({
  //   question: this.clientInput,
  //   formatDate,
  // });
  // //api加入問答紀錄
  // this.api.order.addQA({
  //   question: this.clientInput,
  //   dealId: this.formatDealId(this.choseOrder.dealId),
  //   // orderId: this.choseProduct.orderId,
  //   email: "",
  //   name: "",
  //   phone: "",
  //   sizeId: this.choseProduct?.sizeId,
  //   category: this.qaCategory,
  // });
  // this.clientInput = ""; // 清空輸入框內容
  // this.qaCategory = "9"; //問題類型下拉選單改為預設
  // api.ui.alert.getFadeAlert("感謝您對friDay購物的支持與愛護，我們會盡快回覆您")
}

init()

</script>

<style lang="scss" scoped>
@import "../../style/color.scss";

.service-text {
  &::before {
    background-color: $concretesolid;
    left: -12px;
    -webkit-clip-path: polygon(100% 0, 0 50%, 100% 100%);
    clip-path: polygon(100% 0, 0 50%, 100% 100%);
  }
}

.client-text {
  &::before {
    background-color: $light-blue;
    right: -12px;
    -webkit-clip-path: polygon(0 0, 100% 50%, 0 100%);
    clip-path: polygon(0 0, 100% 50%, 0 100%);
    box-shadow: 1px 1px 5px $sliver;
  }
}

.service-text,
.client-text {
  &::before {
    content: "";
    position: absolute;
    top: 6px;
    width: 15px;
    height: 15px;
  }
}
</style>