<script setup>
import { useRouter } from 'vue-router';
import FlowCanvas from '@/components/marketing/FlowCanvas.vue';
import FlowToolbox from '@/components/marketing/FlowToolbox.vue';
import FlowProperties from '@/components/marketing/FlowProperties.vue';
import { useFlow } from '@/composables/useFlow';

const router = useRouter();
const { nodes, connections } = useFlow();

const handleSave = () => {
  // Hier loggen we de data. Later kun je dit naar je backend sturen.
  console.log('Flow opgeslagen:', JSON.stringify({ nodes: nodes.value, connections: connections.value }));
  alert('Flow data is gelogd in de browser console (F12)');
};

const handleBack = () => {
  router.push('/order');
};
</script>

<template>
  <div class="flex flex-col h-full w-full relative overflow-hidden">

    <div class="h-14 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between px-4 z-20 shrink-0">
      <div class="flex items-center gap-4">
        <button @click="handleBack" class="text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 text-sm font-medium flex items-center gap-1">
          <span>&larr;</span> Terug
        </button>
        <h1 class="font-bold text-slate-700 dark:text-slate-200">Marketing Q&A Designer</h1>
      </div>
      <button @click="handleSave" class="bg-teal-500 hover:bg-teal-600 text-white px-4 py-1.5 rounded text-sm font-medium shadow-sm transition-colors">
        Opslaan
      </button>
    </div>

    <div class="flex-1 flex relative overflow-hidden bg-slate-50 dark:bg-slate-950">

      <FlowToolbox />

      <FlowCanvas />

      <FlowProperties />

    </div>
  </div>
</template>