<script setup>
import { useFlow } from '@/composables/useFlow';
const { selectedNode, removeNode } = useFlow();
</script>

<template>
  <aside
      class="w-80 bg-white dark:bg-slate-800 border-l border-slate-200 dark:border-slate-700 z-50 shadow-xl flex flex-col transition-transform duration-300 h-full"
      :class="selectedNode ? 'translate-x-0' : 'translate-x-full hidden'"
  >
    <div v-if="selectedNode" class="flex flex-col h-full">
      <div class="p-5 border-b border-slate-100 dark:border-slate-700 flex justify-between items-center">
        <h2 class="text-lg font-bold text-slate-800 dark:text-slate-100">Instellingen</h2>
        <button @click="selectedNode = null" class="text-slate-400 hover:text-slate-600">&times;</button>
      </div>

      <div class="flex-1 overflow-y-auto p-5 space-y-5">

        <div v-if="selectedNode.type !== 'condition'">
          <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Vraag</label>
          <textarea
              v-model="selectedNode.data.question"
              rows="3"
              class="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 text-sm focus:ring-2 focus:ring-teal-500 focus:outline-none"
          ></textarea>
        </div>

        <div v-if="selectedNode.type !== 'condition'" class="flex items-center gap-2">
          <input type="checkbox" v-model="selectedNode.data.required" class="rounded text-teal-600 focus:ring-teal-500">
          <span class="text-sm text-slate-700 dark:text-slate-300">Verplicht veld</span>
        </div>

        <div v-if="['multiple_choice', 'multi_select', 'checkbox'].includes(selectedNode.type)">
          <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Antwoorden</label>
          <div class="space-y-2">
            <div v-for="(opt, idx) in selectedNode.data.options" :key="idx" class="flex gap-2">
              <input type="text" v-model="selectedNode.data.options[idx]" class="flex-1 px-2 py-1 border border-slate-300 dark:border-slate-600 rounded text-sm dark:bg-slate-900 dark:text-white">
              <button @click="selectedNode.data.options.splice(idx, 1)" class="text-red-400 hover:text-red-600">&times;</button>
            </div>
          </div>
          <button @click="selectedNode.data.options.push('')" class="mt-2 text-sm text-teal-600 hover:text-teal-700 font-medium">+ Optie toevoegen</button>
        </div>

        <div v-if="selectedNode.type === 'file_input'" class="bg-slate-50 dark:bg-slate-700/50 p-3 rounded border border-slate-200 dark:border-slate-600 space-y-3">
          <h4 class="text-xs font-bold uppercase text-slate-500">Bestandsbeperkingen</h4>
          <div class="flex flex-col gap-2">
            <label class="flex items-center text-sm dark:text-slate-300"><input type="checkbox" class="mr-2"> PDF Documenten</label>
            <label class="flex items-center text-sm dark:text-slate-300"><input type="checkbox" class="mr-2"> Afbeeldingen (JPG/PNG)</label>
          </div>
          <div>
            <label class="text-xs text-slate-500">Max grootte (MB)</label>
            <input type="number" v-model="selectedNode.data.maxSize" class="w-full mt-1 px-2 py-1 border rounded text-sm dark:bg-slate-900 dark:text-white">
          </div>
        </div>

        <div v-if="selectedNode.type === 'condition'" class="bg-amber-50 dark:bg-amber-900/10 p-4 rounded border border-amber-100 dark:border-amber-900/30 space-y-3">
          <div>
            <label class="text-xs font-bold text-amber-800 dark:text-amber-500 uppercase">Operator</label>
            <select v-model="selectedNode.data.conditionType" class="w-full mt-1 px-2 py-1 border border-amber-200 dark:border-amber-800 rounded text-sm dark:bg-slate-900 dark:text-slate-200">
              <option value="equals">Gelijk aan (=)</option>
              <option value="contains">Bevat</option>
              <option value="gt">Groter dan (>)</option>
              <option value="gte">Groter of gelijk (>=)</option>
              <option value="lt">Kleiner dan (<)</option>
              <option value="lte">Kleiner of gelijk (<=)</option>
            </select>
          </div>
          <div>
            <label class="text-xs font-bold text-amber-800 dark:text-amber-500 uppercase">Waarde</label>
            <input type="text" v-model="selectedNode.data.conditionValue" class="w-full mt-1 px-2 py-1 border border-amber-200 rounded text-sm dark:bg-slate-900 dark:text-white">
          </div>
        </div>

      </div>

      <div class="p-5 border-t border-slate-100 dark:border-slate-700">
        <button @click="removeNode(selectedNode.id)" class="w-full py-2 border border-red-200 text-red-600 rounded hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors text-sm">
          Node Verwijderen
        </button>
      </div>
    </div>
  </aside>
</template>
