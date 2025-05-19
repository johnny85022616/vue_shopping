<template>
  <div class="createDialog">
    <transition name="slide">
      <fullscreenDialog>
        <template v-slot:header>新增收貨人</template>
        <template v-slot:body>
          <div class="consigneeForm mt-2 mr-4 mb-20 ml-4">
            <!-- <div class="consigneeForm__preset">
            <p>設為常用收貨人</p>
            <i v-if="isDefault" class="consigneeForm__preset-on" @click="defaultSwitch"></i>
            <i v-else class="consigneeForm__preset-off" @click="defaultSwitch"></i>
          </div> -->
            <div :class="['mb-5', { error: nameAlert.length > 0 }]">
              <p class="text-c_heavy-metal">*姓名</p>
              <input type="text" class="formInput" v-model="name" placeholder="請輸入姓名" />
              <span class="">{{ nameAlert }}</span>
            </div>
            <div :class="['mb-5', { error: phoneAlert.length > 0 }]">
              <p class="text-c_heavy-metal">*手機號碼</p>
              <input type="phone" class="formInput" v-model="phone" @input="phoneFormat" placeholder="請輸入手機號碼" />
              <span>{{ phoneAlert }}</span>
            </div>
            <div :class="['consigneeForm__address mb-5 ', { error: addressAlert.length > 0 }]">
              <p class="text-c_heavy-metal">*地址</p>
              <div class="flex">
                <select class="formSelect mr-5" name="city" v-model="city" @change="city && changeCity(city)">
                  <option v-for="(item, index) in cityArr" :key="index" :value="item.id">{{ item.name }}</option>
                </select>
                <select class="formSelect" name="region" v-model="region">
                  <option v-for="(item, index) in regionArr" :key="index" :value="item.id">{{ item.name }}</option>
                </select>
              </div>
              <input type="text" class="formInput" v-model="road" placeholder="請輸入地址" />
              <span>{{ addressAlert }}</span>
            </div>
            <p class="text-sm text-c_heavy_metal">
              按下確認即表示同意將本次收貨人資料紀錄於「收貨人管理｣中，節省下次結帳時間。
            </p>
          </div>
          <div
            class="consigneeForm__submitBtn w-full h-[60px] leading-[60px] fixed bottom-0 left-0 right-0 bg-c_white text-center border-t border-solid border-c_alto">
            <span class="inline-block w-[92%] h-[40px] bg-c_red text-c_white leading-[40px] text-center rounded-[10px]"
              @click="confirmClick">確認</span>
          </div>
        </template>
      </fullscreenDialog>
    </transition>
  </div>
</template>
<script lang="ts" setup name="createDialog">
import fullscreenDialog from '@/components/common/fullscreenDialog.vue';
import useMemberForm from '@/hooks/useMemberForm';
import { ref, toRefs, watch } from 'vue';

const { memberForm,changeCity, phoneFormat } = useMemberForm();
const { name, phone, city, region, road, nameAlert, phoneAlert, addressAlert, cityArr, regionArr } = toRefs(memberForm);
const isDefault = ref(false);

function confirmClick() { }

</script>
