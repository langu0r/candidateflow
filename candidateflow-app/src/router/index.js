// router/index.js
import { createRouter, createWebHistory } from 'vue-router'

// Импортируем компоненты
import AdminDashboard from '../components/AdminDashboard.vue'
import ApplicationForm from '../components/ApplicationForm.vue'
import LoginForm from '../components/LoginForm.vue'
import RegisterForm from '../components/RegisterForm.vue'
import Analytics from '../components/Analytics.vue'

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
    component: AdminDashboard, // Важно! Используем тот же компонент
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

// Создаем роутер
const router = createRouter({
  history: createWebHistory(),
  routes
})

// Guard для проверки авторизации
router.beforeEach((to, from, next) => {
  const isAuthenticated = localStorage.getItem('currentUser')
  
  if (to.meta.requiresAuth && !isAuthenticated) {
    next('/login')
  } else if ((to.path === '/login' || to.path === '/register') && isAuthenticated) {
    next('/admin')
  } else {
    next()
  }
})

export default router