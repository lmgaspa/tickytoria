<template>
  <div class="d-flex flex-column align-items-center full-height position-relative pt-2" style="z-index: 1;">
    <div class="page-background"></div>

    <!-- Botão de voltar fixo -->
    <!-- Botão de voltar fixo -->
    <BackButton to="/dashboard" />

    <form @submit.prevent="handleSubmit" class="glass-card p-4 border rounded shadow-sm w-100 mt-3 position-relative" style="max-width: 800px; z-index: 1;">
      <h4 class="mb-3 text-center text-gradient fw-bold">{{ $t('client.register') }}</h4>

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

      <div class="row">
        <div class="col-md-6 mb-2">
            <label for="cpf" class="form-label small mb-1">{{ $t('client.byCPF') }} ({{ $t('client.optional') }})</label>
            <input type="text" class="form-control form-control-sm" id="cpf" v-model="client.cpf" @input="onCpfInput" maxlength="14" placeholder="000.000.000-00" />
            <small v-if="client.cpf && !isCpfValid" class="text-danger small-text">{{ $t('ticket.invalidCPF') }}</small>
        </div>

        <div class="col-md-6 mb-2">
            <label for="cnpj" class="form-label small mb-1">{{ $t('client.byCNPJ') }} ({{ $t('client.optional') }})</label>
            <input type="text" class="form-control form-control-sm" id="cnpj" v-model="client.cnpj" @input="onCnpjInput" maxlength="18" placeholder="00.000.000/0000-00" />
            <small v-if="client.cnpj && !isCnpjValid" class="text-danger small-text">{{ $t('ticket.invalidCNPJ') }}</small>
        </div>
      </div>
      
      <div class="row">
        <div class="col-md-6 mb-2">
            <label for="telefone" class="form-label small mb-1">{{ $t('ticket.phone') }} ({{ $t('client.optional') }})</label>
            <input type="tel" class="form-control form-control-sm" id="telefone" v-model="client.telefone" @input="onTelefoneInput" maxlength="15" placeholder="(00)00000-0000" />
            <small v-if="client.telefone && client.telefone.length < 13" class="text-danger small-text">{{ $t('ticket.invalidPhone') }}</small>
        </div>

        <div class="col-md-6 mb-2">
            <label for="whatsapp" class="form-label small mb-1">{{ $t('ticket.whatsapp') }} ({{ $t('client.optional') }})</label>
            <input type="tel" class="form-control form-control-sm" id="whatsapp" v-model="client.whatsapp" @input="onWhatsappInput" maxlength="15" placeholder="(00)00000-0000" />
            <small v-if="client.whatsapp && client.whatsapp.length < 14" class="text-danger small-text">{{ $t('ticket.invalidPhone') }}</small>
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

      <div class="row fade-in">
        <div class="col-12 mb-2">
            <h6 class="text-gradient fw-bold small">{{ $t('client.systemAccess') }}</h6>
        </div>
        <div class="col-md-6 mb-2 position-relative">
          <label for="password" class="form-label small mb-1">{{ $t('client.accessPassword') }}</label>
          <input
            :type="showPassword ? 'text' : 'password'"
            v-model="password"
            id="password"
            class="form-control form-control-sm"
            :placeholder="$t('client.passwordPlaceholder')"
            required
          />
           <i :class="showPassword ? 'bi bi-eye-slash-fill' : 'bi bi-eye-fill'" 
             class="toggle-password-icon" 
             style="top: 32px; right: 25px;"
             @click="showPassword = !showPassword"></i>
        </div>
        <div class="col-md-6 mb-2 position-relative">
          <label for="confirmPassword" class="form-label small mb-1">{{ $t('client.confirmAccessPassword') }}</label>
          <input
            :type="showConfirm ? 'text' : 'password'"
            v-model="confirmPassword"
            id="confirmPassword"
            class="form-control form-control-sm"
            :placeholder="$t('client.repeatPassword')"
            required
          />
           <i :class="showConfirm ? 'bi bi-eye-slash-fill' : 'bi bi-eye-fill'" 
             class="toggle-password-icon" 
             style="top: 32px; right: 25px;"
             @click="showConfirm = !showConfirm"></i>
        </div>
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
import BackButton from './BackButton.vue';

export default defineComponent({
  name: 'RegisterClientForm',
  components: { BackButton },
  setup() {
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

    const createAccess = ref(true); // Always true now
    const password = ref('');
    const confirmPassword = ref('');
    const showPassword = ref(false);
    const showConfirm = ref(false);

    const isCpfValid = ref(true);
    const isCnpjValid = ref(true);
    const isEmailValid = ref(true);

    const onCpfInput = () => {
      if (!client.value.cpf) {
          isCpfValid.value = true;
          return;
      }
      client.value.cpf = client.value.cpf.replace(/\D/g, '').replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4').slice(0, 14);
      const cpfRegex = /^\d{3}\.\d{3}\.\d{3}-\d{2}$/;
      isCpfValid.value = cpfRegex.test(client.value.cpf);
    };

    const onCnpjInput = () => {
      if (!client.value.cnpj) {
          isCnpjValid.value = true;
          return;
      }
      client.value.cnpj = client.value.cnpj.replace(/\D/g, '').replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5').slice(0, 18);
      const cnpjRegex = /^\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}$/;
      isCnpjValid.value = cnpjRegex.test(client.value.cnpj);
    };

    const onTelefoneInput = () => {
      if (!client.value.telefone) return;
      client.value.telefone = client.value.telefone
        .replace(/\D/g, '')                            
        .replace(/(\d{2})(\d{4})(\d{0,4})/, '($1)$2-$3') 
        .slice(0, 13);                                   
    };

    const onWhatsappInput = () => {
      if (!client.value.whatsapp) return;
      client.value.whatsapp = client.value.whatsapp.replace(/\D/g, '').replace(/(\d{2})(\d{5})(\d{4})/, '($1)$2-$3').slice(0, 14);
    };

    const validateForm = () => {
      isEmailValid.value = client.value.emailEmpresa === '' || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(client.value.emailEmpresa);
    };

    const formValidation = () => {
      // Fields are optional, but if filled, must be valid
      const cpfValid = !client.value.cpf || isCpfValid.value;
      const cnpjValid = !client.value.cnpj || isCnpjValid.value;
      const phoneValid = !client.value.telefone || client.value.telefone.length >= 13;
      const whatsappValid = !client.value.whatsapp || client.value.whatsapp.length >= 14;
      
      const requiredFields = client.value.name && client.value.empresa && client.value.endereco;
      
      // Email is mandatory for Access Creation (which is mandatory now)
      const emailOk = client.value.emailEmpresa && isEmailValid.value;
      
      const accessOk = password.value && password.value.length >= 8 && password.value === confirmPassword.value; 

      return cpfValid && cnpjValid && phoneValid && whatsappValid && requiredFields && emailOk && accessOk;
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
        const payload = {
          ...client.value,
          createAccess: createAccess.value,
          password: password.value
        };

        const response = await fetch(`${API_URL}/api/clients/`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(payload),
        });

        if (response.ok) {
          alert('Cliente cadastrado com sucesso!');
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
            password.value = '';
            confirmPassword.value = '';
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
      formValidation,
      isLoading,
      createAccess,
      password,
      confirmPassword,
      showPassword,
      showConfirm
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
