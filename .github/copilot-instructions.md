# Project Context: Vue 3 + TS + Tailwind 專案規範

## 1. Core Tech Stack (核心技術棧)
- **Framework:** Vue 3 (必須使用 `<script setup lang="ts">`)
- **Language:** TypeScript (嚴格模式，禁止使用 any)
- **Styling:** Tailwind CSS (優先使用 Utility Classes，減少使用 @apply)
- **State Management:** Pinia (Store 存放於 `src/stores/`)

## 2. Coding Standards (代碼規範)

### Component Structure (組件結構)
- 檔案命名：使用 **PascalCase** (例如：`UserCard.vue`)。
- 排序邏輯：`<script setup>` > `<template>` > `<style>`。
- 通訊方式：統一使用 `defineProps` 與 `defineEmits`。



### TypeScript Requirements (型別要求)
- **Interface 優先**：優先使用 `interface` 而非 `type` 定義 Props。
- **回傳值型別**：所有的 Function 與 API 請求必須明確定義回傳型別。

### Tailwind CSS (樣式規範)
- 響應式設計：優先使用 `sm:`, `md:`, `lg:` 等前綴。
- 動態類名：複雜的類名組合請使用 `clsx` 或 `cva` 模式。

## 3. Directory Mapping (目錄導航)
- `src/components/`: 可複用的 UI 元件。
- `src/composables/`: 存放邏輯封裝 (Hook)，命名以 `use` 開頭。