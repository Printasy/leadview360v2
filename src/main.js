import { createApp } from 'vue'
import './assets/main.css' // Je Tailwind CSS import
import App from './App.vue'
import router from './router' // <--- Importeer de router

const app = createApp(App)

app.use(router) // <--- Gebruik de router
app.mount('#app')