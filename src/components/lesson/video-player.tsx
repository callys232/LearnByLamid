"use client";

import { useState, useRef, useEffect } from "react";
import Script from "next/script";
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize2,
  Loader2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { track, trackVideoMilestone } from "@/lib/tracker";

interface VideoPlayerProps {
  contentUrl?: string;
  title: string;
  lessonId?: string;
  courseId?: string;
  onProgress?: (pct: number) => void;
}

function detectType(
  url: string,
): "vimeo" | "youtube" | "mux" | "html5" | "placeholder" {
  if (!url) return "placeholder";
  if (url.includes("vimeo.com")) return "vimeo";
  if (url.includes("youtube.com") || url.includes("youtu.be")) return "youtube";
  if (url.match(/^[A-Za-z0-9]{20,}$/) && !url.includes("/")) return "mux";
  if (url.match(/\.(mp4|webm|ogg|mov)(\?.*)?$/i)) return "html5";
  return "placeholder";
}

function getVimeoId(url: string) {
  const m = url.match(/vimeo\.com\/(?:video\/)?(\d+)/);
  return m ? m[1] : null;
}

function getYouTubeId(url: string) {
  const m = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&?/]+)/);
  return m ? m[1] : null;
}

function formatTime(sec: number) {
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}

const SPEEDS = [0.75, 1, 1.25, 1.5, 2];

// ─── Main router ────────────────────────────────────────────────────────────

export function VideoPlayer({
  contentUrl,
  title,
  lessonId,
  courseId,
  onProgress,
}: VideoPlayerProps) {
  const type = detectType(contentUrl ?? "");
  if (type === "vimeo")
    return (
      <VimeoPlayer
        url={contentUrl!}
        title={title}
        lessonId={lessonId}
        courseId={courseId}
        onProgress={onProgress}
      />
    );
  if (type === "youtube")
    return (
      <YouTubePlayer url={contentUrl!} title={title} lessonId={lessonId} />
    );
  if (type === "mux")
    return (
      <MuxPlayer
        playbackId={contentUrl!}
        title={title}
        lessonId={lessonId}
        courseId={courseId}
        onProgress={onProgress}
      />
    );
  if (type === "html5")
    return (
      <Html5Player
        url={contentUrl!}
        title={title}
        lessonId={lessonId}
        courseId={courseId}
        onProgress={onProgress}
      />
    );
  return (
    <PlaceholderPlayer
      title={title}
      lessonId={lessonId}
      courseId={courseId}
      onProgress={onProgress}
    />
  );
}

// ─── Vimeo ─────────────────────────────────────────────────────────────────

function VimeoPlayer({
  url,
  title,
}: Omit<VideoPlayerProps, "contentUrl"> & { url: string }) {
  const id = getVimeoId(url);
  if (!id) return <PlaceholderPlayer title={title} />;
  return (
    <div className="relative w-full bg-black aspect-video">
      <iframe
        src={`https://player.vimeo.com/video/${id}?badge=0&autopause=0&player_id=0`}
        className="absolute inset-0 h-full w-full"
        allow="autoplay; fullscreen; picture-in-picture"
        title={title}
      />
    </div>
  );
}

// ─── YouTube ───────────────────────────────────────────────────────────────

function YouTubePlayer({
  url,
  title,
}: Omit<VideoPlayerProps, "contentUrl"> & { url: string }) {
  const id = getYouTubeId(url);
  if (!id) return <PlaceholderPlayer title={title} />;
  return (
    <div className="relative w-full bg-black aspect-video">
      <iframe
        src={`https://www.youtube-nocookie.com/embed/${id}?rel=0&modestbranding=1`}
        className="absolute inset-0 h-full w-full"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        title={title}
      />
      <div className="absolute right-3 top-3 z-10 rounded-full bg-black/70 px-3 py-1 text-xs text-white">
        <a
          href={`https://www.youtube.com/watch?v=${id}`}
          target="_blank"
          rel="noopener noreferrer"
          className="font-medium text-white hover:text-primary transition-colors"
        >
          Watch on YouTube
        </a>
      </div>
    </div>
  );
}

// ─── Mux ───────────────────────────────────────────────────────────────────

function MuxPlayer({
  playbackId,
  title,
}: Omit<VideoPlayerProps, "contentUrl"> & { playbackId: string }) {
  const [loaded, setLoaded] = useState(false);
  return (
    <>
      <Script
        src="https://cdn.jsdelivr.net/npm/@mux/mux-player"
        type="module"
        onLoad={() => setLoaded(true)}
      />
      <div className="relative w-full bg-black aspect-video">
        {!loaded && (
          <div className="absolute inset-0 flex items-center justify-center">
            <Loader2 className="h-8 w-8 text-primary animate-spin" />
          </div>
        )}
        {loaded && (
          /* @ts-expect-error — mux-player is a custom element */
          <mux-player
            playback-id={playbackId}
            metadata-video-title={title}
            accent-color="#C12129"
            class="w-full aspect-video"
          />
        )}
      </div>
    </>
  );
}

// ─── HTML5 ─────────────────────────────────────────────────────────────────

function Html5Player({
  url,
  title,
  lessonId,
  courseId,
  onProgress,
}: Omit<VideoPlayerProps, "contentUrl"> & { url: string }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(false);
  const [pct, setPct] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [speed, setSpeed] = useState(1);

  function togglePlay() {
    const v = videoRef.current;
    if (!v) return;
    if (v.paused) {
      v.play();
      setPlaying(true);
      track("video_played", { lessonId, courseId });
    } else {
      v.pause();
      setPlaying(false);
    }
  }

  function changeSpeed(s: number) {
    setSpeed(s);
    if (videoRef.current) videoRef.current.playbackRate = s;
  }

  function handleTimeUpdate() {
    const v = videoRef.current;
    if (!v || !v.duration) return;
    setCurrentTime(v.currentTime);
    const progress = Math.round((v.currentTime / v.duration) * 100);
    setPct(progress);
    onProgress?.(progress);
    if (lessonId) trackVideoMilestone(lessonId, progress, courseId);
  }

  // Keyboard shortcuts — uses refs, safe with empty deps
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if ((e.target as HTMLElement)?.tagName.match(/^(INPUT|TEXTAREA|SELECT)$/))
        return;
      const v = videoRef.current;
      if (!v) return;
      if (e.code === "Space") {
        e.preventDefault();
        if (v.paused) {
          v.play();
          setPlaying(true);
        } else {
          v.pause();
          setPlaying(false);
        }
      }
      if (e.code === "ArrowLeft") {
        e.preventDefault();
        v.currentTime = Math.max(0, v.currentTime - 5);
      }
      if (e.code === "ArrowRight") {
        e.preventDefault();
        v.currentTime = Math.min(v.duration || 0, v.currentTime + 5);
      }
      if (e.code === "KeyM") {
        v.muted = !v.muted;
        setMuted(v.muted);
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <div className="group relative w-full bg-black aspect-video overflow-hidden">
      <video
        ref={videoRef}
        src={url}
        className="w-full h-full object-contain"
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={() => {
          const v = videoRef.current;
          if (v) setDuration(v.duration);
        }}
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        onEnded={() => setPlaying(false)}
        muted={muted}
      />

      {/* Controls overlay */}
      <div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 focus-within:opacity-100 transition-opacity duration-200">
        <div className="px-4 pb-3 space-y-2">
          <input
            type="range"
            aria-label="Seek video"
            min={0}
            max={100}
            value={pct}
            onChange={(e) => {
              const v = videoRef.current;
              if (v)
                v.currentTime = (Number(e.target.value) / 100) * v.duration;
              setPct(Number(e.target.value));
            }}
            className="w-full h-1 accent-primary cursor-pointer"
          />
          <div className="flex items-center gap-3">
            <button
              type="button"
              aria-label={playing ? "Pause" : "Play"}
              onClick={togglePlay}
              className="text-white hover:text-primary transition-colors"
            >
              {playing ? (
                <Pause className="h-5 w-5" />
              ) : (
                <Play className="h-5 w-5" />
              )}
            </button>
            <button
              type="button"
              aria-label={muted ? "Unmute" : "Mute"}
              onClick={() => {
                const v = videoRef.current;
                if (!v) return;
                v.muted = !v.muted;
                setMuted(v.muted);
              }}
              className="text-white/70 hover:text-white transition-colors"
            >
              {muted ? (
                <VolumeX className="h-4 w-4" />
              ) : (
                <Volume2 className="h-4 w-4" />
              )}
            </button>
            <span className="text-xs text-white/70 tabular-nums">
              {formatTime(currentTime)} / {formatTime(duration)}
            </span>
            <span className="flex-1" />
            <select
              value={speed}
              onChange={(e) => changeSpeed(Number(e.target.value))}
              aria-label="Playback speed"
              className="bg-transparent text-xs text-white/70 hover:text-white cursor-pointer focus:outline-none"
            >
              {SPEEDS.map((s) => (
                <option key={s} value={s} className="bg-black text-white">
                  {s}×
                </option>
              ))}
            </select>
            <button
              type="button"
              aria-label="Fullscreen"
              onClick={() => videoRef.current?.requestFullscreen()}
              className="text-white/70 hover:text-white transition-colors"
            >
              <Maximize2 className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Centre play button */}
      {!playing && (
        <button
          type="button"
          aria-label="Play"
          onClick={togglePlay}
          className="absolute inset-0 flex items-center justify-center"
        >
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/90 text-white shadow-primary hover:scale-110 transition-transform">
            <Play className="h-7 w-7 ml-1" />
          </div>
        </button>
      )}

      <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
        <p className="text-[10px] text-white/40">Space · ←/→ 5s · M mute</p>
      </div>
    </div>
  );
}

// ─── Placeholder (interactive mock) ────────────────────────────────────────

const MOCK_DURATION = 600; // 10 min

function PlaceholderPlayer({
  title,
  lessonId,
  courseId,
  onProgress,
}: VideoPlayerProps) {
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [speed, setSpeed] = useState(1);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const speedRef = useRef(1);
  const playingRef = useRef(false);

  function startInterval() {
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = setInterval(
      () => {
        setProgress((p) => {
          const next = Math.min(p + 1, 100);
          onProgress?.(next);
          if (lessonId) trackVideoMilestone(lessonId, next, courseId);
          if (next === 100 && intervalRef.current)
            clearInterval(intervalRef.current);
          return next;
        });
      },
      Math.round(200 / speedRef.current),
    );
  }

  function handleToggle() {
    if (playingRef.current) {
      if (intervalRef.current) clearInterval(intervalRef.current);
    } else {
      track("video_played", { lessonId, courseId });
      startInterval();
    }
    playingRef.current = !playingRef.current;
    setPlaying((p) => !p);
  }

  function changeSpeed(s: number) {
    setSpeed(s);
    speedRef.current = s;
    if (playingRef.current) startInterval();
  }

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if ((e.target as HTMLElement)?.tagName.match(/^(INPUT|TEXTAREA|SELECT)$/))
        return;
      if (e.code === "Space") {
        e.preventDefault();
        handleToggle();
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const currentTime = Math.round((progress / 100) * MOCK_DURATION);

  return (
    <div className="relative bg-black aspect-video w-full max-h-[calc(100vh-14rem)] flex items-center justify-center group">
      <div className="absolute inset-0 bg-gradient-to-br from-background-secondary to-black" />

      <button
        type="button"
        aria-label={playing ? "Pause" : "Play"}
        onClick={handleToggle}
        className="relative z-10 flex h-16 w-16 items-center justify-center rounded-full bg-primary/90 text-white shadow-primary hover:scale-110 hover:bg-primary active:scale-95 transition-all"
      >
        {playing ? (
          <Pause className="h-7 w-7" />
        ) : (
          <Play className="h-7 w-7 ml-1" />
        )}
      </button>

      <div className="absolute top-4 left-4">
        <p className="text-sm font-medium text-white/80">{title}</p>
      </div>

      <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/80 to-transparent px-4 pb-3 pt-8 opacity-0 group-hover:opacity-100 transition-opacity">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-xs text-white/60 tabular-nums w-24">
            {formatTime(currentTime)} / {formatTime(MOCK_DURATION)}
          </span>
          <input
            type="range"
            aria-label="Seek video"
            min={0}
            max={100}
            value={progress}
            onChange={(e) => {
              const val = Number(e.target.value);
              setProgress(val);
              onProgress?.(val);
            }}
            className="flex-1 h-1 accent-primary cursor-pointer"
          />
        </div>
        <div className="flex items-center gap-3">
          <button
            type="button"
            aria-label={playing ? "Pause" : "Play"}
            onClick={handleToggle}
            className="text-white/80 hover:text-white transition-colors"
          >
            {playing ? (
              <Pause className="h-4 w-4" />
            ) : (
              <Play className="h-4 w-4" />
            )}
          </button>
          <Volume2 className="h-4 w-4 text-white/60" />
          <span className="flex-1" />
          <select
            value={speed}
            onChange={(e) => changeSpeed(Number(e.target.value))}
            aria-label="Playback speed"
            className="bg-transparent text-xs text-white/70 hover:text-white cursor-pointer focus:outline-none"
          >
            {SPEEDS.map((s) => (
              <option key={s} value={s} className="bg-black text-white">
                {s}×
              </option>
            ))}
          </select>
          <Maximize2 className="h-4 w-4 text-white/60" />
        </div>
      </div>

      <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
        <p className="text-[10px] text-white/40">Space to play/pause</p>
      </div>
    </div>
  );
}
