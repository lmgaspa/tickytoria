import { createRouter, createWebHistory } from 'vue-router';
import HomePage from '../components/HomePage.vue';
import LoginPage from '../components/LoginPage.vue';
import RegisterPage from '../components/RegisterPage.vue';
import DashboardPage from '../components/DashboardPage.vue';
import RegisterTicketForm from '../components/RegisterTicketForm.vue';
import SearchTickets from '../components/SearchTickets.vue';
import SearchClients from '../components/SearchClients.vue';
import ForgotPassword from '../components/ForgotPassword.vue';
import PasswordSent from '../components/PasswordSent.vue';
import ResetPassword from '../components/ResetPassword.vue';
import EditTicket from '../components/EditTicket.vue';
import RegisterClientForm from '../components/RegisterClientForm.vue';
import SearchEmployees from '../components/SearchEmployees.vue';
const routes = [
    { path: '/', component: HomePage },
    { path: '/login', component: LoginPage },
    { path: '/register', component: RegisterPage },
    { path: '/forgot-password', component: ForgotPassword },
    { path: '/password-sent', component: PasswordSent },
    { path: '/reset-password', component: ResetPassword },
    {
        path: '/dashboard',
        component: DashboardPage,
        meta: { requiresAuth: true }
    },
    { path: '/register-ticket',
        component: RegisterTicketForm,
        meta: { requiresAuth: true }
    },
    { path: '/register-client',
        component: RegisterClientForm,
        meta: { requiresAuth: true }
    },
    { path: '/search-ticket',
        component: SearchTickets,
        meta: { requiresAuth: true }
    },
    { path: '/search-client',
        component: SearchClients,
        meta: { requiresAuth: true }
    },
    {
        path: '/edit-ticket/:ticketId',
        component: EditTicket,
        props: true,
        meta: { requiresAuth: true }
    },
    {
        path: '/search-employee',
        component: SearchEmployees,
        meta: { requiresAuth: true }
    }
];
const router = createRouter({
    history: createWebHistory(),
    routes
});
router.beforeEach((to, from, next) => {
    const token = localStorage.getItem('token');
    if (to.meta.requiresAuth && !token) {
        next('/login'); // 🔒 redireciona para login se não tiver token
    }
    else {
        next();
    }
});
export default router;
