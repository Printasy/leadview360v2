<script setup>
import { computed } from 'vue';
const props = defineProps({
  createdBy: { type: String, required: true },
  createdDate: { type: String, required: true },
  modifiedBy: { type: String, default: '-' },
  modifiedDate: { type: String, default: '-' },
  position: { type: String, default: 'bottom', validator: (val) => ['bottom', 'left'].includes(val) }
});
const containerClasses = computed(() => props.position === 'left' ? 'right-full top-1/2 transform -translate-y-1/2 mr-2' : 'right-0 top-full mt-2');
const arrowClasses = computed(() => props.position === 'left' ? 'top-1/2 right-0 transform translate-x-1 -translate-y-1/2 border-t border-r' : 'bottom-full right-4 transform translate-y-1 border-t border-l -rotate-45 hidden');
</script>

<template>
  <div class="relative group/history z-20">
    <button type="button" class="p-1.5 rounded text-slate-400 hover:text-brand-600 dark:hover:text-white bg-transparent hover:bg-slate-50 dark:hover:bg-brand-800 transition focus:outline-none">
      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"></path></svg>
    </button>
    <div class="absolute w-72 bg-white dark:bg-brand-900 rounded-lg shadow-floating border border-slate-100 dark:border-brand-700 p-4 invisible opacity-0 group-hover/history:visible group-hover/history:opacity-100 transition-all duration-200 ease-out origin-top-right" :class="containerClasses">
      <h4 class="text-[10px] font-bold text-slate-400 dark:text-brand-400 uppercase tracking-wider mb-3">Historiek</h4>
      <div class="flex items-start gap-3 mb-4">
        <div class="mt-0.5 p-1.5 bg-brand-100 dark:bg-brand-700 text-brand-600 dark:text-brand-200 rounded-full flex-none"><svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path></svg></div>
        <div><p class="text-xs text-slate-500 dark:text-slate-400 font-medium">Aangemaakt</p><p class="text-sm font-semibold text-slate-700 dark:text-slate-200">{{ createdBy }}</p><p class="text-[10px] text-slate-400 dark:text-slate-500">{{ createdDate }}</p></div>
      </div>
      <div class="flex items-start gap-3">
        <div class="mt-0.5 p-1.5 bg-amber-100 dark:bg-amber-900/40 text-amber-600 dark:text-amber-400 rounded-full flex-none"><svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path></svg></div>
        <div><p class="text-xs text-slate-500 dark:text-slate-400 font-medium">Laatst gewijzigd</p><p class="text-sm font-semibold text-slate-700 dark:text-slate-200">{{ modifiedBy }}</p><p class="text-[10px] text-slate-400 dark:text-slate-500">{{ modifiedDate }}</p></div>
      </div>
      <div class="absolute w-2 h-2 bg-white dark:bg-brand-900 border-slate-100 dark:border-brand-700" :class="arrowClasses"></div>
    </div>
  </div>
</template>