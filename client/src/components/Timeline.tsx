import { useState } from 'react';
import { Play, Pause, SkipBack, SkipForward, Volume2, Scissors, Copy, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';

interface TimelineProps {
  duration?: number;
  currentTime?: number;
  onTimeChange?: (time: number) => void;
  onPlay?: () => void;
  onPause?: () => void;
  isPlaying?: boolean;
  tracks?: Array<{
    id: string;
    name: string;
    type: 'video' | 'audio' | 'subtitle';
    segments: Array<{
      start: number;
      end: number;
      content?: string;
    }>;
  }>;
}

export default function Timeline({
  duration = 120,
  currentTime = 0,
  onTimeChange,
  onPlay,
  onPause,
  isPlaying = false,
  tracks = []
}: TimelineProps) {
  const [selectedTrack, setSelectedTrack] = useState<string | null>(null);
  const [zoom, setZoom] = useState(1);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleTimelineClick = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const newTime = (x / rect.width) * duration;
    onTimeChange?.(newTime);
  };

  return (
    <div className="bg-black/50 backdrop-blur-sm border border-cyan-500/20 rounded-lg p-4 space-y-4">
      {/* Timeline Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={isPlaying ? onPause : onPlay}
            className="text-cyan-400 hover:text-cyan-300"
          >
            {isPlaying ? <Pause size={16} /> : <Play size={16} />}
          </Button>
          <Button variant="ghost" size="sm" className="text-cyan-400 hover:text-cyan-300">
            <SkipBack size={16} />
          </Button>
          <Button variant="ghost" size="sm" className="text-cyan-400 hover:text-cyan-300">
            <SkipForward size={16} />
          </Button>
          <div className="text-sm text-cyan-400 font-mono">
            {formatTime(currentTime)} / {formatTime(duration)}
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <Volume2 size={16} className="text-cyan-400" />
          <Slider
            value={[80]}
            max={100}
            step={1}
            className="w-20"
          />
          <Button variant="ghost" size="sm" className="text-cyan-400 hover:text-cyan-300">
            <Scissors size={16} />
          </Button>
          <Button variant="ghost" size="sm" className="text-cyan-400 hover:text-cyan-300">
            <Copy size={16} />
          </Button>
          <Button variant="ghost" size="sm" className="text-cyan-400 hover:text-cyan-300">
            <Download size={16} />
          </Button>
        </div>
      </div>

      {/* Timeline Ruler */}
      <div className="relative">
        <div className="h-8 bg-gray-900/50 rounded border border-cyan-500/10 relative overflow-hidden cursor-pointer"
             onClick={handleTimelineClick}>
          {/* Time markers */}
          <div className="absolute inset-0 flex">
            {Array.from({ length: Math.ceil(duration / 10) }, (_, i) => (
              <div key={i} className="relative flex-1 border-l border-cyan-500/20">
                <span className="absolute -top-5 text-xs text-cyan-400/70 font-mono">
                  {formatTime(i * 10)}
                </span>
              </div>
            ))}
          </div>
          
          {/* Playhead */}
          <div 
            className="absolute top-0 bottom-0 w-0.5 bg-cyan-400 shadow-lg shadow-cyan-400/50"
            style={{ left: `${(currentTime / duration) * 100}%` }}
          >
            <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-3 h-3 bg-cyan-400 rounded-full shadow-lg shadow-cyan-400/50" />
          </div>
        </div>
      </div>

      {/* Track Layers */}
      <div className="space-y-2 max-h-48 overflow-y-auto">
        {tracks.map((track) => (
          <div key={track.id} className="flex items-center space-x-3">
            <div className="w-24 text-xs text-cyan-400 font-medium truncate">
              {track.name}
            </div>
            <Badge 
              variant={track.type === 'video' ? 'default' : track.type === 'audio' ? 'secondary' : 'outline'}
              className="text-xs"
            >
              {track.type}
            </Badge>
            <div 
              className={`flex-1 h-8 rounded border cursor-pointer transition-colors ${
                selectedTrack === track.id 
                  ? 'border-cyan-400 bg-cyan-400/10' 
                  : 'border-cyan-500/20 bg-gray-900/30 hover:bg-gray-800/50'
              }`}
              onClick={() => setSelectedTrack(selectedTrack === track.id ? null : track.id)}
            >
              <div className="relative h-full flex items-center">
                {track.segments.map((segment, idx) => (
                  <div
                    key={idx}
                    className="absolute h-6 bg-gradient-to-r from-cyan-500/60 to-blue-500/60 rounded-sm border border-cyan-400/30"
                    style={{
                      left: `${(segment.start / duration) * 100}%`,
                      width: `${((segment.end - segment.start) / duration) * 100}%`
                    }}
                  >
                    {segment.content && (
                      <div className="px-1 text-xs text-white/80 truncate">
                        {segment.content}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Zoom Controls */}
      <div className="flex items-center justify-center space-x-2">
        <span className="text-xs text-cyan-400/70">Zoom:</span>
        <Slider
          value={[zoom]}
          onValueChange={([value]) => setZoom(value)}
          max={4}
          min={0.25}
          step={0.25}
          className="w-32"
        />
        <span className="text-xs text-cyan-400/70 font-mono">{zoom}x</span>
      </div>
    </div>
  );
}