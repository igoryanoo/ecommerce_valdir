<template>
  <div class="bg-gray-100 min-h-screen">
    <NavbarLateral />
    <div class="main container mx-auto px-4 py-6 ml-20 md:ml-64 transition-all duration-300 ease-in-out">
      <router-view></router-view>
    </div>
  </div>
</template>

<script setup>
import NavbarLateral from './components/NavbarLateralComponent.vue'
</script>