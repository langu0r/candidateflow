<template>
  <div>
    <!-- Toast Container -->
    <ToastContainer ref="toastRef" />
    
    <div v-if="view === 'admin' && !currentUser">
      <LoginForm
        v-if="authView === 'login'"
        @login="handleLogin"
        @switch-to-register="authView = 'register'"
      />
      <RegisterForm
        v-else
        @register="handleRegister"
        @switch-to-login="authView = 'login'"
      />
    </div>

    <div v-else>
      <div v-if="view === 'public'">
        <div class="fixed top-4 right-4 z-50">
          <button
            @click="setView('admin')"
            class="flex items-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 shadow-lg"
          >
            <Users class="w-4 h-4" />
            Admin Dashboard
          </button>
        </div>
        <ApplicationForm @submit="handleApplicationSubmit" />
      </div>

      <div v-else>
        <div class="fixed top-4 right-4 z-50 flex gap-2">
          <button
            @click="setView('public')"
            class="flex items-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 shadow-lg"
          >
            <Briefcase class="w-4 h-4" />
            Application Form
          </button>
          <button
            v-if="currentUser"
            @click="handleLogout"
            class="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 shadow-lg"
          >
            <LogOut class="w-4 h-4" />
            Logout
          </button>
        </div>
        <AdminDashboard
          :candidates="candidates"
          @update-candidate="handleUpdateCandidate"
          @move-candidate="handleMoveCandidate"
          @add-comment="handleAddComment"
          @add-tag="handleAddTag"
          @remove-tag="handleRemoveTag"
        />
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, provide } from 'vue'
import { Users, Briefcase, LogOut } from 'lucide-vue-next'
import ApplicationForm from './components/ApplicationForm.vue'
import AdminDashboard from './components/AdminDashboard.vue'
import RegisterForm from './components/RegisterForm.vue'
import LoginForm from './components/LoginForm.vue'
import ToastContainer from './components/ToastContainer.vue'
import { toast, setToastInstance } from './utils/toast'

export default {
  name: 'App',
  components: {
    Users,
    Briefcase,
    LogOut,
    ApplicationForm,
    AdminDashboard,
    RegisterForm,
    LoginForm,
    ToastContainer
  },
  setup() {
    const toastRef = ref(null)
    const view = ref('public')
    const authView = ref('login')
    const currentUser = ref(null)
    const candidates = ref([])

    // Initial demo candidates
    const demoCandidates = [
      {
        id: '1',
        name: 'Sarah Johnson',
        email: 'sarah.j@example.com',
        phone: '+1 (555) 123-4567',
        position: 'Software Engineer',
        cvFileName: 'sarah_johnson_cv.pdf',
        cvFileData: null,
        stage: 'interview',
        tags: ['Experienced', 'Frontend'],
        comments: [
          {
            id: 'c1',
            text: 'Strong technical skills, good cultural fit',
            author: 'John Recruiter',
            timestamp: new Date('2025-02-08T10:30:00')
          }
        ],
        history: [
          {
            id: 'h1',
            action: 'Moved to Interview',
            details: 'Candidate passed initial screening',
            timestamp: new Date('2025-02-08T09:00:00')
          },
          {
            id: 'h2',
            action: 'Application Received',
            details: 'Applied for Software Engineer position',
            timestamp: new Date('2025-02-05T14:20:00')
          }
        ],
        appliedAt: new Date('2025-02-05T14:20:00')
      },
      {
        id: '2',
        name: 'Michael Chen',
        email: 'michael.chen@example.com',
        phone: '+1 (555) 234-5678',
        position: 'Marketing Intern',
        cvFileName: 'michael_chen_resume.pdf',
        cvFileData: null,
        stage: 'screening',
        tags: ['Intern', 'Marketing'],
        comments: [],
        history: [
          {
            id: 'h3',
            action: 'Application Received',
            details: 'Applied for Marketing Intern position',
            timestamp: new Date('2025-02-09T11:15:00')
          }
        ],
        appliedAt: new Date('2025-02-09T11:15:00')
      },
      {
        id: '3',
        name: 'Emily Rodriguez',
        email: 'emily.r@example.com',
        phone: '+1 (555) 345-6789',
        position: 'UX Designer',
        cvFileName: 'emily_rodriguez_portfolio.pdf',
        cvFileData: null,
        stage: 'offer',
        tags: ['Experienced', 'Design'],
        comments: [
          {
            id: 'c2',
            text: 'Excellent portfolio, ready to extend offer',
            author: 'Jane Manager',
            timestamp: new Date('2025-02-09T16:45:00')
          }
        ],
        history: [
          {
            id: 'h4',
            action: 'Moved to Offer',
            details: 'Completed all interview rounds successfully',
            timestamp: new Date('2025-02-09T16:00:00')
          },
          {
            id: 'h5',
            action: 'Interview Completed',
            details: 'Final round interview with design team',
            timestamp: new Date('2025-02-08T15:30:00')
          },
          {
            id: 'h6',
            action: 'Application Received',
            details: 'Applied for UX Designer position',
            timestamp: new Date('2025-02-06T09:00:00')
          }
        ],
        appliedAt: new Date('2025-02-06T09:00:00')
      }
    ]

    // Load user from localStorage on mount
    // Инициализация тостов
    onMounted(() => {
      if (toastRef.value) {
        setToastInstance(toastRef.value.toast)
      }
      
      // Загрузка пользователя
      const savedUser = localStorage.getItem('currentUser')
      if (savedUser) {
        try {
          currentUser.value = JSON.parse(savedUser)
        } catch (e) {
          console.error('Failed to parse saved user')
        }
      }

      // Initialize demo user if no users exist
      const users = localStorage.getItem('users')
      if (!users) {
        const demoUsers = [
          {
            id: 'demo-user',
            email: 'demo@recruiter.com',
            password: 'demo123',
            name: 'Demo Recruiter',
            role: 'recruiter',
            createdAt: new Date().toISOString()
          }
        ]
        localStorage.setItem('users', JSON.stringify(demoUsers))
      }

      // Set initial candidates
      candidates.value = [...demoCandidates]
    })

    const handleRegister = (email, password, name) => {
      const users = JSON.parse(localStorage.getItem('users') || '[]')
      
      // Check if user already exists
      if (users.find(u => u.email === email)) {
        toast.error('An account with this email already exists')
        return
      }

      const newUser = {
        id: Date.now().toString(),
        email,
        password,
        name,
        role: 'recruiter',
        createdAt: new Date().toISOString()
      }

      users.push(newUser)
      localStorage.setItem('users', JSON.stringify(users))

      // Log in the new user
      const userToStore = {
        id: newUser.id,
        email: newUser.email,
        name: newUser.name,
        role: newUser.role,
        createdAt: new Date(newUser.createdAt)
      }
      
      currentUser.value = userToStore
      localStorage.setItem('currentUser', JSON.stringify(userToStore))
      toast.success('Account created successfully!')
      view.value = 'admin'
    }

    const handleLogin = (email, password) => {
      const users = JSON.parse(localStorage.getItem('users') || '[]')
      const user = users.find(u => u.email === email && u.password === password)

      if (!user) {
        toast.error('Invalid email or password')
        return
      }

      const userToStore = {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        createdAt: new Date(user.createdAt)
      }

      currentUser.value = userToStore
      localStorage.setItem('currentUser', JSON.stringify(userToStore))
      toast.success(`Welcome back, ${user.name}!`)
      view.value = 'admin'
    }

    const handleLogout = () => {
      currentUser.value = null
      localStorage.removeItem('currentUser')
      view.value = 'public'
      toast.success('Logged out successfully')
    }

    const handleApplicationSubmit = (applicationData) => {
      const newCandidate = {
        ...applicationData,
        id: Date.now().toString(),
        stage: 'applied',
        tags: [],
        comments: [],
        history: [
          {
            id: Date.now().toString(),
            action: 'Application Received',
            details: `Applied for ${applicationData.position} position`,
            timestamp: new Date()
          }
        ],
        appliedAt: new Date()
      }

      candidates.value = [...candidates.value, newCandidate]
    }

    const handleUpdateCandidate = (candidateId, updates) => {
      candidates.value = candidates.value.map(candidate =>
        candidate.id === candidateId ? { ...candidate, ...updates } : candidate
      )
    }

    const handleMoveCandidate = (candidateId, newStage) => {
      candidates.value = candidates.value.map(candidate => {
        if (candidate.id === candidateId) {
          const stageLabels = {
            applied: 'Applied',
            screening: 'Screening',
            interview: 'Interview',
            offer: 'Offer',
            hired: 'Hired',
            rejected: 'Rejected'
          }

          return {
            ...candidate,
            stage: newStage,
            history: [
              {
                id: Date.now().toString(),
                action: `Moved to ${stageLabels[newStage]}`,
                details: `Stage changed from ${candidate.stage} to ${newStage}`,
                timestamp: new Date()
              },
              ...candidate.history
            ]
          }
        }
        return candidate
      })
    }

    const handleAddComment = (candidateId, commentText) => {
      candidates.value = candidates.value.map(candidate => {
        if (candidate.id === candidateId) {
          const newComment = {
            id: Date.now().toString(),
            text: commentText,
            author: currentUser.value?.name || 'Recruiter',
            timestamp: new Date()
          }
          return {
            ...candidate,
            comments: [...candidate.comments, newComment],
            history: [
              {
                id: Date.now().toString() + '_h',
                action: 'Comment Added',
                details: commentText,
                timestamp: new Date()
              },
              ...candidate.history
            ]
          }
        }
        return candidate
      })
    }

    const handleAddTag = (candidateId, tag) => {
      candidates.value = candidates.value.map(candidate => {
        if (candidate.id === candidateId && !candidate.tags.includes(tag)) {
          return {
            ...candidate,
            tags: [...candidate.tags, tag],
            history: [
              {
                id: Date.now().toString(),
                action: 'Tag Added',
                details: `Added tag: ${tag}`,
                timestamp: new Date()
              },
              ...candidate.history
            ]
          }
        }
        return candidate
      })
    }

    const handleRemoveTag = (candidateId, tag) => {
      candidates.value = candidates.value.map(candidate => {
        if (candidate.id === candidateId) {
          return {
            ...candidate,
            tags: candidate.tags.filter(t => t !== tag),
            history: [
              {
                id: Date.now().toString(),
                action: 'Tag Removed',
                details: `Removed tag: ${tag}`,
                timestamp: new Date()
              },
              ...candidate.history
            ]
          }
        }
        return candidate
      })
    }

    const setView = (newView) => {
      view.value = newView
    }

    return {
      view,
      authView,
      currentUser,
      candidates,
      handleRegister,
      handleLogin,
      handleLogout,
      handleApplicationSubmit,
      handleUpdateCandidate,
      handleMoveCandidate,
      handleAddComment,
      handleAddTag,
      handleRemoveTag,
      setView
    }
  }
}
</script>