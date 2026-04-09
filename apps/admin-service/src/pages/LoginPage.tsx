import React, { useState } from 'react'
import { LoginForm } from '@monorepo/shared-ui'
import api from '../services/apiService'

const LoginPage: React.FC = () => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleLogin = async (email: string, password: string) => {
    setLoading(true)
    setError('')
    try {
      const response = await api.post('/auth/login', { email, password })
      console.log('Admin login successful:', response.data)
      alert(`Welcome to ${import.meta.env.VITE_APP_NAME}!`)
    } catch (err: any) {
      setError(err.response?.data?.message || 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <LoginForm
      onSubmit={handleLogin}
      loading={loading}
      error={error}
      dashboardTitle={import.meta.env.VITE_APP_NAME || "Admin Panel"}
    />
  )
}

export default LoginPage
