<template>
  <div class="configuration-page min-vh-100 position-relative py-5">
    <div class="page-background"></div>

    <div class="container position-relative z-2">
      <div class="d-flex justify-content-center mb-4">
        <BackButton />
      </div>
      
      <div class="row justify-content-center">
        <div class="col-md-8 col-lg-6">
          <div class="glass-card p-4 p-md-5">
            <div class="text-center mb-4">
              <div class="icon-circle mb-3 mx-auto bg-primary-glow">
                <i class="bi bi-gear-fill fs-2 text-white"></i>
              </div>
              <h2 class="fw-bold text-gradient">{{ $t('configuration.title') }}</h2>
            </div>

            <!-- Profile Settings -->
            <div class="mb-5">
              <h4 class="mb-3 border-bottom pb-2 border-secondary-subtle">{{ $t('configuration.profile') }}</h4>
              <form @submit.prevent="updateName">
                <div class="mb-3">
                  <label class="form-label">{{ $t('configuration.updateName') }}</label>
                  <div class="input-group">
                    <span class="input-group-text bg-transparent border-end-0 text-primary">
                      <i class="bi bi-person"></i>
                    </span>
                    <input 
                      v-model="form.name" 
                      type="text" 
                      class="form-control bg-transparent border-start-0 ps-0 text-white" 
                      :placeholder="$t('configuration.namePlaceholder')"
                      required
                    >
                  </div>
                </div>
                <button type="submit" class="btn btn-primary w-100" :disabled="loadingName">
                  <span v-if="loadingName" class="spinner-border spinner-border-sm me-2"></span>
                  {{ $t('configuration.saveName') }}
                </button>
              </form>
            </div>

            <!-- Security Settings -->
            <div>
              <h4 class="mb-3 border-bottom pb-2 border-secondary-subtle">{{ $t('configuration.security') }}</h4>
              <form @submit.prevent="updatePassword">
                <div class="mb-3">
                  <label class="form-label">{{ $t('configuration.updatePassword') }}</label>
                  <div class="input-group">
                    <span class="input-group-text bg-transparent border-end-0 text-primary">
                      <i class="bi bi-key"></i>
                    </span>
                    <input 
                      v-model="form.newPassword" 
                      type="password" 
                      class="form-control bg-transparent border-start-0 ps-0 text-white" 
                      :placeholder="$t('configuration.newPasswordPlaceholder')"
                      minlength="8"
                      required
                    >
                  </div>
                </div>

                <div class="mb-3">
                  <label class="form-label">{{ $t('configuration.confirmPassword') }}</label>
                  <div class="input-group">
                    <span class="input-group-text bg-transparent border-end-0 text-primary">
                      <i class="bi bi-check-circle"></i>
                    </span>
                    <input 
                      v-model="form.confirmPassword" 
                      type="password" 
                      class="form-control bg-transparent border-start-0 ps-0 text-white" 
                      :placeholder="$t('configuration.confirmPasswordPlaceholder')"
                      required
                    >
                  </div>
                </div>

                <div v-if="errorMessage" class="alert alert-danger d-flex align-items-center" role="alert">
                  <i class="bi bi-exclamation-triangle-fill me-2"></i>
                  <div>{{ errorMessage }}</div>
                </div>

                <div v-if="successMessage" class="alert alert-success d-flex align-items-center" role="alert">
                  <i class="bi bi-check-circle-fill me-2"></i>
                  <div>
                    {{ successMessage }} <br>
                    <small>{{ $t('configuration.emailSent') }}</small>
                  </div>
                </div>

                <button type="submit" class="btn btn-warning w-100" :disabled="loadingPass">
                  <span v-if="loadingPass" class="spinner-border spinner-border-sm me-2"></span>
                  {{ $t('configuration.savePassword') }}
                </button>
              </form>
            </div>

          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import BackButton from './BackButton.vue'
import { API_URL } from '../config'

const router = useRouter()
const { t, locale } = useI18n()

const form = ref({
  name: '',
  newPassword: '',
  confirmPassword: ''
})

const loadingName = ref(false)
const loadingPass = ref(false)
const errorMessage = ref('')
const successMessage = ref('')

onMounted(async () => {
  await fetchProfile()
})

const fetchProfile = async () => {
  const token = localStorage.getItem('token')
  if (!token) return router.push('/login')

  try {
    const response = await fetch(`${API_URL}/api/auth/profile`, {
      headers: { Authorization: `Bearer ${token}` }
    })
    
    if (response.ok) {
      const data = await response.json()
      form.value.name = data.name
    }
  } catch (error) {
    console.error('Error fetching profile', error)
  }
}

const updateName = async () => {
  loadingName.value = true
  errorMessage.value = ''
  successMessage.value = ''
  
  try {
    const token = localStorage.getItem('token')
    const response = await fetch(`${API_URL}/api/auth/profile`, {
      method: 'PUT',
      headers: { 
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}` 
      },
      body: JSON.stringify({
        name: form.value.name,
        lang: locale.value
      })
    })

    const data = await response.json()

    if (!response.ok) throw new Error(data.message || 'Error updating name')

    successMessage.value = t('configuration.success')
    // Update local storage if needed or refresh
  } catch (error: any) {
    errorMessage.value = error.message
  } finally {
    loadingName.value = false
  }
}

const updatePassword = async () => {
  if (form.value.newPassword !== form.value.confirmPassword) {
    errorMessage.value = t('configuration.passwordMismatch')
    return
  }

  loadingPass.value = true
  errorMessage.value = ''
  successMessage.value = ''

  try {
    const token = localStorage.getItem('token')
    const response = await fetch(`${API_URL}/api/auth/profile`, {
      method: 'PUT',
      headers: { 
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}` 
      },
      body: JSON.stringify({
        newPassword: form.value.newPassword,
        lang: locale.value
      })
    })

    const data = await response.json()

    if (!response.ok) throw new Error(data.message || 'Error updating password')

    successMessage.value = t('configuration.success')
    form.value.newPassword = ''
    form.value.confirmPassword = ''
  } catch (error: any) {
    errorMessage.value = error.message
  } finally {
    loadingPass.value = false
  }
}
</script>

<style scoped>
.configuration-page {
  background-color: var(--bg-color);
}

.icon-circle {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.bg-primary-glow {
  background: var(--primary-color);
  box-shadow: 0 0 20px rgba(0, 255, 163, 0.4);
}

.form-control::placeholder {
  color: rgba(255, 255, 255, 0.5);
}

.form-control:focus {
  box-shadow: none;
  border-color: var(--primary-color);
}

.input-group-text {
  color: var(--primary-color);
}

.border-secondary-subtle {
  border-color: rgba(255, 255, 255, 0.1) !important;
}
</style>
