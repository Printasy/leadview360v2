<script setup>
import { computed } from 'vue';

const props = defineProps({
  type: { type: String, default: 'secondary', validator: v => ['primary', 'secondary', 'danger'].includes(v) },
  icon: { type: String, default: '' }
});

const icons = {
  'x': 'M6 18L18 6M6 6l12 12',
  'check-circle': 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z',
  'clipboard': 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01',
  'truck': 'M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0',
  'document-text': 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z',
  'printer': 'M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z',
  'box': 'M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4',
  'mail': 'M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z',
  'save': 'M5 13l4 4L19 7'
};

const buttonClasses = computed(() => {
  const base = "px-3 py-2 text-sm font-medium rounded-lg transition flex items-center gap-2 border shadow-sm cursor-pointer outline-none ring-offset-1 focus:ring-2";
  const variants = {
    primary: "text-white bg-accent-600 hover:bg-accent-500 border-transparent focus:ring-accent-500",
    secondary: "text-slate-600 bg-white border-slate-300 hover:bg-slate-50 dark:bg-brand-800 dark:border-brand-600 dark:text-slate-300 dark:hover:bg-brand-700 focus:ring-slate-300",
    danger: "text-red-600 bg-white border-red-200 hover:bg-red-50 dark:bg-brand-800 dark:text-red-400 dark:border-red-900/50 dark:hover:bg-red-900/20 focus:ring-red-500"
  };
  return `${base} ${variants[props.type]}`;
});

const iconColorClass = computed(() => {
  if (props.type === 'primary') return 'text-white';
  if (props.type === 'danger') return 'text-red-500 dark:text-red-400';
  if (props.icon === 'check-circle') return 'text-green-500';
  if (['clipboard', 'truck', 'document-text'].includes(props.icon)) return 'text-brand-500';
  return 'text-slate-400';
});
</script>

<template>
  <button :class="buttonClasses">
    <svg v-if="icon && icons[icon]" :class="['w-4 h-4', iconColorClass]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" :d="icons[icon]"></path>
    </svg>
    <slot />
  </button>
</template>