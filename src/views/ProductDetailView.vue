
<template>
  <main class="flex-1 overflow-y-auto p-6 bg-gray-50 text-sm">
    <div class="flex justify-between items-center mb-6 sticky top-0 bg-gray-50 py-2 z-10 border-b border-gray-200">
      <div class="flex gap-4 items-center">
        <div class="relative group">
          <div v-if="!product.image_url" class="w-16 h-16 bg-white border border-gray-300 rounded flex flex-col items-center justify-center text-gray-400 text-[10px] uppercase font-bold text-center cursor-pointer hover:border-blue-400 transition-all">
            <label class="cursor-pointer flex flex-col items-center">
              <i class="fas fa-camera text-lg mb-1"></i> Foto
              <input type="file" class="hidden" @change="handleImageUpload" accept="image/*">
            </label>
          </div>
          <div v-else class="relative w-16 h-16">
            <img :src="product.image_url" class="w-16 h-16 object-cover rounded border border-gray-300" />
            <button @click="removeImage" class="absolute -top-2 -right-2 text-red-500 bg-white rounded-full shadow-sm hover:text-red-700">
              <i class="fas fa-trash-alt text-sm"></i>
            </button>
          </div>
        </div>
        <div>
          <h1 class="text-2xl font-bold text-gray-800">{{ product.description || 'Nieuw Product' }}</h1>
          <p class="text-sm text-gray-500 italic">Productbeheer Detail</p>
        </div>
      </div>
      <div class="flex gap-3">
        <button @click="showHistoryModal = true" type="button" class="px-4 py-2 bg-blue-50 text-blue-700 border border-blue-200 rounded text-sm font-bold hover:bg-blue-100 uppercase tracking-tighter transition-all">
          <i class="fas fa-history mr-2"></i>Transactiegeschiedenis
        </button>
        <button type="button" class="px-4 py-2 bg-white border border-gray-300 rounded text-sm font-semibold hover:bg-gray-100 uppercase tracking-tighter">
          <i class="fas fa-globe mr-2"></i>Webcontent
        </button>
        <button @click="duplicateProduct" type="button" class="px-4 py-2 bg-white border border-gray-300 rounded text-sm font-semibold hover:bg-gray-100 uppercase tracking-tighter">
          <i class="fas fa-copy mr-2 text-gray-500"></i>Dupliceren
        </button>
        <button @click="cancelEdit" type="button" class="px-4 py-2 bg-white border border-red-300 text-red-600 rounded text-sm font-semibold hover:bg-red-50 uppercase tracking-tighter">
          <i class="fas fa-times mr-2"></i>Annuleren
        </button>
        <button @click="saveProduct" type="button" class="px-4 py-2 bg-blue-600 text-white rounded text-sm font-semibold hover:bg-blue-700 shadow-sm transition-all">
          Opslaan
        </button>
      </div>
    </div>

    <div class="grid grid-cols-12 gap-6 pb-20">
      <div class="col-span-12 lg:col-span-8 space-y-6">

        <div class="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 class="text-lg font-semibold mb-4 border-b pb-2">Basis Informatie</h3>
          <div class="grid grid-cols-6 gap-4">
            <div class="col-span-2">
              <label class="block text-xs font-bold uppercase text-gray-500">SKU (Artikelnummer)</label>
              <input v-model="product.sku" type="text" class="w-full mt-1 p-2 border rounded font-mono outline-none focus:ring-1 focus:ring-blue-500 shadow-inner">
            </div>
            <div class="col-span-1">
              <label class="block text-xs font-bold uppercase text-gray-500">Status</label>
              <select v-model="product.status" class="w-full mt-1 p-2 border rounded text-xs bg-white outline-none">
                <option value="active">Actief</option>
                <option value="draft">Concept</option>
              </select>
            </div>
            <div class="col-span-3 flex gap-2">
              <div class="flex-1">
                <label class="block text-[10px] font-bold uppercase text-gray-400 font-mono">Actief Van</label>
                <input v-model="product.active_from" type="date" class="w-full mt-1 p-2 border rounded text-xs">
              </div>
              <div class="flex-1">
                <label class="block text-[10px] font-bold uppercase text-gray-400 font-mono">Actief Tot</label>
                <input v-model="product.active_to" type="date" class="w-full mt-1 p-2 border rounded text-xs">
              </div>
            </div>
            <div class="col-span-6 border-t pt-4">
              <label class="block text-xs font-bold uppercase text-gray-500 mb-2">Barcodes & QR Codes</label>
              <div v-for="(bc, index) in product.barcodes" :key="index" class="flex gap-2 mb-2">
                <select v-model="bc.type" class="p-2 border rounded text-xs bg-gray-50"><option value="EAN13">EAN-13</option><option value="QR">QR-Code</option></select>
                <input v-model="bc.value" type="text" class="flex-1 p-2 border rounded text-xs font-mono shadow-inner" placeholder="Waarde...">
                <button @click="removeBarcode(index)" class="px-3 text-red-500 hover:bg-red-50 rounded transition-colors"><i class="fas fa-trash-alt"></i></button>
              </div>
              <button @click="addBarcode" type="button" class="text-xs font-bold text-blue-600 uppercase hover:underline">+ Voeg barcode toe</button>
            </div>
            <div class="col-span-6">
              <label class="block text-xs font-bold uppercase text-gray-500">Omschrijving</label>
              <input v-model="product.description" type="text" class="w-full mt-1 p-2 border rounded shadow-inner">
            </div>
            <div class="col-span-6">
              <label class="block text-xs font-bold uppercase text-gray-500">Extra beschrijving</label>
              <textarea v-model="product.extra_description" class="w-full mt-1 p-2 border rounded h-16 text-xs shadow-inner"></textarea>
            </div>
          </div>
        </div>

        <div class="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 class="text-lg font-semibold mb-4 border-b pb-2 text-blue-800">Commercieel</h3>
          <div class="grid grid-cols-4 gap-4">
            <div class="col-span-2 flex gap-2">
              <div class="flex-1">
                <label class="block text-xs font-bold uppercase text-gray-500">Verkoopprijs</label>
                <div class="relative mt-1">
                  <span class="absolute left-2 top-2 text-gray-400">€</span>
                  <input v-model="product.selling_price" type="number" step="0.01" class="w-full p-2 pl-6 border border-blue-200 bg-blue-50/50 rounded font-bold text-blue-600 text-right shadow-inner">
                </div>
              </div>
              <div class="w-24">
                <label class="block text-[10px] font-bold uppercase text-gray-400">Eenheid</label>
                <input v-model="product.selling_unit" type="text" class="w-full mt-1 p-2 border rounded text-xs" placeholder="bv. PCE">
              </div>
            </div>
            <div class="col-span-2 flex gap-2">
              <div class="flex-1">
                <label class="block text-xs font-bold uppercase text-gray-500">Kostprijs</label>
                <div class="relative mt-1">
                  <span class="absolute left-2 top-2 text-gray-400 text-[10px]">€</span>
                  <input v-model="product.buying_cost" type="number" step="0.01" class="w-full p-2 pl-6 border border-gray-300 rounded font-mono text-right shadow-inner">
                </div>
              </div>
              <div class="w-24">
                <label class="block text-[10px] font-bold uppercase text-gray-400">Eenheid</label>
                <input v-model="product.buying_unit" type="text" class="w-full mt-1 p-2 border rounded text-xs" placeholder="bv. PCE">
              </div>
            </div>
            <div>
              <label class="block text-xs font-bold uppercase text-gray-500 font-mono">Bestelhoeveelheid</label>
              <input v-model="product.min_quantity" type="number" class="w-full mt-1 p-2 border rounded font-mono text-right shadow-inner">
            </div>
            <div>
              <label class="block text-xs font-bold uppercase text-gray-500 font-mono">Step (Stap)</label>
              <input v-model="product.step" type="number" class="w-full mt-1 p-2 border rounded font-mono text-right shadow-inner">
            </div>
            <div class="col-span-2">
              <label class="block text-xs font-bold uppercase text-gray-500">Primaire Categorie</label>
              <input v-model="product.primary_category" type="text" class="w-full mt-1 p-2 border rounded text-xs shadow-inner">
            </div>
            <div class="col-span-4">
              <label class="block text-xs font-bold uppercase text-gray-500 text-green-700">Actuele Bruto Marge</label>
              <div class="mt-1 p-2 bg-green-50 border border-green-100 rounded flex justify-between items-center">
                <span class="text-xs font-bold text-green-800 italic">Berekend:</span>
                <span class="font-mono font-black text-green-700">{{ calculateMargin }} %</span>
              </div>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div class="p-4 bg-gray-50 border-b flex justify-between items-center text-gray-600 italic">
            <h3 class="text-sm font-bold uppercase tracking-wider">Inkoop / Leveranciers Matrix</h3>
            <button @click="addSupplier" type="button" class="text-xs bg-gray-800 text-white px-3 py-1 rounded font-bold uppercase hover:bg-black transition-all">+ Leverancier</button>
          </div>
          <table class="w-full text-left text-[11px] border-collapse">
            <thead>
            <tr class="bg-gray-100 uppercase text-gray-500 font-bold border-b">
              <th class="p-2 border-r text-center w-8">Def.</th>
              <th class="p-2 border-r w-32">Leverancier</th>
              <th class="p-2 border-r">Sku/omschrijving leverancier</th>
              <th class="p-2 border-r text-center w-12">Per #</th>
              <th class="p-2 border-r w-14">Eenheid</th>
              <th class="p-2 border-r w-24">Inkoopprijs</th>
              <th class="p-2 border-r w-12 text-center">Munt</th>
              <th class="p-2 border-r w-20">€ Bedrag</th>
              <th class="p-2 border-r text-center w-24">BTW Rule</th>
              <th class="p-2 text-center w-10 text-red-500"><i class="fas fa-trash-alt"></i></th>
            </tr>
            </thead>
            <tbody>
            <tr v-for="(sup, index) in product.suppliers" :key="index" class="border-b hover:bg-gray-50">
              <td class="p-2 border-r text-center"><input v-model="product.default_supplier_index" :value="index" type="radio" name="def_sup"></td>
              <td class="p-2 border-r"><input v-model="sup.name" type="text" class="w-full bg-transparent outline-none" placeholder="Zoeken..."></td>
              <td class="p-2 border-r"><input v-model="sup.supplier_sku" type="text" class="w-full bg-transparent outline-none font-mono" placeholder="Art. nr."></td>
              <td class="p-2 border-r"><input v-model="sup.price_per_qty" type="number" class="w-full border-none p-1 rounded font-mono text-center focus:ring-1 focus:ring-blue-300"></td>
              <td class="p-2 border-r"><input v-model="sup.buying_unit_type" type="text" class="w-full border-none p-1 rounded text-center uppercase focus:ring-1 focus:ring-blue-300" placeholder="PCE"></td>
              <td class="p-2 border-r"><input v-model="sup.buying_price" type="number" step="0.01" class="w-full border-none p-1 rounded font-mono text-right focus:ring-1 focus:ring-blue-300"></td>
              <td class="p-2 border-r text-center">
                <select v-model="sup.currency" class="bg-transparent text-[10px] w-full border-none focus:ring-0">
                  <option v-for="rate in currencies" :key="rate" :value="rate">{{ rate }}</option>
                </select>
              </td>
              <td class="p-2 border-r bg-gray-50/50 font-mono text-right text-gray-500">€ {{ calculateEuroPrice(sup) }}</td>
              <td class="p-2 border-r text-center">
                <select v-model="sup.vat_rule_id" class="w-full bg-transparent border-none text-[10px] focus:ring-0">
                  <option v-for="rule in vatRules" :key="rule.id" :value="rule.id">{{ rule.label }}</option>
                </select>
              </td>
              <td @click="removeSupplier(index)" class="p-2 text-center cursor-pointer group">
                <i class="fas fa-trash-alt text-red-400 group-hover:text-red-600 transition-colors"></i>
              </td>
            </tr>
            </tbody>
          </table>
        </div>

        <div class="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 class="text-sm font-bold uppercase text-gray-500 mb-4 border-b pb-2 italic text-blue-700">Audit Notities</h3>
          <div class="space-y-4">
            <div class="flex gap-2">
              <input v-model="newNoteText" @keyup.enter="addNote" type="text" class="flex-1 p-2 border rounded text-xs outline-none focus:ring-1 focus:ring-blue-500 shadow-inner" placeholder="Nieuwe notitie toevoegen...">
              <button @click="addNote" type="button" class="bg-gray-800 text-white px-5 py-1 rounded text-xs font-bold uppercase hover:bg-black transition-colors">Plaatsen</button>
            </div>
            <div class="space-y-2 max-h-40 overflow-y-auto border-l-2 border-gray-100 pl-4">
              <div v-for="(note, nIdx) in product.notes" :key="nIdx" class="p-2 bg-gray-50 border rounded-r">
                <div class="flex justify-between text-[10px] font-bold text-gray-400 uppercase mb-1">
                  <span>{{ note.creator }}</span>
                  <span>{{ note.timestamp }}</span>
                </div>
                <p class="text-xs text-gray-700">{{ note.text }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="col-span-12 lg:col-span-4 space-y-6">

        <div class="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 class="text-lg font-semibold mb-4 border-b pb-2 text-blue-800">Voorraad</h3>

          <div class="grid grid-cols-3 gap-2 mb-6 text-center">
            <div class="bg-blue-50 p-2 rounded border border-blue-100">
              <label class="block text-[9px] font-bold uppercase text-blue-400 mb-1">Actueel</label>
              <span class="text-2xl font-black text-blue-700 font-mono leading-none">{{ totalStock.actual }}</span>
            </div>
            <div class="bg-orange-50 p-2 rounded border border-orange-100">
              <label class="block text-[9px] font-bold uppercase text-orange-400 mb-1">Inkomend</label>
              <span class="text-2xl font-black text-orange-700 font-mono leading-none">{{ totalStock.incoming }}</span>
            </div>
            <div class="bg-gray-50 p-2 rounded border border-gray-200">
              <label class="block text-[9px] font-bold uppercase text-gray-400 mb-1">Uitgaand</label>
              <span class="text-2xl font-black text-gray-600 font-mono leading-none">{{ totalStock.outgoing }}</span>
            </div>
          </div>

          <div class="overflow-x-auto">
            <table class="w-full text-[10px] text-left border-collapse">
              <thead>
              <tr class="bg-gray-50 uppercase text-gray-400 font-bold border-b">
                <th class="py-1 px-2 border-r">Magazijn</th>
                <th class="py-1 px-2 border-r">Locatie</th>
                <th class="py-1 px-2 text-center">Aantal</th>
                <th class="py-1 px-2 text-center text-orange-400">In</th>
                <th class="py-1 px-2 text-center text-gray-400">Uit</th>
              </tr>
              </thead>
              <tbody class="divide-y divide-gray-100">
              <tr v-for="wh in product.warehouseStock" :key="wh.id" class="hover:bg-gray-50 transition-colors">
                <td class="py-1.5 px-2 border-r font-bold">{{ wh.name }}</td>
                <td class="py-1.5 px-2 border-r italic text-gray-400">{{ wh.location }}</td>
                <td class="py-1.5 px-2 border-r text-center font-mono font-bold">{{ wh.actual }}</td>
                <td class="py-1.5 px-2 border-r text-center font-mono text-orange-600">{{ wh.incoming }}</td>
                <td class="py-1.5 px-2 text-center font-mono text-gray-500">{{ wh.outgoing }}</td>
              </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div class="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 class="text-lg font-semibold mb-4 border-b pb-2">Product Kenmerken</h3>
          <div class="grid grid-cols-2 gap-y-3">
            <label v-for="(val, key) in product.flags" :key="key" class="flex items-center cursor-pointer group">
              <input v-model="product.flags[key]" type="checkbox" class="h-4 w-4 text-blue-600 rounded border-gray-300">
              <span class="ml-2 text-xs text-gray-700 group-hover:text-blue-600 capitalize tracking-tight">{{ key.replace('_', ' ') }}</span>
            </label>
          </div>
        </div>

        <div class="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 class="text-lg font-semibold mb-4 border-b pb-2 text-blue-800">Logistiek, Douane & Financieel</h3>
          <div class="space-y-4 text-xs">
            <div class="grid grid-cols-3 gap-2">
              <div class="col-span-3">
                <label class="block font-bold uppercase text-gray-400 text-[10px] font-mono">Nettogewicht (kg)</label>
                <input v-model="product.net_weight" type="number" step="0.001" class="w-full mt-1 p-2 border rounded font-mono shadow-inner">
              </div>
              <div v-for="dim in ['Lengte', 'Breedte', 'Hoogte']" :key="dim">
                <label class="block font-bold uppercase text-gray-400 text-[10px] font-mono">{{ dim }} (mm)</label>
                <input v-model="product['product_' + dim.toLowerCase().replace('é','e')]" type="number" class="w-full mt-1 p-2 border rounded font-mono shadow-inner">
              </div>
            </div>
            <div class="border-t pt-3 space-y-3">
              <div>
                <label class="block font-bold uppercase text-gray-400 text-[10px] font-mono">HS Code (Tariefcode)</label>
                <input v-model="product.tariff_rules" type="text" class="w-full mt-1 p-2 border rounded font-mono shadow-inner" placeholder="Bv. 85.17.12.00">
              </div>
              <div>
                <label class="block font-bold uppercase text-gray-400 text-[10px] font-mono">Land van Oorsprong</label>
                <input v-model="product.country_of_origin" type="text" class="w-full mt-1 p-2 border rounded shadow-inner" placeholder="Bv. BE">
              </div>
            </div>
            <div class="border-t pt-3 space-y-3">
              <div>
                <label class="block font-bold uppercase text-gray-500 text-[10px]">Margeregels</label>
                <select v-model="product.margin_rule_id" class="w-full mt-1 p-2 border rounded bg-white font-bold text-orange-600 outline-none">
                  <option value="">Geen restrictie</option>
                  <option v-for="m in marginRules" :key="m.id" :value="m.id">{{ m.label }} ({{ m.value }}%)</option>
                </select>
              </div>
              <div>
                <label class="block font-bold uppercase text-blue-400 text-[10px]">Boekhoudregels</label>
                <div class="flex gap-1">
                  <select v-model="product.accounting_rule_id" class="flex-1 p-2 border rounded bg-white outline-none">
                    <option v-for="rule in accountingRules" :key="rule.id" :value="rule.id">{{ rule.title }}</option>
                  </select>
                  <button @click="showNewRuleModal = true" type="button" class="px-2 bg-gray-100 border rounded hover:bg-gray-200 transition-colors"><i class="fas fa-plus"></i></button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div class="flex justify-between items-center border-b pb-2 mb-3">
            <h3 class="text-sm font-bold uppercase text-gray-600 tracking-widest">Gekoppelde Producten</h3>
            <button @click="showAutoAddModal = true" type="button" class="text-[10px] font-bold text-blue-600 uppercase border border-blue-200 px-3 py-1 rounded bg-blue-50 hover:bg-blue-100 transition-colors">+ Koppelen</button>
          </div>
          <div class="space-y-3">
            <div v-for="(ap, index) in product.auto_add_items" :key="index" class="text-xs border p-3 rounded-md relative group bg-gray-50 transition-all hover:border-blue-200">
              <div class="flex flex-col gap-1 text-[11px]">
                <div class="flex justify-between items-start">
                  <span class="font-bold text-gray-800 font-mono">{{ ap.sku }}</span>
                  <div class="flex items-center gap-1">
                    <span v-if="ap.required" class="text-[9px] bg-red-100 text-red-600 px-1 rounded font-bold uppercase">Verplicht</span>
                    <span v-else class="text-[9px] bg-gray-200 text-gray-600 px-1 rounded font-bold uppercase">Optioneel</span>
                    <span class="bg-gray-200 px-1.5 rounded font-black font-mono">x {{ ap.qty }}</span>
                  </div>
                </div>
                <div class="text-gray-500 italic">{{ ap.name }}</div>
                <div class="flex justify-between mt-2 pt-2 border-t border-gray-200 font-bold">
                  <span class="text-blue-600 font-black">{{ ap.price_method === 'included' ? 'Inbegrepen' : '€ ' + ap.price }}</span>
                </div>
              </div>
              <button @click="removeAutoAdd(index)" class="absolute -top-1 -right-1 text-red-400 hover:text-red-600 opacity-0 group-hover:opacity-100 transition-opacity">
                <i class="fas fa-trash-alt text-sm"></i>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div v-if="showHistoryModal" class="fixed inset-0 bg-black/60 flex items-center justify-center z-[200] p-4 backdrop-blur-sm">
      <div class="bg-white rounded-lg shadow-2xl w-full max-w-5xl h-[80vh] flex flex-col overflow-hidden">
        <div class="p-4 bg-gray-50 border-b flex justify-between items-center">
          <h3 class="font-bold text-lg text-slate-700 uppercase tracking-tight"><i class="fas fa-exchange-alt mr-2 text-blue-500"></i>Transactiegeschiedenis</h3>
          <div class="flex items-center gap-4">
            <select v-model="historyFilter" class="p-1.5 border rounded text-xs font-bold uppercase bg-white outline-none">
              <option value="1day">Vandaag</option>
              <option value="1week">Afgelopen Week</option>
              <option value="1month">Afgelopen Maand</option>
              <option value="1year">Afgelopen Jaar</option>
              <option value="ytd">Sinds begin dit jaar</option>
              <option value="custom">Van datum tot datum...</option>
            </select>
            <button @click="showHistoryModal = false" class="text-gray-400 hover:text-red-500 text-xl transition-colors"><i class="fas fa-times"></i></button>
          </div>
        </div>
        <div class="flex-1 overflow-auto p-4 font-mono">
          <table class="w-full text-left text-xs border-collapse">
            <thead class="sticky top-0 bg-white shadow-sm z-10">
            <tr class="bg-slate-100 uppercase text-gray-500 font-bold border-b">
              <th class="p-3">Datum</th>
              <th class="p-3">Type</th>
              <th class="p-3 text-right">Aantal</th>
              <th class="p-3 text-right font-mono text-[10px]">Stuksprijs</th>
              <th class="p-3 text-right text-blue-700 font-mono text-[10px]">Inkooptotaal</th>
              <th class="p-3 text-right text-green-700 font-mono text-[10px]">Verkooptotaal</th>
            </tr>
            </thead>
            <tbody class="divide-y divide-gray-100 font-mono">
            <tr v-for="h in transactionHistory" :key="h.id" class="hover:bg-gray-50">
              <td class="p-3 text-gray-400 italic">{{ h.date }}</td>
              <td class="p-3 font-bold uppercase text-[9px] tracking-tight text-slate-900">{{ h.type === 'purchase' ? 'Inkoop' : 'Verkoop' }}</td>
              <td class="p-3 text-right">{{ h.qty }}</td>
              <td class="p-3 text-right">€ {{ h.unit_price.toFixed(2) }}</td>
              <td class="p-3 text-right bg-blue-50/20 font-black">{{ h.type === 'purchase' ? '€ ' + (h.qty * h.unit_price).toFixed(2) : '-' }}</td>
              <td class="p-3 text-right bg-green-50/20 font-black">{{ h.type === 'sale' ? '€ ' + (h.qty * h.unit_price).toFixed(2) : '-' }}</td>
            </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <div v-if="showAutoAddModal" class="fixed inset-0 bg-black/50 flex items-center justify-center z-[250] p-4 backdrop-blur-sm">
      <div class="bg-white rounded-lg shadow-xl w-full max-w-lg overflow-hidden text-xs">
        <div class="p-4 border-b flex justify-between items-center bg-gray-50">
          <h3 class="font-bold uppercase text-gray-600 tracking-widest">Product Koppelen</h3>
          <button @click="showAutoAddModal = false" class="text-gray-400 hover:text-red-500"><i class="fas fa-times"></i></button>
        </div>
        <div class="p-6 space-y-5 text-sm">
          <div>
            <label class="block text-xs font-bold uppercase text-gray-500 mb-1">Zoek op Artikelnummer of Omschrijving</label>
            <input v-model="tempAutoAdd.query" type="text" class="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 outline-none shadow-inner" placeholder="bv. BAT-100">
          </div>
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-xs font-bold uppercase text-gray-500 mb-1">Aantal</label>
              <input v-model="tempAutoAdd.qty" type="number" class="w-full p-2 border rounded font-mono shadow-inner">
            </div>
            <div>
              <label class="block text-xs font-bold uppercase text-gray-500 mb-1">Status</label>
              <select v-model="tempAutoAdd.required" class="w-full p-2 border rounded bg-white font-bold uppercase text-[10px] outline-none shadow-inner">
                <option :value="true">Verplicht</option>
                <option :value="false">Optioneel</option>
              </select>
            </div>
          </div>
          <div>
            <label class="block text-xs font-bold uppercase text-gray-500 mb-1">Prijsmethode</label>
            <select v-model="tempAutoAdd.price_method" class="w-full p-2 border rounded bg-white font-bold uppercase text-[10px] outline-none shadow-inner">
              <option value="included">Inbegrepen in hoofdprijs</option>
              <option value="separate">Apart op order tonen</option>
            </select>
          </div>
        </div>
        <div class="p-4 border-t bg-gray-50 flex justify-end gap-2">
          <button @click="showAutoAddModal = false" type="button" class="px-5 py-2 font-bold uppercase text-gray-500 hover:text-gray-800 transition-colors">Annuleren</button>
          <button @click="confirmAutoAdd" type="button" class="px-5 py-2 font-bold uppercase bg-blue-600 text-white rounded shadow transition-all hover:bg-blue-700">Bevestigen</button>
        </div>
      </div>
    </div>
  </main>
</template>

<script setup>
import { reactive, ref, computed } from 'vue';

// UI Modals state
const showNewRuleModal = ref(false);
const showAutoAddModal = ref(false);
const showHistoryModal = ref(false);
const historyFilter = ref('1month');
const newNoteText = ref('');

// Master Data
const currencies = ['EUR', 'USD', 'GBP', 'CHF'];
const vatRules = [
  { id: 1, label: 'BTW 21%' },
  { id: 2, label: 'BTW 6%' },
  { id: 3, label: 'Export (0%)' }
];
const marginRules = [
  { id: 1, label: 'Strict', value: 35 },
  { id: 2, label: 'Standaard', value: 15 }
];
const accountingRules = ref([{ id: 1, title: 'Handelsgoederen BE 21%' }]);

const product = reactive({
  sku: '', description: '', extra_description: '', image_url: null,
  status: 'active', active_from: '', active_to: '',
  barcodes: [{ type: 'EAN13', value: '' }],
  accounting_rule_id: 1, margin_rule_id: '',
  selling_price: 0, selling_unit: 'PCE',
  buying_cost: 0, buying_unit: 'PCE', buying_currency: 'EUR',
  min_quantity: 1, step: 1, discounting_rules: 15,
  net_weight: 0, product_lengte: 0, product_breedte: 0, product_hoogte: 0,
  tariff_rules: '', country_of_origin: '',
  flags: { sell: true, purchase: true, stock: false, splittable: false, orderbased: false, webshop: false, serial_number: false, expiration_date: false },
  suppliers: [],
  auto_add_items: [],
  warehouseStock: [
    { id: 1, name: 'Hoofdmagazijn', location: 'A-12-01', actual: 450, incoming: 120, outgoing: 80 },
    { id: 2, name: 'Depot Oost', location: 'B-04-10', actual: 12, incoming: 0, outgoing: 5 },
    { id: 3, name: 'Technisch Centrum', location: 'KAB-01', actual: 3, incoming: 5, outgoing: 0 }
  ],
  notes: [],
  default_supplier_index: 0
});

// NIEUW: Voorraad berekeningen
const totalStock = computed(() => {
  return product.warehouseStock.reduce((acc, wh) => {
    acc.actual += wh.actual;
    acc.incoming += wh.incoming;
    acc.outgoing += wh.outgoing;
    return acc;
  }, { actual: 0, incoming: 0, outgoing: 0 });
});

const tempAutoAdd = reactive({ query: '', qty: 1, price_method: 'included', required: true });
const newRule = reactive({ title: '', sales_acc: '', cost_acc: '', stock_acc: '' });

const calculateMargin = computed(() => {
  if (!product.selling_price || product.selling_price <= 0) return 0;
  return (((product.selling_price - product.buying_cost) / product.selling_price) * 100).toFixed(2);
});

const calculateEuroPrice = (sup) => {
  const rates = { EUR: 1, USD: 0.93, GBP: 1.18, CHF: 1.05 };
  return (sup.buying_price * (rates[sup.currency] || 1)).toFixed(2);
};

// Handlers
const handleImageUpload = (e) => {
  const file = e.target.files[0];
  if (file) product.image_url = URL.createObjectURL(file);
};
const removeImage = () => product.image_url = null;
const addBarcode = () => product.barcodes.push({ type: 'EAN13', value: '' });
const removeBarcode = (index) => product.barcodes.splice(index, 1);
const addSupplier = () => product.suppliers.push({ name: '', supplier_sku: '', buying_price: 0, currency: 'EUR', buying_unit_type: 'PCE', price_per_qty: 1, vat_rule_id: 1 });
const removeSupplier = (index) => product.suppliers.splice(index, 1);
const removeAutoAdd = (index) => product.auto_add_items.splice(index, 1);

const confirmAutoAdd = () => {
  if (tempAutoAdd.query.trim()) {
    product.auto_add_items.push({
      sku: 'ART-' + Math.floor(Math.random() * 1000),
      name: tempAutoAdd.query,
      qty: tempAutoAdd.qty,
      price_method: tempAutoAdd.price_method,
      required: tempAutoAdd.required,
      price: 0
    });
    showAutoAddModal.value = false;
    tempAutoAdd.query = '';
  }
};

const addNote = () => {
  if (newNoteText.value.trim()) {
    product.notes.unshift({
      creator: 'Huidige Gebruiker',
      timestamp: new Date().toLocaleString('nl-NL'),
      text: newNoteText.value
    });
    newNoteText.value = '';
  }
};

const duplicateProduct = () => {
  product.sku = product.sku + '-COPY';
  product.description = product.description + ' (Kopie)';
  alert('Product is gedupliceerd.');
};

const cancelEdit = () => {
  if(confirm('Annuleren?')) window.history.back();
};

const saveProduct = () => alert('Opgeslagen!');

const transactionHistory = ref([
  { id: 1, date: '2025-11-12 09:15', type: 'sale', qty: 5, unit_price: 45.00 },
  { id: 2, date: '2025-11-10 14:02', type: 'purchase', qty: 100, unit_price: 22.45 }
]);
</script>

<style scoped>
.fa-trash-alt { color: #dc2626; transition: color 0.2s; cursor: pointer; }
.fa-trash-alt:hover { color: #b91c1c; }
</style>