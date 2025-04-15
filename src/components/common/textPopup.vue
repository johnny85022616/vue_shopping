<template>
  <Teleport to="body">
    <div class="textPopup"></div>
    <div v-if="visible" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div class="bg-white p-6 rounded-lg shadow-lg w-80 text-center">
        <p class="mb-4 text-gray-800">{{ message }}</p>
        <div class="flex justify-center gap-4">
          <button @click="onConfirm" class="px-4 py-2 bg-blue-600 text-white rounded">確認</button>
          <button @click="onCancel" class="px-4 py-2 bg-gray-300 text-black rounded">取消</button>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup>
import { ref } from 'vue'

const visible = ref(false)
const message = ref('')
let resolveFn = null

const show = (msg) => {
  message.value = msg
  visible.value = true
  return new Promise((resolve) => {
    resolveFn = resolve
  })
}

const onConfirm = () => {
  resolveFn?.(true)
  visible.value = false
}
const onCancel = () => {
  resolveFn?.(false)
  visible.value = false
}

defineExpose({ show })
</script>
