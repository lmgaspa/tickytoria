<template>
  <div class="login-page d-flex align-items-center justify-content-center vh-100 position-relative">
    <div class="page-background"></div>

    <div class="glass-card p-4 shadow-lg w-100 position-relative z-2" style="max-width: 400px;">
      <div class="text-center mb-4">
        <h2 class="fw-bold mb-1 text-gradient">{{ $t('auth.login') }}</h2>
        <p class="text-muted-light small">{{ $t('auth.email') }}</p>
      </div>

      <form @submit.prevent="handleLogin">
        <div class="mb-3">
          <label for="email" class="form-label ms-1">{{ $t('auth.email') }}</label>
          <input
            v-model="email"
            type="email"
            id="email"
            class="form-control glass-input"
            placeholder="name@exemplo.com"
            required
          />
        </div>

        <div class="mb-4 position-relative">
          <label for="password" class="form-label ms-1">{{ $t('auth.password') }}</label>
          <input
            v-model="password"
            :type="showPassword ? 'text' : 'password'"
            id="password"
            class="form-control glass-input"
            placeholder="••••••••"
            required
          />
          <i
            :class="showPassword ? 'bi bi-eye-slash-fill' : 'bi bi-eye-fill'"
            class="toggle-password-icon"
            @click="showPassword = !showPassword"
          ></i>
        </div>

        <button type="submit" class="btn btn-primary-glow w-100 fw-bold rounded-pill py-2 mb-3">
          {{ $t('auth.login') }}
        </button>

        <div class="text-center">
          <RouterLink to="/forgot-password" class="text-muted-light small text-decoration-none hover-white">
            {{ $t('auth.forgotPassword') }}
          </RouterLink>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'

import { API_URL } from '../config';

const router = useRouter()
const email = ref('')
const password = ref('')
const showPassword = ref(false)

const handleLogin = async () => {
  try {
    const response = await fetch(`${API_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: email.value, password: password.value })
    })

    if (!response.ok) {
      alert('Login inválido')
      return
    }

    const data = await response.json()
    localStorage.setItem('token', data.token)
    router.push('/dashboard')
  } catch (error) {
    alert('Erro de conexão')
  }
}
</script>

<style scoped>
.login-page {
  /* Background handled globally */
  position: relative;
  overflow: hidden;
}

.text-muted-light {
  color: var(--text-muted);
}

.hover-white:hover {
  color: var(--primary-color) !important;
}

.toggle-password-icon {
  position: absolute;
  top: 42px;
  right: 15px;
  cursor: pointer;
  color: var(--text-muted);
}
</style>