<template>
  <div class="full-height d-flex flex-column align-items-center p-4 position-relative">
    <div class="page-background"></div>

    <div class="w-100 mb-3" style="max-width: 600px;">
      <RouterLink to="/dashboard" class="btn btn-success w-100 fw-bold rounded-pill">
        ⬅️ Voltar ao menu anterior
      </RouterLink>
    </div>

    <div class="card p-4 w-100" style="max-width: 600px;">
      <h2 class="mb-4 text-center text-gradient fw-bold">Buscar Cliente</h2>

      <div class="form-group mb-3">
        <label class="form-label">Buscar por:</label>
        <select v-model="searchType" class="form-select">
          <option disabled value="">Selecione</option>
          <option value="name">Nome do Cliente</option>
          <option value="empresa">Empresa</option>
          <option value="cpf">CPF</option>
          <option value="cnpj">CNPJ</option>
          <option value="whatsapp">WhatsApp</option>
          <option value="telefone">Telefone</option>
          <option value="email">E-mail</option>
          <option value="all">Todos os Clientes</option>
        </select>
      </div>

      <div class="form-group mb-3" v-if="searchType !== '' && searchType !== 'all'">
        <label class="form-label">{{ labelForType }}</label>
        <input v-model="searchValue" class="form-control" :type="searchType === 'email' ? 'email' : 'text'" :placeholder="labelForType" required />
      </div>

      <button class="btn btn-warning w-100" @click="searchClient">Buscar</button>
      <p class="text-danger text-center mt-3 fw-bold" v-if="notFound">{{ notFoundMessage }}</p>
    </div>

    <div v-if="paginatedClients.length > 0" class="card p-4 w-100 mt-4" style="max-width: 600px;">
      <h4 class="mb-3">Resultado</h4>

      <div v-for="client in paginatedClients" :key="client._id" class="mb-4 p-3 border rounded shadow-sm">
        <p><strong>Nome:</strong> {{ client.name }}</p>
        <p><strong>Empresa:</strong> {{ client.empresa }}</p>
        <p><strong>CPF:</strong> {{ client.cpf }}</p>
        <p><strong>CNPJ:</strong> {{ client.cnpj }}</p>
        <p><strong>WhatsApp:</strong> {{ client.whatsapp }}</p>
        <p><strong>Telefone:</strong> {{ client.telefone }}</p>
        <p><strong>Email:</strong> {{ client.emailEmpresa }}</p>
        <p><strong>Endereço:</strong> {{ client.endereco }}</p>

        <!-- Placeholder for future edit functionality if needed -->
        <!-- <button class="btn btn-primary btn-sm mt-2" @click="goToEdit(client)">Editar</button> -->
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

const router = useRouter()
const baseUrl = `${API_URL}/api/clients`

const searchType = ref('')
const searchValue = ref('')
const clients = ref<any[]>([])
const page = ref(1)
const perPage = 20
const notFound = ref(false)

// const goToEdit = (client: any) => {
//   router.push(`/editar-cliente/${client._id}`)
// }

watch(searchValue, (val) => {
  if (searchType.value === 'cpf') {
    searchValue.value = val.replace(/\D/g, '').slice(0, 11).replace(/(\d{3})(\d)/, '$1.$2').replace(/(\d{3})(\d)/, '$1.$2').replace(/(\d{3})(\d{1,2})$/, '$1-$2')
  } else if (searchType.value === 'cnpj') {
    searchValue.value = val.replace(/\D/g, '').slice(0, 14).replace(/^(\d{2})(\d)/, '$1.$2').replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3').replace(/^(\d{2})\.(\d{3})\.(\d{3})(\d)/, '$1.$2.$3/$4').replace(/(\d{4})(\d{1,2})$/, '$1-$2')
  } else if (searchType.value === 'whatsapp') {
    searchValue.value = val.replace(/\D/g, '').slice(0, 11).replace(/^(\d{2})(\d)/, '($1)$2').replace(/(\d{5})(\d{4})$/, '$1-$2')
  } else if (searchType.value === 'telefone') {
    searchValue.value = val.replace(/\D/g, '').slice(0, 10).replace(/^(\d{2})(\d)/, '($1)$2').replace(/(\d{4})(\d{4})$/, '$1-$2')
  }
})

watch(searchType, () => {
  searchValue.value = ''
})

const labelForType = computed(() => {
  switch (searchType.value) {
    case 'name': return 'Nome do Cliente'
    case 'empresa': return 'Empresa'
    case 'cpf': return 'CPF'
    case 'cnpj': return 'CNPJ'
    case 'whatsapp': return 'WhatsApp'
    case 'telefone': return 'Telefone'
    case 'email': return 'E-mail'
    default: return ''
  }
})

const paginatedClients = computed(() => {
  const start = (page.value - 1) * perPage
  return clients.value.slice(start, start + perPage)
})

const totalPages = computed(() => Math.ceil(clients.value.length / perPage))

const notFoundMessage = computed(() => 'Nenhum registro encontrado.')

const searchClient = async () => {
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
    // Check client.routes.ts for route definitions 
    const routeMap: Record<string, string> = {
      name: 'name',
      empresa: 'empresa',
      cpf: 'cpf',
      cnpj: 'cnpj',
      whatsapp: 'whatsapp',
      telefone: 'telefone',
      email: 'email'
    }

    const endpoint = routeMap[searchType.value]
    url = `${baseUrl}/${endpoint}/${encoded}`
  }

  try {
    const response = await fetch(url, {
      headers: { Authorization: `Bearer ${token}` }
    })

    const result = await response.json()

    if (!Array.isArray(result)) {
       // Backend returns 404 with objects for not found, but if found single obj?
       // Controller returns array in all cases for search methods I implemented, 
       // but let's handle if it returns single object just in case or error message
       if (result && result.message) {
         // likely error or not found
         clients.value = []
         notFound.value = true
       } else {
         clients.value = [result]
         notFound.value = false
       }
    } else {
      clients.value = result
      notFound.value = result.length === 0
    }

    page.value = 1
  } catch (err) {
    console.error('Erro ao buscar clientes:', err)
    clients.value = []
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

.gradient-overlay {
  display: none;
}

.card {
  background-color: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(0, 0, 0, 0.1);
  border-radius: 1rem;
  color: var(--text-color);
}
</style>
