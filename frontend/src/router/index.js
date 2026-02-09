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
import ConfigurationPage from '../components/ConfigurationPage.vue';
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
        meta: { requiresAuth: true, requiresAdmin: true }
    },
    { path: '/search-ticket',
        component: SearchTickets,
        meta: { requiresAuth: true }
    },
    { path: '/search-client',
        component: SearchClients,
        meta: { requiresAuth: true, requiresAdmin: true }
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
    },
    {
        path: '/delete-employee',
        component: () => import('../components/DeleteEmployee.vue'),
        meta: { requiresAuth: true }
    },
    {
        path: '/configuration',
        component: ConfigurationPage,
        meta: { requiresAuth: true }
    }
];
const router = createRouter({
    history: createWebHistory(),
    routes,
    scrollBehavior(to, from, savedPosition) {
        // scroll to top for all route navigations
        if (savedPosition) {
            return savedPosition;
        }
        return { top: 0 };
    }
});
// Helper to decode JWT payload safely
function parseJwt(token) {
    try {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function (c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));
        return JSON.parse(jsonPayload);
    }
    catch (e) {
        return null;
    }
}
router.beforeEach((to, from, next) => {
    const token = localStorage.getItem('token');
    if (to.meta.requiresAuth && !token) {
        next('/login'); // 🔒 redireciona para login se não tiver token
    }
    else {
        // Check for admin requirement
        if (to.meta.requiresAdmin) {
            const payload = parseJwt(token || '');
            if (payload && payload.role === 'admin') {
                next();
            }
            else {
                // Identify if user is authenticated but not admin
                if (token) {
                    // Optional: redirect to dashboard or show unauthorized
                    next('/dashboard');
                }
                else {
                    next('/login');
                }
            }
        }
        else {
            next();
        }
    }
});
export default router;
// Forced update
