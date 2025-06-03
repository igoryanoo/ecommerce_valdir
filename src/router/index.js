import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import NotebookView from '../views/NotebookView.vue'
import MotoView from '../views/MotoView.vue'
import MobiliaView from '../views/MobiliaView.vue'
import FraganciaView from '../views/FraganciaView.vue'
import ProdutoDetalheView from '../views/ProdutoDetalheView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/notebook',
      name: 'notebook',
      component: NotebookView,
    },
    {
      path: '/moto',
      name: 'moto',
      component: MotoView,
    },
    {
      path: '/mobilia',
      name: 'mobilia',
      component: MobiliaView,
    },
    {
      path: '/fragancia',
      name: 'fragancia',
      component: FraganciaView,
    },
    {
      path: '/produto/:id', 
      name: 'ProdutoDetalhe', 
      component: ProdutoDetalheView,
    }
  ],
})

export default router
