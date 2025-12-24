<script setup>
import { ref, reactive, computed } from 'vue';
import OrderHeader from '../components/order/OrderHeader.vue';
import OrderTable from '../components/order/OrderTable.vue';
import OrderFooter from '../components/order/OrderFooter.vue';
import ConfirmModal from '../components/common/ConfirmModal.vue';
// NIEUW: Importeer de PriceListModal
import PriceListModal from '../components/common/PriceListModal.vue';

const orderData = reactive({
  id: 'ORD-2025-001',
  customer: '10012 - De Grote Handels BV',
  status: { delivery: 'Gedeeltelijk', invoice: 'Open' },
  lines: [
    { id: 10, code: 'PROD-AX45', desc: 'Luxe Bureaustoel Zwart', stock: 25, qty: 5, unit: 'Stk', priceList: 'Standaard 2025', cost: 80.00, price: 125.00, discount: 10, vat: 21, created: { user: 'System', date: '15/12/2025' }, modified: { user: 'Jan Jansen', date: '16/12/2025' } },
    { id: 20, code: 'SERV-001', desc: 'Montage op locatie', stock: 0, qty: 1, unit: 'Uur', priceList: 'Diensten', cost: 45.00, price: 65.00, discount: 0, vat: 6, created: { user: 'System', date: '15/12/2025' }, modified: { user: 'Jan Jansen', date: '16/12/2025' } }
  ]
});

// NIEUW: Functie om een nieuwe regel toe te voegen
const handleAddLine = () => {
  // Bepaal het nieuwe ID (hoogste ID + 10, of 10 als lijst leeg is)
  const maxId = orderData.lines.length > 0
      ? Math.max(...orderData.lines.map(l => l.id))
      : 0;

  const newLine = {
    id: maxId + 10,
    code: '',
    desc: '', // Leeg, zodat gebruiker kan typen
    stock: 0,
    qty: 1,
    unit: 'Stk',
    priceList: 'Standaard',
    cost: 0,
    price: 0,
    discount: 0,
    vat: 21,
    created: {
      user: 'J. Jansen', // Hardcoded voor nu, later uit je auth halen
      date: new Date().toLocaleDateString('nl-BE')
    },
    modified: { user: '-', date: '-' }
  };

  orderData.lines.push(newLine);
};

const totals = computed(() => {
  let subtotal = 0;
  let vat6 = 0, vat12 = 0, vat21 = 0;
  orderData.lines.forEach(line => {
    const netPrice = line.price * (1 - line.discount / 100);
    const lineTotal = netPrice * line.qty;
    subtotal += lineTotal;
    if(line.vat === 6) vat6 += lineTotal * 0.06;
    if(line.vat === 12) vat12 += lineTotal * 0.12;
    if(line.vat === 21) vat21 += lineTotal * 0.21;
  });
  const transport = 50.00;
  const totalVat = vat6 + vat12 + vat21;
  return { subtotal, transport, vatBreakdown: { 6: vat6, 12: vat12, 21: vat21 }, totalVat, grandTotal: subtotal + transport + totalVat };
});

const showCancelModal = ref(false);
const handleCancel = () => { console.log("Order geannuleerd"); showCancelModal.value = false; };
</script>

<template>
  <div class="flex flex-col h-full bg-slate-50 dark:bg-brand-950 transition-colors duration-300">
    <OrderHeader :order="orderData" @cancel="showCancelModal = true" @save="console.log('Opslaan...')" />

    <div class="flex flex-col flex-grow p-6 gap-6 overflow-hidden">
      <OrderTable :lines="orderData.lines" @add-line="handleAddLine" />
      <OrderFooter :totals="totals" />
    </div>

    <ConfirmModal v-if="showCancelModal" title="Order Annuleren?" message="Weet u zeker dat u dit order wilt annuleren?" confirm-text="Ja, Annuleren" type="danger" @close="showCancelModal = false" @confirm="handleCancel" />
  </div>
</template>