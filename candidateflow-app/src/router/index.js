// router/index.js
import { createRouter, createWebHistory } from 'vue-router'

// Импортируем компоненты с правильными путями
const AdminDashboard = () => import('../components/AdminDashboard.vue')
const ApplicationForm = () => import('../components/ApplicationForm.vue')
const LoginForm = () => import('../components/LoginForm.vue')
const RegisterForm = () => import('../components/RegisterForm.vue')

// Определяем маршруты
const routes = [
  {
    path: '/',
    redirect: '/apply'
  },
  {
    path: '/apply',
    name: 'apply',
    component: ApplicationForm
  },
  {
    path: '/admin',
    name: 'admin',
    component: AdminDashboard,
    meta: { requiresAuth: true }
  },
  {
    path: '/admin/analytics',
    name: 'analytics',
    component: AdminDashboard,
    meta: { requiresAuth: true }
  },
  {
    path: '/login',
    name: 'login',
    component: LoginForm
  },
  {
    path: '/register',
    name: 'register',
    component: RegisterForm
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: '/apply'
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// Guard для проверки авторизации
router.beforeEach((to, from) => {
  const isAuthenticated = localStorage.getItem('currentUser')
  
  if (to.meta.requiresAuth && !isAuthenticated) {
    return '/login'
  }
  if ((to.path === '/login' || to.path === '/register') && isAuthenticated) {
    return '/admin'
  }
  // разрешаем переход
  return true
})

export default router