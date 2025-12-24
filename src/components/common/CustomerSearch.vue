<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';

const props = defineProps({
  modelValue: { type: String, default: '' },
  placeholder: { type: String, default: 'Zoek klant...' }
});

const emit = defineEmits(['update:modelValue', 'select']);

const isOpen = ref(false);
const searchRef = ref(null);
const searchTerm = ref(props.modelValue);

// AANGEPAST: Mock data bevat nu ook default ID's voor facturatie/levering
const customers = [
  {
    id: '10012',
    name: 'De Grote Handels BV',
    city: 'Amsterdam',
    invoiceId: '10012',
    deliveryId: '10012-A'
  },
  {
    id: '10013',
    name: 'Jansen & Zn',
    city: 'Utrecht',
    invoiceId: '10013',
    deliveryId: '10013' // Zelfde als factuur
  },
  {
    id: '10014',
    name: 'Tech Solutions NV',
    city: 'Eindhoven',
    invoiceId: 'BE0899.123.456',
    deliveryId: 'LOC-EIND-01'
  },
  // ... meer data
];

// ... (Filter logica en handlers blijven hetzelfde) ...

const filteredCustomers = computed(() => {
  if (!searchTerm.value) return [];
  const lowerTerm = searchTerm.value.toLowerCase();
  return customers.filter(c =>
      c.name.toLowerCase().includes(lowerTerm) ||
      c.id.includes(lowerTerm)
  );
});

const handleInput = (e) => {
  searchTerm.value = e.target.value;
  emit('update:modelValue', searchTerm.value);
  isOpen.value = true;
};

const selectCustomer = (customer) => {
  const format = `${customer.id} - ${customer.name}`;
  searchTerm.value = format;
  emit('update:modelValue', format);
  emit('select', customer); // We sturen het hele object (incl. adressen) mee
  isOpen.value = false;
};

const handleClickOutside = (e) => {
  if (searchRef.value && !searchRef.value.contains(e.target)) {
    isOpen.value = false;
  }
};

onMounted(() => document.addEventListener('click', handleClickOutside));
onUnmounted(() => document.removeEventListener('keydown', handleClickOutside));
</script>

<template>
  <div class="relative w-full" ref="searchRef">
    <div class="relative">
      <input
          type="text"
          :value="searchTerm"
          @input="handleInput"
          @focus="isOpen = true"
          class="input-field font-semibold pr-8 truncate"
          :placeholder="placeholder"
      >
      <svg class="w-4 h-4 absolute right-2.5 top-2.5 text-slate-400 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
      </svg>
    </div>

    <div v-if="isOpen && filteredCustomers.length > 0" class="absolute left-0 right-0 top-full mt-1 bg-white dark:bg-brand-800 border border-slate-200 dark:border-brand-600 rounded-lg shadow-lg z-50 max-h-60 overflow-y-auto">
      <ul>
        <li
            v-for="c in filteredCustomers"
            :key="c.id"
            @click="selectCustomer(c)"
            class="px-3 py-2 text-sm hover:bg-slate-50 dark:hover:bg-brand-700 cursor-pointer border-b border-slate-50 dark:border-brand-700/50 last:border-0"
        >
          <div class="font-bold text-slate-700 dark:text-white">{{ c.name }}</div>
          <div class="text-xs text-slate-400 flex justify-between">
            <span>#{{ c.id }}</span>
            <span>{{ c.city }}</span>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<style scoped>
@reference "../../assets/main.css";

.input-field {
  @apply text-sm px-2.5 py-1.5 rounded-md border border-slate-200 bg-white text-slate-700 w-full transition-all focus:outline-none focus:border-slate-400 focus:ring-2 focus:ring-slate-200 dark:bg-brand-900 dark:border-brand-600 dark:text-slate-200 dark:focus:ring-brand-700;
}
</style>