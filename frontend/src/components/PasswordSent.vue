<template>
  <div class="forgot-password-page d-flex align-items-center justify-content-center vh-100 position-relative">
    <div class="page-background"></div>
    <div class="card p-4 shadow-lg text-center" style="width: 100%; max-width: 400px;">
      <h2 class="fw-bold mb-3">{{ $t('auth.resetPassword') }}</h2>

      <p class="fs-5 mb-4">
        {{ $t('auth.passwordSent') }}
      </p>

      <router-link to="/login" class="btn btn-warning w-100 fw-semibold rounded-pill">
        {{ $t('auth.backToLogin') }}
      </router-link>
    </div>
  </div>
</template>

<script setup lang="ts">
</script>

<style scoped>
.forgot-password-page {
  /* background managed globally */
  padding: 1rem;
}
.card {
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(0, 0, 0, 0.1);
  border-radius: 1rem;
}

.card .text-success,
.card .text-danger {
  font-size: 1.3rem;
  font-weight: bold;
}
</style>
