<template>
  <div class="forgot-password-page d-flex align-items-center justify-content-center vh-100 position-relative">
    <div class="page-background"></div>
    <div class="card p-4 shadow-lg" style="width: 100%; max-width: 400px;">
      <h2 class="text-center fw-bold mb-3">{{ $t('auth.forgotPassword') }}</h2>

      <form @submit.prevent="submit">
        <div class="mb-3">
          <label for="email" class="form-label">{{ $t('auth.email') }}</label>
          <input
            v-model="email"
            type="email"
            id="email"
            class="form-control"
            placeholder="Digite seu e-mail"
            required
          />
        </div>

        <button
          type="submit"
          class="btn btn-primary w-100 fw-semibold rounded-pill"
          :disabled="!email"
        >
          {{ $t('auth.sendResetLink') }}
        </button>
      </form>

      <p class="text-success mt-3 text-center" v-if="success">{{ success }}</p>
      <p class="text-danger mt-3 text-center" v-if="error">{{ error }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'

import { API_URL } from '../config';

const router = useRouter()

const email = ref('')
const success = ref('')
const error = ref('')

const submit = async () => {
  success.value = ''
  error.value = ''

  try {
    const response = await fetch(`${API_URL}/api/auth/forgot-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: email.value })
    })

    const result = await response.json()
    if (!response.ok) throw new Error(result.message || 'Erro ao enviar e-mail.')

    router.push('/password-sent')
  } catch (err: any) {
    error.value = err.message
  }
}
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
