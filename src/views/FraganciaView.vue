<template>
  <div class="container mx-auto px-4 py-8">
    <h1 class="text-3xl font-bold text-center mb-8 text-gray-800">Fragâncias</h1>

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

    <div v-if="!isLoading && products.length > 0 && totalPages > 1" class="flex justify-center items-center gap-4 mt-10">
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
     <div v-else-if="fetchError" class="text-center py-10 text-red-600">
        <p>{{ fetchError }}</p>
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
const fetchError = ref(null);


const fetchProducts = async () => {
  isLoading.value = true
  fetchError.value = null;
  try {
    const response = await axios.get('https://dummyjson.com/products/category/fragrances')
    products.value = response.data.products.map(product => ({ 
      id: parseInt(product.id, 10),
      title: product.title,
      thumbnail: product.thumbnail,
      category: product.category,
      price: parseFloat(product.price),
      stock: parseInt(product.stock, 10)
    }))
  } catch (error) {
    console.error("Erro ao buscar fragrâncias:", error)
    fetchError.value = "Falha ao carregar fragrâncias.";
    products.value = [] 
  } finally {
    isLoading.value = false
  }
}

const paginatedProducts = computed(() => {
  return products.value.slice(skip.value, skip.value + limit); 
});

const totalPages = computed(() => Math.ceil(products.value.length / limit)) 
const currentPage = computed(() => Math.floor(skip.value / limit) + 1)
const isLastPage = computed(() => skip.value + limit >= products.value.length) 

const nextProducts = () => {
  if (!isLastPage.value) {
    skip.value += limit
  }
}

const previousProducts = () => {
  if (skip.value >= limit) {
    skip.value -= limit
  }
}

onMounted(async () => {
  await fetchProducts();
});
</script>
