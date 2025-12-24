import { createRouter, createWebHistory } from 'vue-router';
import OrderView from '../views/OrderView.vue';
// 1. Importeer de nieuwe pagina
import MarketingFlow from '../views/MarketingFlowView.vue';

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: '/',
            name: 'home',
            component: OrderView
        },
        {
            path: '/marketing/flow',
            name: 'marketing-flow',
            component: MarketingFlow // 2. Gebruik de component direct
        },
        // In src/router/index.js routes array:
        {
            path: '/smartlist/create',
            name: 'SmartListCreate',
            component: () => import('@/views/SmartListView.vue'),
            meta: { title: 'Smart List Builder' }
        },
        // in router/index.js
        {
            path: '/product/new',
            name: 'ProductCreate',
            component: () => import('@/views/ProductDetailView.vue'),
            meta: { title: 'Nieuw Product' }
        },
        {
            path: '/products',
            name: 'ProductList',
            component: () => import('@/views/ProductTableView.vue'),
            meta: { title: 'Productenoverzicht' }
        },
        {
            path: '/product/:id',
            name: 'ProductDetail',
            component: () => import('@/views/ProductDetailView.vue'),
            meta: { title: 'Product Details' }
        }

        // Voor Q&A kun je later hetzelfde doen (eerst een QAPage.vue maken)
        // Voor nu even uitcommentariëren of weglaten om errors te voorkomen:
        /* {
          path: '/content/qa',
          name: 'qa',
          component: () => import('../views/QAPage.vue') // Lazy load voorbeeld
        }
        */
    ]
});

export default router;