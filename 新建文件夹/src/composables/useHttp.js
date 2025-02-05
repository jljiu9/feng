import { ref } from 'vue'

export function useHttp() {
  const loading = ref(false)
  const error = ref(null)

  const request = async (url, options = {}) => {
    loading.value = true
    error.value = null

    try {
      // 添加token到请求头
      const token = localStorage.getItem('token')
      const headers = {
        'Content-Type': 'application/json',
        ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
        ...options.headers
      }

      const response = await fetch(url, {
        ...options,
        headers
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      return data
    } catch (e) {
      error.value = e.message
      throw e
    } finally {
      loading.value = false
    }
  }

  const get = (url, options = {}) => {
    return request(url, { ...options, method: 'GET' })
  }

  const post = (url, data, options = {}) => {
    return request(url, {
      ...options,
      method: 'POST',
      body: JSON.stringify(data)
    })
  }

  const put = (url, data, options = {}) => {
    return request(url, {
      ...options,
      method: 'PUT',
      body: JSON.stringify(data)
    })
  }

  const del = (url, options = {}) => {
    return request(url, { ...options, method: 'DELETE' })
  }

  return {
    loading,
    error,
    get,
    post,
    put,
    del
  }
} 