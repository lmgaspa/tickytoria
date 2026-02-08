<template>
  <div class="d-flex flex-column align-items-center full-height position-relative pt-2" style="z-index: 1;">
    <div class="page-background"></div>

    <!-- Botão de voltar fixo -->
    <div class="w-100 mt-3 px-3 position-relative text-center" style="max-width: 600px; z-index: 1;">
      <RouterLink to="/dashboard" class="btn btn-success fw-bold rounded-pill px-4 btn-sm">
        {{ $t('common.back') }}
      </RouterLink>
    </div>

    <!-- Botão de início do cadastro (aparece só na etapa 0) -->
    <div v-if="startStep === 0" class="mt-2 text-center position-relative" style="z-index: 1;">
      <button class="btn btn-warning fw-bold px-4 rounded-pill btn-sm" @click="startStep = 1">{{ $t('ticket.startRegister') }}</button>
    </div>

    <!-- Etapa 1 -->
    <div v-if="startStep === 1" class="glass-card p-4 mt-3 w-100 position-relative" style="max-width: 600px; z-index: 1;">
      <h6 class="mb-3 text-center fw-bold">{{ $t('ticket.useCPFOrCNPJ') }}</h6>
      <div class="d-flex justify-content-around">
        <button class="btn btn-warning btn-sm px-4" @click="selectCpfCnpj('cpf')">CPF</button>
        <button class="btn btn-warning btn-sm px-4" @click="selectCpfCnpj('cnpj')">CNPJ</button>
      </div>
    </div>

    <div v-if="startStep === 2" class="glass-card p-4 w-100 mt-3 position-relative" style="max-width: 600px; z-index: 1;">
      <h6 class="mb-3 text-center fw-bold">{{ $t('ticket.usePhoneOrWhatsApp') }}</h6>
      <div class="d-flex justify-content-around">
        <button class="btn btn-warning btn-sm px-4" @click="selectContact('telefone')">{{ $t('ticket.phone') }}</button>
        <button class="btn btn-warning btn-sm px-4" @click="selectContact('whatsapp')">{{ $t('ticket.whatsapp') }}</button>
      </div>
    </div>

    <form v-if="startStep === 3" @submit.prevent="handleSubmit" class="glass-card p-4 border rounded shadow-sm w-100 mt-3 position-relative" style="max-width: 800px; z-index: 1;">
      <h4 class="mb-3 text-center text-gradient fw-bold">{{ $t('client.register') }}</h4>

      <div class="row">
        <div class="col-md-6 mb-2">
          <div v-if="selectedCpfCnpj === 'cpf'" class="form-group">
            <label for="cpf" class="form-label small mb-1">CPF</label>
            <input type="text" class="form-control form-control-sm" id="cpf" v-model="client.cpf" @input="onCpfInput" maxlength="14" required />
            <small v-if="client.cpf && !isCpfValid" class="text-danger small-text">{{ $t('ticket.invalidCPF') }}</small>
          </div>

          <div v-if="selectedCpfCnpj === 'cnpj'" class="form-group">
            <label for="cnpj" class="form-label small mb-1">CNPJ</label>
            <input type="text" class="form-control form-control-sm" id="cnpj" v-model="client.cnpj" @input="onCnpjInput" maxlength="18" required />
            <small v-if="client.cnpj && !isCnpjValid" class="text-danger small-text">{{ $t('ticket.invalidCNPJ') }}</small>
          </div>
        </div>

        <div class="col-md-6 mb-2">
          <div v-if="selectedContact === 'telefone'" class="form-group">
            <label for="telefone" class="form-label small mb-1">{{ $t('ticket.phone') }}</label>
            <input type="tel" class="form-control form-control-sm" id="telefone" v-model="client.telefone" @input="onTelefoneInput" maxlength="15" placeholder="(00)00000-0000" required />
            <small v-if="client.telefone && client.telefone.length < 13" class="text-danger small-text">{{ $t('ticket.invalidPhone') }}</small>
          </div>

          <div v-if="selectedContact === 'whatsapp'" class="form-group">
            <label for="whatsapp" class="form-label small mb-1">{{ $t('ticket.whatsapp') }}</label>
            <input type="tel" class="form-control form-control-sm" id="whatsapp" v-model="client.whatsapp" @input="onWhatsappInput" maxlength="15" placeholder="(00)00000-0000" required />
            <small v-if="client.whatsapp && client.whatsapp.length < 14" class="text-danger small-text">{{ $t('ticket.invalidPhone') }}</small>
          </div>
        </div>
      </div>

      <div class="row">
        <div class="col-md-6 mb-2">
          <label for="nome" class="form-label small mb-1">{{ $t('client.name') }}</label>
          <input type="text" class="form-control form-control-sm" id="nome" v-model="client.name" @input="validateForm" required />
        </div>

        <div class="col-md-6 mb-2">
          <label for="empresa" class="form-label small mb-1">{{ $t('client.company') }}</label>
          <input type="text" class="form-control form-control-sm" id="empresa" v-model="client.empresa" @input="validateForm" required />
        </div>
      </div>

      <div class="form-group mb-2">
        <label for="emailEmpresa" class="form-label small mb-1">{{ $t('ticket.email') }}</label>
        <input type="email" class="form-control form-control-sm" id="emailEmpresa" v-model="client.emailEmpresa" @input="validateForm" />
        <small v-if="client.emailEmpresa && !isEmailValid" class="text-danger small-text">{{ $t('ticket.invalidEmail') }}</small>
      </div>

      <div class="form-group mb-3">
        <label for="endereco" class="form-label small mb-1">{{ $t('employee.address') }}</label>
        <textarea class="form-control form-control-sm" id="endereco" v-model="client.endereco" @input="validateForm" rows="2" required></textarea>
      </div>

      <button type="submit" class="btn btn-primary w-100 custom-btn hover-green btn-sm fw-bold" :disabled="!formValidation() || isLoading">
        {{ isLoading ? $t('common.loading') : $t('client.register') }}
      </button>
    </form>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import { API_URL } from '../config';

export default defineComponent({
  name: 'RegisterClientForm',
  setup() {
    const startStep = ref(0);
    const selectedCpfCnpj = ref('');
    const selectedContact = ref('');

    const client = ref({
      cpf: '',
      cnpj: '',
      telefone: '',
      whatsapp: '',
      name: '',
      empresa: '',
      emailEmpresa: '',
      endereco: '',
    });

    const isCpfValid = ref(true);
    const isCnpjValid = ref(true);
    const isEmailValid = ref(true);

    const selectCpfCnpj = (tipo: string) => {
      selectedCpfCnpj.value = tipo;
      startStep.value = 2;
    };

    const selectContact = (tipo: string) => {
      selectedContact.value = tipo;
      startStep.value = 3;
    };

    const onCpfInput = () => {
      client.value.cpf = client.value.cpf.replace(/\D/g, '').replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4').slice(0, 14);
      const cpfRegex = /^\d{3}\.\d{3}\.\d{3}-\d{2}$/;
      isCpfValid.value = cpfRegex.test(client.value.cpf);
    };

    const onCnpjInput = () => {
      client.value.cnpj = client.value.cnpj.replace(/\D/g, '').replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5').slice(0, 18);
      const cnpjRegex = /^\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}$/;
      isCnpjValid.value = cnpjRegex.test(client.value.cnpj);
    };

    const onTelefoneInput = () => {
      client.value.telefone = client.value.telefone
        .replace(/\D/g, '')                            
        .replace(/(\d{2})(\d{4})(\d{0,4})/, '($1)$2-$3') 
        .slice(0, 13);                                   
    };

    const onWhatsappInput = () => {
      client.value.whatsapp = client.value.whatsapp.replace(/\D/g, '').replace(/(\d{2})(\d{5})(\d{4})/, '($1)$2-$3').slice(0, 14);
    };

    const validateForm = () => {
      isEmailValid.value = client.value.emailEmpresa === '' || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(client.value.emailEmpresa);
    };

    const formValidation = () => {
      const cpfValid = selectedCpfCnpj.value !== 'cpf' || isCpfValid.value;
      const cnpjValid = selectedCpfCnpj.value !== 'cnpj' || isCnpjValid.value;
      const phoneValid = selectedContact.value !== 'telefone' || (client.value.telefone && client.value.telefone.length >= 13);
      const whatsappValid = selectedContact.value !== 'whatsapp' || (client.value.whatsapp && client.value.whatsapp.length >= 14);
      const requiredFields = client.value.name && client.value.empresa && client.value.endereco;
      const emailOk = !client.value.emailEmpresa || isEmailValid.value;
      return cpfValid && cnpjValid && phoneValid && whatsappValid && requiredFields && emailOk;
    };

    const isLoading = ref(false);

    const handleSubmit = async () => {
      if (!formValidation() || isLoading.value) return;
      isLoading.value = true;

      const token = localStorage.getItem('token');
      if (!token) {
        alert('Você precisa estar logado para cadastrar um cliente.');
        return;
      }

      try {
        const response = await fetch(`${API_URL}/api/clients/`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(client.value),
        });

        if (response.ok) {
          alert('Cliente cadastrado com sucesso!');
          startStep.value = 0;
           // Reset form
            client.value = {
              cpf: '',
              cnpj: '',
              telefone: '',
              whatsapp: '',
              name: '',
              empresa: '',
              emailEmpresa: '',
              endereco: '',
            };
        } else {
          const error = await response.json();
          alert(error.message || 'Erro ao cadastrar cliente.');
        }
      } catch (error) {
        console.error('Erro ao cadastrar cliente:', error);
        alert('Erro ao enviar cadastro.');
      } finally {
        isLoading.value = false;
      }
    };
    return {
      startStep,
      selectedCpfCnpj,
      selectedContact,
      client,
      handleSubmit,
      onCpfInput,
      onCnpjInput,
      onTelefoneInput,
      onWhatsappInput,
      validateForm,
      isCpfValid,
      isCnpjValid,
      isEmailValid,
      selectCpfCnpj,
      selectContact,
      formValidation,
      isLoading
    };
  }
});
</script>

<style scoped>

.full-height {
  position: relative;
  min-height: 100vh;
  /* background handled globally */
  overflow: hidden;
  width: 100%;
}

.gradient-overlay {
  display: none;
}

</style>
