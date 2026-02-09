import { ref, computed, watch } from 'vue';
import { useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';
import { API_URL } from '../config';
import BackButton from './BackButton.vue';
const router = useRouter();
const baseUrl = `${API_URL}/api/clients`;
const searchType = ref('');
const searchValue = ref('');
const clients = ref([]);
const page = ref(1);
const perPage = 20;
const notFound = ref(false);
// const goToEdit = (client: any) => {
//   router.push(`/editar-cliente/${client._id}`)
// }
watch(searchValue, (val) => {
    if (searchType.value === 'cpf') {
        searchValue.value = val.replace(/\D/g, '').slice(0, 11).replace(/(\d{3})(\d)/, '$1.$2').replace(/(\d{3})(\d)/, '$1.$2').replace(/(\d{3})(\d{1,2})$/, '$1-$2');
    }
    else if (searchType.value === 'cnpj') {
        searchValue.value = val.replace(/\D/g, '').slice(0, 14).replace(/^(\d{2})(\d)/, '$1.$2').replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3').replace(/^(\d{2})\.(\d{3})\.(\d{3})(\d)/, '$1.$2.$3/$4').replace(/(\d{4})(\d{1,2})$/, '$1-$2');
    }
    else if (searchType.value === 'whatsapp') {
        searchValue.value = val.replace(/\D/g, '').slice(0, 11).replace(/^(\d{2})(\d)/, '($1)$2').replace(/(\d{5})(\d{4})$/, '$1-$2');
    }
    else if (searchType.value === 'telefone') {
        searchValue.value = val.replace(/\D/g, '').slice(0, 10).replace(/^(\d{2})(\d)/, '($1)$2').replace(/(\d{4})(\d{4})$/, '$1-$2');
    }
});
watch(searchType, () => {
    searchValue.value = '';
});
const { t } = useI18n();
const labelForType = computed(() => {
    switch (searchType.value) {
        case 'name': return t('client.name');
        case 'empresa': return t('client.company');
        case 'cpf': return 'CPF';
        case 'cnpj': return 'CNPJ';
        case 'whatsapp': return t('ticket.whatsapp');
        case 'telefone': return t('ticket.phone');
        case 'email': return t('employee.email');
        default: return '';
    }
});
const paginatedClients = computed(() => {
    const start = (page.value - 1) * perPage;
    return clients.value.slice(start, start + perPage);
});
const totalPages = computed(() => Math.ceil(clients.value.length / perPage));
const notFoundMessage = computed(() => 'Nenhum registro encontrado.');
const searchClient = async () => {
    if (!searchType.value)
        return;
    if (searchType.value === 'email' && !/^\S+@\S+\.\S+$/.test(searchValue.value)) {
        alert('E-mail inválido');
        return;
    }
    let url = '';
    const token = localStorage.getItem('token');
    const encoded = encodeURIComponent(searchValue.value);
    if (searchType.value === 'all') {
        url = `${baseUrl}/all`;
    }
    else {
        // Check client.routes.ts for route definitions 
        const routeMap = {
            name: 'name',
            empresa: 'empresa',
            cpf: 'cpf',
            cnpj: 'cnpj',
            whatsapp: 'whatsapp',
            telefone: 'telefone',
            email: 'email'
        };
        const endpoint = routeMap[searchType.value];
        url = `${baseUrl}/${endpoint}/${encoded}`;
    }
    try {
        const response = await fetch(url, {
            headers: { Authorization: `Bearer ${token}` }
        });
        const result = await response.json();
        if (!Array.isArray(result)) {
            // Backend returns 404 with objects for not found, but if found single obj?
            // Controller returns array in all cases for search methods I implemented, 
            // but let's handle if it returns single object just in case or error message
            if (result && result.message) {
                // likely error or not found
                clients.value = [];
                notFound.value = true;
            }
            else {
                clients.value = [result];
                notFound.value = false;
            }
        }
        else {
            clients.value = result;
            notFound.value = result.length === 0;
        }
        page.value = 1;
    }
    catch (err) {
        console.error('Erro ao buscar clientes:', err);
        clients.value = [];
        notFound.value = true;
    }
};
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_ctx = {};
let __VLS_components;
let __VLS_directives;
// CSS variable injection 
// CSS variable injection end 
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "full-height d-flex flex-column align-items-center p-4 position-relative" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "page-background" },
});
/** @type {[typeof BackButton, ]} */ ;
// @ts-ignore
const __VLS_0 = __VLS_asFunctionalComponent(BackButton, new BackButton({
    to: "/dashboard",
}));
const __VLS_1 = __VLS_0({
    to: "/dashboard",
}, ...__VLS_functionalComponentArgsRest(__VLS_0));
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "card p-4 w-100" },
    ...{ style: {} },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.h2, __VLS_intrinsicElements.h2)({
    ...{ class: "mb-4 text-center text-gradient fw-bold" },
});
(__VLS_ctx.$t('client.search'));
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "form-group mb-3" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.label, __VLS_intrinsicElements.label)({
    ...{ class: "form-label" },
});
(__VLS_ctx.$t('client.searchBy'));
__VLS_asFunctionalElement(__VLS_intrinsicElements.select, __VLS_intrinsicElements.select)({
    value: (__VLS_ctx.searchType),
    ...{ class: "form-select" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.option, __VLS_intrinsicElements.option)({
    disabled: true,
    value: "",
});
(__VLS_ctx.$t('employee.selectOption'));
__VLS_asFunctionalElement(__VLS_intrinsicElements.option, __VLS_intrinsicElements.option)({
    value: "name",
});
(__VLS_ctx.$t('client.name'));
__VLS_asFunctionalElement(__VLS_intrinsicElements.option, __VLS_intrinsicElements.option)({
    value: "empresa",
});
(__VLS_ctx.$t('client.company'));
__VLS_asFunctionalElement(__VLS_intrinsicElements.option, __VLS_intrinsicElements.option)({
    value: "cpf",
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.option, __VLS_intrinsicElements.option)({
    value: "cnpj",
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.option, __VLS_intrinsicElements.option)({
    value: "whatsapp",
});
(__VLS_ctx.$t('ticket.whatsapp'));
__VLS_asFunctionalElement(__VLS_intrinsicElements.option, __VLS_intrinsicElements.option)({
    value: "telefone",
});
(__VLS_ctx.$t('ticket.phone'));
__VLS_asFunctionalElement(__VLS_intrinsicElements.option, __VLS_intrinsicElements.option)({
    value: "email",
});
(__VLS_ctx.$t('employee.email'));
__VLS_asFunctionalElement(__VLS_intrinsicElements.option, __VLS_intrinsicElements.option)({
    value: "all",
});
(__VLS_ctx.$t('client.allClients'));
if (__VLS_ctx.searchType !== '' && __VLS_ctx.searchType !== 'all') {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "form-group mb-3" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.label, __VLS_intrinsicElements.label)({
        ...{ class: "form-label" },
    });
    (__VLS_ctx.labelForType);
    __VLS_asFunctionalElement(__VLS_intrinsicElements.input)({
        ...{ class: "form-control" },
        type: (__VLS_ctx.searchType === 'email' ? 'email' : 'text'),
        placeholder: (__VLS_ctx.labelForType),
        required: true,
    });
    (__VLS_ctx.searchValue);
}
__VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)({
    ...{ onClick: (__VLS_ctx.searchClient) },
    ...{ class: "btn btn-warning w-100" },
});
(__VLS_ctx.$t('client.searchButton'));
if (__VLS_ctx.notFound) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({
        ...{ class: "text-danger text-center mt-3 fw-bold" },
    });
    (__VLS_ctx.$t('client.noResults'));
}
if (__VLS_ctx.paginatedClients.length > 0) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "card p-4 w-100 mt-4" },
        ...{ style: {} },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.h4, __VLS_intrinsicElements.h4)({
        ...{ class: "mb-3" },
    });
    (__VLS_ctx.$t('employee.results'));
    for (const [client] of __VLS_getVForSourceType((__VLS_ctx.paginatedClients))) {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            key: (client._id),
            ...{ class: "mb-4 p-3 border rounded shadow-sm" },
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({});
        __VLS_asFunctionalElement(__VLS_intrinsicElements.strong, __VLS_intrinsicElements.strong)({});
        (__VLS_ctx.$t('client.name'));
        (client.name);
        __VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({});
        __VLS_asFunctionalElement(__VLS_intrinsicElements.strong, __VLS_intrinsicElements.strong)({});
        (__VLS_ctx.$t('client.company'));
        (client.empresa);
        __VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({});
        __VLS_asFunctionalElement(__VLS_intrinsicElements.strong, __VLS_intrinsicElements.strong)({});
        (client.cpf);
        __VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({});
        __VLS_asFunctionalElement(__VLS_intrinsicElements.strong, __VLS_intrinsicElements.strong)({});
        (client.cnpj);
        __VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({});
        __VLS_asFunctionalElement(__VLS_intrinsicElements.strong, __VLS_intrinsicElements.strong)({});
        (__VLS_ctx.$t('ticket.whatsapp'));
        (client.whatsapp);
        __VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({});
        __VLS_asFunctionalElement(__VLS_intrinsicElements.strong, __VLS_intrinsicElements.strong)({});
        (__VLS_ctx.$t('ticket.phone'));
        (client.telefone);
        __VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({});
        __VLS_asFunctionalElement(__VLS_intrinsicElements.strong, __VLS_intrinsicElements.strong)({});
        (__VLS_ctx.$t('employee.email'));
        (client.emailEmpresa);
        __VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({});
        __VLS_asFunctionalElement(__VLS_intrinsicElements.strong, __VLS_intrinsicElements.strong)({});
        (__VLS_ctx.$t('employee.address'));
        (client.endereco);
    }
    if (__VLS_ctx.totalPages > 1) {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: "d-flex justify-content-between mt-3" },
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)({
            ...{ onClick: (...[$event]) => {
                    if (!(__VLS_ctx.paginatedClients.length > 0))
                        return;
                    if (!(__VLS_ctx.totalPages > 1))
                        return;
                    __VLS_ctx.page--;
                } },
            ...{ class: "btn btn-outline-light" },
            disabled: (__VLS_ctx.page === 1),
        });
        (__VLS_ctx.$t('common.previous'));
        __VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)({
            ...{ onClick: (...[$event]) => {
                    if (!(__VLS_ctx.paginatedClients.length > 0))
                        return;
                    if (!(__VLS_ctx.totalPages > 1))
                        return;
                    __VLS_ctx.page++;
                } },
            ...{ class: "btn btn-outline-light" },
            disabled: (__VLS_ctx.page === __VLS_ctx.totalPages),
        });
        (__VLS_ctx.$t('common.next'));
    }
}
/** @type {__VLS_StyleScopedClasses['full-height']} */ ;
/** @type {__VLS_StyleScopedClasses['d-flex']} */ ;
/** @type {__VLS_StyleScopedClasses['flex-column']} */ ;
/** @type {__VLS_StyleScopedClasses['align-items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['p-4']} */ ;
/** @type {__VLS_StyleScopedClasses['position-relative']} */ ;
/** @type {__VLS_StyleScopedClasses['page-background']} */ ;
/** @type {__VLS_StyleScopedClasses['card']} */ ;
/** @type {__VLS_StyleScopedClasses['p-4']} */ ;
/** @type {__VLS_StyleScopedClasses['w-100']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-4']} */ ;
/** @type {__VLS_StyleScopedClasses['text-center']} */ ;
/** @type {__VLS_StyleScopedClasses['text-gradient']} */ ;
/** @type {__VLS_StyleScopedClasses['fw-bold']} */ ;
/** @type {__VLS_StyleScopedClasses['form-group']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-3']} */ ;
/** @type {__VLS_StyleScopedClasses['form-label']} */ ;
/** @type {__VLS_StyleScopedClasses['form-select']} */ ;
/** @type {__VLS_StyleScopedClasses['form-group']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-3']} */ ;
/** @type {__VLS_StyleScopedClasses['form-label']} */ ;
/** @type {__VLS_StyleScopedClasses['form-control']} */ ;
/** @type {__VLS_StyleScopedClasses['btn']} */ ;
/** @type {__VLS_StyleScopedClasses['btn-warning']} */ ;
/** @type {__VLS_StyleScopedClasses['w-100']} */ ;
/** @type {__VLS_StyleScopedClasses['text-danger']} */ ;
/** @type {__VLS_StyleScopedClasses['text-center']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-3']} */ ;
/** @type {__VLS_StyleScopedClasses['fw-bold']} */ ;
/** @type {__VLS_StyleScopedClasses['card']} */ ;
/** @type {__VLS_StyleScopedClasses['p-4']} */ ;
/** @type {__VLS_StyleScopedClasses['w-100']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-4']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-3']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-4']} */ ;
/** @type {__VLS_StyleScopedClasses['p-3']} */ ;
/** @type {__VLS_StyleScopedClasses['border']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded']} */ ;
/** @type {__VLS_StyleScopedClasses['shadow-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['d-flex']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-content-between']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-3']} */ ;
/** @type {__VLS_StyleScopedClasses['btn']} */ ;
/** @type {__VLS_StyleScopedClasses['btn-outline-light']} */ ;
/** @type {__VLS_StyleScopedClasses['btn']} */ ;
/** @type {__VLS_StyleScopedClasses['btn-outline-light']} */ ;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup() {
        return {
            BackButton: BackButton,
            searchType: searchType,
            searchValue: searchValue,
            page: page,
            notFound: notFound,
            labelForType: labelForType,
            paginatedClients: paginatedClients,
            totalPages: totalPages,
            searchClient: searchClient,
        };
    },
});
export default (await import('vue')).defineComponent({
    setup() {
        return {};
    },
});
; /* PartiallyEnd: #4569/main.vue */
