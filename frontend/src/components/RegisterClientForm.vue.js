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
            if (!client.value.telefone)
                return;
            client.value.telefone = client.value.telefone
                .replace(/\D/g, '')
                .replace(/(\d{2})(\d{4})(\d{0,4})/, '($1)$2-$3')
                .slice(0, 13);
        };
        const onWhatsappInput = () => {
            if (!client.value.whatsapp)
                return;
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
            if (!formValidation() || isLoading.value)
                return;
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
                }
                else {
                    const error = await response.json();
                    alert(error.message || 'Erro ao cadastrar cliente.');
                }
            }
            catch (error) {
                console.error('Erro ao cadastrar cliente:', error);
                alert('Erro ao enviar cadastro.');
            }
            finally {
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
debugger; /* PartiallyEnd: #3632/script.vue */
const __VLS_ctx = {};
const __VLS_componentsOption = { BackButton };
let __VLS_components;
let __VLS_directives;
// CSS variable injection 
// CSS variable injection end 
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "d-flex flex-column align-items-center full-height position-relative pt-2" },
    ...{ style: {} },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "page-background" },
});
const __VLS_0 = {}.BackButton;
/** @type {[typeof __VLS_components.BackButton, ]} */ ;
// @ts-ignore
const __VLS_1 = __VLS_asFunctionalComponent(__VLS_0, new __VLS_0({
    to: "/dashboard",
}));
const __VLS_2 = __VLS_1({
    to: "/dashboard",
}, ...__VLS_functionalComponentArgsRest(__VLS_1));
__VLS_asFunctionalElement(__VLS_intrinsicElements.form, __VLS_intrinsicElements.form)({
    ...{ onSubmit: (__VLS_ctx.handleSubmit) },
    ...{ class: "glass-card p-4 border rounded shadow-sm w-100 mt-3 position-relative" },
    ...{ style: {} },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.h4, __VLS_intrinsicElements.h4)({
    ...{ class: "mb-3 text-center text-gradient fw-bold" },
});
(__VLS_ctx.$t('client.register'));
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "row" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "col-md-6 mb-2" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.label, __VLS_intrinsicElements.label)({
    for: "nome",
    ...{ class: "form-label small mb-1" },
});
(__VLS_ctx.$t('client.name'));
__VLS_asFunctionalElement(__VLS_intrinsicElements.input)({
    ...{ onInput: (__VLS_ctx.validateForm) },
    type: "text",
    ...{ class: "form-control form-control-sm" },
    id: "nome",
    value: (__VLS_ctx.client.name),
    required: true,
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "col-md-6 mb-2" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.label, __VLS_intrinsicElements.label)({
    for: "empresa",
    ...{ class: "form-label small mb-1" },
});
(__VLS_ctx.$t('client.company'));
__VLS_asFunctionalElement(__VLS_intrinsicElements.input)({
    ...{ onInput: (__VLS_ctx.validateForm) },
    type: "text",
    ...{ class: "form-control form-control-sm" },
    id: "empresa",
    value: (__VLS_ctx.client.empresa),
    required: true,
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "row" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "col-md-6 mb-2" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.label, __VLS_intrinsicElements.label)({
    for: "cpf",
    ...{ class: "form-label small mb-1" },
});
(__VLS_ctx.$t('client.byCPF'));
(__VLS_ctx.$t('client.optional'));
__VLS_asFunctionalElement(__VLS_intrinsicElements.input)({
    ...{ onInput: (__VLS_ctx.onCpfInput) },
    type: "text",
    ...{ class: "form-control form-control-sm" },
    id: "cpf",
    value: (__VLS_ctx.client.cpf),
    maxlength: "14",
    placeholder: "000.000.000-00",
});
if (__VLS_ctx.client.cpf && !__VLS_ctx.isCpfValid) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.small, __VLS_intrinsicElements.small)({
        ...{ class: "text-danger small-text" },
    });
    (__VLS_ctx.$t('ticket.invalidCPF'));
}
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "col-md-6 mb-2" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.label, __VLS_intrinsicElements.label)({
    for: "cnpj",
    ...{ class: "form-label small mb-1" },
});
(__VLS_ctx.$t('client.byCNPJ'));
(__VLS_ctx.$t('client.optional'));
__VLS_asFunctionalElement(__VLS_intrinsicElements.input)({
    ...{ onInput: (__VLS_ctx.onCnpjInput) },
    type: "text",
    ...{ class: "form-control form-control-sm" },
    id: "cnpj",
    value: (__VLS_ctx.client.cnpj),
    maxlength: "18",
    placeholder: "00.000.000/0000-00",
});
if (__VLS_ctx.client.cnpj && !__VLS_ctx.isCnpjValid) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.small, __VLS_intrinsicElements.small)({
        ...{ class: "text-danger small-text" },
    });
    (__VLS_ctx.$t('ticket.invalidCNPJ'));
}
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "row" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "col-md-6 mb-2" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.label, __VLS_intrinsicElements.label)({
    for: "telefone",
    ...{ class: "form-label small mb-1" },
});
(__VLS_ctx.$t('ticket.phone'));
(__VLS_ctx.$t('client.optional'));
__VLS_asFunctionalElement(__VLS_intrinsicElements.input)({
    ...{ onInput: (__VLS_ctx.onTelefoneInput) },
    type: "tel",
    ...{ class: "form-control form-control-sm" },
    id: "telefone",
    maxlength: "15",
    placeholder: "(00)00000-0000",
});
(__VLS_ctx.client.telefone);
if (__VLS_ctx.client.telefone && __VLS_ctx.client.telefone.length < 13) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.small, __VLS_intrinsicElements.small)({
        ...{ class: "text-danger small-text" },
    });
    (__VLS_ctx.$t('ticket.invalidPhone'));
}
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "col-md-6 mb-2" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.label, __VLS_intrinsicElements.label)({
    for: "whatsapp",
    ...{ class: "form-label small mb-1" },
});
(__VLS_ctx.$t('ticket.whatsapp'));
(__VLS_ctx.$t('client.optional'));
__VLS_asFunctionalElement(__VLS_intrinsicElements.input)({
    ...{ onInput: (__VLS_ctx.onWhatsappInput) },
    type: "tel",
    ...{ class: "form-control form-control-sm" },
    id: "whatsapp",
    maxlength: "15",
    placeholder: "(00)00000-0000",
});
(__VLS_ctx.client.whatsapp);
if (__VLS_ctx.client.whatsapp && __VLS_ctx.client.whatsapp.length < 14) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.small, __VLS_intrinsicElements.small)({
        ...{ class: "text-danger small-text" },
    });
    (__VLS_ctx.$t('ticket.invalidPhone'));
}
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "form-group mb-2" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.label, __VLS_intrinsicElements.label)({
    for: "emailEmpresa",
    ...{ class: "form-label small mb-1" },
});
(__VLS_ctx.$t('ticket.email'));
__VLS_asFunctionalElement(__VLS_intrinsicElements.input)({
    ...{ onInput: (__VLS_ctx.validateForm) },
    type: "email",
    ...{ class: "form-control form-control-sm" },
    id: "emailEmpresa",
});
(__VLS_ctx.client.emailEmpresa);
if (__VLS_ctx.client.emailEmpresa && !__VLS_ctx.isEmailValid) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.small, __VLS_intrinsicElements.small)({
        ...{ class: "text-danger small-text" },
    });
    (__VLS_ctx.$t('ticket.invalidEmail'));
}
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "form-group mb-3" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.label, __VLS_intrinsicElements.label)({
    for: "endereco",
    ...{ class: "form-label small mb-1" },
});
(__VLS_ctx.$t('employee.address'));
__VLS_asFunctionalElement(__VLS_intrinsicElements.textarea, __VLS_intrinsicElements.textarea)({
    ...{ onInput: (__VLS_ctx.validateForm) },
    ...{ class: "form-control form-control-sm" },
    id: "endereco",
    value: (__VLS_ctx.client.endereco),
    rows: "2",
    required: true,
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "row fade-in" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "col-12 mb-2" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.h6, __VLS_intrinsicElements.h6)({
    ...{ class: "text-gradient fw-bold small" },
});
(__VLS_ctx.$t('client.systemAccess'));
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "col-md-6 mb-2 position-relative" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.label, __VLS_intrinsicElements.label)({
    for: "password",
    ...{ class: "form-label small mb-1" },
});
(__VLS_ctx.$t('client.accessPassword'));
__VLS_asFunctionalElement(__VLS_intrinsicElements.input)({
    type: (__VLS_ctx.showPassword ? 'text' : 'password'),
    id: "password",
    ...{ class: "form-control form-control-sm" },
    placeholder: (__VLS_ctx.$t('client.passwordPlaceholder')),
    required: true,
});
(__VLS_ctx.password);
__VLS_asFunctionalElement(__VLS_intrinsicElements.i, __VLS_intrinsicElements.i)({
    ...{ onClick: (...[$event]) => {
            __VLS_ctx.showPassword = !__VLS_ctx.showPassword;
        } },
    ...{ class: (__VLS_ctx.showPassword ? 'bi bi-eye-slash-fill' : 'bi bi-eye-fill') },
    ...{ class: "toggle-password-icon" },
    ...{ style: {} },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "col-md-6 mb-2 position-relative" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.label, __VLS_intrinsicElements.label)({
    for: "confirmPassword",
    ...{ class: "form-label small mb-1" },
});
(__VLS_ctx.$t('client.confirmAccessPassword'));
__VLS_asFunctionalElement(__VLS_intrinsicElements.input)({
    type: (__VLS_ctx.showConfirm ? 'text' : 'password'),
    id: "confirmPassword",
    ...{ class: "form-control form-control-sm" },
    placeholder: (__VLS_ctx.$t('client.repeatPassword')),
    required: true,
});
(__VLS_ctx.confirmPassword);
__VLS_asFunctionalElement(__VLS_intrinsicElements.i, __VLS_intrinsicElements.i)({
    ...{ onClick: (...[$event]) => {
            __VLS_ctx.showConfirm = !__VLS_ctx.showConfirm;
        } },
    ...{ class: (__VLS_ctx.showConfirm ? 'bi bi-eye-slash-fill' : 'bi bi-eye-fill') },
    ...{ class: "toggle-password-icon" },
    ...{ style: {} },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)({
    type: "submit",
    ...{ class: "btn btn-primary w-100 custom-btn hover-green btn-sm fw-bold" },
    disabled: (!__VLS_ctx.formValidation() || __VLS_ctx.isLoading),
});
(__VLS_ctx.isLoading ? __VLS_ctx.$t('common.loading') : __VLS_ctx.$t('client.register'));
/** @type {__VLS_StyleScopedClasses['d-flex']} */ ;
/** @type {__VLS_StyleScopedClasses['flex-column']} */ ;
/** @type {__VLS_StyleScopedClasses['align-items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['full-height']} */ ;
/** @type {__VLS_StyleScopedClasses['position-relative']} */ ;
/** @type {__VLS_StyleScopedClasses['pt-2']} */ ;
/** @type {__VLS_StyleScopedClasses['page-background']} */ ;
/** @type {__VLS_StyleScopedClasses['glass-card']} */ ;
/** @type {__VLS_StyleScopedClasses['p-4']} */ ;
/** @type {__VLS_StyleScopedClasses['border']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded']} */ ;
/** @type {__VLS_StyleScopedClasses['shadow-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['w-100']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-3']} */ ;
/** @type {__VLS_StyleScopedClasses['position-relative']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-3']} */ ;
/** @type {__VLS_StyleScopedClasses['text-center']} */ ;
/** @type {__VLS_StyleScopedClasses['text-gradient']} */ ;
/** @type {__VLS_StyleScopedClasses['fw-bold']} */ ;
/** @type {__VLS_StyleScopedClasses['row']} */ ;
/** @type {__VLS_StyleScopedClasses['col-md-6']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-2']} */ ;
/** @type {__VLS_StyleScopedClasses['form-label']} */ ;
/** @type {__VLS_StyleScopedClasses['small']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-1']} */ ;
/** @type {__VLS_StyleScopedClasses['form-control']} */ ;
/** @type {__VLS_StyleScopedClasses['form-control-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['col-md-6']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-2']} */ ;
/** @type {__VLS_StyleScopedClasses['form-label']} */ ;
/** @type {__VLS_StyleScopedClasses['small']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-1']} */ ;
/** @type {__VLS_StyleScopedClasses['form-control']} */ ;
/** @type {__VLS_StyleScopedClasses['form-control-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['row']} */ ;
/** @type {__VLS_StyleScopedClasses['col-md-6']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-2']} */ ;
/** @type {__VLS_StyleScopedClasses['form-label']} */ ;
/** @type {__VLS_StyleScopedClasses['small']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-1']} */ ;
/** @type {__VLS_StyleScopedClasses['form-control']} */ ;
/** @type {__VLS_StyleScopedClasses['form-control-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['text-danger']} */ ;
/** @type {__VLS_StyleScopedClasses['small-text']} */ ;
/** @type {__VLS_StyleScopedClasses['col-md-6']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-2']} */ ;
/** @type {__VLS_StyleScopedClasses['form-label']} */ ;
/** @type {__VLS_StyleScopedClasses['small']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-1']} */ ;
/** @type {__VLS_StyleScopedClasses['form-control']} */ ;
/** @type {__VLS_StyleScopedClasses['form-control-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['text-danger']} */ ;
/** @type {__VLS_StyleScopedClasses['small-text']} */ ;
/** @type {__VLS_StyleScopedClasses['row']} */ ;
/** @type {__VLS_StyleScopedClasses['col-md-6']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-2']} */ ;
/** @type {__VLS_StyleScopedClasses['form-label']} */ ;
/** @type {__VLS_StyleScopedClasses['small']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-1']} */ ;
/** @type {__VLS_StyleScopedClasses['form-control']} */ ;
/** @type {__VLS_StyleScopedClasses['form-control-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['text-danger']} */ ;
/** @type {__VLS_StyleScopedClasses['small-text']} */ ;
/** @type {__VLS_StyleScopedClasses['col-md-6']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-2']} */ ;
/** @type {__VLS_StyleScopedClasses['form-label']} */ ;
/** @type {__VLS_StyleScopedClasses['small']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-1']} */ ;
/** @type {__VLS_StyleScopedClasses['form-control']} */ ;
/** @type {__VLS_StyleScopedClasses['form-control-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['text-danger']} */ ;
/** @type {__VLS_StyleScopedClasses['small-text']} */ ;
/** @type {__VLS_StyleScopedClasses['form-group']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-2']} */ ;
/** @type {__VLS_StyleScopedClasses['form-label']} */ ;
/** @type {__VLS_StyleScopedClasses['small']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-1']} */ ;
/** @type {__VLS_StyleScopedClasses['form-control']} */ ;
/** @type {__VLS_StyleScopedClasses['form-control-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['text-danger']} */ ;
/** @type {__VLS_StyleScopedClasses['small-text']} */ ;
/** @type {__VLS_StyleScopedClasses['form-group']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-3']} */ ;
/** @type {__VLS_StyleScopedClasses['form-label']} */ ;
/** @type {__VLS_StyleScopedClasses['small']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-1']} */ ;
/** @type {__VLS_StyleScopedClasses['form-control']} */ ;
/** @type {__VLS_StyleScopedClasses['form-control-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['row']} */ ;
/** @type {__VLS_StyleScopedClasses['fade-in']} */ ;
/** @type {__VLS_StyleScopedClasses['col-12']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-2']} */ ;
/** @type {__VLS_StyleScopedClasses['text-gradient']} */ ;
/** @type {__VLS_StyleScopedClasses['fw-bold']} */ ;
/** @type {__VLS_StyleScopedClasses['small']} */ ;
/** @type {__VLS_StyleScopedClasses['col-md-6']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-2']} */ ;
/** @type {__VLS_StyleScopedClasses['position-relative']} */ ;
/** @type {__VLS_StyleScopedClasses['form-label']} */ ;
/** @type {__VLS_StyleScopedClasses['small']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-1']} */ ;
/** @type {__VLS_StyleScopedClasses['form-control']} */ ;
/** @type {__VLS_StyleScopedClasses['form-control-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['toggle-password-icon']} */ ;
/** @type {__VLS_StyleScopedClasses['col-md-6']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-2']} */ ;
/** @type {__VLS_StyleScopedClasses['position-relative']} */ ;
/** @type {__VLS_StyleScopedClasses['form-label']} */ ;
/** @type {__VLS_StyleScopedClasses['small']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-1']} */ ;
/** @type {__VLS_StyleScopedClasses['form-control']} */ ;
/** @type {__VLS_StyleScopedClasses['form-control-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['toggle-password-icon']} */ ;
/** @type {__VLS_StyleScopedClasses['btn']} */ ;
/** @type {__VLS_StyleScopedClasses['btn-primary']} */ ;
/** @type {__VLS_StyleScopedClasses['w-100']} */ ;
/** @type {__VLS_StyleScopedClasses['custom-btn']} */ ;
/** @type {__VLS_StyleScopedClasses['hover-green']} */ ;
/** @type {__VLS_StyleScopedClasses['btn-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['fw-bold']} */ ;
var __VLS_dollars;
let __VLS_self;
