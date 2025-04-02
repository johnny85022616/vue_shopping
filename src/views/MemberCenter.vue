<template>
  <div class="memberCenter">
    <navigation></navigation>
    <div class="text-base flex justify-center border-b border-solid border-c_swirl p-3 relative">
      <p>會員中心</p>
    </div>
    <div class="p-5">
      <div
        class="bg-memberCard bg-center bg-100% bg-no-repeat p-4 rounded-[5px] text-c_white text-xl w-full min-h-[75px]">
        <div class="flex items-center text-base mb-5">
          <i class="w-7 h-7 rounded-3xl bg-member-frday-logo bg-center bg-100% mr-2"></i>
          <p>{{ name }}</p>
        </div>
        <div v-if="type" class="text-right">
          {{ type }}
        </div>
      </div>
      <div class="flex border-b border-solid border-c_swirl py-6" v-if="fetLife !== null">
        <template v-if="fetLife !== 1">
          <a class="text-xs w-1/4 text-center no-underline" href="/member/voucher/list">
            <p class="text-c_black">{{ voucher || 0 }}</p>
            <p class="text-c_sliver">購物金<br />(原遠傳幣)</p>
          </a>
        </template>
        <template v-else-if="fetLife === 1">
          <a class="text-xs w-1/4 text-center no-underline" href="/member/voucher/list">
            <p class="text-c_black">{{ voucher || 0 }}</p>
            <p class="text-c_sliver">購物金</p>
          </a>
          <a href="/mobileweb/member/fcoin/list" class="text-xs w-1/4 text-center no-underline">
            <p class="text-c_black">{{ fcoin || 0 }}</p>
            <p class="text-c_sliver">遠傳幣</p>
          </a>
        </template>
        <a class="text-xs w-1/4 text-center no-underline" href="/member/queryCoupon">
          <p class="text-c_black">{{ couponAmount || 0 }}張</p>
          <p class="text-c_sliver">折價券</p>
        </a>
        <div class="text-xs w-1/4 text-center no-underline">
          <a class="text-c_dodger_blue no-underline" href="/mobileweb/member/queryHappyGoPoints">點數查詢</a>
          <p class="text-c_sliver">Happy Go</p>
        </div>
      </div>
      <div class="flex pt-6">
        <RouterLink class="w-1/4 text-center no-underline text-xs text-c_tundora" :to="{ name: 'order' }">
          <i class="inline-block w-6 h-6 bg-member-order-icon bg-center bg-100% bg-no-repeat"></i>
          <p>訂單記錄</p>
        </RouterLink>
        <a class="w-1/4 text-center no-underline text-xs text-c_tundora" href="/favorite">
          <i class="inline-block w-6 h-6 bg-member-favorite-icon bg-center bg-100% bg-no-repeat"></i>
          <p>我的最愛</p>
        </a>
      </div>
      <div class="border-b border-solid border-c_swirl py-5">
        <div class="text-c_sliver text-sm mb-[10px]">個人管理</div>
        <ul class="list-none">
          <li class="py-2"><a class="no-underline text-c_tundora text-sm" href="/member/receiver">收貨人通訊錄</a></li>
          <li class="py-2"><a class="no-underline text-c_tundora text-sm"
              href="/mobileweb/member/creditCardInfo">信用卡綁定</a>
          </li>
          <li class="py-2"><a class="no-underline text-c_tundora text-sm" href="/mobileweb/member/cvsInfo">取貨門市設定</a>
          </li>
          <li class="py-2"><a class="no-underline text-c_tundora text-sm" href="/member/einvoiceInfo">電子發票(手機)載具設定</a>
          </li>
        </ul>
      </div>
      <div class="border-b border-solid border-c_swirl py-5">
        <div class="text-c_sliver text-sm mb-[10px]">客服中心</div>
        <ul class="list-none">
          <li class="py-2"><a class="no-underline text-c_tundora text-sm" href="/intro/commonProblem">常見問題 Q&A</a></li>
          <li class="py-2"><a class="no-underline text-c_tundora text-sm" href="/intro/service_line">聯絡客服</a></li>
          <li class="py-2"><a class="no-underline text-c_tundora text-sm" href="/mobileweb/member/myQAList">問答記錄</a>
          </li>
        </ul>
      </div>
      <div class="border-b border-solid border-c_swirl py-5">
        <div class="text-c_sliver text-sm mb-[10px]">會員權益</div>
        <ul class="list-none">
          <li class="py-2">
            <RouterLink class="no-underline text-c_tundora text-sm" :to="{ name: 'shoppingIntro' }">購物說明
            </RouterLink>
          </li>
          <li class="py-2"><a class="no-underline text-c_tundora text-sm" href="/intro/privacy-intro">隱私權說明</a></li>
          <li class="py-2"><a class="no-underline text-c_tundora text-sm" href="/intro/memterms-intro">服務條款</a></li>
          <li class="py-2"><a class="no-underline text-c_tundora text-sm" href="/intro/conditions-intro">購物約定條款</a></li>
        </ul>
      </div>
      <div class="py-5">
        <div class="text-c_sliver text-sm mb-[10px]">追蹤我們</div>
        <ul class="list-none">
          <li class="py-2">
            <a class="flex items-center no-underline text-c_tundora text-sm"
              href="https://www.facebook.com/fridayshopping" target="_blank"><i
                class="inline-block ml-0 bg-fb-icon bg-100% bg-center bg-no-repeat w-6 h-6 mr-2"></i>
              <p>Facebook</p>
            </a>
          </li>
          <li class="py-2">
            <a class="flex items-center no-underline text-c_tundora text-sm" href="https://maac.io/1xDKI"
              target="_blank"><i class="inline-block ml-0 bg-line-icon bg-100% bg-center bg-no-repeat w-6 h-6 mr-2"></i>
              <p>Line</p>
            </a>
          </li>
          <li class="py-2 text-sm" @click="logout"><a class="no-underline text-c_tundora text-sm" href="">登出</a></li>
        </ul>
      </div>
      <div class="w-[90%] text-c_sliver">
        遠時數位科技股份有限公司為遠傳電信集團關係企業/版權所有 Copyright © 2017 All Rights Reserved by YSDT.<br />營業人名稱:
        遠時數位科技股份有限公司 統一編號: 54349098
      </div>
    </div>
  </div>
</template>

<script setup lang="ts" name="memberCenter">
import { inject, ref } from 'vue';
import api from '../apis/api';
import navigation from '@/components/common/navigation.vue';
import { RouterLink, useRouter } from 'vue-router';

const $cookie = inject<any>('$cookies');
const router = useRouter()

const fetLife = ref(null)
const voucher = ref(0)
const fcoin = ref(0)
const couponAmount = ref(0)
const name = ref('')
const type = ref(null)

function checkFetLife() {
  const feecInfo = $cookie.get("FEEC-B2C-INFO");
  fetLife.value = feecInfo?.data?.fetLife;
  console.log(feecInfo);
}

const getMemberData = async () => {
  const info = await api.member.getMemberData()
  console.log(info);
  if (!info) return
  const { maskName, memberType } = info.MaskInfo || {}
  name.value = maskName
  type.value = memberType
  voucher.value = await api.member.queryVoucherBalance()
  fcoin.value = await api.member.getFetCoins()
}

const logout = () => {
  api.member.logout()
  router.push('/')
}

const init = async function () {
  const isLogin = api.member.checkLogin()
  if (isLogin) {
    checkFetLife();
    getMemberData();
    return
  }
  alert('尚未登入')
}

init()
</script>

<style lang='scss' scoped></style>