import { defineComponent, ref } from 'vue';
import { API_URL } from '../config';
import BackButton from './BackButton.vue';
export default defineComponent({
    name: 'RegisterTicketForm',
    components: { BackButton },
    setup() {
        const startStep = ref(0);
        const selectedCpfCnpj = ref('');
        const selectedContact = ref('');
        const ticket = ref({
            cpf: '',
            cnpj: '',
            telefone: '',
            whatsapp: '',
            cliente: '',
            empresa: '',
            emailEmpresa: '',
            descricaoServico: '',
        });
        const isCpfValid = ref(true);
        const isCnpjValid = ref(true);
        const isEmailValid = ref(true);
        const selectCpfCnpj = (tipo) => {
            selectedCpfCnpj.value = tipo;
            startStep.value = 2;
        };
        const selectContact = (tipo) => {
            selectedContact.value = tipo;
            startStep.value = 3;
        };
        const onCpfInput = () => {
            ticket.value.cpf = ticket.value.cpf.replace(/\D/g, '').replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4').slice(0, 14);
            const cpfRegex = /^\d{3}\.\d{3}\.\d{3}-\d{2}$/;
            isCpfValid.value = cpfRegex.test(ticket.value.cpf);
        };
        const onCnpjInput = () => {
            ticket.value.cnpj = ticket.value.cnpj.replace(/\D/g, '').replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5').slice(0, 18);
            const cnpjRegex = /^\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}$/;
            isCnpjValid.value = cnpjRegex.test(ticket.value.cnpj);
        };
        const onTelefoneInput = () => {
            ticket.value.telefone = ticket.value.telefone
                .replace(/\D/g, '')
                .replace(/(\d{2})(\d{4})(\d{0,4})/, '($1)$2-$3')
                .slice(0, 13);
        };
        const onWhatsappInput = () => {
            ticket.value.whatsapp = ticket.value.whatsapp.replace(/\D/g, '').replace(/(\d{2})(\d{5})(\d{4})/, '($1)$2-$3').slice(0, 14);
        };
        const validateForm = () => {
            isEmailValid.value = ticket.value.emailEmpresa === '' || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(ticket.value.emailEmpresa);
        };
        const formValidation = () => {
            const cpfValid = selectedCpfCnpj.value !== 'cpf' || isCpfValid.value;
            const cnpjValid = selectedCpfCnpj.value !== 'cnpj' || isCnpjValid.value;
            const phoneValid = selectedContact.value !== 'telefone' || (ticket.value.telefone && ticket.value.telefone.length >= 13);
            const whatsappValid = selectedContact.value !== 'whatsapp' || (ticket.value.whatsapp && ticket.value.whatsapp.length >= 14);
            const requiredFields = ticket.value.cliente && ticket.value.empresa && ticket.value.descricaoServico;
            const emailOk = !ticket.value.emailEmpresa || isEmailValid.value;
            return cpfValid && cnpjValid && phoneValid && whatsappValid && requiredFields && emailOk;
        };
        const isLoading = ref(false);
        const handleSubmit = async () => {
            if (!formValidation() || isLoading.value)
                return;
            isLoading.value = true;
            const token = localStorage.getItem('token');
            if (!token) {
                alert('Você precisa estar logado para criar uma nota de serviço.');
                return;
            }
            try {
                const response = await fetch(`${API_URL}/api/tickets/`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify(ticket.value),
                });
                if (response.ok) {
                    alert('Nota de serviço criada com sucesso!');
                    startStep.value = 0;
                }
                else {
                    const error = await response.json();
                    alert(error.message || 'Erro ao criar nota de serviço.');
                }
            }
            catch (error) {
                console.error('Erro ao criar nota de serviço:', error);
                alert('Erro ao enviar nota de serviço.');
            }
            finally {
                isLoading.value = false;
            }
        };
        return {
            startStep,
            selectedCpfCnpj,
            selectedContact,
            ticket,
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
if (__VLS_ctx.startStep === 0) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "mt-2 text-center position-relative" },
        ...{ style: {} },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)({
        ...{ onClick: (...[$event]) => {
                if (!(__VLS_ctx.startStep === 0))
                    return;
                __VLS_ctx.startStep = 1;
            } },
        ...{ class: "btn btn-warning fw-bold px-4 rounded-pill btn-sm" },
    });
    (__VLS_ctx.$t('ticket.startRegister'));
}
if (__VLS_ctx.startStep === 1) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "glass-card p-4 mt-3 w-100 position-relative" },
        ...{ style: {} },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.h6, __VLS_intrinsicElements.h6)({
        ...{ class: "mb-3 text-center fw-bold" },
    });
    (__VLS_ctx.$t('ticket.useCPFOrCNPJ'));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "d-flex justify-content-around" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)({
        ...{ onClick: (...[$event]) => {
                if (!(__VLS_ctx.startStep === 1))
                    return;
                __VLS_ctx.selectCpfCnpj('cpf');
            } },
        ...{ class: "btn btn-warning btn-sm px-4" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)({
        ...{ onClick: (...[$event]) => {
                if (!(__VLS_ctx.startStep === 1))
                    return;
                __VLS_ctx.selectCpfCnpj('cnpj');
            } },
        ...{ class: "btn btn-warning btn-sm px-4" },
    });
}
if (__VLS_ctx.startStep === 2) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "glass-card p-4 w-100 mt-3 position-relative" },
        ...{ style: {} },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.h6, __VLS_intrinsicElements.h6)({
        ...{ class: "mb-3 text-center fw-bold" },
    });
    (__VLS_ctx.$t('ticket.usePhoneOrWhatsApp'));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "d-flex justify-content-around" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)({
        ...{ onClick: (...[$event]) => {
                if (!(__VLS_ctx.startStep === 2))
                    return;
                __VLS_ctx.selectContact('telefone');
            } },
        ...{ class: "btn btn-warning btn-sm px-4" },
    });
    (__VLS_ctx.$t('ticket.phone'));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)({
        ...{ onClick: (...[$event]) => {
                if (!(__VLS_ctx.startStep === 2))
                    return;
                __VLS_ctx.selectContact('whatsapp');
            } },
        ...{ class: "btn btn-warning btn-sm px-4" },
    });
    (__VLS_ctx.$t('ticket.whatsapp'));
}
if (__VLS_ctx.startStep === 3) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.form, __VLS_intrinsicElements.form)({
        ...{ onSubmit: (__VLS_ctx.handleSubmit) },
        ...{ class: "glass-card p-4 border rounded shadow-sm w-100 mt-3 position-relative" },
        ...{ style: {} },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.h4, __VLS_intrinsicElements.h4)({
        ...{ class: "mb-3 text-center text-gradient fw-bold" },
    });
    (__VLS_ctx.$t('ticket.register'));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "row" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "col-md-6 mb-2" },
    });
    if (__VLS_ctx.selectedCpfCnpj === 'cpf') {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: "form-group" },
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.label, __VLS_intrinsicElements.label)({
            for: "cpf",
            ...{ class: "form-label small mb-1" },
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.input)({
            ...{ onInput: (__VLS_ctx.onCpfInput) },
            type: "text",
            ...{ class: "form-control form-control-sm" },
            id: "cpf",
            value: (__VLS_ctx.ticket.cpf),
            maxlength: "14",
            required: true,
        });
        if (__VLS_ctx.ticket.cpf && !__VLS_ctx.isCpfValid) {
            __VLS_asFunctionalElement(__VLS_intrinsicElements.small, __VLS_intrinsicElements.small)({
                ...{ class: "text-danger small-text" },
            });
            (__VLS_ctx.$t('ticket.invalidCPF'));
        }
    }
    if (__VLS_ctx.selectedCpfCnpj === 'cnpj') {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: "form-group" },
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.label, __VLS_intrinsicElements.label)({
            for: "cnpj",
            ...{ class: "form-label small mb-1" },
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.input)({
            ...{ onInput: (__VLS_ctx.onCnpjInput) },
            type: "text",
            ...{ class: "form-control form-control-sm" },
            id: "cnpj",
            value: (__VLS_ctx.ticket.cnpj),
            maxlength: "18",
            required: true,
        });
        if (__VLS_ctx.ticket.cnpj && !__VLS_ctx.isCnpjValid) {
            __VLS_asFunctionalElement(__VLS_intrinsicElements.small, __VLS_intrinsicElements.small)({
                ...{ class: "text-danger small-text" },
            });
            (__VLS_ctx.$t('ticket.invalidCNPJ'));
        }
    }
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "col-md-6 mb-2" },
    });
    if (__VLS_ctx.selectedContact === 'telefone') {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: "form-group" },
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.label, __VLS_intrinsicElements.label)({
            for: "telefone",
            ...{ class: "form-label small mb-1" },
        });
        (__VLS_ctx.$t('ticket.phone'));
        __VLS_asFunctionalElement(__VLS_intrinsicElements.input)({
            ...{ onInput: (__VLS_ctx.onTelefoneInput) },
            type: "tel",
            ...{ class: "form-control form-control-sm" },
            id: "telefone",
            maxlength: "15",
            placeholder: "(00)00000-0000",
            required: true,
        });
        (__VLS_ctx.ticket.telefone);
        if (__VLS_ctx.ticket.telefone && __VLS_ctx.ticket.telefone.length < 13) {
            __VLS_asFunctionalElement(__VLS_intrinsicElements.small, __VLS_intrinsicElements.small)({
                ...{ class: "text-danger small-text" },
            });
            (__VLS_ctx.$t('ticket.invalidPhone'));
        }
    }
    if (__VLS_ctx.selectedContact === 'whatsapp') {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: "form-group" },
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.label, __VLS_intrinsicElements.label)({
            for: "whatsapp",
            ...{ class: "form-label small mb-1" },
        });
        (__VLS_ctx.$t('ticket.whatsapp'));
        __VLS_asFunctionalElement(__VLS_intrinsicElements.input)({
            ...{ onInput: (__VLS_ctx.onWhatsappInput) },
            type: "tel",
            ...{ class: "form-control form-control-sm" },
            id: "whatsapp",
            maxlength: "15",
            placeholder: "(00)00000-0000",
            required: true,
        });
        (__VLS_ctx.ticket.whatsapp);
        if (__VLS_ctx.ticket.whatsapp && __VLS_ctx.ticket.whatsapp.length < 14) {
            __VLS_asFunctionalElement(__VLS_intrinsicElements.small, __VLS_intrinsicElements.small)({
                ...{ class: "text-danger small-text" },
            });
            (__VLS_ctx.$t('ticket.invalidPhone'));
        }
    }
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "row" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "col-md-6 mb-2" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.label, __VLS_intrinsicElements.label)({
        for: "cliente",
        ...{ class: "form-label small mb-1" },
    });
    (__VLS_ctx.$t('ticket.client'));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.input)({
        ...{ onInput: (__VLS_ctx.validateForm) },
        type: "text",
        ...{ class: "form-control form-control-sm" },
        id: "cliente",
        value: (__VLS_ctx.ticket.cliente),
        required: true,
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "col-md-6 mb-2" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.label, __VLS_intrinsicElements.label)({
        for: "empresa",
        ...{ class: "form-label small mb-1" },
    });
    (__VLS_ctx.$t('ticket.company'));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.input)({
        ...{ onInput: (__VLS_ctx.validateForm) },
        type: "text",
        ...{ class: "form-control form-control-sm" },
        id: "empresa",
        value: (__VLS_ctx.ticket.empresa),
        required: true,
    });
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
    (__VLS_ctx.ticket.emailEmpresa);
    if (__VLS_ctx.ticket.emailEmpresa && !__VLS_ctx.isEmailValid) {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.small, __VLS_intrinsicElements.small)({
            ...{ class: "text-danger small-text" },
        });
        (__VLS_ctx.$t('ticket.invalidEmail'));
    }
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "form-group mb-3" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.label, __VLS_intrinsicElements.label)({
        for: "descricaoServico",
        ...{ class: "form-label small mb-1" },
    });
    (__VLS_ctx.$t('ticket.description'));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.textarea, __VLS_intrinsicElements.textarea)({
        ...{ onInput: (__VLS_ctx.validateForm) },
        ...{ class: "form-control form-control-sm" },
        id: "descricaoServico",
        value: (__VLS_ctx.ticket.descricaoServico),
        rows: "2",
        required: true,
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)({
        type: "submit",
        ...{ class: "btn btn-primary w-100 custom-btn hover-green btn-sm fw-bold" },
        disabled: (!__VLS_ctx.formValidation() || __VLS_ctx.isLoading),
    });
    (__VLS_ctx.isLoading ? __VLS_ctx.$t('common.loading') : __VLS_ctx.$t('ticket.createButton'));
}
/** @type {__VLS_StyleScopedClasses['d-flex']} */ ;
/** @type {__VLS_StyleScopedClasses['flex-column']} */ ;
/** @type {__VLS_StyleScopedClasses['align-items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['full-height']} */ ;
/** @type {__VLS_StyleScopedClasses['position-relative']} */ ;
/** @type {__VLS_StyleScopedClasses['pt-2']} */ ;
/** @type {__VLS_StyleScopedClasses['page-background']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-2']} */ ;
/** @type {__VLS_StyleScopedClasses['text-center']} */ ;
/** @type {__VLS_StyleScopedClasses['position-relative']} */ ;
/** @type {__VLS_StyleScopedClasses['btn']} */ ;
/** @type {__VLS_StyleScopedClasses['btn-warning']} */ ;
/** @type {__VLS_StyleScopedClasses['fw-bold']} */ ;
/** @type {__VLS_StyleScopedClasses['px-4']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-pill']} */ ;
/** @type {__VLS_StyleScopedClasses['btn-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['glass-card']} */ ;
/** @type {__VLS_StyleScopedClasses['p-4']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-3']} */ ;
/** @type {__VLS_StyleScopedClasses['w-100']} */ ;
/** @type {__VLS_StyleScopedClasses['position-relative']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-3']} */ ;
/** @type {__VLS_StyleScopedClasses['text-center']} */ ;
/** @type {__VLS_StyleScopedClasses['fw-bold']} */ ;
/** @type {__VLS_StyleScopedClasses['d-flex']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-content-around']} */ ;
/** @type {__VLS_StyleScopedClasses['btn']} */ ;
/** @type {__VLS_StyleScopedClasses['btn-warning']} */ ;
/** @type {__VLS_StyleScopedClasses['btn-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['px-4']} */ ;
/** @type {__VLS_StyleScopedClasses['btn']} */ ;
/** @type {__VLS_StyleScopedClasses['btn-warning']} */ ;
/** @type {__VLS_StyleScopedClasses['btn-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['px-4']} */ ;
/** @type {__VLS_StyleScopedClasses['glass-card']} */ ;
/** @type {__VLS_StyleScopedClasses['p-4']} */ ;
/** @type {__VLS_StyleScopedClasses['w-100']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-3']} */ ;
/** @type {__VLS_StyleScopedClasses['position-relative']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-3']} */ ;
/** @type {__VLS_StyleScopedClasses['text-center']} */ ;
/** @type {__VLS_StyleScopedClasses['fw-bold']} */ ;
/** @type {__VLS_StyleScopedClasses['d-flex']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-content-around']} */ ;
/** @type {__VLS_StyleScopedClasses['btn']} */ ;
/** @type {__VLS_StyleScopedClasses['btn-warning']} */ ;
/** @type {__VLS_StyleScopedClasses['btn-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['px-4']} */ ;
/** @type {__VLS_StyleScopedClasses['btn']} */ ;
/** @type {__VLS_StyleScopedClasses['btn-warning']} */ ;
/** @type {__VLS_StyleScopedClasses['btn-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['px-4']} */ ;
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
/** @type {__VLS_StyleScopedClasses['form-group']} */ ;
/** @type {__VLS_StyleScopedClasses['form-label']} */ ;
/** @type {__VLS_StyleScopedClasses['small']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-1']} */ ;
/** @type {__VLS_StyleScopedClasses['form-control']} */ ;
/** @type {__VLS_StyleScopedClasses['form-control-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['text-danger']} */ ;
/** @type {__VLS_StyleScopedClasses['small-text']} */ ;
/** @type {__VLS_StyleScopedClasses['form-group']} */ ;
/** @type {__VLS_StyleScopedClasses['form-label']} */ ;
/** @type {__VLS_StyleScopedClasses['small']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-1']} */ ;
/** @type {__VLS_StyleScopedClasses['form-control']} */ ;
/** @type {__VLS_StyleScopedClasses['form-control-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['text-danger']} */ ;
/** @type {__VLS_StyleScopedClasses['small-text']} */ ;
/** @type {__VLS_StyleScopedClasses['col-md-6']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-2']} */ ;
/** @type {__VLS_StyleScopedClasses['form-group']} */ ;
/** @type {__VLS_StyleScopedClasses['form-label']} */ ;
/** @type {__VLS_StyleScopedClasses['small']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-1']} */ ;
/** @type {__VLS_StyleScopedClasses['form-control']} */ ;
/** @type {__VLS_StyleScopedClasses['form-control-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['text-danger']} */ ;
/** @type {__VLS_StyleScopedClasses['small-text']} */ ;
/** @type {__VLS_StyleScopedClasses['form-group']} */ ;
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
/** @type {__VLS_StyleScopedClasses['col-md-6']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-2']} */ ;
/** @type {__VLS_StyleScopedClasses['form-label']} */ ;
/** @type {__VLS_StyleScopedClasses['small']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-1']} */ ;
/** @type {__VLS_StyleScopedClasses['form-control']} */ ;
/** @type {__VLS_StyleScopedClasses['form-control-sm']} */ ;
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
/** @type {__VLS_StyleScopedClasses['btn']} */ ;
/** @type {__VLS_StyleScopedClasses['btn-primary']} */ ;
/** @type {__VLS_StyleScopedClasses['w-100']} */ ;
/** @type {__VLS_StyleScopedClasses['custom-btn']} */ ;
/** @type {__VLS_StyleScopedClasses['hover-green']} */ ;
/** @type {__VLS_StyleScopedClasses['btn-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['fw-bold']} */ ;
var __VLS_dollars;
let __VLS_self;
