<template>
  <div class="dashboard-page d-flex flex-column align-items-center min-vh-100 position-relative py-5">
    <div class="page-background"></div>

    <div class="content position-relative z-2 text-center w-100" style="max-width: 900px;">
      <h1 class="display-3 fw-bold mb-2 tracking-tight">{{ $t('dashboard.welcome') }}, <span class="text-gradient">{{ userName }}</span></h1>
      <p class="lead mb-5 text-muted-light">{{ $t('dashboard.subtitle') }}</p>

      <div class="row g-4 justify-content-center">
        <!-- Card: Buscar Nota -->
        <div class="col-md-6 col-lg-3">
          <div class="glass-card hover-card p-4 h-100 d-flex flex-column align-items-center justify-content-center cursor-pointer" @click="goToBuscarNota">
            <div class="icon-circle mb-3 bg-secondary-glow">
              <i class="bi bi-search fs-3 text-white"></i>
            </div>
            <h5 class="fw-bold mb-1">{{ $t('dashboard.searchTicket') }}</h5>
            <span class="small text-muted-light">{{ $t('dashboard.searchTicketDesc') }}</span>
          </div>
        </div>

        <!-- Card: Registrar Nota -->
        <div class="col-md-6 col-lg-3">
          <div class="glass-card hover-card p-4 h-100 d-flex flex-column align-items-center justify-content-center cursor-pointer" @click="goToNovaNota">
            <div class="icon-circle mb-3 bg-primary-glow">
              <i class="bi bi-plus-lg fs-3 text-dark"></i>
            </div>
            <h5 class="fw-bold mb-1">{{ $t('dashboard.newTicket') }}</h5>
            <span class="small text-muted-light">{{ $t('dashboard.newTicketDesc') }}</span>
          </div>
        </div>

        <!-- Card: Registrar Cliente -->
        <div class="col-md-6 col-lg-3">
          <div class="glass-card hover-card p-4 h-100 d-flex flex-column align-items-center justify-content-center cursor-pointer" @click="goToRegistrarCliente">
            <div class="icon-circle mb-3 bg-purple-glow">
              <i class="bi bi-person-lines-fill fs-3 text-white"></i>
            </div>
            <h5 class="fw-bold mb-1">{{ $t('dashboard.registerClient') }}</h5>
            <span class="small text-muted-light">{{ $t('dashboard.registerClientDesc') }}</span>
          </div>
        </div>

        <!-- Card: Buscar Cliente -->
        <div class="col-md-6 col-lg-3">
          <div class="glass-card hover-card p-4 h-100 d-flex flex-column align-items-center justify-content-center cursor-pointer" @click="goToBuscarCliente">
            <div class="icon-circle mb-3 bg-info-glow">
              <i class="bi bi-person-badge-fill fs-3 text-white"></i>
            </div>
            <h5 class="fw-bold mb-1">{{ $t('dashboard.searchClient') }}</h5>
            <span class="small text-muted-light">{{ $t('dashboard.searchClientDesc') }}</span>
          </div>
        </div>

        <!-- Card: Registrar ário (Admin) -->
        <div v-if="isAdmin" class="col-md-6 col-lg-3">
          <div class="glass-card hover-card p-4 h-100 d-flex flex-column align-items-center justify-content-center cursor-pointer" @click="goToRegistrarFuncionario">
            <div class="icon-circle mb-3 bg-blue-glow">
              <i class="bi bi-person-plus-fill fs-3 text-white"></i>
            </div>
            <h5 class="fw-bold mb-1">{{ $t('dashboard.registerEmployee') }}</h5>
            <span class="small text-muted-light">{{ $t('dashboard.registerEmployeeDesc') }}</span>
          </div>
        </div>

        <!-- Card: Buscar Funcionário (Admin) -->
        <div v-if="isAdmin" class="col-md-6 col-lg-3">
          <div class="glass-card hover-card p-4 h-100 d-flex flex-column align-items-center justify-content-center cursor-pointer" @click="goToBuscarFuncionario">
            <div class="icon-circle mb-1 bg-blue-glow" style="filter: hue-rotate(45deg);">
              <i class="bi bi-people-fill fs-3 text-white"></i>
            </div>
            <h5 class="fw-bold mb-1">{{ $t('dashboard.searchEmployee') }}</h5>
            <span class="small text-muted-light">{{ $t('dashboard.searchEmployeeDesc') }}</span>
          </div>
        </div>

        <!-- Card: Deletar Funcionário (Admin) -->
        <div v-if="isAdmin" class="col-md-6 col-lg-3">
          <div class="glass-card hover-card p-4 h-100 d-flex flex-column align-items-center justify-content-center cursor-pointer bg-danger-soft" @click="goToDeletarFuncionario">
            <div class="icon-circle mb-3 bg-red-glow">
              <i class="bi bi-trash-fill fs-3 text-white"></i>
            </div>
            <h5 class="fw-bold mb-1">{{ $t('deleteUser.title') }}</h5>
            <span class="small text-muted-light">{{ $t('deleteUser.warning') }}</span>
          </div>
        </div>

        <!-- Card: Sair -->
        <div class="col-md-6 col-lg-3">
          <div class="glass-card hover-card p-4 h-100 d-flex flex-column align-items-center justify-content-center cursor-pointer bg-danger-soft" @click="logout">
            <div class="icon-circle mb-3 bg-red-glow">
              <i class="bi bi-box-arrow-right fs-3 text-white"></i>
            </div>
            <h5 class="fw-bold mb-1">{{ $t('dashboard.logout') }}</h5>
            <span class="small text-muted-light">{{ $t('dashboard.logoutDesc') }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'

import { API_URL } from '../config';

const router = useRouter()
const userName = ref('')
const isAdmin = ref(false)

onMounted(async () => {
  const token = localStorage.getItem('token')
  if (!token) return router.push('/login')

  try {
    const response = await fetch(`${API_URL}/api/auth/profile`, {
      headers: { Authorization: `Bearer ${token}` }
    })

    if (!response.ok) throw new Error('Erro')

    const user = await response.json()
    userName.value = user.name
    isAdmin.value = user.role === 'admin'
  } catch (e) {
    localStorage.removeItem('token')
    router.push('/login')
  }
})

const goToBuscarNota = () => router.push('/search-ticket')
const goToNovaNota = () => router.push('/register-ticket')
const goToRegistrarCliente = () => router.push('/register-client')
const goToBuscarCliente = () => router.push('/search-client')
const goToRegistrarFuncionario = () => router.push('/register')
const goToBuscarFuncionario = () => router.push('/search-employee')
const goToDeletarFuncionario = () => router.push('/delete-employee')
const logout = () => {
  localStorage.removeItem('token')
  router.push('/login')
}
</script>

<style scoped>
.dashboard-page {
  background-color: var(--bg-color);
  overflow-y: auto; /* Enable vertical scrolling */
}

.text-muted-light {
  color: var(--text-muted);
}

.cursor-pointer {
  cursor: pointer;
}

.hover-card {
  transition: transform 0.3s ease, background 0.3s ease;
}

.hover-card:hover {
  transform: translateY(-5px);
  background: rgba(0, 0, 0, 0.05);
}

.icon-circle {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.bg-primary-glow {
  background: var(--primary-color);
  box-shadow: 0 0 20px rgba(0, 255, 163, 0.4);
}

.bg-secondary-glow {
  background: #2d00f7;
  box-shadow: 0 0 20px rgba(45, 0, 247, 0.4);
}

.bg-purple-glow {
  background: #6f42c1;
  box-shadow: 0 0 20px rgba(111, 66, 193, 0.4);
}

.bg-blue-glow {
  background: #0d6efd;
  box-shadow: 0 0 20px rgba(13, 110, 253, 0.4);
}

.bg-red-glow {
  background: #dc3545;
  box-shadow: 0 0 20px rgba(220, 53, 69, 0.4);
}

.bg-info-glow {
  background: #0dcaf0;
  box-shadow: 0 0 20px rgba(13, 202, 240, 0.4);
}

.bg-danger-soft:hover {
  border-color: rgba(220, 53, 69, 0.5);
}

@keyframes float {
  0% { transform: translate(0, 0); }
  50% { transform: translate(30px, 40px); }
  100% { transform: translate(0, 0); }
}
</style>
