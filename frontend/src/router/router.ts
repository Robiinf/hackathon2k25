import * as VueRouter from 'vue-router';
import LoginPage from '../pages/authentication/LoginPage.vue';
import RegisterPage from '../pages/authentication/RegisterPage.vue';
import HomePage from '../pages/HomePage.vue';
import ListWorkflowsPage from '../pages/workflow/ListWorkflowsPage.vue';
import WorkflowDetailsPage from '../pages/workflow/WorkflowDetailsPage.vue';
import WorkflowGeneratorPage from '../pages/workflow/WorkflowGeneratorPage.vue';
import WorkflowPage from '../pages/workflow/WorkflowPage.vue';

const routes = [
    { path: '/', component: HomePage },
    { path: '/register', component: RegisterPage },
    { path: '/login', component: LoginPage },
    { path: '/workflow-generator', component: WorkflowGeneratorPage },
    { path: "/workflow", component: WorkflowPage },
    { path: "/workflows", component: ListWorkflowsPage },
    { path: '/workflows/:id', component: WorkflowDetailsPage },
    { path: '/workflow/:id', redirect: to => `/workflows/${to.params.id}` }
]


const router = VueRouter.createRouter({
    history: VueRouter.createWebHistory(),
    routes,
})

export default router