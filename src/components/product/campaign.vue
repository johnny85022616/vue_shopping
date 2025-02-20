<template>
  <div v-if="campaignUI && Object.keys(campaignUI).length > 0" class="campaign">
    <div class="campaignInfo px-5 py-4 text-sm">
      <div class="block">
        <div class="flex justify-between items-center my-2 relative">
          <p class="w-[10%] text-c_sliver">優惠</p>
          <ul class="w-[88%] flex flex-wrap">
            <li
              :class="`${key === 'ADD' ? 'bg-c_olivine' : ['ASD', 'AWD'].includes(key as string) ? 'bg-purple-700' : 'bg-c_bean_red'} mr-3 text-c_white px-2 py-1 rounded mb-1`"
              @click="openCampaignDialog(key as string)" v-for="(item, key) in pInfo.couponCategory" :key="key">
              {{ item.tagTitle }}
            </li>
          </ul>
        </div>
        <p class="campaignBoxText underline text-c_blue_ribbon text-right" @click="openCampaignDialog()">點我領優惠</p>
      </div>
    </div>
    <autoscreendialog v-if="isCampaignDialogOpen" @closeDialog="closeCampaignDialog">
      <template v-slot:header>優惠</template>
      <template v-slot:body>
        <div class="campaignDialog p-4">
          <div class="popupTop mb-4 flex justify-end">
            <a class="mr-2 underline text-c_dodger_blue" href="" @click.prevent="drawAllCampaign">一鍵全領</a>
            <a class="underline text-c_dodger_blue" href="" @click.prevent="changeDiscountInputOpenStatus">如果我有折扣碼</a>
          </div>
          <div class="discountCodeArea mb-4 flex flex-col items-end">
            <div v-if="isDiscountInputOpen" class="disCountCode flex justify-end">
              <input class="border border-solid border-c_sliver p-2 mr-2 rounded" type="text" v-model="discountCode"
                placeholder="輸入折扣碼領優惠" />
              <button class="px-1 py-2 bg-c_dodger_blue text-white tracking-wider"
                @click="drawDiscount(discountCode)">GO</button>
            </div>
          </div>
          <div class="mb-4" v-if="campaignPopupData && campaignPopupData.length > 0">
            <ul>
              <li class="min-h-[155px] mb-4 flex" :class="composeCouponUiType(item)"
                v-for="(item, index) in campaignPopupData" :key="index">
                <div class="left w-4/5 p-4 flex-grow bg-center bg-100% bg-no-repeat">
                  <div v-if="!item.childCampaignInfo" class="flex justify-between items-center">
                    <p class="text-c_sliver min-h-[21px]">{{ item.ui.campaignEndTime }}</p>
                    <p class="text-c_sundown" v-if="item.ui.isAdditionalDiscount">可與其他優惠併用</p>
                    <p class="campaignSiteName" v-html="item.ui.campaignSiteName"></p>
                  </div>
                  <div v-if="!item.ui.discountCode" class="commonType">
                    <!-- d9 -->
                    <template v-if="item.childCampaignInfo">
                      <div class="mb-2">
                        <p class="title text-2xl font-bold text-c_red text-center" v-html="item.ui.title"></p>
                        <div class="middle relative min-h-5 flex items-center mb-2 text-c_dodger_blue">
                          <p class="w-[35%]">{{ item.ui.rule }}</p>
                          <p class="w-[65%] text-right text-c_red"><a
                              class="campaignUrl text-c_dodger_blue underline text-right block"
                              :href="item.ui.campaignUrl">看全部商品</a></p>
                        </div>
                      </div>
                      <div
                        class="d9Discount bg-[url(../../assets/icons/flowerTicket.svg)] bg-center bg-100% bg-no-repeat flex flex-col justify-center p-5">
                        <div class="mb-1">
                          <p class="d9Title text-lg font-bold text-c_mine_shaft text-center"
                            v-html="`本活動<span>${item.childCampaignInfo.title}</span>`"></p>
                        </div>
                        <p class="d9Content">{{ item.childCampaignInfo.rule }}</p>
                      </div>
                    </template>
                    <!-- 一般 -->
                    <template v-else>
                      <div class="mb-2">
                        <p class="title text-2xl font-bold text-c_red text-center" v-html="item.ui.title"></p>
                      </div>
                      <div class="relative middle min-h-5 flex items-center mb-2 text-c_dodger_blue">
                        <p class="w-[35%]">{{ item.ui.rule }}</p>
                        <p class="w-[65%] text-right text-c_red">{{ item.ui.couponExpireTime }}</p>
                      </div>
                      <a v-if="item.ui.digitalType !== 'd24'"
                        class="campaignUrl text-c_dodger_blue underline text-right block"
                        :href="item.ui.campaignUrl">看全部商品</a>
                    </template>
                  </div>
                  <div v-else class="discountCodeType mt-2">
                    <div class="topArea flex">
                      <p class="content w-[45%] text-c_red">輸入折扣碼</p>
                      <p class="rule w-[55%] text-c_sliver">{{ item.ui.rule }}</p>
                    </div>
                    <div class="bottomArea flex text-2xl">
                      <p class="code  w-[45%] text-c_dodger_blue">{{ item.ui.discountCode }}</p>
                      <p class="name w-[55%] text-c_red text-left" v-html="item.ui.title"></p>
                    </div>
                    <p class="copy text-c_sliver text-xs mb-2" @click="copyNumber(item.ui.discountCode)">點我複製折扣碼</p>
                    <a v-if="item.ui.digitalType" class="campaignUrl text-c_dodger_blue underline text-right block"
                      :href="item.ui.campaignUrl">看全部商品</a>
                    <div v-if="item.childCampaignInfo"
                      class="d9Discount bg-[url(../../assets/icons/flowerTicket.svg)] bg-center bg-100% bg-no-repeat flex flex-col justify-center p-5">
                      <div class="mb-1">
                        <p class="d9Title text-lg font-bold text-c_mine_shaft text-center"
                          v-html="`本活動<span>${item.childCampaignInfo.title}</span>`"></p>
                      </div>
                      <p class="d9Content">{{ item.childCampaignInfo.rule }}</p>
                    </div>
                  </div>
                </div>
                <div v-if="item.ui.digitalType !== 'd24'"
                  class="right w-1/5 flex items-center justify-center flex-col py-2 bg-center bg-100% bg-no-repeat">
                  <div v-if="!item.ui.isGeted && !item.ui.discountCode"
                    @click="drawCampaign(item.ui.campaignId, item.childCampaignInfo?.campaignId)">
                    <i
                      class="bg-checkbox-icon w-5 h-5 bg-center bg-100% bg-no-repeat inline-block bg-white rounded"></i>
                    <p class="writing-rl text-sm font-extrabold tracking-[2px]">打勾領取</p>
                  </div>
                  <div v-else-if="!item.ui.isGeted && item.ui.discountCode"
                    @click="drawDiscount(item.ui.discountCode, item.childCampaignInfo?.campaignId)">
                    <i
                      class="bg-checkbox-icon w-5 h-5 bg-center bg-100% bg-no-repeat inline-block bg-white rounded"></i>
                    <p class="writing-rl text-sm font-extrabold tracking-[2px]">打勾領取</p>
                  </div>
                  <template v-else>
                    <a v-if="item.ui.campaignUrl"
                      class="link writing-rl no-underline text-sm font-extrabold tracking-[2px]"
                      :href="item.ui.campaignUrl">已領，逛更多</a>
                  </template>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </template>
    </autoscreendialog>
  </div>
</template>

<script lang="ts" setup name="campaign">
import type { couponCategoryData, productInfo } from '@/types/productInfo';
import autoscreendialog from '@/components/common/autoscreendialog.vue';
import { ref, toRefs } from 'vue';
import api from '@/apis/api';

const showDialog = ref(false);
const isCampaignDialogOpen = ref(false);
const campaignUI = ref<couponCategoryData[] | null>(null);
const campaignPopupData = ref<couponCategoryData[] | null>(null);
const isDiscountInputOpen = ref(false);
const discountCode = ref('');

const props = defineProps<{ pInfo: productInfo; bsiteLogin: Boolean }>();
const { pInfo, bsiteLogin } = toRefs(props);

//組成外層campaign資料
const composeCampaignUI = () => {
  if (pInfo.value && pInfo.value.couponCategory) {
    const arr: couponCategoryData[] = [];
    const campignIdArr: string[] = [];
    for (const [key, value] of Object.entries(pInfo.value.couponCategory)) {
      if (value) {
        value.data.forEach((ele) => {
          //取不重複資料
          if (!campignIdArr.some((campaignId: string) => campaignId === ele.campaignId)) {
            arr.push({ ...ele, couponType: key });
            campignIdArr.push(ele.campaignId); //推進現有campaignId pool
          }
        });
      }
    }
    campaignUI.value = arr;
  }
};

//開啟優惠券popup
const openCampaignDialog = (couponType?: string) => {
  composePopupUI(couponType);
  isCampaignDialogOpen.value = true;
};

//關閉優惠券popup
const closeCampaignDialog = () => {
  isCampaignDialogOpen.value = false;
};

//開啟折扣碼輸入區塊
const changeDiscountInputOpenStatus = () => {
  isDiscountInputOpen.value = true;
};

//重新排序popup中資料
const composePopupUI = (couponType?: string) => {
  if (couponType) {
    let topCouponData: couponCategoryData[] = [];
    let bottomCouponData: couponCategoryData[] = [];
    campaignUI.value?.forEach((ele: couponCategoryData) => {
      if (couponType !== 'ASD') {
        if (ele.couponType === couponType) {
          topCouponData.push(ele);
        } else {
          bottomCouponData.push(ele);
        }
      } else {
        if (ele.childCampaignInfo) {
          topCouponData.push(ele);
        } else {
          bottomCouponData.push(ele);
        }
      }
    });
    campaignPopupData.value = [...topCouponData, ...bottomCouponData];
    return;
  }
  campaignPopupData.value = campaignUI.value;
};

//popup中券的背景圖
const composeCouponUiType = (campaignData: couponCategoryData) => {
  const { isGeted, isAnti } = campaignData.ui;
  //D9特別未領取
  if (!isGeted && campaignData.childCampaignInfo) {
    return "d9NoGeted";
  }
  //D9已領取
  else if (isGeted && campaignData.childCampaignInfo) {
    return "d9Geted";
  }
  //未領無鋸齒
  else if (!isGeted && !isAnti) {
    return "noGetedNoAnti";
  }
  //已領無鋸齒
  else if (isGeted && !isAnti) {
    return "getedNoAnti";
  }
  //未領有鋸齒
  else if (!isGeted && isAnti) {
    return "noGetedAnti";
  }
  //已領有鋸齒
  else if (isGeted && isAnti) {
    return "getedAnti";
  }
}

//領全部券
const drawAllCampaign = async () => {
  // const campaignArr = [];
  // for (let item of campaignPopupData.value) {
  //   //一般券
  //   if (!item.ui.discountCode) {
  //     campaignArr.push(item.ui.campaignId);
  //     //娃娃
  //     if (item.childCampaignInfo) {
  //       campaignArr.push(item.childCampaignInfo?.campaignId);
  //     }
  //   }
  //   //折扣碼
  //   else {
  //     const childPass = await doDrawDiscountApi(item.ui.discountCode);
  //     if (!childPass) return;
  //     //有帶娃娃
  //     if (item.childCampaignInfo) {
  //       campaignArr.push(item.childCampaignInfo?.campaignId);
  //     }
  //   }
  // }
  // const pass = await this.doDrawCampaingApi(campaignArr);
  // if (!pass) return;
  // //所有券狀態改為已經領
  // this.campaignUI.forEach((ele) => {
  //   ele.ui.isGeted = true;
  // });
  // this.api.ui.alert.getFadeAlert("領取成功");
};

//領取(有itemCouponType表示點我領優惠途徑)
const drawCampaign = async (campaignId: string, childCampaignId?: string) => {
  // const pass = await this.doDrawCampaingApi([campaignId, childCampaignId]);
  // if (!pass) return;

  // let index;
  // this.campaignUI.forEach((ele, idx) => {
  //   if (ele.campaignId === campaignId) {
  //     index = idx;
  //   }
  // });
  // const nowObj = this.campaignUI[index].ui;
  // this.setChoseCampaignGetedStatus(nowObj);
  // this.api.ui.alert.getFadeAlert("領取成功");
}

//領取折扣碼(有itemCouponType表示點我領優惠途徑)
const drawDiscount = async (discountCode: string, childCampaignId?: string) => {
  // const pass = await this.doDrawDiscountApi(discountCode);
  // if (!pass) return;
  // //有帶娃娃
  // if (childCampaignId) {
  //   const childPass = await this.doDrawCampaingApi(childCampaignId);
  //   if (!childPass) return;
  // }
  // let index = null;
  // this.campaignUI.forEach((ele, idx) => {
  //   if (
  //     ele.ui &&
  //     ele.ui.discountCode &&
  //     ele.ui.discountCode === discountCode
  //   ) {
  //     index = idx;
  //   }
  // });
  // if (index) {
  //   const nowObj = this.campaignUI[index].ui;
  //   this.setChoseCampaignGetedStatus(nowObj);
  // }
  // this.discountCode = "";
  // this.api.ui.alert.getFadeAlert("領取成功");
};

//領券api
const doDrawCampaingApi = async (campaignArr: string[]) => {
  const result = await api.campaign.drawCampaign(campaignArr);
  if (result && result.status === 0) {
    api.ui.alert.getFadeAlert(result.msg);
    return false;
  }
  return true;
}

//領折價券api
const doDrawDiscountApi = async (discountCode: string) => {
  const drawResult = await api.campaign.drawDiscountCode(discountCode);
  if (drawResult.status === 0) {
    api.ui.alert.getFadeAlert(drawResult.msg);
    return false;
  }
  return true;
};

//複製折扣碼
const copyNumber = (content: string) => {
  navigator.clipboard.writeText(content).then(() => {
    alert(`已複製${content}至剪貼簿`);
  });
};

const init = async () => {
  composeCampaignUI();
};

init();
</script>

<style lang="scss" scoped>
@import "../../style/color.scss";

//D9未領
.d9NoGeted {
  .left {
    background-image: url("../../assets/icons/Coupon01_L.png");
  }

  .right {
    background-image: url("../../assets/icons/Coupon01_R.png");
    color: $yellow;

    a {
      color: $yellow;
    }
  }
}

//D9有領
.d9Geted {
  .left {
    background-image: url("../../assets/icons/Coupon02_L.png");
  }

  .right {
    background-image: url("../../assets/icons/Coupon02_R.png");
    color: $white;

    a {
      color: $white;
    }
  }
}

//沒領無鋸齒
.noGetedNoAnti {
  .left {
    background-image: url("../../assets/icons/Coupon01_L.png");
  }

  .right {
    background-image: url("../../assets/icons/Coupon01_R.png");
    color: $yellow;

    a {
      color: $yellow;
    }
  }
}

//有領無鋸齒
.getedNoAnti {
  .left {
    background-image: url("../../assets/icons/Coupon02_L.png");
  }

  .right {
    background-image: url("../../assets/icons/Coupon02_R.png");
    color: $white;

    a {
      color: $white;
    }
  }
}

//沒領有鋸齒
.noGetedAnti {
  .left {
    background-image: url("../../assets/icons/Coupon01_L.png");
  }

  .right {
    background-image: url("../../assets/icons/Coupon03_R.png");
    color: $yellow;

    a {
      color: $yellow;
    }
  }
}

//有領有鋸齒
.getedAnti {
  .left {
    background-image: url("../../assets/icons/Coupon02_L.png");
  }

  .right {
    background-image: url("../../assets/icons/Coupon04_R.png");
    color: $white;

    a {
      color: $white;
    }
  }
}

.d9Title {
  ::v-deep(span) {
    font-size: 2rem;
    color: $red;

  }
}
</style>