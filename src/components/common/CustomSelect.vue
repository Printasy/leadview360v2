<script setup>
import { ref, onMounted, onUnmounted } from 'vue';

const props = defineProps({
  modelValue: { type: Object, default: null },
  options: { type: Array, required: true },
  placeholder: { type: String, default: 'Selecteer...' }
});
const emit = defineEmits(['update:modelValue']);
const isOpen = ref(false);
const containerRef = ref(null);

const icons = {
  'phone': 'M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z',
  'mail': 'M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z',
  'globe': 'M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9'
};

const selectOption = (opt) => { emit('update:modelValue', opt); isOpen.value = false; };
const handleClickOutside = (e) => { if (containerRef.value && !containerRef.value.contains(e.target)) isOpen.value = false; };

onMounted(() => document.addEventListener('click', handleClickOutside));
onUnmounted(() => document.removeEventListener('click', handleClickOutside));
</script>

<template>
  <div class="relative w-full" ref="containerRef">
    <button type="button" @click="isOpen = !isOpen" class="flex w-full items-center justify-between rounded-md border border-slate-200 bg-white px-2.5 py-1.5 text-sm text-slate-700 shadow-sm transition-all focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-200 dark:bg-brand-900 dark:border-brand-600 dark:text-slate-200 cursor-pointer">
      <span class="flex items-center gap-2 truncate">
        <template v-if="modelValue">
          <svg v-if="modelValue.icon" class="h-3.5 w-3.5 text-slate-500 dark:text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" :d="icons[modelValue.icon]" /></svg>
          <span>{{ modelValue.label }}</span>
        </template>
        <span v-else class="text-slate-400">{{ placeholder }}</span>
      </span>
      <svg class="h-4 w-4 text-slate-400 transition-transform duration-200" :class="{ 'rotate-180': isOpen }" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7" /></svg>
    </button>
    <div v-if="isOpen" class="absolute left-0 right-0 top-full z-50 mt-1 max-h-60 overflow-auto rounded-md border border-slate-200 bg-white p-1 shadow-lg dark:border-brand-600 dark:bg-brand-800">
      <div v-for="opt in options" :key="opt.value" @click="selectOption(opt)" class="flex cursor-pointer items-center gap-2 rounded px-2 py-1.5 text-sm text-slate-700 hover:bg-slate-50 dark:text-slate-200 dark:hover:bg-brand-700" :class="{ 'bg-slate-50 dark:bg-brand-700 font-medium': modelValue?.value === opt.value }">
        <svg v-if="opt.icon" class="h-3.5 w-3.5" :class="modelValue?.value === opt.value ? 'text-brand-600 dark:text-brand-400' : 'text-slate-400'" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" :d="icons[opt.icon]" /></svg>
        <span>{{ opt.label }}</span>
      </div>
    </div>
  </div>
</template>