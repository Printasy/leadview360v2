<script setup>
import { computed } from 'vue';

const props = defineProps({
  node: { type: Object, required: true },
  selected: { type: Boolean, default: false }
});

const emit = defineEmits(['select', 'delete', 'drag-start', 'connect-start', 'connect-end']);

// Icon mapping (simplified inline SVGs)
const getIcon = (type) => {
  // Voeg hier je SVG paths toe op basis van type
  if (type === 'file_input') return 'M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12';
  if (type === 'condition') return 'M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4';
  return 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z'; // default check
};
</script>

<template>
  <div
      class="absolute w-72 bg-white dark:bg-slate-800 rounded-lg shadow-md border flex flex-col group transition-shadow duration-200"
      :class="[
      selected ? 'ring-2 ring-teal-500 shadow-xl border-teal-500' : 'border-slate-200 dark:border-slate-700 hover:border-teal-300'
    ]"
      :style="{ left: `${node.x}px`, top: `${node.y}px` }"
      @mousedown.stop="emit('select', node)"
  >
    <div
        class="h-3 rounded-t-lg bg-slate-50 dark:bg-slate-700 border-b border-slate-100 dark:border-slate-600 cursor-move flex justify-end px-2 items-center group-hover:bg-teal-50 dark:group-hover:bg-slate-600 transition-colors"
        @mousedown.stop="emit('drag-start', $event, node)"
    >
      <button @click.stop="emit('delete', node.id)" class="text-slate-400 hover:text-red-500 font-bold text-lg leading-none">&times;</button>
    </div>

    <div class="p-4">
      <span class="text-[10px] font-bold text-teal-600 dark:text-teal-400 uppercase tracking-wider mb-1 block">
        {{ node.typeLabel }}
      </span>

      <h3 class="text-sm font-semibold text-slate-800 dark:text-slate-200 mb-2 line-clamp-2 min-h-[1.25rem]">
        {{ node.data.question || 'Klik om in te stellen...' }}
      </h3>

      <div v-if="node.type === 'file_input'" class="w-full h-16 border-2 border-dashed border-slate-300 dark:border-slate-600 rounded bg-slate-50 dark:bg-slate-900 flex flex-col items-center justify-center text-center p-1">
        <svg class="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" :d="getIcon('file_input')"></path></svg>
        <span class="text-[9px] text-slate-500 dark:text-slate-400">Upload zone</span>
      </div>

      <div v-if="['multiple_choice', 'checkbox', 'multi_select'].includes(node.type)" class="space-y-1">
        <div v-for="(opt, idx) in node.data.options.slice(0, 3)" :key="idx" class="flex items-center gap-2">
          <div class="w-2 h-2 rounded-full border border-slate-300 bg-white"></div>
          <div class="h-1.5 bg-slate-100 dark:bg-slate-700 rounded w-2/3"></div>
        </div>
      </div>

      <div v-if="node.type === 'condition'" class="bg-amber-50 dark:bg-amber-900/20 border border-amber-100 dark:border-amber-900/50 rounded p-2 text-xs text-amber-800 dark:text-amber-400">
        <span class="font-bold">Als:</span> {{ node.data.conditionType }} "{{ node.data.conditionValue }}"
      </div>

      <p v-if="node.data.required" class="text-[10px] text-slate-400 mt-2 text-right">* Verplicht</p>
    </div>

    <div class="absolute -top-3 left-1/2 transform -translate-x-1/2 w-6 h-6 bg-white dark:bg-slate-700 border-2 border-slate-300 dark:border-slate-500 rounded-full flex items-center justify-center cursor-crosshair hover:border-teal-500 z-10 shadow-sm"
         @mouseup="emit('connect-end', node.id)">
      <div class="w-1.5 h-1.5 bg-slate-400 rounded-full"></div>
    </div>

    <div class="absolute -bottom-3 left-1/2 transform -translate-x-1/2 w-6 h-6 bg-white dark:bg-slate-700 border-2 border-teal-500 rounded-full flex items-center justify-center cursor-crosshair hover:bg-teal-50 dark:hover:bg-teal-900 z-10 shadow-sm"
         @mousedown.stop="emit('connect-start', $event, node.id)">
      <div class="w-2 h-2 bg-teal-500 rounded-full"></div>
    </div>
  </div>
</template>