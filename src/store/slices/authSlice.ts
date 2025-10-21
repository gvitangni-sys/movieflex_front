import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface User {
  id: string;
  email: string;
  subscription: 'free' | 'basic' | 'premium';
  subscriptionExpires: string | null;
  isEmailVerified: boolean;
  createdAt: string;
  isSubscriptionActive: boolean;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  token: string | null;
}

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: false,
  token: localStorage.getItem('netflix_token'),
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginStart: (state) => {
      state.isLoading = true;
    },
    loginSuccess: (state, action: PayloadAction<{ user: User; token: string }>) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.isAuthenticated = true;
      state.isLoading = false;
      
      // Sauvegarder le token dans le localStorage
      localStorage.setItem('netflix_token', action.payload.token);
    },
    loginFailure: (state) => {
      state.isLoading = false;
      state.token = null;
      localStorage.removeItem('netflix_token');
    },
    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.isLoading = false;
      state.token = null;
      localStorage.removeItem('netflix_token');
    },
    setUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
      state.isAuthenticated = true;
    },
    updateSubscription: (state, action: PayloadAction<{ subscription: 'free' | 'basic' | 'premium'; subscriptionExpires: string }>) => {
      if (state.user) {
        state.user.subscription = action.payload.subscription;
        state.user.subscriptionExpires = action.payload.subscriptionExpires;
        state.user.isSubscriptionActive = true;
      }
    },
    cancelSubscriptionSuccess: (state) => {
      if (state.user) {
        state.user.subscription = 'free';
        state.user.subscriptionExpires = null;
        state.user.isSubscriptionActive = false;
      }
    },
    verifyEmail: (state) => {
      if (state.user) {
        state.user.isEmailVerified = true;
      }
    },
  },
});

export const { 
  loginStart, 
  loginSuccess, 
  loginFailure, 
  logout, 
  setUser, 
  updateSubscription, 
  verifyEmail,
  cancelSubscriptionSuccess
} = authSlice.actions;
export default authSlice.reducer;
