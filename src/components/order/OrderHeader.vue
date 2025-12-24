<script setup>
import { ref } from 'vue';
import ActionButton from '../common/ActionButton.vue';
import HistoryTooltip from '../common/HistoryTooltip.vue';
import CustomSelect from '../common/CustomSelect.vue';
import CustomerSearch from '../common/CustomerSearch.vue';

// Props
const props = defineProps(['order']);
defineEmits(['cancel', 'save']);

// Refs voor de gekoppelde velden
const invoiceClient = ref('10012');
const deliveryClient = ref('10012-A');

const handleCustomerSelect = (customer) => {
  if (customer.invoiceId) {
    invoiceClient.value = customer.invoiceId;
  }
  if (customer.deliveryId) {
    deliveryClient.value = customer.deliveryId;
  }
};

const originOptions = [
  { value: 'email', label: 'Email', icon: 'mail' },
  { value: 'phone', label: 'Telefonisch', icon: 'phone' },
  { value: 'web1', label: 'Webshop 1', icon: 'globe' },
];
const selectedOrigin = ref(originOptions[0]);
</script>

<template>
  <div class="bg-white dark:bg-brand-900 border-b border-slate-200 dark:border-brand-700 px-8 py-5 flex-none z-40 shadow-sm transition-colors duration-300">

    <div class="flex flex-col xl:flex-row justify-between xl:items-center mb-6 gap-4">
      <div class="flex items-center gap-3">
        <h1 class="text-2xl font-bold text-slate-800 dark:text-white tracking-tight">Nieuwe Verkooporder</h1>
        <span class="font-mono text-sm text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-brand-800 px-2 py-1 rounded border border-slate-200 dark:border-brand-700">#{{ order.id }}</span>
      </div>

      <div class="flex flex-wrap items-center gap-2">
        <ActionButton icon="clipboard">Besteladvies</ActionButton>
        <ActionButton icon="check-circle">Vrijgeven</ActionButton>
        <ActionButton icon="truck">Leveren</ActionButton>
        <ActionButton icon="document-text">Factureren</ActionButton>

        <div class="h-6 w-px bg-slate-200 dark:bg-brand-700 mx-1"></div>

        <ActionButton icon="printer">Afdrukken</ActionButton>
        <ActionButton icon="box">Paklijst</ActionButton>
        <ActionButton icon="mail">Email</ActionButton>

        <div class="h-6 w-px bg-slate-200 dark:bg-brand-700 mx-1"></div>

        <button class="px-5 py-2 text-sm font-medium text-white bg-accent-600 hover:bg-accent-500 rounded-lg shadow-md transition flex items-center gap-2 cursor-pointer" @click="$emit('save')">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>Opslaan
        </button>

        <ActionButton type="danger" icon="x" @click="$emit('cancel')">Annuleren</ActionButton>

        <HistoryTooltip created-by="Jan Jansen" created-date="15/12/2025 - 09:30" modified-by="Pieter Peeters" modified-date="15/12/2025 - 14:15" />
      </div>
    </div>

    <div class="grid grid-cols-12 gap-8">
      <div class="col-span-4 space-y-4">

        <div class="group">
          <label class="input-label">Klant</label>
          <CustomerSearch
              v-model="order.customer"
              @select="handleCustomerSelect"
          />
        </div>

        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="input-label">Leveringsadres</label>
            <input type="text" class="input-field text-sm" v-model="deliveryClient">
          </div>
          <div>
            <label class="input-label">Facturatieadres</label>
            <input type="text" class="input-field text-sm" v-model="invoiceClient">
          </div>
        </div>

      </div>

      <div class="col-span-8">
        <div class="grid grid-cols-4 gap-4">
          <div><label class="input-label">Administratie</label><select class="input-field"><option>EU - Hoofd</option></select></div>
          <div><label class="input-label">Sales Rep.</label><select class="input-field"><option>Jan Jansen</option></select></div>
          <div><label class="input-label">Magazijn</label><select class="input-field"><option>CENTRUM</option></select></div>
          <div><label class="input-label">Orderdatum</label><input type="date" class="input-field" value="2025-12-15"></div>
          <div><label class="input-label">Levering</label><select class="input-field"><option>DHL Standaard</option></select></div>
          <div><label class="input-label">Betaling</label><select class="input-field"><option>30 Dagen</option></select></div>
          <div><label class="input-label">Herkomst</label><CustomSelect :options="originOptions" v-model="selectedOrigin" /></div>
          <div><label class="input-label">Ref. Klant</label><input type="text" class="input-field" placeholder="..."></div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
@reference "../../assets/main.css";

.input-field {
  @apply text-sm px-2.5 py-1.5 rounded-md border border-slate-200 bg-white text-slate-700 w-full transition-all focus:outline-none focus:border-slate-400 focus:ring-2 focus:ring-slate-200 dark:bg-brand-900 dark:border-brand-600 dark:text-slate-200 dark:focus:ring-brand-700;
}
.input-label {
  @apply text-[11px] font-bold uppercase tracking-wide text-slate-500 mb-1 block dark:text-slate-400;
}
</style>