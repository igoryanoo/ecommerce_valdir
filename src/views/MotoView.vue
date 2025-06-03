<template>
  <div class="container mx-auto px-4 py-8">
    <h1 class="text-3xl font-bold text-center mb-8 text-gray-800">Motos</h1>

    <div v-if="isLoading" class="text-center py-10">
      <p class="text-xl text-gray-500">Carregando produtos...</p>
    </div>

    <div v-else-if="products.length > 0"
         class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
      <ProductCardComponent
        v-for="p in paginatedProducts"
        :key="p.id"
        :product="p"
      />
    </div>

    <div v-else class="text-center py-10">
      <p class="text-xl text-gray-500">Nenhum produto encontrado.</p>
    </div>

    <div v-if="!isLoading && products.length > 0" class="flex justify-center items-center gap-4 mt-10">
      <button @click="previousProducts" :disabled="skip === 0"
              class="btn bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed">
        Anterior
      </button>
      <span class="text-gray-700">Página {{ currentPage }} de {{ totalPages }}</span>
      <button @click="nextProducts" :disabled="isLastPage"
              class="btn bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed">
        Próximo
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import axios from 'axios'
import ProductCardComponent from '../components/ProdutosCardComponent.vue'

const products = ref([])
const skip = ref(0)
const limit = 10
const isLoading = ref(false)

const fetchProducts = async () => {
  isLoading.value = true
  try {
    const response = await axios.get('https://dummyjson.com/products/category/motorcycle')
    products.value = response.data.products.map(product => ({
      id: product.id,
      title: product.title,
      thumbnail: product.thumbnail,
      category: product.category,
      price: product.price,
      stock: product.stock
    }))
  } catch (error) {
    console.error("Erro ao buscar notebooks:", error)
    products.value = []
  } finally {
    isLoading.value = false
  }
}

const paginatedProducts = computed(() => products.value.slice(skip.value, skip.value + limit))
const totalPages = computed(() => Math.ceil(products.value.length / limit))
const currentPage = computed(() => Math.floor(skip.value / limit) + 1)
const isLastPage = computed(() => skip.value + limit >= products.value.length)

const nextProducts = () => !isLastPage.value && (skip.value += limit)
const previousProducts = () => skip.value >= limit && (skip.value -= limit)

onMounted(fetchProducts)
</script>