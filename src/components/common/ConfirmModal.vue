<script setup>
import { computed, onMounted, onUnmounted } from 'vue';

const props = defineProps({
  title: { type: String, default: 'Bevestigen' },
  message: { type: String, default: 'Weet u het zeker?' },
  confirmText: { type: String, default: 'Bevestigen' },
  cancelText: { type: String, default: 'Annuleren' },
  type: { type: String, default: 'info', validator: v => ['info', 'danger'].includes(v) }
});
const emit = defineEmits(['close', 'confirm']);
const handleKeydown = (e) => { if (e.key === 'Escape') emit('close'); };
onMounted(() => document.addEventListener('keydown', handleKeydown));
onUnmounted(() => document.removeEventListener('keydown', handleKeydown));

const isDanger = computed(() => props.type === 'danger');
const iconContainerClass = computed(() => isDanger.value ? 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400' : 'bg-brand-100 dark:bg-brand-700/50 text-brand-600 dark:text-brand-300');
const confirmButtonClass = computed(() => isDanger.value ? 'bg-red-600 hover:bg-red-700 focus:ring-red-500' : 'bg-brand-600 hover:bg-brand-700 focus:ring-brand-500');
</script>

<template>
  <div class="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm" @click="emit('close')">
    <div class="bg-white dark:bg-brand-900 rounded-xl shadow-2xl w-full max-w-sm p-6 border border-slate-200 dark:border-brand-700 text-center" @click.stop>
      <div class="mx-auto flex h-12 w-12 items-center justify-center rounded-full mb-4" :class="iconContainerClass">
        <svg v-if="isDanger" class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
        <svg v-else class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
      </div>
      <h3 class="text-lg font-bold text-slate-900 dark:text-white mb-2">{{ title }}</h3>
      <p class="text-sm text-slate-500 dark:text-slate-400 mb-6">{{ message }}</p>
      <div class="flex justify-center gap-3">
        <button @click="emit('close')" class="px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-300 bg-white dark:bg-brand-800 border border-slate-300 dark:border-brand-600 rounded-lg hover:bg-slate-50 dark:hover:bg-brand-700 transition cursor-pointer">{{ cancelText }}</button>
        <button @click="emit('confirm')" class="px-4 py-2 text-sm font-medium text-white rounded-lg transition shadow-sm cursor-pointer" :class="confirmButtonClass">{{ confirmText }}</button>
      </div>
    </div>
  </div>
</template>