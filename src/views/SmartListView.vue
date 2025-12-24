<script setup>
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();

// --- LOGICA (Behouden uit originele spaghetti code) ---

const listName = ref('');
const targetType = ref('companies'); // 'contacts' of 'companies'
const activeRules = ref([]);
const showMenu = ref(false);

// MOCK DATA
const availableTags = ['Black Friday 2024', 'VIP Customer', 'Newsletter Subscriber', 'Webinar Q1', 'Whitepaper Download', 'Cold Lead', 'Churn Risk'];
const availableForms = ['Contactformulier', 'Offerte Aanvraag', 'Sollicitatie', 'Feedback Survey', 'Support Ticket'];
const availableSKUs = ['SKU-101', 'SKU-102', 'SKU-200', 'PROD-A', 'PROD-B', 'IPHONE-15', 'SAMSUNG-S24'];
const availableCategories = ['Electronics', 'Home & Garden', 'Clothing', 'Software', 'Services', 'Accessories'];

// Regels Definitie
const ruleDefinitions = [
  // Demografie
  { id: 1, label: 'Stad', category: 'Demografie', inputType: 'multi-text', value: '', operator: 'include' },
  { id: 2, label: 'Land', category: 'Demografie', inputType: 'multi-text', value: '', operator: 'include' },
  { id: 3, label: 'Postcode', category: 'Demografie', inputType: 'postcode-ranges', ranges: [{from: '', to: ''}], operator: 'include' },

  // Bedrijf / CRM
  { id: 5, label: 'Business Type', category: 'Bedrijf', inputType: 'multi-text', value: '', operator: 'include' },
  { id: 6, label: 'Lifecycle & Segment', category: 'Bedrijf', inputType: 'lifecycle', pairs: [{stage: '', segment: ''}], operator: 'include' },
  { id: 7, label: 'Relatie Type', category: 'Bedrijf', inputType: 'checkbox-group', options: ['Customer', 'Prospect', 'Suspect', 'Supplier'], selected: [], operator: 'include' },

  // Activiteit
  { id: 9, label: 'Web Activiteit sinds', category: 'Activiteit', inputType: 'timeframe', hours: 0, days: 30, operator: 'include' },
  { id: 13, label: 'Tagging Activiteit', category: 'Activiteit', inputType: 'tagged-activity', tags: [{name:'', score: 0, days: 30, showDropdown: false, filteredList: []}], operator: 'include' },
  { id: 30, label: 'Heeft ingevuld formulier', category: 'Activiteit', inputType: 'form-activity', formName: '', showDropdown: false, filteredForms: [], hours: 0, days: 30, operator: 'include' },

  // Orders (COMPANY ONLY)
  {
    id: 24, label: 'Heeft nieuwe bestelling sinds', category: 'Orders', inputType: 'order-scoped',
    hours: 0, days: 0, operator: 'include', filterType: 'none', searchValue: '', selectedItems: [], showDropdown: false, filteredItems: []
  },
  { id: 29, label: 'Order status change', category: 'Orders', inputType: 'status-select', status: '', operator: 'include' },
];

// Computed: Groepeer regels
const groupedRules = computed(() => {
  const groups = { 'Demografie': [], 'Bedrijf': [], 'Activiteit': [], 'Orders': [] };

  // Voeg company-only categorieën enkel toe als targetType == companies
  if (targetType.value !== 'companies') {
    delete groups['Orders'];
  }

  ruleDefinitions.forEach(rule => {
    if (groups[rule.category] && (targetType.value === 'companies' || rule.category !== 'Orders')) {
      groups[rule.category].push(rule);
    }
  });

  return Object.fromEntries(Object.entries(groups).filter(([_, v]) => v && v.length > 0));
});

// Helper: Check validiteit
const isRuleInvalid = (rule) => {
  if (targetType.value === 'companies') return false;
  const invalidCategories = ['Orders', 'Baskets'];
  return invalidCategories.includes(rule.category);
};

// Actions
const toggleMenu = () => showMenu.value = !showMenu.value;

const addRule = (ruleDef) => {
  const newRule = JSON.parse(JSON.stringify(ruleDef));
  newRule.uniqueId = Date.now() + Math.random();
  activeRules.value.push(newRule);
  showMenu.value = false;
};

const removeRule = (index) => activeRules.value.splice(index, 1);
const handleBack = () => router.push('/order');
const handleSave = () => {
  console.log("Saving Smart List...", { name: listName.value, type: targetType.value, rules: activeRules.value });
  alert("Smart List Opgeslagen (zie console)");
};

// --- Tag Helpers ---
const addTagRow = (rule) => rule.tags.push({name:'', score: 0, days: 30, showDropdown: false, filteredList: []});
const filterTags = (tagObj) => {
  if (!tagObj.name) { tagObj.filteredList = []; return; }
  tagObj.filteredList = availableTags.filter(t => t.toLowerCase().includes(tagObj.name.toLowerCase()));
  tagObj.showDropdown = true;
};

// --- Form Helpers ---
const filterForms = (ruleObj) => {
  if (!ruleObj.formName) { ruleObj.filteredForms = []; return; }
  ruleObj.filteredForms = availableForms.filter(f => f.toLowerCase().includes(ruleObj.formName.toLowerCase()));
  ruleObj.showDropdown = true;
};

// --- Order Helpers ---
const filterOrderItems = (rule) => {
  if (!rule.searchValue) { rule.filteredItems = []; return; }
  const source = rule.filterType === 'sku' ? availableSKUs : availableCategories;
  rule.filteredItems = source.filter(item =>
      item.toLowerCase().includes(rule.searchValue.toLowerCase()) &&
      !rule.selectedItems.includes(item)
  );
  rule.showDropdown = true;
};
const selectOrderItem = (rule, item) => {
  rule.selectedItems.push(item);
  rule.searchValue = '';
  rule.showDropdown = false;
};
</script>

<template>
  <div class="flex flex-col h-full w-full relative bg-slate-50 dark:bg-brand-950 overflow-hidden">

    <div class="h-14 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between px-6 z-20 shrink-0 shadow-sm">
      <div class="flex items-center gap-4">
        <button @click="handleBack" class="text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 text-sm font-medium flex items-center gap-1">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
          Terug
        </button>
        <div class="h-6 w-px bg-slate-200 dark:bg-slate-700"></div>
        <h1 class="font-bold text-slate-700 dark:text-slate-200 flex items-center gap-2">
          Smart List Builder
        </h1>
      </div>
      <button @click="handleSave" class="bg-teal-500 hover:bg-teal-600 text-white px-4 py-1.5 rounded text-sm font-medium shadow-sm transition-colors flex items-center gap-2">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>
        Lijst Opslaan
      </button>
    </div>

    <div class="flex-1 overflow-y-auto p-6">
      <div class="max-w-5xl mx-auto space-y-6 pb-20">

        <div class="bg-white dark:bg-slate-900 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700 p-6">
          <div class="flex flex-col md:flex-row gap-6">
            <div class="w-full md:w-1/3">
              <label class="block text-xs font-bold uppercase text-slate-500 dark:text-slate-400 mb-2 tracking-wide">Type Lijst</label>
              <div class="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-lg border border-slate-200 dark:border-slate-700">
                <button
                    @click="targetType = 'contacts'"
                    :class="targetType === 'contacts' ? 'bg-white dark:bg-slate-700 text-teal-600 dark:text-teal-400 shadow-sm' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700'"
                    class="flex-1 py-1.5 px-3 rounded-md text-sm font-bold transition-all flex justify-center items-center gap-2">
                  Contacten
                </button>
                <button
                    @click="targetType = 'companies'"
                    :class="targetType === 'companies' ? 'bg-white dark:bg-slate-700 text-teal-600 dark:text-teal-400 shadow-sm' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700'"
                    class="flex-1 py-1.5 px-3 rounded-md text-sm font-bold transition-all flex justify-center items-center gap-2">
                  Bedrijven
                </button>
              </div>
            </div>

            <div class="w-full md:w-2/3">
              <label class="block text-xs font-bold uppercase text-slate-500 dark:text-slate-400 mb-2 tracking-wide">Naam van de lijst</label>
              <input type="text" v-model="listName" placeholder="bv. Klanten met iPhone aankopen" class="w-full p-2 border border-slate-300 dark:border-slate-600 rounded bg-white dark:bg-slate-950 text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-teal-500 focus:outline-none">
            </div>
          </div>
        </div>

        <div class="space-y-4 min-h-[200px]">
          <div v-if="activeRules.length === 0" class="flex flex-col items-center justify-center py-16 text-slate-400 dark:text-slate-500 border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-xl bg-slate-50/50 dark:bg-slate-900/50">
            <div class="bg-white dark:bg-slate-800 p-4 rounded-full mb-3 shadow-sm">
              <svg class="w-8 h-8 text-teal-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"></path></svg>
            </div>
            <p class="font-medium">Nog geen filters ingesteld.</p>
          </div>

          <div v-for="(rule, index) in activeRules" :key="rule.uniqueId"
               :class="{'ring-2 ring-red-400': isRuleInvalid(rule)}"
               class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg shadow-sm group">

            <div class="flex flex-wrap justify-between items-center p-3 bg-slate-50 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-700 rounded-t-lg gap-3">
              <div class="flex items-center gap-3">
                <div class="flex bg-slate-200 dark:bg-slate-700 rounded-md p-0.5 text-[10px] font-bold">
                  <button
                      @click="rule.operator = 'include'"
                      :class="rule.operator === 'include' ? 'bg-white dark:bg-slate-600 text-teal-700 dark:text-teal-300 shadow-sm' : 'text-slate-500 hover:text-slate-700'"
                      class="px-2 py-1 rounded transition-all">
                    WEL
                  </button>
                  <button
                      @click="rule.operator = 'exclude'"
                      :class="rule.operator === 'exclude' ? 'bg-white dark:bg-slate-600 text-red-600 dark:text-red-400 shadow-sm' : 'text-slate-500 hover:text-slate-700'"
                      class="px-2 py-1 rounded transition-all">
                    NIET
                  </button>
                </div>

                <div class="h-4 w-px bg-slate-300 dark:bg-slate-600 mx-1"></div>

                <span class="text-slate-400 text-xs font-bold uppercase tracking-wider">{{ rule.category }}</span>
                <span class="font-bold text-slate-800 dark:text-slate-200">{{ rule.label }}</span>

                <span v-if="isRuleInvalid(rule)" class="ml-2 bg-red-100 text-red-600 text-[10px] font-bold px-2 py-1 rounded">
                                Ongeldig voor {{ targetType }}
                            </span>
              </div>

              <button @click="removeRule(index)" class="text-slate-400 hover:text-red-500 transition p-1.5 rounded-full hover:bg-red-50 dark:hover:bg-red-900/20">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
              </button>
            </div>

            <div class="p-4" :class="{'opacity-50 pointer-events-none': isRuleInvalid(rule)}">

              <div v-if="rule.inputType === 'multi-text'" class="space-y-2">
                <label class="text-xs text-slate-500 uppercase font-bold">Waarden (komma gescheiden)</label>
                <textarea v-model="rule.value" rows="1" class="w-full p-2 border border-slate-300 dark:border-slate-600 rounded dark:bg-slate-950 dark:text-white focus:ring-teal-500 focus:border-teal-500"></textarea>
              </div>

              <div v-if="rule.inputType === 'postcode-ranges'" class="space-y-2">
                <div class="text-xs text-slate-500 font-bold uppercase">Postcode Bereiken</div>
                <div v-for="(range, rIndex) in rule.ranges" :key="rIndex" class="flex items-center gap-3">
                  <input type="number" v-model="range.from" placeholder="Van" class="w-24 p-2 border border-slate-300 dark:border-slate-600 rounded dark:bg-slate-950 dark:text-white text-sm">
                  <span class="text-slate-400">-</span>
                  <input type="number" v-model="range.to" placeholder="Tot" class="w-24 p-2 border border-slate-300 dark:border-slate-600 rounded dark:bg-slate-950 dark:text-white text-sm">
                  <button @click="rule.ranges.splice(rIndex, 1)" class="text-red-400" v-if="rule.ranges.length > 1">&times;</button>
                </div>
                <button @click="rule.ranges.push({from:'', to:''})" class="text-xs text-teal-600 font-bold hover:underline">+ Bereik</button>
              </div>

              <div v-if="rule.inputType === 'checkbox-group'" class="space-y-2">
                <div class="flex flex-wrap gap-2">
                  <label v-for="opt in rule.options" :key="opt" class="flex items-center px-3 py-2 border border-slate-200 dark:border-slate-700 rounded cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800 transition select-none">
                    <input type="checkbox" :value="opt" v-model="rule.selected" class="w-4 h-4 text-teal-600 rounded border-gray-300 focus:ring-teal-500">
                    <span class="ml-2 text-sm text-slate-700 dark:text-slate-300">{{ opt }}</span>
                  </label>
                </div>
              </div>

              <div v-if="rule.inputType === 'lifecycle'" class="space-y-2">
                <div v-for="(item, i) in rule.pairs" :key="i" class="flex gap-2 items-center">
                  <select v-model="item.stage" class="p-2 border border-slate-300 dark:border-slate-600 rounded bg-white dark:bg-slate-950 dark:text-white text-sm">
                    <option value="">Lifecycle...</option>
                    <option>Lead</option><option>Customer</option>
                  </select>
                  <select v-model="item.segment" class="p-2 border border-slate-300 dark:border-slate-600 rounded bg-white dark:bg-slate-950 dark:text-white text-sm">
                    <option value="">Segment...</option>
                    <option>Enterprise</option><option>SME</option>
                  </select>
                  <button @click="rule.pairs.splice(i, 1)" class="text-red-400" v-if="rule.pairs.length > 1">&times;</button>
                </div>
                <button @click="rule.pairs.push({stage:'', segment:''})" class="text-xs text-teal-600 font-bold hover:underline">+ Combinatie</button>
              </div>

              <div v-if="rule.inputType === 'timeframe'" class="flex items-center gap-4 bg-amber-50 dark:bg-amber-900/10 p-3 rounded border border-amber-100 dark:border-amber-900/30">
                <div class="flex flex-col">
                  <label class="text-[10px] text-amber-800 dark:text-amber-500 uppercase font-bold">Uren</label>
                  <input type="number" v-model="rule.hours" class="w-20 p-1 border border-amber-200 rounded dark:bg-slate-900 dark:text-white dark:border-slate-600">
                </div>
                <div class="flex flex-col">
                  <label class="text-[10px] text-amber-800 dark:text-amber-500 uppercase font-bold">Dagen</label>
                  <input type="number" v-model="rule.days" class="w-20 p-1 border border-amber-200 rounded dark:bg-slate-900 dark:text-white dark:border-slate-600">
                </div>
                <div class="text-sm text-amber-800 dark:text-amber-500 pt-3">geleden</div>
              </div>

              <div v-if="rule.inputType === 'tagged-activity'" class="space-y-2">
                <div v-for="(tag, i) in rule.tags" :key="i" class="flex flex-wrap gap-2 items-start p-2 bg-slate-50 dark:bg-slate-800 rounded border border-slate-100 dark:border-slate-700">
                  <div class="relative flex-1 min-w-[150px]">
                    <input type="text" v-model="tag.name" @input="filterTags(tag)" @focus="tag.showDropdown = true" @blur="setTimeout(() => tag.showDropdown = false, 200)" placeholder="Tag naam..." class="w-full p-2 border border-slate-300 dark:border-slate-600 rounded text-sm dark:bg-slate-950 dark:text-white">
                    <div v-if="tag.showDropdown && tag.filteredList.length" class="absolute top-full left-0 w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-600 shadow-lg z-50 max-h-40 overflow-y-auto rounded mt-1">
                      <div v-for="suggestion in tag.filteredList" @click="tag.name = suggestion; tag.showDropdown = false" class="p-2 hover:bg-teal-50 dark:hover:bg-slate-700 cursor-pointer text-sm dark:text-slate-200">{{ suggestion }}</div>
                    </div>
                  </div>
                  <input type="number" v-model="tag.score" placeholder="Min Score" class="w-20 p-2 border border-slate-300 dark:border-slate-600 rounded text-sm dark:bg-slate-950 dark:text-white">
                  <button @click="rule.tags.splice(i, 1)" class="text-red-400 mt-2" v-if="rule.tags.length > 1">&times;</button>
                </div>
                <button @click="addTagRow(rule)" class="text-xs text-teal-600 font-bold hover:underline">+ Tag conditie</button>
              </div>

              <div v-if="rule.inputType === 'order-scoped'" class="bg-emerald-50 dark:bg-emerald-900/10 p-4 rounded border border-emerald-100 dark:border-emerald-900/30 space-y-3">
                <div class="flex gap-4">
                  <input type="number" v-model="rule.days" placeholder="Dagen" class="w-24 p-2 border border-emerald-200 dark:border-emerald-800 rounded text-sm dark:bg-slate-900 dark:text-white">
                  <span class="text-sm self-center text-emerald-800 dark:text-emerald-500">dagen geleden</span>
                </div>
                <div class="flex gap-4 border-t border-emerald-200 dark:border-emerald-800 pt-2">
                  <label class="flex items-center gap-2 text-sm text-emerald-900 dark:text-emerald-400"><input type="radio" v-model="rule.filterType" value="none" class="text-emerald-600"> Alle Orders</label>
                  <label class="flex items-center gap-2 text-sm text-emerald-900 dark:text-emerald-400"><input type="radio" v-model="rule.filterType" value="sku" class="text-emerald-600"> SKU</label>
                  <label class="flex items-center gap-2 text-sm text-emerald-900 dark:text-emerald-400"><input type="radio" v-model="rule.filterType" value="category" class="text-emerald-600"> Categorie</label>
                </div>
                <div v-if="rule.filterType !== 'none'" class="relative">
                  <input type="text" v-model="rule.searchValue" @input="filterOrderItems(rule)" @focus="rule.showDropdown = true" @blur="setTimeout(() => rule.showDropdown = false, 200)" placeholder="Zoek..." class="w-full p-2 border border-emerald-200 dark:border-emerald-800 rounded dark:bg-slate-900 dark:text-white text-sm">
                  <div v-if="rule.showDropdown && rule.filteredItems.length" class="absolute top-full left-0 w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-600 shadow-lg z-50 mt-1 rounded">
                    <div v-for="item in rule.filteredItems" @click="selectOrderItem(rule, item)" class="p-2 hover:bg-emerald-50 dark:hover:bg-slate-700 cursor-pointer text-sm dark:text-slate-200">{{ item }}</div>
                  </div>
                  <div class="flex flex-wrap gap-2 mt-2">
                                    <span v-for="(sel, sIdx) in rule.selectedItems" :key="sIdx" class="bg-emerald-100 dark:bg-emerald-900 text-emerald-800 dark:text-emerald-200 text-xs px-2 py-1 rounded flex items-center gap-1">
                                        {{ sel }} <button @click="rule.selectedItems.splice(sIdx, 1)">&times;</button>
                                    </span>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>

        <div class="relative">
          <button @click="toggleMenu" class="w-full py-4 border-2 border-dashed border-teal-300 dark:border-teal-700/50 text-teal-600 dark:text-teal-400 font-bold rounded-xl hover:bg-teal-50 dark:hover:bg-teal-900/20 transition flex justify-center items-center gap-2">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path></svg>
            Nieuw Filter Toevoegen
          </button>

          <div v-if="showMenu" class="absolute bottom-16 left-0 right-0 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-2xl rounded-lg max-h-[400px] overflow-y-auto z-50 grid grid-cols-1 md:grid-cols-3 gap-0 divide-x divide-slate-100 dark:divide-slate-700">
            <div v-for="(rules, category) in groupedRules" :key="category" class="p-4">
              <h3 class="text-xs font-bold text-teal-500 uppercase mb-3 border-b border-teal-100 dark:border-teal-900/50 pb-1">{{ category }}</h3>
              <div class="space-y-1">
                <button v-for="r in rules" @click="addRule(r)" class="w-full text-left text-sm px-3 py-2 hover:bg-slate-100 dark:hover:bg-slate-700 hover:text-teal-600 dark:hover:text-teal-400 rounded text-slate-600 dark:text-slate-300 transition truncate flex items-center gap-2">
                  <span class="w-1.5 h-1.5 rounded-full bg-slate-300 dark:bg-slate-600"></span> {{ r.label }}
                </button>
              </div>
            </div>
          </div>
        </div>

        <div class="p-4 bg-slate-800 dark:bg-black text-green-400 rounded-lg font-mono text-xs overflow-x-auto border border-slate-700">
          <div class="flex justify-between border-b border-slate-600 pb-2 mb-2">
            <span class="font-bold text-white">Payload Preview</span>
            <span class="text-slate-400">Target: {{ targetType }}</span>
          </div>
          <pre>{{ JSON.stringify({ name: listName, targetEntity: targetType, rules: activeRules }, null, 2) }}</pre>
        </div>
      </div>
    </div>

  </div>
</template>

<style scoped>
/* Custom styling for autocomplete if needed */
.autocomplete-results {
  @apply absolute w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-md shadow-lg max-h-40 overflow-y-auto z-50 mt-1;
}
</style>