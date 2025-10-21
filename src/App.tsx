import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Provider } from "react-redux";
import { store } from "@/store/store";
import { useAuthCheck } from "@/hooks/useAuth";
import { useSelector } from "react-redux";
import type { RootState } from "@/store/store";
import { useLocation } from "react-router-dom";

// Auth pages
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import ForgotPassword from "./pages/auth/ForgotPassword";
import Payment from "./pages/Payment";

// Main pages
import Home from "./pages/Home";
import Browse from "./pages/Browse";
import MyList from "./pages/MyList";
import Search from "./pages/Search";
import Profile from "./pages/Profile";
import MovieDetails from "./pages/MovieDetails";
import Watch from "./pages/Watch";
import Notifications from "./pages/Notifications";
import WatchHistory from "./pages/WatchHistory";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

// Composant pour protéger les routes nécessitant une authentification
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useAuthCheck();
  const { user } = useSelector((state: RootState) => state.auth);
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  const isOnPayment = location.pathname === "/payment";
  const requiresPayment = !user?.isSubscriptionActive || user?.subscription === "free";

  if (requiresPayment && !isOnPayment) {
    return <Navigate to="/payment" replace />;
  }

  return <>{children}</>;
};

// Composant pour les routes publiques (rediriger si déjà connecté)
const PublicRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useAuthCheck();
  const { user } = useSelector((state: RootState) => state.auth);
  
  if (isAuthenticated) {
    // Si l'utilisateur n'a pas d'abonnement actif, rediriger vers la page de paiement
    const requiresPayment = !user?.isSubscriptionActive || user?.subscription === "free";
    if (requiresPayment) {
      return <Navigate to="/payment" replace />;
    }
    // Sinon, rediriger vers la page d'accueil
    return <Navigate to="/home" replace />;
  }
  
  return <>{children}</>;
};

const AppRoutes = () => {
  // Vérifier l'authentification au chargement
  useAuthCheck();

  return (
    <Routes>
      <Route path="/" element={<Navigate to="/home" replace />} />
      
      {/* Routes publiques (redirigent si connecté) */}
      <Route path="/login" element={
        <PublicRoute>
          <Login />
        </PublicRoute>
      } />
      <Route path="/register" element={
        <PublicRoute>
          <Register />
        </PublicRoute>
      } />
      <Route path="/forgot-password" element={
        <PublicRoute>
          <ForgotPassword />
        </PublicRoute>
      } />
      
      {/* Route Home accessible sans authentification */}
      <Route path="/home" element={<Home />} />
      
      {/* Routes protégées (nécessitent une authentification) */}
      <Route path="/payment" element={
        <ProtectedRoute>
          <Payment />
        </ProtectedRoute>
      } />
      <Route path="/browse" element={
        <ProtectedRoute>
          <Browse />
        </ProtectedRoute>
      } />
      <Route path="/my-list" element={
        <ProtectedRoute>
          <MyList />
        </ProtectedRoute>
      } />
      <Route path="/search" element={
        <ProtectedRoute>
          <Search />
        </ProtectedRoute>
      } />
      <Route path="/profile" element={
        <ProtectedRoute>
          <Profile />
        </ProtectedRoute>
      } />
      <Route path="/movie/:id" element={
        <ProtectedRoute>
          <MovieDetails />
        </ProtectedRoute>
      } />
      <Route path="/watch/:id" element={
        <ProtectedRoute>
          <Watch />
        </ProtectedRoute>
      } />
      <Route path="/notifications" element={
        <ProtectedRoute>
          <Notifications />
        </ProtectedRoute>
      } />
      <Route path="/watch-history" element={
        <ProtectedRoute>
          <WatchHistory />
        </ProtectedRoute>
      } />
      
      {/* Route 404 */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

const App = () => (
  <BrowserRouter
    future={{
      v7_startTransition: true,
      v7_relativeSplatPath: true,
    }}
  >
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <AppRoutes />
        </TooltipProvider>
      </QueryClientProvider>
    </Provider>
  </BrowserRouter>
);

export default App;
