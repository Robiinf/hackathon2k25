import * as VueRouter from 'vue-router';
import LoginPage from '../pages/authentication/LoginPage.vue';
import RegisterPage from '../pages/authentication/RegisterPage.vue';
import HomePage from '../pages/HomePage.vue';

const routes = [
    { path: '/', component: HomePage },
    { path: '/register', component: RegisterPage },
    { path: '/login', component: LoginPage },
]

const router = VueRouter.createRouter({
    history: VueRouter.createWebHistory(),
    routes,
})

export default router