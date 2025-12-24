<script setup>
import { formatCurrency, formatPercent } from '../../utils/formatters';
defineProps(['totals']);
</script>

<template>
  <div class="grid grid-cols-12 gap-6 h-48 flex-none">
    <div class="col-span-8 bg-white dark:bg-brand-900 rounded-lg shadow-sm border border-slate-200 dark:border-brand-800 p-4 flex gap-6">
      <div class="flex-1 flex flex-col">
        <label class="text-[11px] font-bold uppercase tracking-wide text-slate-500 mb-1">Interne Notities</label>
        <textarea class="w-full h-full resize-none p-2 text-sm border border-slate-200 rounded dark:bg-brand-800 dark:border-brand-600" placeholder="Typ notitie..."></textarea>
      </div>
      <div class="w-1/3 flex flex-col">
        <label class="text-[11px] font-bold uppercase tracking-wide text-slate-500 mb-1">Bestanden</label>
        <div class="flex-grow border-2 border-dashed border-slate-200 dark:border-brand-700 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:bg-slate-50 dark:hover:bg-brand-800 transition">
          <span class="text-xs text-slate-400">Sleep bestanden hier</span>
        </div>
      </div>
    </div>
    <div class="col-span-4 bg-white dark:bg-brand-900 rounded-lg shadow-sm border border-slate-200 dark:border-brand-800 p-5 flex flex-col justify-center">
      <div class="space-y-2">
        <div class="flex justify-between text-sm text-slate-600 dark:text-slate-300"><span>Subtotaal</span><span class="font-mono">{{ formatCurrency(totals.subtotal) }}</span></div>
        <div class="flex justify-between text-sm text-slate-600 dark:text-slate-300"><span>Transport</span><span class="font-mono">{{ formatCurrency(totals.transport) }}</span></div>
        <div class="flex justify-between items-center text-sm text-slate-600 dark:text-slate-300 pt-2 border-t border-slate-100 dark:border-brand-700">
          <div class="flex gap-3 text-xs text-slate-500 dark:text-slate-400">
            <span v-if="totals.vatBreakdown[6] > 0"><span class="font-medium text-slate-400">6%:</span> {{ formatCurrency(totals.vatBreakdown[6]) }}</span>
            <span v-if="totals.vatBreakdown[12] > 0"><span class="font-medium text-slate-400">12%:</span> {{ formatCurrency(totals.vatBreakdown[12]) }}</span>
            <span v-if="totals.vatBreakdown[21] > 0"><span class="font-medium text-slate-400">21%:</span> {{ formatCurrency(totals.vatBreakdown[21]) }}</span>
          </div>
          <div class="text-right flex flex-col"><span class="text-[10px] font-bold text-slate-400 uppercase">BTW Totaal</span><span class="font-mono font-medium">{{ formatCurrency(totals.totalVat) }}</span></div>
        </div>
        <div class="flex justify-between items-baseline pt-2 border-t-2 border-slate-100 dark:border-brand-700"><span class="text-lg font-bold text-slate-800 dark:text-white">Totaal</span><span class="text-2xl font-bold font-mono text-brand-700 dark:text-white">{{ formatCurrency(totals.grandTotal) }}</span></div>
      </div>
    </div>
  </div>
</template>