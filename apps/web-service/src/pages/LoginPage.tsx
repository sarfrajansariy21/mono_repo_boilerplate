import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '../hooks/useRedux'
import { loginStart, loginSuccess, loginFailure } from '../store/slices/authSlice'
import api from '../services/apiService'
import { LoginForm } from '@monorepo/shared-ui'

const LoginPage: React.FC = () => {
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const { isAuthenticated } = useAppSelector((state) => state.auth)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  React.useEffect(() => {
    if (isAuthenticated) {
      navigate('/')
    }
  }, [isAuthenticated, navigate])

  const handleLogin = async (email: string, password: string) => {
    setLoading(true)
    setError('')
    dispatch(loginStart())
    try {
      const response = await api.post('/auth/login', { email, password })
      dispatch(loginSuccess(response.data))
      navigate('/')
    } catch (err: any) {
      dispatch(loginFailure())
      setError(err.response?.data?.message || 'Invalid credentials')
    } finally {
      setLoading(false)
    }
  }

  return (
    <LoginForm
      onSubmit={handleLogin}
      loading={loading}
      error={error}
      dashboardTitle={import.meta.env.VITE_APP_NAME || "Web Dashboard"}
      onToggleMode={() => navigate('/register')}
    />
  )
}

export default LoginPage

