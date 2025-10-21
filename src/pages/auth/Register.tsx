import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Mail, Lock, User } from 'lucide-react';
import { AuthLayout } from '@/components/auth/AuthLayout';
import { NetflixButton } from '@/components/ui/netflix-button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { loginSuccess } from '@/store/slices/authSlice';
import { authService } from '@/services/api';

const Register = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      toast({
        title: "Erreur",
        description: "Les mots de passe ne correspondent pas",
        variant: "destructive",
      });
      return;
    }

    if (formData.password.length < 6) {
      toast({
        title: "Erreur",
        description: "Le mot de passe doit contenir au moins 6 caractères",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      const response = await authService.register(formData.email, formData.password);
      
      // Connecter automatiquement l'utilisateur après l'inscription
      dispatch(loginSuccess({
        user: response.user,
        token: response.token
      }));
      
      toast({
        title: "Inscription réussie !",
        description: "Redirection vers la page d'abonnement...",
      });
      
      // Rediriger directement vers la page de paiement pour l'abonnement
      navigate('/payment', { state: { newUser: true } });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Une erreur est survenue lors de l'inscription";
      toast({
        title: "Erreur d'inscription",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <AuthLayout title="Créer un compte" subtitle="Rejoignez millions d'utilisateurs Netflix">
      <form onSubmit={handleSubmit} className="space-y-4">

        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <div className="relative">
            <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              id="email"
              type="email"
              placeholder="votre@email.com"
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
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
              placeholder="Créer un mot de passe"
              value={formData.password}
              onChange={(e) => handleInputChange('password', e.target.value)}
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

        <div className="space-y-2">
          <Label htmlFor="confirmPassword">Confirmer le mot de passe</Label>
          <div className="relative">
            <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              id="confirmPassword"
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Confirmer le mot de passe"
              value={formData.confirmPassword}
              onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
              className="pl-10 pr-10 bg-netflix-gray border-netflix-light-gray"
              required
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-3 text-muted-foreground hover:text-foreground"
            >
              {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
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
          {isLoading ? "Création en cours..." : "Créer mon compte"}
        </NetflixButton>

        <div className="text-center text-sm text-muted-foreground">
          Déjà un compte ?{' '}
          <Link
            to="/login"
            className="text-netflix-red hover:underline font-medium"
          >
            Se connecter
          </Link>
        </div>
      </form>
    </AuthLayout>
  );
};

export default Register;
