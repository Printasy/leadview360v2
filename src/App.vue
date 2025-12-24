<script setup>
import TheNavbar from './components/layout/TheNavbar.vue';
import TheSidebar from './components/layout/TheSidebar.vue';
// VERWIJDER: import OrderView from './views/OrderView.vue';
</script>

<template>
  <div class="h-screen flex flex-col overflow-hidden bg-slate-50 dark:bg-brand-950 transition-colors duration-300">
    <TheNavbar />

    <div class="flex flex-grow overflow-hidden">
      <TheSidebar />

      <main class="flex-grow flex flex-col h-full bg-slate-50/50 dark:bg-brand-950 overflow-hidden relative transition-colors duration-300">
        <router-view />
      </main>
    </div>
  </div>
</template>