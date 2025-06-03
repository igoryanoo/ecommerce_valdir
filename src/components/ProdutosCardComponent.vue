<template>
  <div
    class="border rounded-lg p-4 shadow hover:shadow-lg transition-shadow duration-200 ease-in-out bg-white flex flex-col justify-between cursor-pointer"
    role="article"
    @click="navigateToProductDetails"
    tabindex="0" @keydown.enter="navigateToProductDetails" @keydown.space="navigateToProductDetails"
  >
    <div>
      <img :src="product.thumbnail" :alt="product.title" class="w-full h-40 object-cover mb-3 rounded">
      <h3 class="font-semibold text-lg truncate mb-1" :title="product.title">{{ product.title }}</h3>
      <p class="text-sm text-gray-600 capitalize mb-1">{{ product.category }}</p>
      <p class="text-sm font-medium">
        <span v-if="product.stock > 0" class="text-green-700">
          {{ product.stock }} em estoque
        </span>
        <span v-else class="text-red-700">
          Fora de estoque
        </span>
      </p>
    </div>
    <p class="text-lg font-bold text-blue-600 mt-2">${{ product.price }}</p>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router';

const props = defineProps({
  product: {
    type: Object,
    required: true,
    validator: (value) => {
      return typeof value.id === 'number' &&
             typeof value.title === 'string' &&
             typeof value.thumbnail === 'string' &&
             typeof value.category === 'string' &&
             typeof value.price === 'number';
    }
  }
});

const router = useRouter();

const navigateToProductDetails = () => {
  router.push({ name: 'ProdutoDetalhe', params: { id: props.product.id } });
};
</script>