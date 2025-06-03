<template>
  <div class="container mx-auto px-4 py-8">
    <h1 class="text-3xl font-bold text-center mb-8 text-gray-800">Todos os Produtos</h1>

    <div v-if="isLoading" class="text-center py-10">
      <p class="text-xl text-gray-500">Carregando produtos...</p>
    </div>

    <div v-else-if="products.length > 0"
         class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
      <ProductCardComponent
        v-for="p in products"
        :key="p.id"
        :product="p"
      />
    </div>

    <div v-else class="text-center py-10">
      <p class="text-xl text-gray-500">Nenhum produto encontrado.</p>
    </div>

    <div v-if="!isLoading && products.length > 0 && totalPages > 1" class="flex justify-center items-center gap-4 mt-10">
      <button @click="previousPage" :disabled="currentPage === 1"
              class="btn bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed">
        Anterior
      </button>
      <span class="text-gray-700">Página {{ currentPage }} de {{ totalPages }}</span>
      <button @click="nextPage" :disabled="currentPage === totalPages"
              class="btn bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed">
        Próximo
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, watch } from 'vue'
import axios from 'axios'
import ProductCardComponent from '../components/ProdutosCardComponent.vue'

const products = ref([])
const isLoading = ref(false)
const currentPage = ref(1)
const limit = ref(10)
const totalProducts = ref(0)

const totalPages = computed(() => Math.ceil(totalProducts.value / limit.value))

const fetchProducts = async (page) => {
  isLoading.value = true
  const skip = (page - 1) * limit.value
  try {
    const response = await axios.get(`https://dummyjson.com/products?limit=${limit.value}&skip=${skip}`)
    products.value = response.data.products.map(product => ({
      id: parseInt(product.id, 10),
      title: product.title,
      thumbnail: product.thumbnail,
      category: product.category,
      price: parseFloat(product.price),
      stock: parseInt(product.stock, 10)
    }))
    totalProducts.value = response.data.total
  } catch (error) {
    console.error("Erro ao buscar produtos:", error)
    products.value = []
    totalProducts.value = 0
  } finally {
    isLoading.value = false
  }
}

const nextPage = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value++
  }
}

const previousPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--
  }
}

watch(currentPage, (newPage) => {
  fetchProducts(newPage);
})


onMounted(async () => {
  await fetchProducts(currentPage.value);
})
</script>