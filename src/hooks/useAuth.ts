import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { setUser, logout } from '@/store/slices/authSlice';
import { authService } from '@/services/api';
import { useToast } from '@/hooks/use-toast';
import { RootState } from '@/store/store';

// Hook pour vérifier l'authentification au chargement de l'application
export const useAuthCheck = () => {
  const dispatch = useDispatch();
  const { toast } = useToast();
  const navigate = useNavigate();
  const { isAuthenticated, token } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    const checkAuth = async () => {
      // Si un token existe mais que l'utilisateur n'est pas authentifié
      if (token && !isAuthenticated) {
        try {
          const response = await authService.getProfile();
          dispatch(setUser(response.user));
        } catch (error) {
          // Token invalide, déconnecter l'utilisateur
          dispatch(logout());
          console.error('Token invalide:', error);
        }
      }
    };

    checkAuth();
  }, [dispatch, token, isAuthenticated]);

  return { isAuthenticated, token };
};

// Hook pour protéger les routes nécessitant une authentification
export const useRequireAuth = (redirectTo: string = '/login') => {
  const { isAuthenticated } = useAuthCheck();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate(redirectTo);
    }
  }, [isAuthenticated, navigate, redirectTo]);

  return isAuthenticated;
};

// Hook pour protéger les routes d'authentification (rediriger si déjà connecté)
export const useRequireGuest = (redirectTo: string = '/home') => {
  const { isAuthenticated } = useAuthCheck();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate(redirectTo);
    }
  }, [isAuthenticated, navigate, redirectTo]);

  return !isAuthenticated;
};

// Hook pour vérifier si l'utilisateur a un abonnement actif
export const useSubscriptionCheck = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  
  const hasActiveSubscription = user?.isSubscriptionActive || false;
  const subscriptionLevel = user?.subscription || 'free';
  
  const canAccessPremium = subscriptionLevel === 'premium' && hasActiveSubscription;
  const canAccessBasic = (subscriptionLevel === 'basic' || subscriptionLevel === 'premium') && hasActiveSubscription;

  return {
    hasActiveSubscription,
    subscriptionLevel,
    canAccessPremium,
    canAccessBasic,
    isFreeUser: subscriptionLevel === 'free' || !hasActiveSubscription
  };
};
