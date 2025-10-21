import { useRef, useEffect, useState } from 'react';
import { Loader2, Play, Pause, Volume2, VolumeX, Maximize, Minimize } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';

interface SecureVideoPlayerProps {
  videoUrl: string;
  movieTitle: string;
  movieId: string;
  poster?: string;
  onTimeUpdate?: (currentTime: number, duration: number) => void;
  onEnded?: () => void;
}

const SecureVideoPlayer = ({
  videoUrl,
  movieTitle,
  movieId,
  poster,
  onTimeUpdate,
  onEnded,
}: SecureVideoPlayerProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0);
  const [isMuted, setIsMuted] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [showUnmutePrompt, setShowUnmutePrompt] = useState(true);
  const controlsTimeoutRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    console.log('Initializing SecureVideoPlayer with URL:', videoUrl);
    
    const video = videoRef.current;
    if (!video) return;

    // Pour l'autoplay, on doit commencer avec le son coupé
    // Les navigateurs bloquent l'autoplay avec son
    video.muted = true;
    video.volume = 0;

    const handleCanPlay = () => {
      console.log('Video can play');
      setIsLoading(false);
      setDuration(video.duration);
      
      // Essayer de jouer automatiquement (mais avec son coupé)
      video.play().catch(err => {
        console.error('Autoplay blocked:', err);
        // Si l'autoplay est bloqué, on attend que l'utilisateur clique
        setIsPlaying(false);
      });
    };

    const handlePlay = () => {
      console.log('Video started playing');
      setIsPlaying(true);
    };

    const handleTimeUpdate = () => {
      setCurrentTime(video.currentTime);
      onTimeUpdate?.(video.currentTime, video.duration);
    };

    const handleEnded = () => {
      setIsPlaying(false);
      onEnded?.();
    };

    const handlePlaying = () => {
      console.log('Video is playing');
      setIsLoading(false);
      setIsPlaying(true);
    };

    const handlePause = () => {
      console.log('Video paused');
      setIsPlaying(false);
    };

    const handleWaiting = () => {
      setIsLoading(true);
    };

    const handleLoadedMetadata = () => {
      setDuration(video.duration);
    };

    video.addEventListener('canplay', handleCanPlay);
    video.addEventListener('play', handlePlay);
    video.addEventListener('playing', handlePlaying);
    video.addEventListener('pause', handlePause);
    video.addEventListener('timeupdate', handleTimeUpdate);
    video.addEventListener('ended', handleEnded);
    video.addEventListener('waiting', handleWaiting);
    video.addEventListener('loadedmetadata', handleLoadedMetadata);

    return () => {
      video.removeEventListener('canplay', handleCanPlay);
      video.removeEventListener('play', handlePlay);
      video.removeEventListener('playing', handlePlaying);
      video.removeEventListener('pause', handlePause);
      video.removeEventListener('timeupdate', handleTimeUpdate);
      video.removeEventListener('ended', handleEnded);
      video.removeEventListener('waiting', handleWaiting);
      video.removeEventListener('loadedmetadata', handleLoadedMetadata);
    };
  }, [videoUrl, onTimeUpdate, onEnded]);

  // Gérer l'affichage/masquage des contrôles
  const handleMouseMove = () => {
    setShowControls(true);
    if (controlsTimeoutRef.current) {
      clearTimeout(controlsTimeoutRef.current);
    }
    controlsTimeoutRef.current = setTimeout(() => {
      if (isPlaying) {
        setShowControls(false);
      }
    }, 3000);
  };

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play().catch(err => {
          console.error('Error playing video:', err);
        });
      }
    }
  };

  const handleVolumeChange = (value: number[]) => {
    const newVolume = value[0];
    setVolume(newVolume);
    if (videoRef.current) {
      videoRef.current.volume = newVolume;
      setIsMuted(newVolume === 0);
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      const newMuted = !isMuted;
      setIsMuted(newMuted);
      videoRef.current.muted = newMuted;
      if (newMuted) {
        setVolume(0);
      } else {
        setVolume(1);
        videoRef.current.volume = 1;
      }
    }
  };

  const handleSeek = (value: number[]) => {
    const time = value[0];
    if (videoRef.current) {
      videoRef.current.currentTime = time;
      setCurrentTime(time);
    }
  };

  const toggleFullscreen = () => {
    const container = containerRef.current;
    if (!container) return;

    // Vérifier si le plein écran est déjà actif
    if (document.fullscreenElement) {
      // Sortir du plein écran
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if ('webkitExitFullscreen' in document) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (document as any).webkitExitFullscreen();
      } else if ('msExitFullscreen' in document) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (document as any).msExitFullscreen();
      }
      setIsFullscreen(false);
    } else {
      // Entrer en plein écran
      if (container.requestFullscreen) {
        container.requestFullscreen();
      } else if ('webkitRequestFullscreen' in container) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (container as any).webkitRequestFullscreen();
      } else if ('msRequestFullscreen' in container) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (container as any).msRequestFullscreen();
      } else if ('mozRequestFullScreen' in container) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (container as any).mozRequestFullScreen();
      } else {
        // Fallback pour les navigateurs mobiles qui ne supportent pas le plein écran
        console.warn('Fullscreen not supported on this device');
        // On peut essayer d'utiliser l'API Picture-in-Picture comme alternative
        const video = videoRef.current;
        if (video && 'webkitSupportsPresentationMode' in video) {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          (video as any).webkitSetPresentationMode('fullscreen');
        }
      }
      setIsFullscreen(true);
    }
  };

  const formatTime = (time: number) => {
    if (isNaN(time)) return '0:00';
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full bg-black group"
      onMouseMove={handleMouseMove}
      onMouseLeave={() => isPlaying && setShowControls(false)}
    >
      {/* Vidéo */}
      <video
        ref={videoRef}
        className="w-full h-full object-contain"
        poster={poster}
        autoPlay
        playsInline
        preload="metadata"
      >
        <source src={videoUrl} type="video/mp4" />
        Votre navigateur ne supporte pas la lecture de vidéos.
      </video>

      {/* Loader */}
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/50">
          <Loader2 className="h-12 w-12 text-white animate-spin" />
        </div>
      )}

      {/* Overlay cliquable pour play/pause */}
      <div
        className="absolute inset-0 cursor-pointer"
        onClick={togglePlay}
      />

      {/* Overlay pour indiquer d'activer le son */}
      {showUnmutePrompt && isPlaying && isMuted && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/70">
          <div className="text-center p-6 bg-black/80 rounded-lg max-w-md">
            <VolumeX className="h-12 w-12 text-white mx-auto mb-4" />
            <h3 className="text-white text-xl font-bold mb-2">Son coupé</h3>
            <p className="text-gray-300 mb-4">
              Cliquez sur l'icône du son dans les contrôles pour activer l'audio
            </p>
            <Button
              onClick={() => {
                toggleMute();
                setShowUnmutePrompt(false);
              }}
              className="bg-netflix-red hover:bg-red-700 text-white"
            >
              <Volume2 className="h-4 w-4 mr-2" />
              Activer le son
            </Button>
          </div>
        </div>
      )}

      {/* Contrôles */}
      <div
        className={`absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black via-black/80 to-transparent p-4 transition-opacity duration-300 ${
          showControls || !isPlaying ? 'opacity-100' : 'opacity-0'
        }`}
      >
        {/* Barre de progression */}
        <div className="mb-4">
          <Slider
            value={[currentTime]}
            max={duration || 100}
            step={0.1}
            onValueChange={handleSeek}
            className="cursor-pointer"
          />
          <div className="flex justify-between text-xs text-white mt-1">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration)}</span>
          </div>
        </div>

        {/* Boutons de contrôle */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            {/* Play/Pause */}
            <Button
              variant="ghost"
              size="icon"
              onClick={(e) => {
                e.stopPropagation();
                togglePlay();
              }}
              className="text-white hover:bg-white/20"
            >
              {isPlaying ? (
                <Pause className="h-6 w-6" />
              ) : (
                <Play className="h-6 w-6" />
              )}
            </Button>

            {/* Volume */}
            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={(e) => {
                  e.stopPropagation();
                  toggleMute();
                }}
                className="text-white hover:bg-white/20"
              >
                {isMuted || volume === 0 ? (
                  <VolumeX className="h-5 w-5" />
                ) : (
                  <Volume2 className="h-5 w-5" />
                )}
              </Button>
              <div className="w-20">
                <Slider
                  value={[isMuted ? 0 : volume]}
                  max={1}
                  step={0.01}
                  onValueChange={handleVolumeChange}
                  className="cursor-pointer"
                />
              </div>
            </div>

            {/* Titre */}
            <span className="text-white text-sm font-medium ml-4 hidden md:block">
              {movieTitle}
            </span>
          </div>

          {/* Fullscreen */}
          <Button
            variant="ghost"
            size="icon"
            onClick={(e) => {
              e.stopPropagation();
              toggleFullscreen();
            }}
            className="text-white hover:bg-white/20"
          >
            {isFullscreen ? (
              <Minimize className="h-5 w-5" />
            ) : (
              <Maximize className="h-5 w-5" />
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SecureVideoPlayer;
