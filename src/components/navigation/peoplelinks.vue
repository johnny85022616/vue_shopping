<template>
  <div :class="[`peoplelinks fixed pt-[60px] pb-[80px] left-0 right-0 z-10 h-screen bg-c_white`]">
    <ul>
      <li class="p-3 border-b border-solid border-c_alto text-base">
        <a @click="(e)=>doLogin(e)" class="inline-block w-full"href="">我的帳戶</a>
      </li>
      <li class="p-3 border-b border-solid border-c_alto text-base">
        <div class="flex justify-between items-center" @click="changeCustomerService">
          <p class="inline-block w-full"href="">客服中心</p>
          <i :class="['bg-arrow-bottom w-6 h-6 bg-center bg-no-repeat bg-100% inline-block', {'rotate-180':iscustomerServiceOpen }]"></i>
        </div>
      </li>
      <template v-if="iscustomerServiceOpen">
        <li class="p-3 border-b border-solid border-c_alto text-base"><a class="inline-block w-full"href="">常見問題</a></li>
        <li class="p-3 border-b border-solid border-c_alto text-base"><a class="inline-block w-full"href="">聯絡客服</a></li>
      </template>
    </ul>
    <div class="text-c_sliver text-xs absolute bottom-[80px] text-center"> 遠時數位科技股份有限公司為遠傳電信集團關係企業/版權所有Copyright © 2017 All Rights Reserved by YSDT.0<br>營業人名稱: 遠時數位科技股份有限公司 統一編號: 54349098 </div>
  </div>
</template>

<script setup lang="ts" name="peoplelinks">
import { inject, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import api from '../../apis/api';

const $cookies = inject<any>('$cookies');
const routes = useRoute()
const router = useRouter()

const iscustomerServiceOpen = ref(false)

function changeCustomerService(){
  iscustomerServiceOpen.value = !iscustomerServiceOpen.value
}

console.log(routes);
console.log(router);

function doLogin(e:Event){
  e.preventDefault()
  api.member.login();
  // 刷新當前頁面
  router.go(0)
}
  
</script>