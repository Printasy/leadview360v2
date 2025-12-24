<script setup>
import { ref, onMounted, onUnmounted } from 'vue';

// Props: De regel die we aan het bewerken zijn
const props = defineProps({
  line: {
    type: Object,
    required: true
  }
});

const emit = defineEmits(['close', 'save']);

// Mock data: Beschikbare prijslijsten
const priceLists = [
  { id: 'std', name: 'Standaard 2025', multiplier: 1.0 },
  { id: 'b2b', name: 'B2B Wholesale', multiplier: 0.85 },
  { id: 'partner', name: 'Partner Goud', multiplier: 0.75 },
  { id: 'promo', name: 'Diensten / Uurtarief', multiplier: 1.0 }
];

// Lokale state: Welke is geselecteerd? (Standaard de huidige van de regel)
const selectedList = ref(props.line.priceList);

const handleSave = () => {
  // Emit de naam van de gekozen lijst terug
  emit('save', selectedList.value);
};

// Sluiten met Escape
const handleKeydown = (e) => {
  if (e.key === 'Escape') emit('close');
};

onMounted(() => document.addEventListener('keydown', handleKeydown));
onUnmounted(() => document.removeEventListener('keydown', handleKeydown));
</script>

<template>
  <div class="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4" @click="$emit('close')">
    <div class="bg-white dark:bg-brand-900 rounded-xl shadow-2xl w-full max-w-md overflow-hidden flex flex-col max-h-[90vh]" @click.stop>

      <div class="px-6 py-4 border-b border-slate-100 dark:border-brand-800 flex justify-between items-center bg-slate-50 dark:bg-brand-950">
        <div>
          <h3 class="font-bold text-slate-800 dark:text-white">Prijslijst Toewijzen</h3>
          <p class="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{{ line.code }} - {{ line.desc }}</p>
        </div>
        <button @click="$emit('close')" class="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
        </button>
      </div>

      <div class="p-6 overflow-y-auto">
        <label class="block text-xs font-bold uppercase text-slate-400 tracking-wider mb-3">Beschikbare lijsten</label>

        <div class="space-y-2">
          <label
              v-for="list in priceLists"
              :key="list.id"
              class="flex items-center justify-between p-3 rounded-lg border cursor-pointer transition-all"
              :class="selectedList === list.name
              ? 'border-brand-500 bg-brand-50 dark:bg-brand-800/60 dark:border-brand-400'
              : 'border-slate-200 hover:border-brand-300 dark:border-brand-700 dark:hover:border-brand-600'"
          >
            <div class="flex items-center gap-3">
              <input
                  type="radio"
                  name="pricelist"
                  :value="list.name"
                  v-model="selectedList"
                  class="text-brand-600 focus:ring-brand-500"
              />
              <span class="text-sm font-medium text-slate-700 dark:text-slate-200">{{ list.name }}</span>
            </div>
            <span class="text-xs font-mono text-slate-400" :class="{'text-brand-600 font-bold dark:text-brand-400': selectedList === list.name}">
              x {{ list.multiplier }}
            </span>
          </label>
        </div>
      </div>

      <div class="px-6 py-4 bg-slate-50 dark:bg-brand-950 border-t border-slate-100 dark:border-brand-800 flex justify-end gap-3">
        <button @click="$emit('close')" class="px-4 py-2 text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-brand-800 rounded-lg transition">Annuleren</button>
        <button @click="handleSave" class="px-4 py-2 text-sm font-medium text-white bg-brand-600 hover:bg-brand-500 rounded-lg shadow-sm transition">Opslaan</button>
      </div>

    </div>
  </div>
</template>

<style scoped>
@reference "../../assets/main.css";
</style>