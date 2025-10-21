import { useToast } from "@/hooks/use-toast";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// Configuration de base pour les requêtes fetch
const apiConfig = {
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
};

// Gestionnaire d'erreurs global
const handleError = (
  error: unknown,
  toast: ReturnType<typeof useToast>["toast"]
) => {
  console.error("API Error:", error);

  if (error instanceof Error && error.message === "Failed to fetch") {
    toast({
      title: "Erreur de connexion",
      description:
        "Impossible de se connecter au serveur. Vérifiez votre connexion.",
      variant: "destructive",
    });
    return;
  }

  const message =
    error instanceof Error ? error.message : "Une erreur est survenue";
  toast({
    title: "Erreur",
    description: message,
    variant: "destructive",
  });
};

// Service d'authentification
export const authService = {
  // Inscription
  async register(email: string, password: string) {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: "POST",
        headers: apiConfig.headers,
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Erreur lors de l'inscription");
      }

      return data;
    } catch (error) {
      throw error;
    }
  },
  // Mise à jour du profil (email / mot de passe)
  async updateProfile(payload: {
    email?: string;
    currentPassword?: string;
    newPassword?: string;
  }) {
    try {
      const token = localStorage.getItem("netflix_token");
      if (!token) throw new Error("Token manquant");

      const response = await fetch(`${API_BASE_URL}/auth/profile`, {
        method: "PUT",
        headers: {
          ...apiConfig.headers,
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      if (!response.ok) {
        if (response.status === 401) {
          // Session expirée ou token invalide
          localStorage.removeItem("netflix_token");
          throw new Error("Session expirée. Veuillez vous reconnecter.");
        }
        throw new Error(
          data.message || "Erreur lors de la mise à jour du profil"
        );
      }
      return data;
    } catch (error) {
      throw error;
    }
  },

  // Connexion
  async login(email: string, password: string) {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: "POST",
        headers: apiConfig.headers,
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Email ou mot de passe incorrect");
      }

      // Sauvegarder le token dans le localStorage
      if (data.token) {
        localStorage.setItem("netflix_token", data.token);
      }

      return data;
    } catch (error) {
      throw error;
    }
  },

  // Mot de passe oublié
  async forgotPassword(email: string) {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/forgot-password`, {
        method: "POST",
        headers: apiConfig.headers,
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Erreur lors de la demande de réinitialisation"
        );
      }

      return data;
    } catch (error) {
      throw error;
    }
  },

  // Réinitialisation du mot de passe
  async resetPassword(token: string, newPassword: string) {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/reset-password`, {
        method: "POST",
        headers: apiConfig.headers,
        body: JSON.stringify({ token, newPassword }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Erreur lors de la réinitialisation");
      }

      return data;
    } catch (error) {
      throw error;
    }
  },

  // Vérification d'email
  async verifyEmail(token: string) {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/verify-email`, {
        method: "POST",
        headers: apiConfig.headers,
        body: JSON.stringify({ token }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Erreur lors de la vérification");
      }

      return data;
    } catch (error) {
      throw error;
    }
  },

  // Récupération du profil utilisateur
  async getProfile() {
    try {
      const token = localStorage.getItem("netflix_token");

      if (!token) {
        throw new Error("Token manquant");
      }

      const response = await fetch(`${API_BASE_URL}/auth/me`, {
        method: "GET",
        headers: {
          ...apiConfig.headers,
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        // Si le token est invalide, le supprimer
        if (response.status === 401) {
          localStorage.removeItem("netflix_token");
        }
        throw new Error(
          data.message || "Erreur lors de la récupération du profil"
        );
      }

      return data;
    } catch (error) {
      throw error;
    }
  },

  // Déconnexion
  logout() {
    localStorage.removeItem("netflix_token");
  },

  // Vérifier si l'utilisateur est connecté
  isAuthenticated(): boolean {
    return !!localStorage.getItem("netflix_token");
  },

  // Récupérer le token
  getToken(): string | null {
    return localStorage.getItem("netflix_token");
  },
};

// Service pour les films/séries (à implémenter plus tard)
export const moviesService = {
  async getMovies() {
    const token = authService.getToken();
    const headers: Record<string, string> = { ...apiConfig.headers };

    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_BASE_URL}/movies`, {
      method: "GET",
      headers,
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        data.message || "Erreur lors de la récupération des films"
      );
    }

    return data;
  },

  async getMovieById(id: string) {
    const token = authService.getToken();
    const headers: Record<string, string> = { ...apiConfig.headers };

    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_BASE_URL}/movies/${id}`, {
      method: "GET",
      headers,
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Erreur lors de la récupération du film");
    }

    return data;
  },
  async getStreamingUrl(id: string) {
    // Utiliser l'endpoint sécurisé avec authentification
    const token = authService.getToken();
    if (!token) {
      throw new Error("Authentification requise pour accéder au streaming");
    }

    const response = await fetch(`${API_BASE_URL}/movies/${id}/watch`, {
      method: "GET",
      headers: {
        ...apiConfig.headers,
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        data.message || "Erreur lors de la récupération de l'URL de streaming"
      );
    }

    // En production, le backend retourne déjà l'URL complète vers Vercel
    // Ne pas ajouter API_BASE_URL devant
    return data.streamingUrl;
  },
};

// Service pour les favoris
export const favoritesService = {
  async getFavorites() {
    const token = authService.getToken();
    if (!token) {
      throw new Error("Authentification requise");
    }

    const response = await fetch(`${API_BASE_URL}/auth/favorites`, {
      method: "GET",
      headers: {
        ...apiConfig.headers,
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        data.message || "Erreur lors de la récupération des favoris"
      );
    }

    return data.favorites;
  },

  async addToFavorites(movieId: string) {
    const token = authService.getToken();
    if (!token) {
      throw new Error("Authentification requise");
    }

    const response = await fetch(`${API_BASE_URL}/auth/favorites/${movieId}`, {
      method: "POST",
      headers: {
        ...apiConfig.headers,
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Erreur lors de l'ajout aux favoris");
    }

    return data;
  },

  async removeFromFavorites(movieId: string) {
    const token = authService.getToken();
    if (!token) {
      throw new Error("Authentification requise");
    }

    const response = await fetch(`${API_BASE_URL}/auth/favorites/${movieId}`, {
      method: "DELETE",
      headers: {
        ...apiConfig.headers,
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Erreur lors du retrait des favoris");
    }

    return data;
  },

  async isInFavorites(movieId: string) {
    const token = authService.getToken();
    if (!token) {
      return false;
    }

    try {
      const favorites = await this.getFavorites();
      return favorites.some(
        (favorite: { _id: string }) => favorite._id === movieId
      );
    } catch (error) {
      console.error("Erreur lors de la vérification des favoris:", error);
      return false;
    }
  },
};

// Service pour les paiements (à implémenter plus tard)
export const paymentService = {
  async createSubscription(paymentData: Record<string, unknown>) {
    const token = authService.getToken();

    if (!token) {
      throw new Error("Authentification requise");
    }

    const response = await fetch(`${API_BASE_URL}/payments/subscribe`, {
      method: "POST",
      headers: {
        ...apiConfig.headers,
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(paymentData),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        data.message || "Erreur lors de la création de l'abonnement"
      );
    }

    return data;
  },
  async cancelSubscription() {
    const token = authService.getToken();
    if (!token) throw new Error("Authentification requise");
    const response = await fetch(`${API_BASE_URL}/payments/cancel`, {
      method: "POST",
      headers: {
        ...apiConfig.headers,
        Authorization: `Bearer ${token}`,
      },
    });
    const data = await response.json();
    if (!response.ok)
      throw new Error(data.message || "Erreur lors de l'annulation");
    return data;
  },
  async getSubscriptionStatus() {
    const token = authService.getToken();
    if (!token) throw new Error("Authentification requise");
    const response = await fetch(`${API_BASE_URL}/payments/status`, {
      method: "GET",
      headers: {
        ...apiConfig.headers,
        Authorization: `Bearer ${token}`,
      },
    });
    const data = await response.json();
    if (!response.ok)
      throw new Error(data.message || "Erreur statut abonnement");
    return data;
  },
};

// Service pour l'historique de visionnage
export const watchHistoryService = {
  async getWatchHistory() {
    const token = authService.getToken();
    if (!token) {
      throw new Error("Authentification requise");
    }

    const response = await fetch(`${API_BASE_URL}/watch-history`, {
      method: "GET",
      headers: {
        ...apiConfig.headers,
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        data.message || "Erreur lors de la récupération de l'historique"
      );
    }

    return data.history;
  },

  async getWatchStats() {
    const token = authService.getToken();
    if (!token) {
      throw new Error("Authentification requise");
    }

    const response = await fetch(`${API_BASE_URL}/watch-history/stats`, {
      method: "GET",
      headers: {
        ...apiConfig.headers,
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        data.message || "Erreur lors de la récupération des statistiques"
      );
    }

    return data.stats;
  },

  async removeFromWatchHistory(id: string) {
    const token = authService.getToken();
    if (!token) {
      throw new Error("Authentification requise");
    }

    const response = await fetch(`${API_BASE_URL}/watch-history/${id}`, {
      method: "DELETE",
      headers: {
        ...apiConfig.headers,
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        data.message || "Erreur lors de la suppression de l'historique"
      );
    }

    return data;
  },

  async clearWatchHistory() {
    const token = authService.getToken();
    if (!token) {
      throw new Error("Authentification requise");
    }

    const response = await fetch(`${API_BASE_URL}/watch-history/clear`, {
      method: "DELETE",
      headers: {
        ...apiConfig.headers,
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Erreur lors du vidage de l'historique");
    }

    return data;
  },

  async addToWatchHistory(movieId: string, progress: number, duration: number) {
    const token = authService.getToken();
    if (!token) {
      throw new Error("Authentification requise");
    }

    const response = await fetch(`${API_BASE_URL}/watch-history`, {
      method: "POST",
      headers: {
        ...apiConfig.headers,
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        movieId,
        progress,
        duration,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Erreur lors de l'ajout à l'historique");
    }

    return data;
  },
};

// Service pour les notifications
export const notificationsService = {
  async getNotifications() {
    const token = authService.getToken();
    if (!token) {
      throw new Error("Authentification requise");
    }

    const response = await fetch(`${API_BASE_URL}/notifications`, {
      method: "GET",
      headers: {
        ...apiConfig.headers,
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        data.message || "Erreur lors de la récupération des notifications"
      );
    }

    return data.notifications;
  },

  async getUnreadCount() {
    const token = authService.getToken();
    if (!token) {
      return 0;
    }

    try {
      const response = await fetch(
        `${API_BASE_URL}/notifications/unread-count`,
        {
          method: "GET",
          headers: {
            ...apiConfig.headers,
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        console.error(
          "Erreur lors du comptage des notifications non lues:",
          data.message
        );
        return 0;
      }

      return data.unreadCount;
    } catch (error) {
      console.error(
        "Erreur lors du comptage des notifications non lues:",
        error
      );
      return 0;
    }
  },

  async markAsRead(notificationId: string) {
    const token = authService.getToken();
    if (!token) {
      throw new Error("Authentification requise");
    }

    const response = await fetch(
      `${API_BASE_URL}/notifications/${notificationId}/read`,
      {
        method: "PUT",
        headers: {
          ...apiConfig.headers,
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Erreur lors du marquage comme lu");
    }

    return data;
  },

  async markAllAsRead() {
    const token = authService.getToken();
    if (!token) {
      throw new Error("Authentification requise");
    }

    const response = await fetch(`${API_BASE_URL}/notifications/read-all`, {
      method: "PUT",
      headers: {
        ...apiConfig.headers,
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        data.message ||
          "Erreur lors du marquage de toutes les notifications comme lues"
      );
    }

    return data;
  },

  async createNotification(notificationData: {
    type: "subscription_renewal" | "system" | "promotion";
    title: string;
    message: string;
    actionUrl?: string;
    expiresInDays?: number;
  }) {
    const token = authService.getToken();
    if (!token) {
      throw new Error("Authentification requise");
    }

    const response = await fetch(`${API_BASE_URL}/notifications`, {
      method: "POST",
      headers: {
        ...apiConfig.headers,
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(notificationData),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        data.message || "Erreur lors de la création de la notification"
      );
    }

    return data;
  },

  async deleteNotification(notificationId: string) {
    const token = authService.getToken();
    if (!token) {
      throw new Error("Authentification requise");
    }

    const response = await fetch(
      `${API_BASE_URL}/notifications/${notificationId}`,
      {
        method: "DELETE",
        headers: {
          ...apiConfig.headers,
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        data.message || "Erreur lors de la suppression de la notification"
      );
    }

    return data;
  },
};

export default {
  auth: authService,
  movies: moviesService,
  payments: paymentService,
  notifications: notificationsService,
  watchHistory: watchHistoryService,
};
