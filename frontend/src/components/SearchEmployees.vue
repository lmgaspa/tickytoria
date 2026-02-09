<template>
  <div class="full-height d-flex flex-column align-items-center p-4 position-relative">
    <div class="page-background"></div>

    <BackButton to="/dashboard" />

    <div class="card p-4 w-100" style="max-width: 600px;">
      <h2 class="mb-4 text-center text-gradient fw-bold"><i class="bi bi-person-search me-2"></i>{{ $t('employee.search') }}</h2>

      <div class="form-group mb-3">
        <label class="form-label">Buscar por:</label>
        <select v-model="searchType" class="form-select">
          <option disabled value="">Selecione</option>
          <option value="name">Nome do Funcionário</option>
          <option value="email">E-mail</option>
          <option value="whatsapp">WhatsApp</option>
          <option value="role">Função</option>
          <option value="all">Todos os Funcionários</option>
        </select>
      </div>

      <div class="form-group mb-3" v-if="searchType !== '' && searchType !== 'all'">
        <label class="form-label">{{ labelForType }}</label>
        <input v-model="searchValue" class="form-control" :type="searchType === 'email' ? 'email' : 'text'" :placeholder="labelForType" required />
      </div>

      <button class="btn btn-warning w-100" @click="searchEmployee">{{ $t('employee.searchButton') }}</button>
      <p class="text-danger text-center mt-3 fw-bold" v-if="notFound">{{ notFoundMessage }}</p>
    </div>

    <div v-if="paginatedEmployees.length > 0" class="card p-4 w-100 mt-4" style="max-width: 600px;">
      <h4 class="mb-3">{{ $t('employee.results') }}</h4>

      <div v-for="employee in paginatedEmployees" :key="employee._id" class="mb-4 p-3 border rounded shadow-sm">
        <p><strong>Nome:</strong> {{ employee.name }}</p>
        <p><strong>Função:</strong> {{ employee.role }}</p>
        <p><strong>E-mail:</strong> {{ employee.email }}</p>
        <p><strong>WhatsApp:</strong> {{ employee.whatsapp || 'Não informado' }}</p>
        <p><strong>Endereço:</strong> {{ employee.endereco || 'Não informado' }}</p>
      </div>

      <div class="d-flex justify-content-between mt-3" v-if="totalPages > 1">
        <button class="btn btn-outline-light" :disabled="page === 1" @click="page--">⬅️ Anterior</button>
        <button class="btn btn-outline-light" :disabled="page === totalPages" @click="page++">Próxima ➔</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useRouter } from 'vue-router'
import { API_URL } from '../config';
import BackButton from './BackButton.vue';

const router = useRouter()
const baseUrl = `${API_URL}/api/users`

const searchType = ref('')
const searchValue = ref('')
const employees = ref<any[]>([])
const page = ref(1)
const perPage = 20
const notFound = ref(false)

watch(searchValue, (val) => {
  if (searchType.value === 'whatsapp') {
    searchValue.value = val.replace(/\D/g, '').slice(0, 11).replace(/^(\d{2})(\d)/, '($1)$2').replace(/(\d{5})(\d{4})$/, '$1-$2')
  }
})

watch(searchType, () => {
  searchValue.value = ''
})

const labelForType = computed(() => {
  switch (searchType.value) {
    case 'name': return 'Nome do Funcionário'
    case 'email': return 'E-mail'
    case 'whatsapp': return 'WhatsApp'
    case 'role': return 'Função (ex: admin, funcionário)'
    default: return ''
  }
})

const paginatedEmployees = computed(() => {
  const start = (page.value - 1) * perPage
  return employees.value.slice(start, start + perPage)
})

const totalPages = computed(() => Math.ceil(employees.value.length / perPage))
const notFoundMessage = computed(() => 'Nenhum funcionário encontrado.')

const searchEmployee = async () => {
  if (!searchType.value) return

  if (searchType.value === 'email' && !/^\S+@\S+\.\S+$/.test(searchValue.value)) {
    alert('E-mail inválido')
    return
  }

  let url = ''
  const token = localStorage.getItem('token')
  const encoded = encodeURIComponent(searchValue.value)

  if (searchType.value === 'all') {
    url = `${baseUrl}/all`
  } else {
    url = `${baseUrl}/${searchType.value}/${encoded}`
  }

  try {
    const response = await fetch(url, {
      headers: { Authorization: `Bearer ${token}` }
    })

    const result = await response.json()

    if (!Array.isArray(result)) {
      if (result && result.message) {
        employees.value = []
        notFound.value = true
      } else {
        employees.value = [result]
        notFound.value = false
      }
    } else {
      employees.value = result
      notFound.value = result.length === 0
    }

    page.value = 1
  } catch (err) {
    console.error('Erro ao buscar funcionários:', err)
    employees.value = []
    notFound.value = true
  }
}
</script>

<style scoped>
.full-height {
  position: relative;
  min-height: 100vh;
  background-color: #0f0f1b;
  overflow: hidden;
  width: 100%;
}

.card {
  background-color: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(0, 0, 0, 0.1);
  border-radius: 1rem;
  color: var(--text-color);
}
</style>
