<script setup>
import { useTheme } from '../../composables/useTheme';

const { isDark, toggleTheme } = useTheme();

const navItems = [
  { label: 'Dashboard', submenu: ['Overzicht', 'Statistieken'] },
  { label: 'Relaties', submenu: ['Klanten', 'Leveranciers'] },

  // AANGEPAST: 'Q&A' toegevoegd aan het submenu
  { label: 'Content', submenu: ['Nieuws', 'Downloads', 'Q&A'] },

  { label: 'Artikels', submenu: ['Overzicht', 'Voorraad'] },
  { label: 'Verkoop', active: true, submenu: ['Orders', 'Offertes'] },
  { label: 'Inkoop', submenu: ['Bestellingen', 'Ontvangst'] },
  { label: 'Rapportering', submenu: ['Omzet', 'Marges'] }
];
</script>

<template>
  <nav class="bg-white dark:bg-brand-800 border-b border-slate-200 dark:border-brand-700 flex-none h-14 flex items-center px-6 justify-between z-50 shadow-subtle relative transition-colors duration-300">

    <div class="flex items-center space-x-8 h-full">
      <div class="flex items-center gap-2 mr-4 cursor-pointer">
        <div class="w-8 h-8 rounded-lg bg-brand-600 dark:bg-brand-500 text-white flex items-center justify-center font-bold text-lg shadow-sm">E</div>
        <span class="font-bold text-lg text-slate-700 dark:text-slate-200 tracking-tight">ERPSYS</span>
      </div>
      <div class="flex space-x-1 h-full">
        <div v-for="(item, index) in navItems" :key="index" class="header-menu-item group relative h-full flex items-center">
          <button class="px-3 py-2 text-sm rounded-md transition-colors duration-200 cursor-pointer" :class="[item.active ? 'font-bold text-brand-700 dark:text-white bg-slate-50 dark:bg-brand-700/50' : 'font-medium text-slate-500 dark:text-slate-400 group-hover:text-brand-600 dark:group-hover:text-white hover:bg-slate-50 dark:hover:bg-brand-700/30']">{{ item.label }}</button>
          <div class="hidden group-hover:block absolute top-full left-0 z-50 pt-2 animate-[softFade_0.15s_ease-out]">
            <div class="bg-white dark:bg-brand-800 rounded-lg shadow-floating border border-slate-100 dark:border-brand-600 py-1 min-w-[180px]">
              <a v-for="sub in item.submenu" :key="sub" href="#" class="block px-4 py-2 text-xs text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-brand-700 hover:text-brand-600 transition-colors">{{ sub }}</a>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="flex items-center space-x-5">

      <button
          @click="toggleTheme"
          class="text-slate-400 hover:text-brand-600 dark:text-slate-400 dark:hover:text-brand-200 transition p-1.5 rounded-full hover:bg-slate-50 dark:hover:bg-brand-700/50 cursor-pointer"
          :title="isDark ? 'Schakel naar licht' : 'Schakel naar donker'"
      >
        <svg v-if="isDark" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"></path>
        </svg>
        <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"></path>
        </svg>
      </button>

      <button class="text-slate-400 hover:text-brand-600 transition relative cursor-pointer">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"></path></svg>
        <span class="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-500 ring-2 ring-white dark:ring-brand-800"></span>
      </button>

      <div class="h-9 w-9 rounded-full bg-brand-100 dark:bg-brand-700 text-brand-600 dark:text-brand-200 flex items-center justify-center font-bold text-sm border border-brand-200 dark:border-brand-600 cursor-pointer hover:shadow-md transition">JJ</div>
    </div>
  </nav>
</template>

<style>
@keyframes softFade { from { opacity: 0; transform: translateY(-4px); } to { opacity: 1; transform: translateY(0); } }
</style>