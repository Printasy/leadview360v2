<script setup>
import { ref } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();
const openGroups = ref(['commerce', 'products', 'marketing']); // Standaard opengeklapte groepen

const toggleGroup = (key) => {
  if (openGroups.value.includes(key)) {
    openGroups.value = openGroups.value.filter(k => k !== key);
  } else {
    openGroups.value.push(key);
  }
};

// Menu Data Structuur
const menuGroups = [
  {
    key: 'dashboard',
    label: 'Dashboard',
    icon: 'fas fa-chart-line',
    to: '/'
  },
  {
    key: 'commerce',
    label: 'Verkoop & CRM',
    icon: 'fas fa-shopping-cart',
    children: [
      { label: 'Orders', to: '/order' },
      { label: 'Offertes', to: '/quotes' },
      { label: 'Klanten', to: '/customers' },
    ]
  },
  {
    key: 'products',
    label: 'Productbeheer',
    icon: 'fas fa-box',
    children: [
      { label: 'Nieuw Product', to: '/product/new' },
      { label: 'Voorraad', to: '/inventory' },
      { label: 'Categorieën', to: '/categories' },
    ]
  },
  {
    key: 'marketing',
    label: 'Marketing',
    icon: 'fas fa-bullhorn',
    children: [
      { label: 'Campagnes', to: '/marketing/campaigns' },
      { label: 'Q&A Flows', to: '/marketing/flow' },
    ]
  },
  {
    key: 'finance',
    label: 'Financieel',
    icon: 'fas fa-file-invoice-dollar',
    children: [
      { label: 'Facturen', to: '/invoices' },
      { label: 'Grootboek', to: '/ledger' },
    ]
  }
];

const isActive = (path) => route.path.startsWith(path);
</script>

<template>
  <aside class="w-64 bg-slate-900 text-gray-300 flex flex-col flex-shrink-0 h-full border-r border-slate-800">

    <div class="h-16 flex items-center px-5 border-b border-slate-800 shrink-0">
      <div class="flex items-center gap-3 text-white font-bold text-xl">
        <div class="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center shadow-lg shadow-blue-900/50">
          <i class="fas fa-cube text-sm"></i>
        </div>
        <span class="tracking-tight">CoreERP</span>
      </div>
    </div>

    <nav class="flex-1 overflow-y-auto py-4 px-3 space-y-1 custom-scrollbar">

      <div v-for="group in menuGroups" :key="group.key" class="mb-1">

        <router-link v-if="!group.children" :to="group.to"
                     class="flex items-center px-3 py-2.5 rounded-lg transition-colors text-sm font-medium group"
                     :class="route.path === group.to ? 'bg-blue-600 text-white shadow-md' : 'text-slate-400 hover:bg-slate-800 hover:text-white'">
          <i :class="[group.icon, 'w-6 text-center']"></i>
          <span class="ml-2">{{ group.label }}</span>
        </router-link>

        <div v-else>
          <button @click="toggleGroup(group.key)"
                  class="w-full flex items-center justify-between px-3 py-2.5 rounded-lg transition-colors text-sm font-medium text-slate-400 hover:bg-slate-800 hover:text-white group select-none">
            <div class="flex items-center">
              <i :class="[group.icon, 'w-6 text-center transition-colors', openGroups.includes(group.key) ? 'text-white' : '']"></i>
              <span class="ml-2" :class="openGroups.includes(group.key) ? 'text-white' : ''">{{ group.label }}</span>
            </div>
            <i class="fas fa-chevron-right text-[10px] transition-transform duration-200"
               :class="openGroups.includes(group.key) ? 'rotate-90 text-white' : 'text-slate-600'"></i>
          </button>

          <div v-show="openGroups.includes(group.key)" class="mt-1 ml-3 pl-3 border-l border-slate-700 space-y-1">
            <router-link v-for="child in group.children" :key="child.label" :to="child.to"
                         class="block px-3 py-2 rounded-md text-sm transition-colors"
                         :class="isActive(child.to) ? 'bg-slate-800 text-blue-400 font-medium' : 'text-slate-500 hover:text-slate-200'">
              {{ child.label }}
            </router-link>
          </div>
        </div>

      </div>
    </nav>

    <div class="p-4 border-t border-slate-800 bg-slate-900/50 shrink-0">
      <div class="flex items-center gap-3">
        <div class="h-9 w-9 bg-slate-700 rounded-full flex items-center justify-center text-xs font-bold text-white border border-slate-600">JD</div>
        <div class="overflow-hidden">
          <div class="text-sm font-medium text-white truncate">Jan de Designer</div>
          <div class="text-xs text-slate-500 truncate">Systeembeheerder</div>
        </div>
      </div>
    </div>
  </aside>
</template>

<style scoped>
.custom-scrollbar::-webkit-scrollbar { width: 4px; }
.custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
.custom-scrollbar::-webkit-scrollbar-thumb { background: #334155; border-radius: 2px; }
.custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #475569; }
</style>