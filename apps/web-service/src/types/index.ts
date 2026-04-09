export interface User {
  id: string
  firstName: string
  lastName: string
  email: string
  role: 'admin' | 'user'
  createdAt: string | Date
}

export interface Todo {
  id: string
  text: string
  completed: boolean
}

export interface AuthState {
  user: User | null
  isAuthenticated: boolean
  loading: boolean
}
