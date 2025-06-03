<template>
    <div class="fixed left-0 top-0 h-screen bg-white shadow-lg 
                w-20 md:w-64 p-3 md:p-4 
                transition-all duration-300 ease-in-out">
        <div class="mb-4 md:mb-8">
            <h2 class="text-2xl font-bold text-gray-800 hidden md:block">E-Commerce</h2>
            <div class="text-2xl font-bold text-gray-800 block md:hidden text-center">E</div>
        </div>

        <div class="mb-4 md:mb-6 px-1 md:px-0">
            <input
                type="text"
                v-model="searchQuery"
                placeholder="Buscar produtos..."
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
            />
            <div v-if="isSearching" class="text-xs text-gray-500 mt-1 px-1">Buscando...</div>
            <div v-if="searchResults.length > 0 && searchQuery.length > 0" class="mt-2 bg-white border border-gray-200 rounded-md shadow-sm max-h-60 overflow-y-auto">
                <ul>
                <li v-for="product in searchResults" :key="product.id"
                    class="px-3 py-2 hover:bg-gray-50 border-b border-gray-100 last:border-b-0">
                    <router-link
                    :to="{ name: 'ProdutoDetalhe', params: { id: product.id } }"
                    @click="clearSearchAndClose"
                    class="text-xs text-gray-700 hover:text-blue-600 block truncate"
                    :title="product.title"
                    >
                    {{ product.title }}
                    </router-link>
                </li>
                </ul>
            </div>
            <div v-else-if="searchQuery.length > 0 && !isSearching && !searchError && searchAttempted" class="text-xs text-gray-500 mt-1 px-1">
                Nenhum produto encontrado.
            </div>
            <div v-if="searchError" class="text-xs text-red-500 mt-1 px-1">
                {{ searchError }}
            </div>
        </div>

        <nav class="space-y-2">
            <router-link to="/" @click="clearSearch" class="sidebar-link flex items-center justify-center md:justify-start md:space-x-3 p-3 rounded-lg hover:bg-gray-50 text-gray-600">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                <path stroke-linecap="round" stroke-linejoin="round" d="M3 12l9-9 9 9M4.5 10.5v9a1.5 1.5 0 001.5 1.5H9v-6h6v6h3a1.5 1.5 0 001.5-1.5v-9" />
                </svg>
                <span class="hidden md:inline">Home</span>
            </router-link>
            <router-link to="/fragancia" @click="clearSearch" class="sidebar-link flex items-center justify-center md:justify-start md:space-x-3 p-3 rounded-lg hover:bg-gray-50 text-gray-600">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                <path stroke-linecap="round" stroke-linejoin="round" d="M10 3h4m-2 0v3m6 4a6 6 0 11-12 0 6 6 0 0112 0zm0 0v7a2 2 0 01-2 2H8a2 2 0 01-2-2v-7" />
                </svg>
                <span class="hidden md:inline">Fragâncias</span>
            </router-link>
            <router-link to="/mobilia" @click="clearSearch" class="sidebar-link flex items-center justify-center md:justify-start md:space-x-3 p-3 rounded-lg hover:bg-gray-50 text-gray-600">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                <path stroke-linecap="round" stroke-linejoin="round" d="M3 10a3 3 0 016 0v1h6v-1a3 3 0 116 0v7H3v-7z" />
                </svg>
                <span class="hidden md:inline">Mobílias</span>
            </router-link>
            <router-link to="/notebook" @click="clearSearch" class="sidebar-link flex items-center justify-center md:justify-start md:space-x-3 p-3 rounded-lg hover:bg-gray-50 text-gray-600">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                <path stroke-linecap="round" stroke-linejoin="round" d="M3 5.25A2.25 2.25 0 015.25 3h13.5A2.25 2.25 0 0121 5.25v10.5H3V5.25zM2.25 17.25h19.5A.75.75 0 0122.5 18v.75a.75.75 0 01-.75.75H2.25a.75.75 0 01-.75-.75V18a.75.75 0 01.75-.75z" />
                </svg>
                <span class="hidden md:inline">Notebooks</span>
            </router-link>
            <router-link to="/moto" @click="clearSearch" class="sidebar-link flex items-center justify-center md:justify-start md:space-x-3 p-3 rounded-lg hover:bg-gray-50 text-gray-600">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                <path stroke-linecap="round" stroke-linejoin="round" d="M9 16a3 3 0 11-6 0 3 3 0 016 0zm0 0h6m0 0a3 3 0 116 0 3 3 0 01-6 0zM12 16l-3-6h4l2-3h2l1 2" />
                </svg>
                <span class="hidden md:inline">Motos</span>
            </router-link>
        </nav>
    </div>
</template>

<script setup>
import { ref, watch } from 'vue';
import axios from 'axios';

const searchQuery = ref('');
const searchResults = ref([]);
const isSearching = ref(false);
const searchError = ref(null);
const searchAttempted = ref(false);
let debounceTimer = null;


const performSearch = async () => {
  if (searchQuery.value.trim().length < 2) {
    searchResults.value = [];
    searchError.value = null;
    searchAttempted.value = false;
    return;
  }
  isSearching.value = true;
  searchError.value = null;
  searchAttempted.value = true;
  try {
    const response = await axios.get(`https://dummyjson.com/products/search?q=${searchQuery.value.trim()}`);
    searchResults.value = response.data.products;
  } catch (error) {
    console.error("Erro ao buscar produtos:", error);
    searchError.value = "Falha ao buscar.";
    searchResults.value = [];
  } finally {
    isSearching.value = false;
  }
};

watch(searchQuery, (newValue) => {
  clearTimeout(debounceTimer);
  searchAttempted.value = false;
  if (newValue.trim() === '') {
    searchResults.value = [];
    searchError.value = null;
    isSearching.value = false;
    return;
  }
  debounceTimer = setTimeout(performSearch, 500);
});

const clearSearch = () => {
  searchQuery.value = '';
  searchResults.value = [];
  searchError.value = null;
  searchAttempted.value = false;
};

const clearSearchAndClose = () => {
  clearSearch();
};
</script>