<template>
  <div class="d-flex flex-column align-items-center full-height position-relative pt-2" style="z-index: 1;">
    <div class="page-background"></div>

    <BackButton to="/dashboard" />

    <div class="glass-card p-4 border rounded shadow-sm w-100 mt-4 position-relative" style="max-width: 600px; z-index: 1; border-color: rgba(255, 0, 0, 0.3) !important;">
      <h4 class="mb-3 text-center text-danger fw-bold">{{ $t('deleteUser.title') }}</h4>
      <p class="text-center small text-muted mb-3">{{ $t('deleteUser.warning') }}</p>
      
      <div class="row align-items-end">
        <div class="col-md-12 mb-3">
          <label for="deleteEmail" class="form-label small mb-1">{{ $t('deleteUser.emailLabel') }}</label>
          <input v-model="deleteEmail" type="email" id="deleteEmail" class="form-control form-control-sm" :placeholder="$t('deleteUser.placeholder')" />
        </div>
        <div class="col-md-12">
            <button @click="handleDeleteUser" class="btn btn-danger w-100 btn-sm fw-bold">
            <i class="bi bi-trash-fill me-1"></i> {{ $t('deleteUser.button') }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { API_URL } from '../config';
import BackButton from './BackButton.vue';

const router = useRouter()
const { t } = useI18n()
const deleteEmail = ref('')

const handleDeleteUser = async () => {
  if (!deleteEmail.value) {
    alert(t('deleteUser.emailRequired'))
    return
  }

  const confirmDelete = confirm(t('deleteUser.confirm', { email: deleteEmail.value }))
  if (!confirmDelete) return

  const token = localStorage.getItem('token')
  if (!token) {
    alert('Você precisa estar logado como administrador.')
    router.push('/login')
    return
  }

  try {
      const response = await fetch(`${API_URL}/api/auth/delete/${deleteEmail.value}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      }
    })

    const data = await response.json()

    if (!response.ok) {
      alert(data.message || t('deleteUser.error'))
      return
    }

    alert(t('deleteUser.success'))
    deleteEmail.value = '' // Limpar campo
  } catch (error) {
    console.error(error)
    alert(t('deleteUser.error'))
  }
}
</script>

<style scoped>
.full-height {
  position: relative;
  min-height: 100vh;
  overflow: hidden;
  width: 100%;
}
</style>
