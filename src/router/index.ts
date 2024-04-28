import { createRouter, createWebHistory } from 'vue-router'
import Table from '../components/Table.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'table',
      component: Table
    }
  ]
})

export default router
