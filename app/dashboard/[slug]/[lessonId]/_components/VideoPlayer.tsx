"use client";

import { Slider } from "@/components/ui/slider";
import { useConstructUrl } from "@/hooks/use-construct-url";
import { cn } from "@/lib/utils";
import {
  BookIcon,
  Loader2,
  Maximize,
  Minimize,
  Pause,
  Play,
  Settings,
  Volume2,
  VolumeX,
} from "lucide-react";
import { KeyboardEvent, useCallback, useEffect, useRef, useState } from "react";

interface VideoPlayerProps {
  thumbnailKey: string;
  videoKey: string;
}

function formatTime(seconds: number): string {
  if (isNaN(seconds)) return "0:00";
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, "0")}`;
}

export function VideoPlayer({ thumbnailKey, videoKey }: VideoPlayerProps) {
  const videoUrl = useConstructUrl(videoKey);
  const thumbnailUrl = useConstructUrl(thumbnailKey);

  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const controlsTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [isBuffering, setIsBuffering] = useState(false);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [showSettings, setShowSettings] = useState(false);

  const playbackRates = [0.5, 0.75, 1, 1.25, 1.5, 2];

  const togglePlay = useCallback(() => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
    } else {
      videoRef.current.play();
    }
  }, [isPlaying]);

  const toggleMute = useCallback(() => {
    if (!videoRef.current) return;
    videoRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  }, [isMuted]);

  const toggleFullscreen = useCallback(() => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  }, []);

  const handleVolumeChange = useCallback((value: number[]) => {
    if (!videoRef.current) return;
    const newVolume = value[0];
    videoRef.current.volume = newVolume;
    setVolume(newVolume);
    setIsMuted(newVolume === 0);
  }, []);

  const handleSeek = useCallback((value: number[]) => {
    if (!videoRef.current) return;
    videoRef.current.currentTime = value[0];
    setCurrentTime(value[0]);
  }, []);

  const handlePlaybackRateChange = useCallback((rate: number) => {
    if (!videoRef.current) return;
    videoRef.current.playbackRate = rate;
    setPlaybackRate(rate);
    setShowSettings(false);
  }, []);

  const skip = useCallback((seconds: number) => {
    if (!videoRef.current) return;
    videoRef.current.currentTime += seconds;
  }, []);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent<HTMLDivElement>) => {
      switch (e.key.toLowerCase()) {
        case " ":
        case "k":
          e.preventDefault();
          togglePlay();
          break;
        case "m":
          e.preventDefault();
          toggleMute();
          break;
        case "f":
          e.preventDefault();
          toggleFullscreen();
          break;
        case "arrowleft":
          e.preventDefault();
          skip(-10);
          break;
        case "arrowright":
          e.preventDefault();
          skip(10);
          break;
        case "arrowup":
          e.preventDefault();
          handleVolumeChange([Math.min(1, volume + 0.1)]);
          break;
        case "arrowdown":
          e.preventDefault();
          handleVolumeChange([Math.max(0, volume - 0.1)]);
          break;
        case "j":
          e.preventDefault();
          skip(-10);
          break;
        case "l":
          e.preventDefault();
          skip(10);
          break;
      }
    },
    [togglePlay, toggleMute, toggleFullscreen, skip, handleVolumeChange, volume]
  );

  const handleMouseMove = useCallback(() => {
    setShowControls(true);
    if (controlsTimeoutRef.current) {
      clearTimeout(controlsTimeoutRef.current);
    }
    if (isPlaying) {
      controlsTimeoutRef.current = setTimeout(() => {
        setShowControls(false);
      }, 3000);
    }
  }, [isPlaying]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);
    const handleTimeUpdate = () => {
      setCurrentTime(video.currentTime);
      // Also update duration in case it wasn't available before
      if (
        video.duration &&
        !isNaN(video.duration) &&
        video.duration !== Infinity
      ) {
        setDuration(video.duration);
      }
    };
    const handleLoadedMetadata = () => {
      if (
        video.duration &&
        !isNaN(video.duration) &&
        video.duration !== Infinity
      ) {
        setDuration(video.duration);
      }
      setIsLoading(false);
    };
    const handleDurationChange = () => {
      if (
        video.duration &&
        !isNaN(video.duration) &&
        video.duration !== Infinity
      ) {
        setDuration(video.duration);
      }
    };
    const handleLoadedData = () => {
      if (
        video.duration &&
        !isNaN(video.duration) &&
        video.duration !== Infinity
      ) {
        setDuration(video.duration);
      }
    };
    const handleWaiting = () => setIsBuffering(true);
    const handleCanPlay = () => {
      setIsBuffering(false);
      // Try to get duration when video is ready to play
      if (
        video.duration &&
        !isNaN(video.duration) &&
        video.duration !== Infinity
      ) {
        setDuration(video.duration);
      }
    };
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    video.addEventListener("play", handlePlay);
    video.addEventListener("pause", handlePause);
    video.addEventListener("timeupdate", handleTimeUpdate);
    video.addEventListener("loadedmetadata", handleLoadedMetadata);
    video.addEventListener("durationchange", handleDurationChange);
    video.addEventListener("loadeddata", handleLoadedData);
    video.addEventListener("waiting", handleWaiting);
    video.addEventListener("canplay", handleCanPlay);
    document.addEventListener("fullscreenchange", handleFullscreenChange);

    // Try to get duration if video is already loaded
    if (
      video.duration &&
      !isNaN(video.duration) &&
      video.duration !== Infinity
    ) {
      setDuration(video.duration);
    }

    return () => {
      video.removeEventListener("play", handlePlay);
      video.removeEventListener("pause", handlePause);
      video.removeEventListener("timeupdate", handleTimeUpdate);
      video.removeEventListener("loadedmetadata", handleLoadedMetadata);
      video.removeEventListener("durationchange", handleDurationChange);
      video.removeEventListener("loadeddata", handleLoadedData);
      video.removeEventListener("waiting", handleWaiting);
      video.removeEventListener("canplay", handleCanPlay);
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
      if (controlsTimeoutRef.current) {
        clearTimeout(controlsTimeoutRef.current);
      }
    };
  }, []);

  if (!videoKey) {
    return (
      <div className="bg-muted flex aspect-video flex-col items-center justify-center gap-4 rounded-lg border border-dashed">
        <div className="bg-primary/10 rounded-full p-4">
          <BookIcon className="text-primary size-10" />
        </div>
        <div className="text-center">
          <p className="text-foreground font-medium">No video available</p>
          <p className="text-muted-foreground text-sm">
            This lesson does not have a video yet
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className="group relative aspect-video w-full overflow-hidden rounded-lg bg-black"
      onMouseMove={handleMouseMove}
      onMouseLeave={() => isPlaying && setShowControls(false)}
      onKeyDown={handleKeyDown}
      tabIndex={0}
    >
      <video
        ref={videoRef}
        className="h-full w-full object-contain"
        poster={thumbnailUrl}
        src={videoUrl}
        onClick={togglePlay}
        playsInline
      />

      {/* Buffering Indicator - only show when video is playing and buffering */}
      {isBuffering && isPlaying && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/30">
          <Loader2 className="size-12 animate-spin text-white" />
        </div>
      )}

      {/* Play/Pause overlay on click */}
      {!isPlaying && !isLoading && (
        <button
          onClick={togglePlay}
          className="absolute inset-0 flex items-center justify-center bg-black/30 transition-opacity"
        >
          <div className="bg-primary/90 hover:bg-primary rounded-full p-4 transition-colors">
            <Play className="text-primary-foreground size-12 fill-current" />
          </div>
        </button>
      )}

      {/* Controls */}
      <div
        className={cn(
          "absolute right-0 bottom-0 left-0 bg-linear-to-t from-black/80 to-transparent p-4 transition-opacity duration-300",
          showControls || !isPlaying ? "opacity-100" : "opacity-0"
        )}
      >
        {/* Progress Bar */}
        <div className="mb-3">
          <Slider
            value={[currentTime]}
            min={0}
            max={duration || 100}
            step={0.1}
            onValueChange={handleSeek}
            className="**:data-[slot=slider-range]:bg-primary cursor-pointer **:data-[slot=slider-thumb]:size-3 **:data-[slot=slider-thumb]:opacity-0 group-hover:**:data-[slot=slider-thumb]:opacity-100 **:data-[slot=slider-track]:h-1 **:data-[slot=slider-track]:bg-white/30"
          />
        </div>

        {/* Controls Row */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {/* Play/Pause */}
            <button
              onClick={togglePlay}
              className="rounded-full p-2 text-white transition-colors hover:bg-white/20"
              aria-label={isPlaying ? "Pause" : "Play"}
            >
              {isPlaying ? (
                <Pause className="size-5 fill-current" />
              ) : (
                <Play className="size-5 fill-current" />
              )}
            </button>

            {/* Volume Controls */}
            <div className="group/volume flex items-center gap-1">
              <button
                onClick={toggleMute}
                className="rounded-full p-2 text-white transition-colors hover:bg-white/20"
                aria-label={isMuted ? "Unmute" : "Mute"}
              >
                {isMuted || volume === 0 ? (
                  <VolumeX className="size-5" />
                ) : (
                  <Volume2 className="size-5" />
                )}
              </button>
              <div className="w-0 overflow-hidden transition-all duration-200 group-hover/volume:w-20">
                <Slider
                  value={[isMuted ? 0 : volume]}
                  min={0}
                  max={1}
                  step={0.01}
                  onValueChange={handleVolumeChange}
                  className="cursor-pointer **:data-[slot=slider-range]:bg-white **:data-[slot=slider-thumb]:size-3 **:data-[slot=slider-track]:h-1 **:data-[slot=slider-track]:bg-white/30"
                />
              </div>
            </div>

            {/* Time Display */}
            <span className="ml-2 text-sm text-white tabular-nums">
              {formatTime(currentTime)} / {formatTime(duration)}
            </span>
          </div>

          <div className="flex items-center gap-2">
            {/* Playback Speed */}
            <div className="relative">
              <button
                onClick={() => setShowSettings(!showSettings)}
                className="rounded-full p-2 text-white transition-colors hover:bg-white/20"
                aria-label="Settings"
              >
                <Settings className="size-5" />
              </button>
              {showSettings && (
                <div className="absolute right-0 bottom-full mb-2 min-w-30 rounded-lg bg-black/90 py-2">
                  <p className="px-3 py-1 text-xs text-white/60">Speed</p>
                  {playbackRates.map((rate) => (
                    <button
                      key={rate}
                      onClick={() => handlePlaybackRateChange(rate)}
                      className={cn(
                        "w-full px-3 py-1.5 text-left text-sm transition-colors hover:bg-white/20",
                        playbackRate === rate ? "text-primary" : "text-white"
                      )}
                    >
                      {rate === 1 ? "Normal" : `${rate}x`}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Fullscreen */}
            <button
              onClick={toggleFullscreen}
              className="rounded-full p-2 text-white transition-colors hover:bg-white/20"
              aria-label={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
            >
              {isFullscreen ? (
                <Minimize className="size-5" />
              ) : (
                <Maximize className="size-5" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Keyboard shortcuts hint */}
      <div className="absolute top-4 right-4 rounded-lg bg-black/70 px-3 py-2 text-xs text-white opacity-0 transition-opacity group-focus:opacity-100">
        <p>Space/K: Play/Pause</p>
        <p>M: Mute</p>
        <p>F: Fullscreen</p>
        <p>←/J: -10s | →/L: +10s</p>
      </div>
    </div>
  );
}
