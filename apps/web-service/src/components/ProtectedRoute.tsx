import React from 'react'
import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAppSelector } from '../hooks/useRedux'
import { UserRole } from '@monorepo/types'

interface ProtectedRouteProps {
  allowedRoles?: UserRole[]
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ allowedRoles }) => {
  const { isAuthenticated, user, loading } = useAppSelector((state) => state.auth)
  const location = useLocation()

  if (loading) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-slate-950">
        <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  if (allowedRoles && user && !allowedRoles.includes(user.role)) {
    console.warn('Access denied: Unauthorized role', {
      userRole: user.role,
      allowedRoles
    })
    return <Navigate to="/" replace />
  }

  return <Outlet />
}

export default ProtectedRoute
