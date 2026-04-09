import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import ProtectedRoute from './components/ProtectedRoute'
import PublicRoute from './components/PublicRoute'
import HomePage from './pages/HomePage'
import TodosPage from './pages/TodosPage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import UsersListPage from './pages/UsersListPage'
import NotFoundPage from './pages/NotFoundPage'
import './App.css'

import { useAppDispatch, useAppSelector } from './hooks/useRedux'
import { loginSuccess, loginFailure, loginStart } from './store/slices/authSlice'
import api, { getAccessToken } from './services/apiService'
import { UserRole } from '@monorepo/types'

function App() {
  const dispatch = useAppDispatch()
  const { loading } = useAppSelector((state) => state.auth)

  React.useEffect(() => {
    const checkAuth = async () => {
      // If we have no token in memory, we can't be logged in (since no localStorage)
      if (!getAccessToken()) {
        dispatch(loginFailure())
        return
      }
      
      dispatch(loginStart())
      try {
        const response = await api.get('/auth/me')
        // Usually /auth/me returns the user object directly or nested in data
        const userData = response.data.data?.user || response.data.user || response.data
        dispatch(loginSuccess({ data: { user: userData, tokens: { accessToken: getAccessToken() } } }))
      } catch (err) {
        dispatch(loginFailure())
      }
    }
    checkAuth()
  }, [dispatch])

  if (loading) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-slate-950">
        <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <Router>
      <Routes>
        <Route element={<PublicRoute />}>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
        </Route>
        
        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<Layout />}>
            <Route index element={<HomePage />} />
            <Route path="todos" element={<TodosPage />} />
            <Route path="users" element={<ProtectedRoute allowedRoles={[UserRole.ADMIN]} />}>
              <Route index element={<UsersListPage />} />
            </Route>
            <Route path="*" element={<NotFoundPage />} />
          </Route>
        </Route>
      </Routes>
    </Router>
  )
}

export default App
