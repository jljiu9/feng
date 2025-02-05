import { ref } from 'vue'
import { useRouter } from 'vue-router'

export function useAuth() {
  const user = ref(null)
  const token = ref(localStorage.getItem('token'))
  const router = useRouter()

  const login = async (username, password) => {
    try {
      // 这里替换为实际的登录API调用
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      })
      const data = await response.json()
      
      if (data.token) {
        token.value = data.token
        user.value = data.user
        localStorage.setItem('token', data.token)
        router.push('/')
        return true
      }
      return false
    } catch (error) {
      console.error('登录失败:', error)
      return false
    }
  }

  const logout = () => {
    token.value = null
    user.value = null
    localStorage.removeItem('token')
    router.push('/login')
  }

  const checkAuth = () => {
    return !!token.value
  }

  return {
    user,
    token,
    login,
    logout,
    checkAuth
  }
} 