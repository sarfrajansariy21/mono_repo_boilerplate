import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { setAccessToken } from '../../services/apiService'
import { User, ApiResponse, AuthResponse } from '@monorepo/types'

interface AuthState {
  user: User | null
  isAuthenticated: boolean
  loading: boolean
}

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  loading: false,
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginStart: (state) => {
      state.loading = true
    },
    loginSuccess: (state, action: PayloadAction<any>) => {
      state.loading = false
      state.isAuthenticated = true
      
      // Accessing response structure provided by user
      const { user, tokens } = action.payload.data || {}
      state.user = user
      
      if (tokens?.accessToken) {
        setAccessToken(tokens.accessToken)
      }
    },
    loginFailure: (state) => {
      state.loading = false
    },
    logout: (state) => {
      state.isAuthenticated = false
      state.user = null
      setAccessToken(null)
    },
  },
})

export const { loginStart, loginSuccess, loginFailure, logout } = authSlice.actions
export default authSlice.reducer
