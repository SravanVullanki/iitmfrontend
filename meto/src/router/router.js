import { createRouter, createWebHistory } from 'vue-router';
import AdminSummary from '../components/admin/admin_summary.vue';
import AdminBoiler from '../components/admin/adminboiler.vue';
import AdminHome from '../components/admin/adminhome.vue';
import Customers from '../components/admin/customers.vue';
import EditService from '../components/admin/editservice.vue';
import Professionals from '../components/admin/professionals.vue';
import ServiceRequests from '../components/admin/service_requests.vue';
import Services from '../components/admin/services.vue';
import ForgotPassword from '../components/authentication/forgot_password.vue';
import Login from '../components/authentication/login.vue';
import Registration from '../components/authentication/registration.vue';
import ResetPassword from '../components/authentication/reset_password.vue';
import VerifyOtp from '../components/authentication/verify_otp.vue';
import BookService from '../components/customer/book_service.vue';
import CustomerBoiler from '../components/customer/customerboiler.vue';
import CustomerHome from '../components/customer/customerhome.vue';
import History from '../components/customer/history.vue';
import CustomerProfile from '../components/customer/profile.vue';
import CustomerServices from '../components/customer/services.vue';
import CustomerSummary from '../components/customer/summary.vue';
import Home from '../components/general/home.vue';
import ActiveServices from '../components/professional/activeservices.vue';
import AllServices from '../components/professional/allservices.vue';
import ProfessionalBoiler from '../components/professional/professionalboiler.vue';
import ProfessionalHome from '../components/professional/professionalhome.vue';
import ProfessionalProfile from '../components/professional/profile.vue';
import ProfessionalSummary from '../components/professional/summary.vue'

const routes = [
    { path: '/', component: Home },
    { path: '/admin/summary', component: AdminSummary },
    { path: '/admin/boiler', component: AdminBoiler },
    { path: '/admin/home', component: AdminHome },
    { path: '/admin/customers', component: Customers },
    { path: '/admin/editservice/:service_id', component: EditService },
    { path: '/admin/professionals', component: Professionals },
    { path: '/admin/servicerequests', component: ServiceRequests },
    { path: '/admin/services', component: Services },
    { path: '/auth/forgotpassword', component: ForgotPassword },
    { path: '/auth/login', component: Login },
    { path: '/auth/registration', component: Registration },
    { path: '/auth/resetpassword', component: ResetPassword },
    { path: '/auth/verifyotp', component: VerifyOtp },
    { path: '/customer/bookservice', component: BookService },
    { path: '/customer/boiler', component: CustomerBoiler },
    { path: '/customer/home', component: CustomerHome },
    { path: '/customer/history', component: History },
    { path: '/customer/profile', component: CustomerProfile },
    { path: '/customer/services', component: CustomerServices },
    { path: '/customer/summary', component: CustomerSummary },
    { path: '/professional/activeservices', component: ActiveServices },
    { path: '/professional/allservices', component: AllServices },
    { path: '/professional/boiler', component: ProfessionalBoiler },
    { path: '/professional/home', component: ProfessionalHome },
    { path: '/professional/summary', component: ProfessionalSummary },
    { path: '/professional/profile', component: ProfessionalProfile }
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

export default router;

