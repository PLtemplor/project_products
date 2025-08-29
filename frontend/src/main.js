import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import axios from 'axios'

axios.defaults.baseURL = import.meta.env.VITE_API_URL || 'http://localhost:8081/api'
axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest'

createApp(App).mount('#app')
