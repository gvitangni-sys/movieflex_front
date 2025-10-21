import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, ArrowLeft } from 'lucide-react';
import { AuthLayout } from '@/components/auth/AuthLayout';
import { NetflixButton } from '@/components/ui/netflix-button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulation d'envoi d'email
    setTimeout(() => {
      setEmailSent(true);
      toast({
        title: "Email envoyé !",
        description: "Vérifiez votre boîte mail pour réinitialiser votre mot de passe",
      });
      setIsLoading(false);
    }, 1000);
  };

  if (emailSent) {
    return (
      <AuthLayout title="Email envoyé" subtitle="Vérifiez votre boîte mail">
        <div className="text-center space-y-4">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5 }}
            className="mx-auto w-16 h-16 bg-netflix-red rounded-full flex items-center justify-center"
          >
            <Mail className="h-8 w-8 text-white" />
          </motion.div>
          
          <div className="space-y-2">
            <p className="text-foreground">
              Un email de réinitialisation a été envoyé à :
            </p>
            <p className="font-medium text-netflix-red">{email}</p>
            <p className="text-sm text-muted-foreground">
              Cliquez sur le lien dans l'email pour créer un nouveau mot de passe.
            </p>
          </div>

          <div className="space-y-2">
            <NetflixButton
              onClick={() => setEmailSent(false)}
              variant="netflix-outline"
              className="w-full"
            >
              Renvoyer l'email
            </NetflixButton>
            
            <Link to="/login">
              <NetflixButton variant="ghost" className="w-full">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Retour à la connexion
              </NetflixButton>
            </Link>
          </div>
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout title="Mot de passe oublié" subtitle="Saisissez votre email pour recevoir un lien de réinitialisation">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email">Adresse email</Label>
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

        <NetflixButton
          type="submit"
          variant="netflix"
          size="lg"
          disabled={isLoading}
          className="w-full"
        >
          {isLoading ? "Envoi en cours..." : "Envoyer le lien"}
        </NetflixButton>

        <Link to="/login">
          <NetflixButton variant="ghost" className="w-full">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Retour à la connexion
          </NetflixButton>
        </Link>
      </form>
    </AuthLayout>
  );
};

export default ForgotPassword;