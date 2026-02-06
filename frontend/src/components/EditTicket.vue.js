import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { API_URL } from '../config';
const route = useRoute();
const router = useRouter();
const notaServico = route.params.notaServico;
const token = localStorage.getItem('token');
const formData = ref({
    cliente: '',
    empresa: '',
    cpf: '',
    cnpj: '',
    telefone: '',
    whatsapp: '',
    emailEmpresa: '',
    descricaoServico: '',
});
const isUpdating = ref(false);
const fields = {
    cliente: 'Cliente',
    empresa: 'Empresa',
    cpf: 'CPF',
    cnpj: 'CNPJ',
    telefone: 'Telefone',
    whatsapp: 'WhatsApp',
    emailEmpresa: 'Email',
};
const onCpfInput = () => {
    formData.value.cpf = formData.value.cpf
        .replace(/\D/g, '')
        .replace(/(\d{3})(\d{3})(\d{3})(\d{0,2})/, '$1.$2.$3-$4')
        .slice(0, 14);
};
const onCnpjInput = () => {
    formData.value.cnpj = formData.value.cnpj
        .replace(/\D/g, '')
        .replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{0,2})/, '$1.$2.$3/$4-$5')
        .slice(0, 18);
};
const onTelefoneInput = () => {
    formData.value.telefone = formData.value.telefone
        .replace(/\D/g, '')
        .replace(/(\d{2})(\d{4})(\d{0,4})/, '($1)$2-$3')
        .slice(0, 13);
};
const onWhatsappInput = () => {
    formData.value.whatsapp = formData.value.whatsapp
        .replace(/\D/g, '')
        .replace(/(\d{2})(\d{5})(\d{4})/, '($1)$2-$3')
        .slice(0, 14);
};
const fetchTicket = async () => {
    try {
        const response = await fetch(`${API_URL}/api/tickets/nota/${encodeURIComponent(notaServico)}`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        const data = await response.json();
        Object.assign(formData.value, data);
    }
    catch (err) {
        alert('Erro ao buscar ticket.');
        router.push('/dashboard');
    }
};
const handleUpdateTicket = async () => {
    if (!token) {
        router.push('/login');
        return;
    }
    if (isUpdating.value)
        return;
    isUpdating.value = true;
    const updatedFields = {};
    for (const key in formData.value) {
        if (formData.value[key])
            updatedFields[key] = formData.value[key];
    }
    if (Object.keys(updatedFields).length === 0) {
        alert('Preencha pelo menos um campo.');
        return;
    }
    try {
        const response = await fetch(`${API_URL}/api/tickets/nota/${notaServico}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify(updatedFields)
        });
        if (!response.ok) {
            const err = await response.json();
            alert(err.message || 'Erro ao atualizar ticket.');
            return;
        }
        alert('Nota de Serviço atualizada com sucesso!');
        router.push('/dashboard');
    }
    catch (err) {
        alert('Erro ao tentar atualizar.');
    }
    finally {
        isUpdating.value = false;
    }
};
onMounted(() => {
    if (!notaServico)
        return router.push('/dashboard');
    fetchTicket();
});
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_ctx = {};
let __VLS_components;
let __VLS_directives;
// CSS variable injection 
// CSS variable injection end 
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "d-flex align-items-center justify-content-center vh-100 position-relative" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "page-background" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "glass-card p-4" },
    ...{ style: {} },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "w-100 mb-3" },
    ...{ style: {} },
});
const __VLS_0 = {}.RouterLink;
/** @type {[typeof __VLS_components.RouterLink, typeof __VLS_components.RouterLink, ]} */ ;
// @ts-ignore
const __VLS_1 = __VLS_asFunctionalComponent(__VLS_0, new __VLS_0({
    to: "/dashboard",
    ...{ class: "btn btn-primary w-100 fw-bold rounded-pill" },
}));
const __VLS_2 = __VLS_1({
    to: "/dashboard",
    ...{ class: "btn btn-primary w-100 fw-bold rounded-pill" },
}, ...__VLS_functionalComponentArgsRest(__VLS_1));
__VLS_3.slots.default;
var __VLS_3;
__VLS_asFunctionalElement(__VLS_intrinsicElements.h2, __VLS_intrinsicElements.h2)({
    ...{ class: "text-center fw-bold text-gradient mb-3" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.form, __VLS_intrinsicElements.form)({
    ...{ onSubmit: (__VLS_ctx.handleUpdateTicket) },
});
for (const [label, key] of __VLS_getVForSourceType((__VLS_ctx.fields))) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "mb-2" },
        key: (key),
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.label, __VLS_intrinsicElements.label)({
        for: (key),
        ...{ class: "form-label" },
    });
    (label);
    __VLS_asFunctionalElement(__VLS_intrinsicElements.input)({
        ...{ onInput: (...[$event]) => {
                key === 'cpf' ? __VLS_ctx.onCpfInput() :
                    key === 'cnpj' ? __VLS_ctx.onCnpjInput() :
                        key === 'telefone' ? __VLS_ctx.onTelefoneInput() :
                            key === 'whatsapp' ? __VLS_ctx.onWhatsappInput() : null;
            } },
        type: (key === 'emailEmpresa' ? 'email' : 'text'),
        ...{ class: "form-control" },
        id: (key),
        placeholder: (label),
    });
    (__VLS_ctx.formData[key]);
}
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "mb-3" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.label, __VLS_intrinsicElements.label)({
    for: "descricaoServico",
    ...{ class: "form-label" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.textarea, __VLS_intrinsicElements.textarea)({
    value: (__VLS_ctx.formData.descricaoServico),
    id: "descricaoServico",
    ...{ class: "form-control" },
    placeholder: "Descreva o problema",
    rows: "3",
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)({
    type: "submit",
    ...{ class: "btn btn-warning w-100 fw-semibold rounded-pill" },
    disabled: (__VLS_ctx.isUpdating),
});
(__VLS_ctx.isUpdating ? 'Atualizando...' : 'Atualizar Nota de Serviço');
/** @type {__VLS_StyleScopedClasses['d-flex']} */ ;
/** @type {__VLS_StyleScopedClasses['align-items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-content-center']} */ ;
/** @type {__VLS_StyleScopedClasses['vh-100']} */ ;
/** @type {__VLS_StyleScopedClasses['position-relative']} */ ;
/** @type {__VLS_StyleScopedClasses['page-background']} */ ;
/** @type {__VLS_StyleScopedClasses['glass-card']} */ ;
/** @type {__VLS_StyleScopedClasses['p-4']} */ ;
/** @type {__VLS_StyleScopedClasses['w-100']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-3']} */ ;
/** @type {__VLS_StyleScopedClasses['btn']} */ ;
/** @type {__VLS_StyleScopedClasses['btn-primary']} */ ;
/** @type {__VLS_StyleScopedClasses['w-100']} */ ;
/** @type {__VLS_StyleScopedClasses['fw-bold']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-pill']} */ ;
/** @type {__VLS_StyleScopedClasses['text-center']} */ ;
/** @type {__VLS_StyleScopedClasses['fw-bold']} */ ;
/** @type {__VLS_StyleScopedClasses['text-gradient']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-3']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-2']} */ ;
/** @type {__VLS_StyleScopedClasses['form-label']} */ ;
/** @type {__VLS_StyleScopedClasses['form-control']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-3']} */ ;
/** @type {__VLS_StyleScopedClasses['form-label']} */ ;
/** @type {__VLS_StyleScopedClasses['form-control']} */ ;
/** @type {__VLS_StyleScopedClasses['btn']} */ ;
/** @type {__VLS_StyleScopedClasses['btn-warning']} */ ;
/** @type {__VLS_StyleScopedClasses['w-100']} */ ;
/** @type {__VLS_StyleScopedClasses['fw-semibold']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-pill']} */ ;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup() {
        return {
            formData: formData,
            isUpdating: isUpdating,
            fields: fields,
            onCpfInput: onCpfInput,
            onCnpjInput: onCnpjInput,
            onTelefoneInput: onTelefoneInput,
            onWhatsappInput: onWhatsappInput,
            handleUpdateTicket: handleUpdateTicket,
        };
    },
});
export default (await import('vue')).defineComponent({
    setup() {
        return {};
    },
});
; /* PartiallyEnd: #4569/main.vue */
