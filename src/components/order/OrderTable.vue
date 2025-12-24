<script setup>
import { ref, nextTick, onMounted, onUnmounted, watch } from 'vue'; // Extra imports nodig
import { formatCurrency } from '../../utils/formatters';
import IconButton from '../common/IconButton.vue';
import HistoryTooltip from '../common/HistoryTooltip.vue';

const props = defineProps(['lines']);
const emit = defineEmits(['add-line', 'open-pricelist']); // Definieer het event

// Ref voor de scrollbare container
const tableContainer = ref(null);

// Functie om event te sturen
const triggerAddLine = () => {
  emit('add-line');
};

// Scroll automatisch naar beneden als er een regel bijkomt
watch(() => props.lines.length, async () => {
  await nextTick(); // Wacht tot Vue de DOM heeft geupdate
  if (tableContainer.value) {
    tableContainer.value.scrollTop = tableContainer.value.scrollHeight;
    // Optioneel: Focus zetten op het eerste inputveld van de nieuwe regel
    // Dit vergt wat extra logica met refs op de inputs
  }
});

// Sneltoets luisteraar (F4)
const handleKeydown = (e) => {
  if (e.key === 'F4') {
    e.preventDefault(); // Voorkom standaard browser gedrag
    triggerAddLine();
  }
};

onMounted(() => window.addEventListener('keydown', handleKeydown));
onUnmounted(() => window.removeEventListener('keydown', handleKeydown));
</script>

<template>
  <div class="bg-white dark:bg-brand-900 rounded-lg shadow-sm border border-slate-200 dark:border-brand-800 flex flex-col flex-grow overflow-hidden transition-colors duration-300">

    <div ref="tableContainer" class="flex-grow overflow-auto border-0 rounded-none h-[calc(100vh-360px)]">
      <table class="w-full text-sm table-fixed min-w-[2400px]">

        <thead class="bg-slate-50 dark:bg-brand-800 sticky top-0 z-30 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase border-b border-slate-200 dark:border-brand-700">
        <tr>
          <th class="w-[50px] text-center py-2.5">#</th>
          <th class="w-[400px] text-left px-4">Artikelcode / Omschrijving</th>
          <th class="w-[70px] text-right px-2">Voorraad</th>
          <th class="w-[80px] text-right px-2">Aantal</th>
          <th class="w-[60px] text-left px-2">Eenh.</th>
          <th class="w-[120px] text-left px-2">Prijslijst</th>
          <th class="w-[100px] text-right px-2">Verkoopprijs</th>
          <th class="w-[70px] text-right px-2">Kort%</th>
          <th class="w-[100px] text-right px-2">Netto</th>
          <th class="w-[100px] text-right px-2">Kostprijs</th>
          <th class="w-[100px] text-right px-2">Marge%</th>
          <th class="w-[60px] text-right px-2">BTW%</th>
          <th class="w-[110px] text-right px-2 font-bold text-slate-900 dark:text-white">Totaal Ex</th>
          <th class="w-[110px] text-right px-2 text-slate-500 dark:text-slate-400">Totaal Inc</th>
          <th class="w-[70px] text-right px-2 text-slate-400">Geleverd</th>
          <th class="w-[110px] text-center px-2">Afleverdatum</th>
          <th class="w-[70px] text-right px-2 text-slate-400">Gefac.</th>
          <th class="w-[160px] text-center sticky right-0 bg-slate-50 dark:bg-brand-800 shadow-[-4px_0_8px_-4px_rgba(0,0,0,0.1)] z-20 border-b border-slate-200 dark:border-brand-700">Acties</th>
        </tr>
        </thead>

        <tbody class="divide-y divide-slate-100 dark:divide-brand-800">
        <tr v-for="line in lines" :key="line.id" class="group hover:bg-slate-50 dark:hover:bg-brand-800/50 transition-colors">
          <td class="text-center text-slate-400">{{ line.id }}</td>
          <td class="px-4 py-2">
            <div class="flex flex-col w-full">
              <input type="text" v-model="line.code" class="bg-transparent font-bold text-brand-600 dark:text-brand-300 w-full outline-none p-0 border-0 h-5 placeholder-slate-300" placeholder="Code..." />
              <input type="text" v-model="line.desc" class="bg-transparent text-xs text-slate-500 dark:text-slate-400 w-full outline-none p-0 border-0 h-4 placeholder-slate-300" placeholder="Omschrijving..." />
            </div>
          </td>
          <td
              class="text-right font-medium px-2 transition-colors duration-200"
              :class="line.qty > line.stock
                ? 'text-red-600 dark:text-red-400 font-bold'
                : 'text-green-600 dark:text-green-400'"
          >
            {{ line.stock }}
          </td>
          <td class="px-2"><input type="number" v-model="line.qty" class="input-row font-bold" /></td>
          <td class="text-slate-400 text-xs px-2">{{ line.unit }}</td>
          <td class="text-xs text-slate-500 px-2">{{ line.priceList }}</td>
          <td class="px-2"><input type="number" v-model="line.price" class="input-row" /></td>
          <td class="px-2"><input type="number" v-model="line.discount" class="input-row" /></td>
          <td class="text-right px-2 font-medium">{{ formatCurrency(line.price * (1 - line.discount/100)) }}</td>
          <td class="text-right text-slate-400 px-2">{{ formatCurrency(line.cost) }}</td>
          <td class="text-right text-slate-400 px-2">28,89%</td>
          <td class="text-right text-slate-500 px-2">{{ line.vat }}%</td>
          <td class="text-right font-bold text-slate-900 dark:text-white px-2">{{ formatCurrency((line.price * (1 - line.discount/100)) * line.qty) }}</td>
          <td class="text-right text-slate-500 px-2">{{ formatCurrency(((line.price * (1 - line.discount/100)) * line.qty) * (1 + line.vat/100)) }}</td>
          <td class="text-right text-slate-300 px-2">0</td>
          <td class="text-center px-2"><span class="text-xs bg-slate-100 dark:bg-brand-700 px-2 py-1 rounded text-slate-600 dark:text-slate-300">20/12</span></td>
          <td class="text-right text-slate-300 px-2">0</td>

          <td class="text-center sticky right-0 bg-white dark:bg-brand-900 group-hover:bg-slate-50 dark:group-hover:bg-brand-800 shadow-[-4px_0_8px_-4px_rgba(0,0,0,0.1)] z-10 px-2 py-1">
            <div class="flex justify-center items-center gap-1 h-full w-full">
              <IconButton icon="pencil-alt" title="Notitie" />
              <IconButton
                  icon="tag"
                  title="Prijslijst Wijzigen"
                  @click="$emit('open-pricelist', line)"
              />
              <IconButton icon="trash" color="text-red-500" title="Verwijderen" />
              <div class="relative group/history">
                <IconButton icon="dots-horizontal" />
                <HistoryTooltip class="hidden group-hover/history:block absolute right-full top-1/2 transform -translate-y-1/2 mr-2 w-64 z-50" :created-by="line.created.user" :created-date="line.created.date" :modified-by="line.modified.user" :modified-date="line.modified.date" position="left" />
              </div>
            </div>
          </td>
        </tr>
        </tbody>
      </table>
    </div>

    <button
        @click="triggerAddLine"
        class="py-2.5 bg-slate-50 dark:bg-brand-800/50 border-t border-slate-100 dark:border-brand-800 text-slate-500 dark:text-slate-400 hover:text-brand-600 dark:hover:text-white hover:bg-white dark:hover:bg-brand-800 text-sm font-medium transition text-left px-4 cursor-pointer flex justify-between items-center group"
    >
      <span>+ Nieuwe Regel toevoegen (F4)</span>
      <span class="text-xs font-mono bg-slate-200 dark:bg-brand-700 px-1.5 py-0.5 rounded text-slate-500 dark:text-slate-300 opacity-0 group-hover:opacity-100 transition-opacity">F4</span>
    </button>
  </div>
</template>

<style scoped>
@reference "../../assets/main.css";

.input-row {
  @apply text-sm px-1 py-1 rounded border border-slate-200 bg-white text-slate-700 w-full text-right h-7 transition-all focus:outline-none focus:border-slate-400 dark:bg-brand-800 dark:border-brand-600 dark:text-slate-200;
}
</style>