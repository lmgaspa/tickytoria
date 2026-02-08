<template>
  <div class="d-flex flex-column align-items-center full-height position-relative pt-2" style="z-index: 1;">
    <div class="page-background"></div>

    <!-- Botão de voltar fixo -->
    <div class="w-100 mt-3 px-3 position-relative text-center" style="max-width: 600px; z-index: 1;">
      <RouterLink to="/dashboard" class="btn btn-success fw-bold rounded-pill px-4 btn-sm">
        ⬅️ Voltar ao menu anterior
      </RouterLink>
    </div>

    <form @submit.prevent="handleRegister" class="glass-card p-4 border rounded shadow-sm w-100 mt-3 position-relative" style="max-width: 800px; z-index: 1;">
      <h4 class="mb-3 text-center text-gradient fw-bold">Registrar Funcionário</h4>

      <div class="row">
        <div class="col-md-6 mb-2">
          <label for="name" class="form-label small mb-1">Nome completo</label>
          <input v-model="name" type="text" id="name" class="form-control form-control-sm" placeholder="Seu nome" required />
        </div>

        <div class="col-md-6 mb-2">
          <label for="role" class="form-label small mb-1">Função</label>
          <input v-model="role" type="text" id="role" class="form-control form-control-sm" placeholder="Ex: Atendente, Gerente, etc." required />
        </div>
      </div>

      <div class="row">
        <div class="col-md-6 mb-2">
          <label for="whatsapp" class="form-label small mb-1">WhatsApp</label>
          <input v-model="whatsapp" type="tel" id="whatsapp" class="form-control form-control-sm" placeholder="(00)00000-0000" @input="onWhatsappInput" required />
        </div>

        <div class="col-md-6 mb-2">
          <label for="email" class="form-label small mb-1">E-mail</label>
          <input v-model="email" type="email" id="email" class="form-control form-control-sm" placeholder="nome@exemplo.com" required />
        </div>
      </div>

      <div class="form-group mb-2">
        <label for="endereco" class="form-label small mb-1">Endereço</label>
        <input v-model="endereco" type="text" id="endereco" class="form-control form-control-sm" placeholder="Rua, Número, Bairro" required />
      </div>

      <div class="row">
        <div class="col-md-6 mb-2 position-relative">
          <label for="password" class="form-label small mb-1">Senha</label>
          <input
            :type="showPassword ? 'text' : 'password'"
            v-model="password"
            id="password"
            class="form-control form-control-sm"
            placeholder="Crie uma senha"
            required
          />
          <i :class="showPassword ? 'bi bi-eye-slash-fill' : 'bi bi-eye-fill'" 
             class="toggle-password-icon" 
             @click="showPassword = !showPassword"></i>
        </div>

        <div class="col-md-6 mb-3 position-relative">
          <label for="confirmPassword" class="form-label small mb-1">Confirmar Senha</label>
          <input
            :type="showConfirm ? 'text' : 'password'"
            v-model="confirmPassword"
            id="confirmPassword"
            class="form-control form-control-sm"
            placeholder="Repita sua senha"
            required
          />
          <i :class="showConfirm ? 'bi bi-eye-slash-fill' : 'bi bi-eye-fill'" 
             class="toggle-password-icon" 
             @click="showConfirm = !showConfirm"></i>
        </div>
      </div>

      <button type="submit" class="btn btn-primary w-100 custom-btn hover-green btn-sm fw-bold">
        Registrar Funcionário
      </button>
    </form>


  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const name = ref('')
const email = ref('')
const password = ref('')
const confirmPassword = ref('')
const role = ref('funcionário')
const whatsapp = ref('')
const endereco = ref('')
const showPassword = ref(false)
const showConfirm = ref(false)
const router = useRouter()

const onWhatsappInput = () => {
  whatsapp.value = whatsapp.value
    .replace(/\D/g, '')
    .replace(/(\d{2})(\d{5})(\d{4})/, '($1)$2-$3')
    .slice(0, 14);
};

const handleRegister = async () => {
  if (!name.value || !email.value || !password.value || !confirmPassword.value) {
    alert('Preencha todos os campos.')
    return
  }

  if (password.value.length < 8) {
    alert('A senha deve ter no mínimo 8 caracteres.')
    return
  }

  if (password.value !== confirmPassword.value) {
    alert('As senhas não coincidem.')
    return
  }

  const token = localStorage.getItem('token')
  if (!token) {
    alert('Você precisa estar logado como administrador para registrar.')
    router.push('/login')
    return
  }

  try {
    const payload = JSON.parse(atob(token.split('.')[1]))
    if (payload.role !== 'admin') {
      alert('Apenas administradores podem registrar novos funcionários.')
      return
    }

    const response = await fetch('https://tickytoria-d1c0ff69e067.herokuapp.com/api/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({
        name: name.value,
        email: email.value,
        password: password.value,
        role: role.value,
        whatsapp: whatsapp.value,
        endereco: endereco.value
      })
    })

    if (!response.ok) {
      const err = await response.json()
      alert(err.message || 'Erro ao registrar funcionário.')
      return
    }

    alert('funcionário registrado com sucesso!')
    router.push('/dashboard')
  } catch (error) {
    console.error(error)
    alert('Erro ao tentar registrar funcionário.')
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

.gradient-overlay {
  display: none;
}

.toggle-password-icon {
  position: absolute;
  top: 32px;
  right: 15px;
  cursor: pointer;
  color: var(--text-muted);
}
</style>
