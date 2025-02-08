<template>
  <div class="dialog fixed left-0 right-0 z-20 bottom-0 shadow-xl rounded-t-lg bg-c_white">
    <div class="box w-full h-full">
      <div class="header relative flex items-center justify-center text-lg border-b border-c_alto border-solid h-[45px]">
        <slot name="header"></slot>
        <i @click="close" class="absolute right-0 top-0 block w-11 h-11 bg-close-icon bg-center bg-no-repeat bg-100%"></i>
      </div>

      <div class="body relative pt-[10px] pr-[10px] pl-[10px] text-sm overflow-auto max-h-[80vh]">
        <slot name="body"></slot>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup name="product">

const emit = defineEmits(['closeDialog'])

const close = () => {
  emit('closeDialog')
}

const init = () => { }
init()
</script>