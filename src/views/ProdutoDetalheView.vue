<template>
  <div class="container mx-auto px-4 py-8">
    <div v-if="isLoading" class="text-center py-20">
      <p class="text-2xl text-gray-500">Carregando detalhes do produto...</p>
    </div>

    <div v-else-if="error" class="text-center py-20">
      <p class="text-2xl text-red-600">Erro ao carregar o produto.</p>
      <p class="text-gray-700">{{ error }}</p>
      <router-link to="/" class="mt-4 inline-block bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors">
        Voltar para Home
      </router-link>
    </div>

    <div v-else-if="product" class="bg-white shadow-xl rounded-lg overflow-hidden">
      <div class="md:flex">
        <div class="md:w-1/2 p-4">
          <img 
            v-if="product.thumbnail" 
            :src="product.thumbnail" 
            :alt="product.title" class="w-full h-auto max-h-[500px] object-contain rounded-lg border mb-4">
        </div>

        <div class="md:w-1/2 p-6">
          <h1 class="text-3xl font-bold text-gray-800 mb-2">{{ product.title }}</h1>
          <p class="text-sm text-gray-500 capitalize mb-4">
            Marca: <span class="font-semibold text-gray-700">{{ product.brand || 'Não informado' }}</span> |
            Categoria: <span class="font-semibold text-gray-700">{{ product.category }}</span>
          </p>

          <p class="text-gray-700 mb-4 text-base leading-relaxed">{{ product.description }}</p>

          <div class="mb-4">
            <span v-if="typeof product.price === 'number'" class="text-3xl font-bold text-blue-600">
              ${{ product.price.toFixed(2) }}
            </span>
            <span v-else class="text-3xl font-bold text-blue-600">Preço indisponível</span>
          </div>

          <div class="mb-4">
            <p class="text-sm font-medium" :class="product.stock > 0 ? 'text-green-700' : 'text-red-700'">
              {{ product.stock > 0 ? `${product.stock} em estoque` : 'Fora de estoque' }}
            </p>
          </div>

          <div v-if="typeof product.rating === 'number'" class="mb-6 flex items-center">
            <span class="text-yellow-500 text-lg" title="Avaliação">
              <template v-if="product.rating > 0">
                {{ '★'.repeat(Math.round(product.rating)) }}{{ '☆'.repeat(5 - Math.round(product.rating)) }}
              </template>
              <template v-else>Sem avaliação</template>
            </span>
            <span class="ml-2 text-gray-600 text-sm" v-if="product.rating > 0">({{ product.rating.toFixed(1) }} de 5)</span>
          </div>

          <button class="w-full bg-green-600 text-white font-semibold py-3 px-6 rounded-lg hover:bg-green-700 transition-colors text-lg">
            Comprar
          </button>
        </div>
      </div>
    </div>
    <div v-else class="text-center py-20">
      <p class="text-2xl text-gray-500">Produto não encontrado.</p>
       <router-link to="/" class="mt-4 inline-block bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors">
        Voltar para Home
      </router-link>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';
import { useRoute } from 'vue-router';
import axios from 'axios';

const route = useRoute();
const product = ref(null);
const isLoading = ref(true);
const error = ref(null);


const fetchProductDetails = async (productId) => {
  isLoading.value = true;
  error.value = null;
  product.value = null;

  if (!productId) {
    error.value = "ID do produto não fornecido.";
    isLoading.value = false;
    return;
  }
  try {
    const response = await axios.get(`https://dummyjson.com/products/${productId}`);
    product.value = response.data;
  } catch (err) {
    error.value = err.response?.data?.message || err.message || "Falha ao buscar dados do produto.";
    if (err.response && err.response.status === 404) {
      error.value = "Produto não encontrado.";
    }
  } finally {
    isLoading.value = false;
  }
};

onMounted(() => {
  fetchProductDetails(route.params.id);
});

watch(() => route.params.id, (newId, oldId) => {
  if (newId && newId !== oldId) {
    fetchProductDetails(newId);
  }
});
</script>