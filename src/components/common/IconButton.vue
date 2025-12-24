<script setup>
import { computed } from 'vue';

const props = defineProps({
  icon: { type: String, required: true },
  title: { type: String, default: '' },
  color: { type: String, default: '' }
});

const icons = {
  'pencil-alt': 'M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z',
  'tag': 'M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z',
  'trash': 'M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16',
  'dots-horizontal': 'M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z'
};

const colorClasses = computed(() => {
  return props.color
      ? `${props.color} hover:bg-slate-100 dark:hover:bg-brand-700/50`
      : 'text-slate-400 hover:text-brand-600 hover:bg-slate-100 dark:hover:bg-brand-700 dark:hover:text-white';
});
</script>

<template>
  <button type="button" class="p-1.5 rounded transition-colors focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-1 dark:focus:ring-offset-brand-900" :class="colorClasses" :title="title">
    <svg v-if="icons[icon]" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" :d="icons[icon]"></path>
    </svg>
  </button>
</template>