<template>
  <div class="date-time-picker grid gap-4 rounded-[12px] border border-c_alto bg-c_white p-4 shadow-sm">
    <div class="mb-1">
      <p class="text-sm font-semibold text-c_heavy_metal">時間區間</p>
      <p class="text-xs text-c_sliver">請選擇開始與結束時間</p>
    </div>

    <div class="grid gap-1">
      <label class="text-sm font-medium text-c_heavy_metal">開始時間</label>
      <button
        type="button"
        :class="[
          'group relative flex h-12 w-full items-center justify-between rounded-[10px] border bg-c_white px-3 text-left text-sm outline-none transition-colors duration-200 cursor-pointer',
          localStartInput ? 'border-c_dodger_blue text-c_heavy_metal shadow-sm' : 'border-c_sliver text-c_sliver',
          'hover:border-c_dodger_blue focus:border-c_dodger_blue focus:ring-2 focus:ring-c_dodger_blue/20',
        ]"
        aria-label="開始時間"
        @click="openStartPicker"
      >
        <div class="flex min-w-0 items-center gap-3">
          <span class="flex h-7 w-7 items-center justify-center rounded-md border border-c_alto bg-c_black_haze text-c_heavy_metal">
            <svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
              <path d="M7 2V5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" />
              <path d="M17 2V5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" />
              <rect x="3.5" y="4.5" width="17" height="16" rx="2.5" stroke="currentColor" stroke-width="1.8" />
              <path d="M3.5 8.5H20.5" stroke="currentColor" stroke-width="1.8" />
            </svg>
          </span>
          <span class="block truncate" :class="localStartInput ? 'text-c_heavy_metal' : 'text-c_sliver'">
            {{ localStartInput ? formatDisplayText(localStartInput) : '請選擇開始時間' }}
          </span>
        </div>
        <span class="text-c_sliver transition-colors duration-200 group-hover:text-c_dodger_blue">›</span>
      </button>
      <input
        ref="startInputRef"
        v-model="localStartInput"
        type="datetime-local"
        class="sr-only"
        tabindex="-1"
        aria-hidden="true"
        @change="onStartChange"
      />
    </div>
    <div class="grid gap-1">
      <label class="text-sm font-medium text-c_heavy_metal">結束時間</label>
      <button
        type="button"
        :class="[
          'group relative flex h-12 w-full items-center justify-between rounded-[10px] border bg-c_white px-3 text-left text-sm outline-none transition-colors duration-200 cursor-pointer',
          localEndInput ? 'border-c_dodger_blue text-c_heavy_metal shadow-sm' : 'border-c_sliver text-c_sliver',
          'hover:border-c_dodger_blue focus:border-c_dodger_blue focus:ring-2 focus:ring-c_dodger_blue/20',
        ]"
        aria-label="結束時間"
        @click="openEndPicker"
      >
        <div class="flex min-w-0 items-center gap-3">
          <span class="flex h-7 w-7 items-center justify-center rounded-md border border-c_alto bg-c_black_haze text-c_heavy_metal">
            <svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
              <path d="M7 2V5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" />
              <path d="M17 2V5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" />
              <rect x="3.5" y="4.5" width="17" height="16" rx="2.5" stroke="currentColor" stroke-width="1.8" />
              <path d="M3.5 8.5H20.5" stroke="currentColor" stroke-width="1.8" />
            </svg>
          </span>
          <span class="block truncate" :class="localEndInput ? 'text-c_heavy_metal' : 'text-c_sliver'">
            {{ localEndInput ? formatDisplayText(localEndInput) : '請選擇結束時間' }}
          </span>
        </div>
        <span class="text-c_sliver transition-colors duration-200 group-hover:text-c_dodger_blue">›</span>
      </button>
      <input
        ref="endInputRef"
        v-model="localEndInput"
        type="datetime-local"
        class="sr-only"
        tabindex="-1"
        aria-hidden="true"
        @change="onEndChange"
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, watch } from 'vue';

export interface DateTimeRangeState {
  startTime: Date | null;
  endTime: Date | null;
}

const props = withDefaults(
  defineProps<{
    startTime?: Date | null;
    endTime?: Date | null;
  }>(),
  {
    startTime: null,
    endTime: null,
  },
);

const emit = defineEmits<{
  (event: 'update:startTime', value: Date | null): void;
  (event: 'update:endTime', value: Date | null): void;
}>();

const startInputRef = ref<HTMLInputElement | null>(null);
const endInputRef = ref<HTMLInputElement | null>(null);
const localStartInput = ref<string>(toInputValue(props.startTime));
const localEndInput = ref<string>(toInputValue(props.endTime));

watch(
  () => props.startTime,
  (value) => {
    localStartInput.value = toInputValue(value);
  },
);

watch(
  () => props.endTime,
  (value) => {
    localEndInput.value = toInputValue(value);
  },
);

function toInputValue(value: Date | null): string {
  if (!value) return '';
  const year = value.getFullYear();
  const month = String(value.getMonth() + 1).padStart(2, '0');
  const day = String(value.getDate()).padStart(2, '0');
  const hour = String(value.getHours()).padStart(2, '0');
  const minute = String(value.getMinutes()).padStart(2, '0');
  return `${year}-${month}-${day}T${hour}:${minute}`;
}

function parseInputValue(value: string): Date | null {
  if (!value) return null;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
}

function formatDisplayText(value: string): string {
  return value.replace('T', ' ');
}

function openStartPicker() {
  const input = startInputRef.value;
  if (!input) return;
  if (typeof input.showPicker === 'function') {
    input.showPicker();
    return;
  }
  input.focus();
  input.click();
}

function openEndPicker() {
  const input = endInputRef.value;
  if (!input) return;
  if (typeof input.showPicker === 'function') {
    input.showPicker();
    return;
  }
  input.focus();
  input.click();
}

function onStartChange() {
  emit('update:startTime', parseInputValue(localStartInput.value));
}

function onEndChange() {
  emit('update:endTime', parseInputValue(localEndInput.value));
}

function getDateTimeState(): DateTimeRangeState {
  let startTime = parseInputValue(localStartInput.value);
  let endTime = parseInputValue(localEndInput.value);

  if (endTime && !startTime) {
    startTime = new Date(0);
  }

  if (startTime && !endTime) {
    endTime = new Date();
  }

  if (startTime && endTime && endTime.getTime() < startTime.getTime()) {
    endTime = new Date();
  }

  localStartInput.value = toInputValue(startTime);
  localEndInput.value = toInputValue(endTime);

  emit('update:startTime', startTime);
  emit('update:endTime', endTime);

  return {
    startTime,
    endTime,
  };
}

defineExpose({
  getDateTimeState,
});
</script>
