import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Mail, Lock } from 'lucide-react';
import { AuthLayout } from '@/components/auth/AuthLayout';
import { NetflixButton } from '@/components/ui/netflix-button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { loginStart, loginSuccess, loginFailure } from '@/store/slices/authSlice';
import { authService } from '@/services/api';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const { toast } = useToast();

  useEffect(() => {
    const prefillEmail = (location.state as any)?.prefillEmail;
    if (prefillEmail) {
      setEmail(prefillEmail);
    }
  }, [location.state]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast({
        title: "Erreur",
        description: "Veuillez remplir tous les champs",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    dispatch(loginStart());

    try {
      const response = await authService.login(email, password);
      
      dispatch(loginSuccess({
        user: response.user,
        token: response.token
      }));
      
      toast({
        title: "Connexion réussie",
        description: `Bienvenue ${response.user.email} !`,
      });
      
      // Redirection selon l'abonnement
      const user = response.user;
      if (!user.isSubscriptionActive || user.subscription === 'free') {
        navigate('/payment');
      } else {
        navigate('/home');
      }
    } catch (error) {
      dispatch(loginFailure());
      const errorMessage = error instanceof Error ? error.message : "Une erreur est survenue";
      toast({
        title: "Erreur de connexion",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout title="Se connecter" subtitle="Accédez à vos films et séries préférés">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <div className="relative">
            <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              id="email"
              type="email"
              placeholder="votre@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="pl-10 bg-netflix-gray border-netflix-light-gray"
              required
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="password">Mot de passe</Label>
          <div className="relative">
            <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="Votre mot de passe"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="pl-10 pr-10 bg-netflix-gray border-netflix-light-gray"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-3 text-muted-foreground hover:text-foreground"
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
        </div>

        <NetflixButton
          type="submit"
          variant="netflix"
          size="lg"
          disabled={isLoading}
          className="w-full"
        >
          {isLoading ? "Connexion..." : "Se connecter"}
        </NetflixButton>

        <div className="text-center space-y-2">
          <Link
            to="/forgot-password"
            className="text-sm text-muted-foreground hover:text-netflix-red transition-colors"
          >
            Mot de passe oublié ?
          </Link>
          
          <div className="text-sm text-muted-foreground">
            Nouveau sur Netflix ?{' '}
            <Link
              to="/register"
              className="text-netflix-red hover:underline font-medium"
            >
              Inscrivez-vous maintenant
            </Link>
          </div>
        </div>
      </form>
    </AuthLayout>
  );
};

export default Login;
