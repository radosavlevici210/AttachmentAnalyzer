import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Play, Pause, Volume2, VolumeX, Maximize, RotateCcw } from "lucide-react";

interface VideoPlayerProps {
  isOpen: boolean;
  onClose: () => void;
  videoUrl: string;
  title: string;
  project: any;
}

export default function VideoPlayer({ isOpen, onClose, videoUrl, title, project }: VideoPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const updateTime = () => setCurrentTime(video.currentTime);
    const updateDuration = () => setDuration(video.duration);
    
    video.addEventListener('timeupdate', updateTime);
    video.addEventListener('loadedmetadata', updateDuration);
    video.addEventListener('ended', () => setIsPlaying(false));

    return () => {
      video.removeEventListener('timeupdate', updateTime);
      video.removeEventListener('loadedmetadata', updateDuration);
      video.removeEventListener('ended', () => setIsPlaying(false));
    };
  }, []);

  const togglePlay = () => {
    const video = videoRef.current;
    if (!video) return;

    if (isPlaying) {
      video.pause();
    } else {
      video.play();
    }
    setIsPlaying(!isPlaying);
  };

  const toggleMute = () => {
    const video = videoRef.current;
    if (!video) return;

    video.muted = !video.muted;
    setIsMuted(video.muted);
  };

  const toggleFullscreen = () => {
    const container = containerRef.current;
    if (!container) return;

    if (!document.fullscreenElement) {
      container.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  const restart = () => {
    const video = videoRef.current;
    if (!video) return;

    video.currentTime = 0;
    video.play();
    setIsPlaying(true);
  };

  const seekTo = (time: number) => {
    const video = videoRef.current;
    if (!video) return;

    video.currentTime = time;
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl w-full bg-black/95 border-cyan-500/20 p-0">
        <div ref={containerRef} className="relative bg-black rounded-lg overflow-hidden">
          <DialogHeader className="p-6 pb-0">
            <DialogTitle className="text-cyan-400">{title}</DialogTitle>
            <DialogDescription className="text-gray-400">
              {project?.settings?.quality?.toUpperCase()} • {project?.settings?.duration}s • {project?.settings?.audioEnhancement}
            </DialogDescription>
          </DialogHeader>

          <div className="relative aspect-video bg-black">
            <video
              ref={videoRef}
              src={videoUrl}
              className="w-full h-full object-contain"
              poster="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='800' height='450' viewBox='0 0 800 450'%3E%3Crect width='800' height='450' fill='%23000'/%3E%3Ctext x='400' y='225' text-anchor='middle' dominant-baseline='middle' fill='%2300D9FF' font-family='Arial' font-size='24'%3EAI Generated Movie%3C/text%3E%3C/svg%3E"
              onLoadedData={() => {
                // Auto-play when loaded
                if (videoRef.current) {
                  videoRef.current.play().then(() => {
                    setIsPlaying(true);
                  }).catch(() => {
                    // Auto-play failed, user needs to click play
                    setIsPlaying(false);
                  });
                }
              }}
              onError={(e) => {
                console.error('Video load error:', e);
                // Show fallback content
              }}
            />

            {/* Video overlay info */}
            <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-sm rounded-lg px-3 py-2">
              <div className="text-sm text-cyan-400 font-medium">
                {project?.settings?.quality?.toUpperCase()} Quality
              </div>
              <div className="text-xs text-gray-300">
                {project?.settings?.aiModel} • {project?.settings?.audioEnhancement}
              </div>
            </div>

            {/* Center play button when paused */}
            {!isPlaying && (
              <div className="absolute inset-0 flex items-center justify-center">
                <Button
                  onClick={togglePlay}
                  className="w-16 h-16 rounded-full bg-cyan-500/20 hover:bg-cyan-500/30 border-2 border-cyan-400"
                >
                  <Play className="w-8 h-8 text-cyan-400 ml-1" />
                </Button>
              </div>
            )}
          </div>

          {/* Video controls */}
          <div className="p-4 bg-gradient-to-t from-black/80 to-transparent">
            {/* Progress bar */}
            <div className="mb-4">
              <div className="flex items-center gap-2 text-xs text-gray-400 mb-2">
                <span>{formatTime(currentTime)}</span>
                <div 
                  className="flex-1 h-1 bg-gray-600 rounded-full cursor-pointer"
                  onClick={(e) => {
                    const rect = e.currentTarget.getBoundingClientRect();
                    const x = e.clientX - rect.left;
                    const percentage = x / rect.width;
                    seekTo(duration * percentage);
                  }}
                >
                  <div 
                    className="h-full bg-cyan-400 rounded-full"
                    style={{ width: `${duration ? (currentTime / duration) * 100 : 0}%` }}
                  />
                </div>
                <span>{formatTime(duration || project?.settings?.duration || 0)}</span>
              </div>
            </div>

            {/* Control buttons */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={togglePlay}
                  className="text-cyan-400 hover:text-cyan-300"
                >
                  {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
                </Button>
                
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={restart}
                  className="text-cyan-400 hover:text-cyan-300"
                >
                  <RotateCcw className="w-4 h-4" />
                </Button>

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={toggleMute}
                  className="text-cyan-400 hover:text-cyan-300"
                >
                  {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
                </Button>
              </div>

              <div className="flex items-center gap-2">
                <div className="text-sm text-gray-400">
                  Generated with {project?.settings?.aiModel || 'AI'}
                </div>
                
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={toggleFullscreen}
                  className="text-cyan-400 hover:text-cyan-300"
                >
                  <Maximize className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Scene breakdown */}
          {project?.output?.scenes && (
            <div className="p-4 border-t border-cyan-500/20">
              <h4 className="text-sm font-medium text-cyan-400 mb-3">Scene Breakdown</h4>
              <div className="grid grid-cols-2 gap-3 max-h-32 overflow-y-auto">
                {project.output.scenes.map((scene: any, index: number) => (
                  <div key={index} className="text-xs bg-black/40 rounded p-2">
                    <div className="text-cyan-300 font-medium">{scene.title}</div>
                    <div className="text-gray-400">{scene.duration}s • {scene.visualStyle}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}