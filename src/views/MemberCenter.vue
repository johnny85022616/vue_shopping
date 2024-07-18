<template>
  membercenter
</template>

<script setup lang="ts" name="memberCenter">
import { inject, ref } from 'vue';
import api from '../apis/api';

  const $cookie = inject<any>('$cookies');

  const memberInfo = ref(null)
  const fetLife = ref(null)
  const voucher = ref(0)
  const fcoin = ref(0)
  const couponAmount = ref(0)
  const isLogin = ref(false)
  const maskName = ref('')
  const memberType = ref(null)

  isLogin.value = api.member.checkLogin()
  if(isLogin.value){
    checkFetLife()
  }


  function checkFetLife() {
    const feecInfo = $cookie.get("FEEC-B2C-INFO");
    fetLife.value = feecInfo?.data?.fetLife;
  }
</script>

<style lang='scss' scoped>

</style>