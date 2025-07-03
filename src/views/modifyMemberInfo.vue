<template>
  <div class="modifyMemberInfo mb-[60px]">
    <navigation></navigation>
    <div
      class="w-full h-[50px] text-center border-b border-solid border-c_alto relative flex items-center justify-center p-5">
      <i class="w-5 h-5 bg-nextArrow-icon bg-center bg-100% bg-no-repeat rotate-180 justify-self-start absolute left-2"
        @click="historyBack"></i>
      <p class="text-lg font-bold text-c_mine_shaft">查看會員資料</p>
    </div>
    <div class="consigneeForm mt-2 mr-4 mb-20 ml-4">
      <div :class="['mb-5 group', { error: nameAlert.length > 0 }]">
        <p class="text-c_heavy-metal">姓名：</p>
        <input type="text" class="formInput group-[.error]:border-c_red" v-model="name" placeholder="請輸入姓名" :disabled="hasMemeberName"/>
        <span class="text-c_red">{{ nameAlert }}</span>
      </div>
      <div :class="['mb-5 group']">
        <p class="text-c_heavy-metal">性別：</p>
        <select class="formSelect group-[.error]:border-c_red" name="gender" v-model="gender">
            <option :value="Gender.男">男</option>
            <option :value="Gender.女">女</option>
          </select>
      </div>
      <div :class="['mb-5 group', { error: emailAlert.length > 0 }]">
        <p class="text-c_heavy-metal">E-mail：</p>
        <input type="text" class="formInput group-[.error]:border-c_red" v-model="email" @input="phoneFormat"
          placeholder="請輸入E-mail" />
        <span class="text-c_red">{{ emailAlert }}</span>
      </div>
      <div :class="['mb-5 group', { error: phoneAlert.length > 0 }]">
        <p class="text-c_heavy-metal">手機號碼：</p>
        <input type="phone" class="formInput group-[.error]:border-c_red" v-model="phone" @input="phoneFormat"
          placeholder="請輸入手機號碼" />
        <span class="text-c_red">{{ phoneAlert }}</span>
      </div>
      <div :class="['consigneeForm__address mb-5 group', { error: addressAlert.length > 0 }]">
        <p class="text-c_heavy-metal">地址：</p>
        <div class="flex">
          <select class="formSelect group-[.error]:border-c_red mr-5" name="city" v-model="city"
            @change="city && changeCity(city)">
            <option v-for="(item, index) in cityArr" :key="index" :value="item.id">{{ item.name }}</option>
          </select>
          <select class="formSelect group-[.error]:border-c_red" name="region" v-model="region">
            <option v-for="(item, index) in regionArr" :key="index" :value="item.id">{{ item.name }}</option>
          </select>
        </div>
        <input type="text" class="formInput group-[.error]:border-c_red" v-model="road" placeholder="請輸入地址" />
        <span class="text-c_red">{{ addressAlert }}</span>
      </div>
    </div>
    <agreeBox v-if="isGetMemberData" :sendEdm="memberForm.sendEdm" :sendSms="memberForm.sendSms"></agreeBox>
    <div class="flex justify-center">
      <span class="inline-block w-[92%] h-[40px] bg-c_red text-c_white leading-[40px] text-center rounded-[10px]"
        @click="confirmClick">確認</span>
    </div>
  </div>
</template>
<script lang="ts" setup name="modifyMemberInfo">
import { Gender } from '@/hooks/form/useMemberForm';
import navigation from "../components/common/navigation.vue";
import { useRouter } from "vue-router";
import useMemberForm from "@/hooks/form/useMemberForm";
import agreeBox from '@/components/modifyMemberInfo/agreeBox.vue'
import { ref, toRefs } from "vue";

const router = useRouter()
const { memberForm, changeCity, phoneFormat, processMemeber, formCheck } = useMemberForm();
const { name, phone, city, region, road, email, gender, nameAlert, phoneAlert, emailAlert, addressAlert, cityArr, regionArr,hasMemeberName} = toRefs(memberForm);
const isGetMemberData = ref(false)

init()

async function init(){
  await processMemeber()
  isGetMemberData.value = true
}

function historyBack() {
  router.back()
}

//form檢查 ＆ 新增收貨人
function confirmClick() {
  const isPass = formCheck(['name', 'phone', 'address'])
  if (!isPass) return
}
</script>