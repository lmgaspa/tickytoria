<template>
  <div class="w-100 mb-3 px-3 position-relative text-center" style="max-width: 600px; z-index: 1;">
    <RouterLink :to="to" class="btn btn-back-gradient fw-bold rounded-pill px-4 btn-sm shadow-sm d-inline-flex align-items-center gap-2 transition-transform">
      <i class="bi bi-arrow-left"></i>
      {{ label || $t('common.back') }}
    </RouterLink>
  </div>
</template>

<script setup lang="ts">


defineProps({
  to: {
    type: String,
    default: '/dashboard'
  },
  label: {
    type: String,
    default: ''
  }
});
</script>

<style scoped>
.btn-back-gradient {
  background: linear-gradient(135deg, #6a11cb 0%, #2575fc 100%);
  color: white;
  border: none;
}

.transition-transform {
  transition: transform 0.2s, box-shadow 0.2s;
}

.transition-transform:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 15px rgba(37, 117, 252, 0.4) !important;
  color: white;
}

.transition-transform:active {
  transform: translateY(0);
}
</style>
