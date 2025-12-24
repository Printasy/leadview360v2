<template>
  <div class="flex flex-col h-screen bg-[#f8fafc] font-['Inter',sans-serif] text-slate-900 overflow-hidden">

    <header class="w-full bg-white border-b border-slate-200 px-8 py-4 sticky top-0 z-40 shadow-sm">
      <div class="max-w-full mx-auto flex flex-col gap-4">

        <div class="flex justify-between items-center">
          <div class="flex items-center gap-6">
            <h1 class="text-2xl font-black text-slate-900 tracking-tighter uppercase">Productenoverzicht</h1>

            <div class="relative">
              <select v-model="currentView" class="pl-4 pr-10 py-2 border border-slate-300 rounded-sm text-[11px] font-black uppercase tracking-widest text-blue-600 outline-none hover:bg-slate-50 transition-all appearance-none cursor-pointer">
                <option value="default">Standaard overzicht</option>
                <option value="logistics">Logistieke data</option>
                <option value="financial">Financieel beheer</option>
              </select>
              <i class="fas fa-chevron-down absolute right-3 top-3 text-[10px] text-blue-400 pointer-events-none"></i>
            </div>
          </div>

          <div class="flex gap-3">
            <button class="px-5 py-2 border border-slate-300 rounded-sm text-[11px] font-black uppercase tracking-widest text-slate-600 hover:bg-slate-50 transition-all bg-white shadow-sm">
              <i class="fas fa-file-export mr-2 text-slate-400"></i>Export
            </button>
            <button @click="createNewProduct" class="px-6 py-2 bg-blue-600 text-white rounded-sm text-[11px] font-black uppercase tracking-widest hover:bg-blue-700 active:scale-95 shadow-md transition-all">
              <i class="fas fa-plus mr-2"></i>Nieuw Product
            </button>
          </div>
        </div>

        <div class="flex items-center gap-3">

          <div class="relative flex-1 group max-w-2xl">
            <i class="fas fa-search absolute left-4 top-3 text-slate-400 group-focus-within:text-blue-500 transition-colors"></i>
            <input
                v-model="searchQuery"
                type="text"
                class="w-full pl-11 pr-4 py-2 border border-slate-300 rounded-sm text-sm focus:bg-white focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all shadow-inner"
                placeholder="Snel zoeken op Artikelnummer (SKU) of Omschrijving..."
            >
          </div>

          <div class="flex items-center gap-2">
            <div class="relative" v-for="(filter, key) in filterConfig" :key="key">
              <input
                  type="text"
                  v-model="filters[key]"
                  class="w-40 px-3 py-2 border border-slate-300 rounded-sm text-[11px] font-bold uppercase placeholder-slate-400 focus:border-blue-500 outline-none transition-all shadow-sm"
                  :placeholder="filter.label"
              >
              <i class="fas fa-caret-down absolute right-2 top-3 text-slate-300 text-[10px]"></i>
            </div>

            <button @click="resetFilters" class="p-2 text-slate-400 hover:text-red-500 transition-colors" title="Filters wissen">
              <i class="fas fa-filter-circle-xmark text-lg"></i>
            </button>
          </div>
        </div>
      </div>
    </header>

    <main class="flex-1 overflow-auto p-6 bg-slate-50">
      <div class="bg-white border border-slate-200 shadow-sm overflow-hidden rounded-none">
        <table class="w-full text-left border-collapse table-fixed">
          <thead>
          <tr class="bg-slate-100 border-b border-slate-300">
            <th class="p-3 pl-6 w-44 text-[10px] font-black uppercase text-slate-500 tracking-widest border-r border-slate-200">SKU</th>
            <th class="p-3 w-80 text-[10px] font-black uppercase text-slate-500 tracking-widest border-r border-slate-200">Omschrijving</th>
            <th class="p-3 w-40 text-[10px] font-black uppercase text-slate-500 tracking-widest border-r border-slate-200 text-center">Categorie</th>
            <th class="p-3 w-32 text-[10px] font-black uppercase text-slate-500 tracking-widest border-r border-slate-200 text-right">Verkoopprijs</th>
            <th class="p-3 w-24 text-[10px] font-black uppercase text-slate-500 tracking-widest border-r border-slate-200 text-center">Status</th>
            <th class="p-3 w-20 text-[10px] font-black uppercase text-slate-500 tracking-widest border-r border-slate-200 text-center">Unit</th>
            <th class="p-3 w-28 text-[10px] font-black uppercase text-slate-500 tracking-widest border-r border-slate-200 text-center">Min. Qty</th>
            <th class="p-3 w-20 text-[10px] font-black uppercase text-slate-500 tracking-widest border-r border-slate-200 text-center">Step</th>
            <th class="p-3 w-52 text-[10px] font-black uppercase text-slate-500 tracking-widest border-r border-slate-200">Hoofdleverancier</th>
            <th class="p-3 w-32 text-[10px] font-black uppercase text-slate-500 tracking-widest border-r border-slate-200 text-right italic">Kostprijs</th>
            <th class="p-3 w-24 text-[10px] font-black uppercase text-slate-500 tracking-widest border-r border-slate-200 text-right text-blue-600">Marge</th>
            <th class="p-3 w-24 text-[10px] font-black uppercase text-slate-500 tracking-widest text-center">Dropship</th>
          </tr>
          </thead>
          <tbody class="divide-y divide-slate-200 text-[12px] font-medium text-slate-700">
          <tr v-for="product in products" :key="product.sku" class="hover:bg-blue-50/50 transition-colors group cursor-pointer" @click="openProduct(product.sku)">
            <td class="p-3 pl-6 font-mono text-blue-600 font-bold border-r border-slate-100 tracking-tight">{{ product.sku }}</td>
            <td class="p-3 truncate font-bold text-slate-900 border-r border-slate-100">{{ product.description }}</td>
            <td class="p-3 text-center border-r border-slate-100 uppercase text-[10px] font-black text-slate-400 tracking-tighter">{{ product.category }}</td>
            <td class="p-3 text-right font-mono font-black text-slate-900 border-r border-slate-100">€ {{ product.price.toFixed(2) }}</td>
            <td class="p-3 text-center border-r border-slate-100">
                <span :class="product.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-slate-200 text-slate-500'" class="px-2 py-0.5 rounded-sm text-[9px] font-black uppercase">
                  {{ product.status }}
                </span>
            </td>
            <td class="p-3 text-center uppercase font-black text-slate-400 border-r border-slate-100">{{ product.unit }}</td>
            <td class="p-3 text-center font-mono border-r border-slate-100 text-slate-400">{{ product.min_qty }}</td>
            <td class="p-3 text-center font-mono border-r border-slate-100 text-slate-400">{{ product.step }}</td>
            <td class="p-3 truncate border-r border-slate-100 font-bold text-slate-500">{{ product.main_supplier }}</td>
            <td class="p-3 text-right font-mono text-slate-400 border-r border-slate-100">€ {{ product.cost.toFixed(2) }}</td>
            <td class="p-3 text-right font-mono font-black border-r border-slate-100" :class="product.margin > 20 ? 'text-green-600' : 'text-orange-500'">
              {{ product.margin }}%
            </td>
            <td class="p-3 text-center">
              <i v-if="product.dropshipped" class="fas fa-check-circle text-blue-500"></i>
              <i v-else class="fas fa-times-circle text-slate-200"></i>
            </td>
          </tr>
          </tbody>
        </table>

        <div class="p-4 bg-white border-t border-slate-300 flex justify-between items-center text-[10px] font-black uppercase text-slate-500 tracking-widest">
          <div class="flex items-center gap-4">
            <span>Totaal items: 1.450</span>
            <div class="flex items-center gap-2 border-l pl-4 border-slate-200">
              <span>Items per pagina:</span>
              <select v-model="itemsPerPage" class="bg-slate-100 border-none rounded-sm p-1 text-[10px] font-black outline-none cursor-pointer hover:bg-slate-200 transition-colors">
                <option :value="25">25</option>
                <option :value="50">50</option>
                <option :value="100">100</option>
                <option :value="250">250</option>
              </select>
            </div>
          </div>

          <div class="flex gap-4 items-center">
            <button class="hover:text-blue-600 transition-colors opacity-50 cursor-not-allowed"><i class="fas fa-chevron-left mr-2"></i>Vorige</button>
            <div class="flex gap-1 items-baseline">
              <span class="px-2 py-1 bg-blue-600 text-white rounded-sm font-bold">1</span>
              <span class="px-2 py-1 hover:bg-slate-100 cursor-pointer">2</span>
              <span class="px-2 py-1 hover:bg-slate-100 cursor-pointer">3</span>
              <span class="px-2">...</span>
              <span class="px-2 py-1 hover:bg-slate-100 cursor-pointer">15</span>
            </div>
            <button class="hover:text-blue-600 transition-colors font-bold">Volgende<i class="fas fa-chevron-right ml-2"></i></button>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue';

const currentView = ref('default');
const searchQuery = ref('');
const itemsPerPage = ref(50);

// Filter Config voor Autocomplete simulatie
const filterConfig = {
  category: { label: 'Categorie...' },
  supplier: { label: 'Leverancier...' },
  status: { label: 'Status...' },
  admin: { label: 'Administratie...' }
};

const filters = reactive({
  category: '',
  supplier: '',
  status: '',
  admin: ''
});

// Mock Data (Data-dense)
const products = ref([
  {
    sku: 'EL-CONNECTOR-X5',
    description: 'Industrial Power Connector 5P 63A IP67 Heavy Duty',
    category: 'Hardware',
    price: 189.50,
    status: 'active',
    unit: 'PCE',
    min_qty: 1,
    step: 1,
    main_supplier: 'ElectroHub Ghent NV',
    cost: 112.40,
    margin: 40.7,
    dropshipped: false
  },
  {
    sku: 'CAB-CAT6-B-20M',
    description: 'UTP Cat6 Network Cable 20m Blue Shielded',
    category: 'Kabels',
    price: 24.95,
    status: 'active',
    unit: 'PCE',
    min_qty: 5,
    step: 5,
    main_supplier: 'TechParts International',
    cost: 8.50,
    margin: 65.9,
    dropshipped: true
  }
]);

const resetFilters = () => {
  Object.keys(filters).forEach(k => filters[k] = '');
  searchQuery.value = '';
};

const openProduct = (sku) => {
  alert('Openen van Product: ' + sku);
};

const createNewProduct = () => {
  console.log('Navigating to ProductCreate...');
};
</script>

<style scoped>
/* Strakke tabel regels */
th {
  background-color: #f1f5f9;
  z-index: 10;
}

td {
  white-space: nowrap;
}

/* ERP Scrollbar: Minimalistisch en recht */
::-webkit-scrollbar {
  width: 5px;
  height: 5px;
}
::-webkit-scrollbar-track {
  background: #f1f5f9;
}
::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 0px;
}
::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}

/* Verwijder standaard select arrow voor custom ERP look */
select {
  background-image: none;
}
</style>