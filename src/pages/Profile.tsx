import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { motion } from "framer-motion";
import {
  User,
  Mail,
  Crown,
  Calendar,
  Settings,
  LogOut,
  Eye,
  EyeOff,
} from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { NetflixButton } from "@/components/ui/netflix-button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { RootState } from "@/store/store";
import {
  logout,
  cancelSubscriptionSuccess,
  setUser,
} from "@/store/slices/authSlice";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { authService, paymentService } from "@/services/api";

const Profile = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { toast } = useToast();

  // Form state - moved before conditional return
  const [email, setEmail] = useState(user?.email || "");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [saving, setSaving] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);

  const handleLogout = () => {
    dispatch(logout());
    toast({
      title: "Déconnexion",
      description: "À bientôt sur Netflix !",
    });
    navigate("/login");
  };

  if (!user) {
    return null;
  }

  const handleRefreshProfile = async () => {
    try {
      const result = await authService.getProfile();
      dispatch(setUser(result.user));
      toast({ title: "Profil actualisé" });
    } catch (e: unknown) {
      const errorMessage =
        e instanceof Error ? e.message : "Actualisation impossible";
      toast({
        title: "Erreur",
        description: errorMessage,
        variant: "destructive",
      });
    }
  };

  const handleCancelSubscription = async () => {
    try {
      const result = await paymentService.cancelSubscription();
      dispatch(cancelSubscriptionSuccess());
      toast({ title: "Abonnement annulé", description: result.message });
    } catch (e: unknown) {
      const errorMessage =
        e instanceof Error ? e.message : "Annulation impossible";
      toast({
        title: "Erreur",
        description: errorMessage,
        variant: "destructive",
      });
    }
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload: {
        email?: string;
        currentPassword?: string;
        newPassword?: string;
      } = {};
      if (email && email !== user.email) payload.email = email;
      if (newPassword) {
        payload.currentPassword = currentPassword;
        payload.newPassword = newPassword;
      }
      if (Object.keys(payload).length === 0) {
        toast({ title: "Aucun changement à enregistrer" });
        setSaving(false);
        return;
      }
      const result = await authService.updateProfile(payload);
      dispatch(setUser(result.user));
      toast({ title: "Profil mis à jour", description: result.message });
      setCurrentPassword("");
      setNewPassword("");
    } catch (e: unknown) {
      const errorMessage =
        e instanceof Error ? e.message : "Mise à jour impossible";
      toast({
        title: "Erreur",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="pt-24 container mx-auto px-4 max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-8"
        >
          {/* En-tête profil */}
          <div className="text-center space-y-4">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center justify-center w-24 h-24 bg-gradient-card rounded-full border-4 border-netflix-red"
            >
              <User className="h-12 w-12 text-netflix-red" />
            </motion.div>

            <div>
              <h1 className="text-3xl font-bold text-foreground">
                {user.email.split("@")[0]}
              </h1>
              <p className="text-muted-foreground">{user.email}</p>
            </div>

            <div className="flex justify-center">
              {user.isSubscriptionActive ? (
                <Badge className="bg-netflix-red text-white">
                  <Crown className="h-4 w-4 mr-1" />
                  Abonnement {user.subscription} actif
                </Badge>
              ) : (
                <Badge variant="outline">Aucun abonnement actif</Badge>
              )}
            </div>
          </div>

          {/* Informations du compte */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
            <Card className="bg-gradient-card border-netflix-light-gray">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-foreground text-base md:text-lg">
                  <User className="h-4 w-4 md:h-5 md:w-5 text-netflix-red" />
                  Informations personnelles
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 md:space-y-4">
                <div className="flex items-center gap-2 md:gap-3">
                  <Mail className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                  <div className="min-w-0">
                    <div className="text-sm text-muted-foreground">Email</div>
                    <div className="text-foreground text-sm md:text-base truncate">
                      {user.email}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 md:gap-3">
                  <Calendar className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                  <div className="min-w-0">
                    <div className="text-sm text-muted-foreground">
                      Membre depuis
                    </div>
                    <div className="text-foreground text-sm md:text-base">
                      {user.createdAt
                        ? new Date(user.createdAt).toLocaleDateString("fr-FR", {
                            year: "numeric",
                            month: "long",
                          })
                        : "-"}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-card border-netflix-light-gray">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-foreground text-base md:text-lg">
                  <Crown className="h-4 w-4 md:h-5 md:w-5 text-netflix-red" />
                  Abonnement
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 md:space-y-4">
                {user.isSubscriptionActive ? (
                  <>
                    <div>
                      <div className="text-sm text-muted-foreground">
                        Plan actuel
                      </div>
                      <div className="text-foreground font-medium text-sm md:text-base">
                        {user.subscription}
                      </div>
                    </div>

                    <div>
                      <div className="text-sm text-muted-foreground">
                        Prix mensuel
                      </div>
                      <div className="text-foreground font-medium text-sm md:text-base">
                        {user.subscription === "premium"
                          ? "15.99€"
                          : user.subscription === "basic"
                          ? "9.99€"
                          : "0€"}
                      </div>
                    </div>

                    <div>
                      <div className="text-sm text-muted-foreground">
                        Prochaine facturation
                      </div>
                      <div className="text-foreground text-sm md:text-base">
                        {user.subscriptionExpires
                          ? new Date(
                              user.subscriptionExpires
                            ).toLocaleDateString()
                          : "-"}
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-2 pt-2">
                      <NetflixButton
                        variant="netflix"
                        size="sm"
                        className="w-full sm:w-auto justify-center"
                        onClick={() => navigate("/payment")}
                      >
                        Mettre à niveau / Renouveler
                      </NetflixButton>
                      <NetflixButton
                        variant="ghost"
                        size="sm"
                        className="w-full sm:w-auto justify-center"
                        onClick={handleCancelSubscription}
                      >
                        Annuler l'abonnement
                      </NetflixButton>
                    </div>
                  </>
                ) : (
                  <div className="text-center py-3 md:py-4">
                    <p className="text-muted-foreground text-sm md:text-base mb-3 md:mb-4">
                      Aucun abonnement actif
                    </p>
                    <NetflixButton
                      variant="netflix"
                      size="sm"
                      className="w-full sm:w-auto justify-center"
                      onClick={() => navigate("/payment")}
                    >
                      S'abonner maintenant
                    </NetflixButton>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Actions */}
          <Card className="bg-gradient-card border-netflix-light-gray">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-foreground">
                <Settings className="h-5 w-5 text-netflix-red" />
                Paramètres du compte
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-netflix-gray/50 rounded-lg">
                  <div>
                    <div className="font-medium text-foreground">
                      Modifier le profil
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Changez votre nom, email et mot de passe
                    </div>
                  </div>
                  <NetflixButton variant="ghost" onClick={handleRefreshProfile}>
                    Actualiser
                  </NetflixButton>
                </div>

                {/* Formulaire d'édition */}
                <form
                  onSubmit={handleSaveProfile}
                  className="space-y-4 p-4 bg-netflix-gray/30 rounded-lg"
                >
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="currentPassword">
                        Mot de passe actuel
                      </Label>
                      <div className="relative">
                        <Input
                          id="currentPassword"
                          type={showCurrentPassword ? "text" : "password"}
                          value={currentPassword}
                          onChange={(e) => setCurrentPassword(e.target.value)}
                          className="pr-10"
                        />
                        <button
                          type="button"
                          onClick={() =>
                            setShowCurrentPassword(!showCurrentPassword)
                          }
                          className="absolute right-3 top-2.5 text-muted-foreground hover:text-foreground"
                          aria-label={
                            showCurrentPassword
                              ? "Masquer le mot de passe"
                              : "Afficher le mot de passe"
                          }
                        >
                          {showCurrentPassword ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </button>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="newPassword">Nouveau mot de passe</Label>
                      <div className="relative">
                        <Input
                          id="newPassword"
                          type={showNewPassword ? "text" : "password"}
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          className="pr-10"
                        />
                        <button
                          type="button"
                          onClick={() => setShowNewPassword(!showNewPassword)}
                          className="absolute right-3 top-2.5 text-muted-foreground hover:text-foreground"
                          aria-label={
                            showNewPassword
                              ? "Masquer le mot de passe"
                              : "Afficher le mot de passe"
                          }
                        >
                          {showNewPassword ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2 justify-end">
                    <NetflixButton
                      type="submit"
                      variant="netflix"
                      disabled={saving}
                    >
                      {saving
                        ? "Enregistrement..."
                        : "Enregistrer les modifications"}
                    </NetflixButton>
                  </div>
                </form>

                <div className="flex items-center justify-between p-4 bg-netflix-gray/50 rounded-lg">
                  <div>
                    <div className="font-medium text-foreground">
                      Gérer l'abonnement
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Modifier votre plan ou annuler votre abonnement
                    </div>
                  </div>
                  <NetflixButton
                    variant="ghost"
                    onClick={() => navigate("/payment")}
                  >
                    Gérer
                  </NetflixButton>
                </div>

                <div className="flex items-center justify-between p-4 bg-netflix-gray/50 rounded-lg">
                  <div>
                    <div className="font-medium text-foreground">
                      Historique de visionnage
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Voir et gérer votre historique
                    </div>
                  </div>
                  <NetflixButton
                    variant="ghost"
                    onClick={() => navigate("/watch-history")}
                  >
                    Voir
                  </NetflixButton>
                </div>

                <div className="pt-4 border-t border-netflix-light-gray">
                  <NetflixButton
                    variant="netflix-outline"
                    onClick={handleLogout}
                    className="w-full border-destructive text-destructive hover:bg-destructive hover:text-white"
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Se déconnecter
                  </NetflixButton>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default Profile;
