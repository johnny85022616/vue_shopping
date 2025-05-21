<template>
  <div class="createDialog">
    <transition name="slide">
      <fullscreenDialog>
        <template v-slot:header>新增信用卡</template>
        <template v-slot:body>
          <div class="creditCardForm mt-2 mr-4 mb-20 ml-4">
            <div :class="['mb-5 group', { error: nameAlert.length > 0 }]">
              <p class="text-c_heavy-metal">*姓名</p>
              <input type="text" class="formInput group-[.error]:border-c_red" v-model="name" placeholder="請輸入姓名" />
              <span class="text-c_red">{{ nameAlert }}</span>
            </div>
            <div :class="['mb-5 group', { error: creditNumAlert.length > 0 }]">
              <p class="text-c_heavy-metal">信用卡號碼</p>
              <input type="text" class="formInput group-[.error]:border-c_red" v-model="creditNum" placeholder="XXXX XXXX XXXX XXXX" />
              <span class="text-c_red">{{ creditNumAlert }}</span>
            </div>
          </div>
          <div
            class="submitBtn w-full h-[60px] leading-[60px] fixed bottom-0 left-0 right-0 bg-c_white text-center border-t border-solid border-c_alto">
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
import useMemberForm from '@/hooks/form/useMemberForm';
import { inject, ref, toRefs, watch } from 'vue';
import type { creditCardConposable } from '@/hooks/useCreditCard';
import useCreditCardForm from '@/hooks/form/useCreditCardForm';

const { memberForm, formCheck:checkMemeber } = useMemberForm();
const { creditCardForm, checkCreditCard } = useCreditCardForm();
const creditCard = inject('creditCard') as creditCardConposable;
const closeDialog: any = inject('closeDialog')
const isDefault = ref(true);
const { name, nameAlert } = toRefs(memberForm)
const { creditNum, creditNumAlert } = toRefs(creditCardForm)


function confirmClick() {
  const namePass = checkMemeber(['name']); 
  const creditPass = checkCreditCard()
  return namePass && creditPass 
}

</script>
