import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { motion } from 'framer-motion';
import { CreditCard, Shield, Lock, CheckCircle, XCircle } from 'lucide-react';
import { AuthLayout } from '@/components/auth/AuthLayout';
import { NetflixButton } from '@/components/ui/netflix-button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { updateSubscription } from '@/store/slices/authSlice';

// Stripe Elements (gardé pour la configuration)
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';

// Configuration Stripe (clé publique de test)
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || 'pk_test_51SBc7MPbdMUVanRJrA16CGq2vHv6VtUkdfMrbCcUOSRaKumenBxFlbxBSYrmcWAf0sNqaXCCvbY9CQTM3bP43MKG00E5UXhZcA');

// Composant de paiement automatique
const AutoPaymentForm = ({ plan, onSuccess }: { plan: string; onSuccess: () => void }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const handleSubscribe = async () => {
    setIsLoading(true);
    setError(null);

    try {
      // Pour le mode test, nous allons simuler un paiement réussi
      // En production, vous utiliseriez Stripe Elements pour collecter les informations de carte
      
      // Appeler notre backend de test pour créer l'abonnement
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/test-payments/subscribe`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('netflix_token')}`
        },
        body: JSON.stringify({
          plan,
          // Mode test - pas besoin de paymentMethodId
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Erreur lors de la création de l\'abonnement');
      }

      toast({
        title: "Paiement réussi !",
        description: "Votre abonnement a été activé avec succès.",
      });

      onSuccess();

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Une erreur est survenue lors du paiement";
      setError(errorMessage);
      toast({
        title: "Erreur de paiement",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Message d'erreur */}
      {error && (
        <div className="flex items-center gap-2 text-red-500 text-sm">
          <XCircle className="h-4 w-4" />
          {error}
        </div>
      )}

      <NetflixButton
        onClick={handleSubscribe}
        variant="netflix"
        size="lg"
        disabled={isLoading}
        className="w-full"
      >
        {isLoading ? "Activation en cours..." : `S'abonner - ${plan === 'basic' ? '9.99€' : '15.99€'}/mois`}
      </NetflixButton>
    </div>
  );
};

const Payment = () => {
  const [selectedPlan, setSelectedPlan] = useState<'basic' | 'premium'>('premium');
  const [paymentCompleted, setPaymentCompleted] = useState(false);
  
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const { toast } = useToast();

  const userData = location.state?.userData;
  const isNewUser = location.state?.newUser;

  const handlePaymentSuccess = () => {
    setPaymentCompleted(true);
    
    // Mettre à jour l'état Redux
    dispatch(updateSubscription({
      subscription: selectedPlan,
      subscriptionExpires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString() // 30 jours
    }));

    // Rediriger après 2 secondes
    setTimeout(() => {
      navigate('/home');
    }, 2000);
  };

  if (paymentCompleted) {
    return (
      <AuthLayout 
        title="Abonnement activé !" 
        subtitle="Redirection vers votre compte..."
      >
        <div className="text-center space-y-4">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200 }}
          >
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
          </motion.div>
          <h3 className="text-xl font-semibold">Félicitations !</h3>
          <p className="text-muted-foreground">
            Votre abonnement {selectedPlan} a été activé avec succès.
          </p>
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout 
      title="Abonnement Netflix" 
      subtitle={isNewUser ? "Finalisez votre inscription" : "Renouveler votre abonnement"}
    >
      <div className="space-y-6">
        {/* Sélection du plan */}
        <div className="grid grid-cols-2 gap-4">
          <Card 
            className={`cursor-pointer transition-all ${
              selectedPlan === 'basic' 
                ? 'border-netflix-red bg-netflix-red/10' 
                : 'border-netflix-light-gray hover:border-netflix-red/50'
            }`}
            onClick={() => setSelectedPlan('basic')}
          >
            <CardHeader className="text-center pb-2">
              <CardTitle className="text-sm">Basic</CardTitle>
            </CardHeader>
            <CardContent className="text-center space-y-1">
              <div className="text-xl font-bold">9.99€</div>
              <div className="text-xs text-muted-foreground">par mois</div>
              <div className="text-xs text-muted-foreground">HD • 1 écran</div>
            </CardContent>
          </Card>

          <Card 
            className={`cursor-pointer transition-all ${
              selectedPlan === 'premium' 
                ? 'border-netflix-red bg-netflix-red/10' 
                : 'border-netflix-light-gray hover:border-netflix-red/50'
            }`}
            onClick={() => setSelectedPlan('premium')}
          >
            <CardHeader className="text-center pb-2">
              <CardTitle className="text-sm text-netflix-red">Premium</CardTitle>
            </CardHeader>
            <CardContent className="text-center space-y-1">
              <div className="text-xl font-bold">15.99€</div>
              <div className="text-xs text-muted-foreground">par mois</div>
              <div className="text-xs text-muted-foreground">Ultra HD • 4 écrans</div>
            </CardContent>
          </Card>
        </div>

        {/* Détails du plan sélectionné */}
        <Card className="bg-gradient-card border-netflix-light-gray">
          <CardHeader className="text-center">
            <CardTitle className={selectedPlan === 'premium' ? 'text-netflix-red' : ''}>
              Plan {selectedPlan === 'basic' ? 'Basic' : 'Premium'}
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-2">
            <div className="text-3xl font-bold text-foreground">
              {selectedPlan === 'basic' ? '9.99€' : '15.99€'}
            </div>
            <div className="text-sm text-muted-foreground">par mois</div>
            <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
              <Shield className="h-4 w-4" />
              {selectedPlan === 'basic' ? 'HD • 1 écran simultané' : 'Ultra HD • 4 écrans simultanés'}
            </div>
          </CardContent>
        </Card>

        {/* Formulaire de paiement automatique */}
        <AutoPaymentForm plan={selectedPlan} onSuccess={handlePaymentSuccess} />

        <div className="text-center text-xs text-muted-foreground">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Lock className="h-3 w-3" />
            <span>Paiement 100% sécurisé par Stripe</span>
          </div>
          <p>🔒 Données cryptées • Annulation à tout moment</p>
          <p className="mt-1">
            Système de paiement réel en mode test - Aucun vrai compte ne sera débité
          </p>
        </div>
      </div>
    </AuthLayout>
  );
};

export default Payment;
