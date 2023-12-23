import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'

import axios, { type AxiosInstance } from 'axios'

const axiosInstance: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_MAZADY_API,
  headers: { 'private-key': import.meta.env.VITE_MAZADY_PRIVATE_KEY },
})

createApp(App)
  .provide('axios', axiosInstance)

  .mount('#app')
