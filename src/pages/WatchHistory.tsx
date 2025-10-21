import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Trash2,
  Clock,
  Play,
  Calendar,
  BarChart3,
} from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { NetflixButton } from "@/components/ui/netflix-button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { RootState } from "@/store/store";
import api from "@/services/api";

interface WatchHistoryItem {
  _id: string;
  movieId: string;
  movieTitle: string;
  movieThumbnail: string;
  movieGenre: string;
  watchedAt: string;
  durationWatched: number;
  progress: number;
  completed: boolean;
}

interface WatchStats {
  totalWatched: number;
  completedMovies: number;
  totalWatchTime: number;
  recentActivity: number;
}

const WatchHistory = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const navigate = useNavigate();
  const { toast } = useToast();

  const [watchHistory, setWatchHistory] = useState<WatchHistoryItem[]>([]);
  const [stats, setStats] = useState<WatchStats>({
    totalWatched: 0,
    completedMovies: 0,
    totalWatchTime: 0,
    recentActivity: 0,
  });
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<string | null>(null);

  useEffect(() => {
    loadWatchHistory();
    loadStats();
  }, []);

  const loadWatchHistory = async () => {
    try {
      setLoading(true);
      const history = await api.watchHistory.getWatchHistory();
      setWatchHistory(history);
    } catch (error) {
      console.error("Erreur lors du chargement de l'historique:", error);
      toast({
        title: "Erreur",
        description: "Impossible de charger l'historique de visionnage",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const loadStats = async () => {
    try {
      const statsData = await api.watchHistory.getWatchStats();
      setStats(statsData);
    } catch (error) {
      console.error("Erreur lors du chargement des statistiques:", error);
    }
  };

  const deleteHistoryItem = async (id: string) => {
    try {
      setDeleting(id);
      await api.watchHistory.removeFromWatchHistory(id);
      setWatchHistory((prev) => prev.filter((item) => item._id !== id));
      await loadStats(); // Recharger les stats après suppression
      toast({
        title: "Succès",
        description: "Élément supprimé de l'historique",
      });
    } catch (error) {
      console.error("Erreur lors de la suppression:", error);
      toast({
        title: "Erreur",
        description: "Impossible de supprimer l'élément",
        variant: "destructive",
      });
    } finally {
      setDeleting(null);
    }
  };

  const clearAllHistory = async () => {
    try {
      await api.watchHistory.clearWatchHistory();
      setWatchHistory([]);
      setStats({
        totalWatched: 0,
        completedMovies: 0,
        totalWatchTime: 0,
        recentActivity: 0,
      });
      toast({
        title: "Succès",
        description: "Historique vidé avec succès",
      });
    } catch (error) {
      console.error("Erreur lors du vidage:", error);
      toast({
        title: "Erreur",
        description: "Impossible de vider l'historique",
        variant: "destructive",
      });
    }
  };

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);

    if (hours > 0) {
      return `${hours}h ${minutes}min`;
    }
    return `${minutes}min`;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) {
      return "Hier";
    } else if (diffDays < 7) {
      return `Il y a ${diffDays} jours`;
    } else if (diffDays < 30) {
      const weeks = Math.floor(diffDays / 7);
      return `Il y a ${weeks} semaine${weeks > 1 ? "s" : ""}`;
    } else {
      return date.toLocaleDateString("fr-FR", {
        day: "numeric",
        month: "long",
        year: "numeric",
      });
    }
  };

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="pt-24 container mx-auto px-4 max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-8"
        >
          {/* En-tête */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                onClick={() => navigate("/profile")}
                className="text-foreground hover:bg-netflix-gray"
              >
                <ArrowLeft className="h-5 w-5 mr-2" />
                Retour au profil
              </Button>
              <div>
                <h1 className="text-3xl font-bold text-foreground">
                  Historique de visionnage
                </h1>
                <p className="text-muted-foreground">
                  Retrouvez tous les films et séries que vous avez regardés
                </p>
              </div>
            </div>

            {watchHistory.length > 0 && (
              <NetflixButton
                variant="netflix-outline"
                onClick={clearAllHistory}
                className="border-destructive text-destructive hover:bg-destructive hover:text-white"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Vider l'historique
              </NetflixButton>
            )}
          </div>

          {/* Statistiques */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="bg-gradient-card border-netflix-light-gray">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Total regardé
                    </p>
                    <p className="text-2xl font-bold text-foreground">
                      {stats.totalWatched}
                    </p>
                  </div>
                  <div className="p-3 bg-netflix-red/20 rounded-full">
                    <Play className="h-6 w-6 text-netflix-red" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-card border-netflix-light-gray">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Terminés</p>
                    <p className="text-2xl font-bold text-foreground">
                      {stats.completedMovies}
                    </p>
                  </div>
                  <div className="p-3 bg-green-500/20 rounded-full">
                    <BarChart3 className="h-6 w-6 text-green-500" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-card border-netflix-light-gray">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Temps total</p>
                    <p className="text-2xl font-bold text-foreground">
                      {formatTime(stats.totalWatchTime)}
                    </p>
                  </div>
                  <div className="p-3 bg-blue-500/20 rounded-full">
                    <Clock className="h-6 w-6 text-blue-500" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-card border-netflix-light-gray">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Activité récente
                    </p>
                    <p className="text-2xl font-bold text-foreground">
                      {stats.recentActivity}
                    </p>
                  </div>
                  <div className="p-3 bg-purple-500/20 rounded-full">
                    <Calendar className="h-6 w-6 text-purple-500" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Historique */}
          <Card className="bg-gradient-card border-netflix-light-gray">
            <CardHeader>
              <CardTitle className="text-foreground">
                Votre historique
              </CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="text-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-netflix-red mx-auto"></div>
                  <p className="text-muted-foreground mt-4">
                    Chargement de l'historique...
                  </p>
                </div>
              ) : watchHistory.length === 0 ? (
                <div className="text-center py-12">
                  <div className="w-24 h-24 bg-netflix-gray/50 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Play className="h-12 w-12 text-muted-foreground" />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground mb-2">
                    Aucun historique de visionnage
                  </h3>
                  <p className="text-muted-foreground mb-6">
                    Les films et séries que vous regardez apparaîtront ici.
                  </p>
                  <NetflixButton
                    variant="netflix"
                    onClick={() => navigate("/browse")}
                  >
                    Découvrir du contenu
                  </NetflixButton>
                </div>
              ) : (
                <div className="space-y-4">
                  {watchHistory.map((item, index) => (
                    <motion.div
                      key={item._id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-4 bg-netflix-gray/30 rounded-lg hover:bg-netflix-gray/50 transition-colors"
                    >
                      {/* Image du film */}
                      <div className="flex-shrink-0 w-20 h-28 bg-netflix-gray rounded overflow-hidden">
                        {item.movieThumbnail ? (
                          <img
                            src={item.movieThumbnail}
                            alt={item.movieTitle}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full bg-netflix-dark-gray flex items-center justify-center">
                            <Play className="h-8 w-8 text-muted-foreground" />
                          </div>
                        )}
                      </div>

                      {/* Informations */}
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                          <div>
                            <h3 className="font-semibold text-foreground text-lg truncate">
                              {item.movieTitle}
                            </h3>
                            <div className="flex items-center gap-2 mt-1 flex-wrap">
                              <Badge variant="outline" className="text-xs">
                                {item.movieGenre}
                              </Badge>
                              {item.completed && (
                                <Badge className="bg-green-500 text-white text-xs">
                                  Terminé
                                </Badge>
                              )}
                            </div>
                          </div>

                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <Clock className="h-4 w-4" />
                              {formatTime(item.durationWatched)}
                            </div>
                            <div className="flex items-center gap-1">
                              <Calendar className="h-4 w-4" />
                              {formatDate(item.watchedAt)}
                            </div>
                          </div>
                        </div>

                        {/* Barre de progression */}
                        <div className="mt-3">
                          <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
                            <span>Progression</span>
                            <span>{Math.round(item.progress)}%</span>
                          </div>
                          <div className="w-full bg-netflix-gray rounded-full h-2">
                            <div
                              className="bg-netflix-red h-2 rounded-full transition-all duration-300"
                              style={{ width: `${item.progress}%` }}
                            />
                          </div>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-2 self-end sm:self-auto">
                        <NetflixButton
                          variant="netflix"
                          size="sm"
                          onClick={() => navigate(`/watch/${item.movieId}`)}
                        >
                          <Play className="h-4 w-4 mr-1" />
                          Regarder
                        </NetflixButton>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => deleteHistoryItem(item._id)}
                          disabled={deleting === item._id}
                          className="text-destructive hover:text-destructive hover:bg-destructive/10"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default WatchHistory;
