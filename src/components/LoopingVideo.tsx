import { useEffect, useRef } from "react";

const FADE_SECONDS = 0.5;
const RESTART_DELAY_MS = 100;

interface LoopingVideoProps {
  src: string;
}

/**
 * Background video that loops manually: fades in over the first 0.5s, fades out over
 * the last 0.5s, then waits 100ms on `ended` before restarting from 0.
 * Opacity is written straight to the element so the rAF loop never re-renders React.
 */
export function LoopingVideo({ src }: LoopingVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // Reduced motion: show the still first frame instead of a looping film.
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      video.pause();
      video.style.opacity = "1";
      return;
    }

    let frame = 0;
    let restartTimer: number | undefined;

    const applyFade = () => {
      const { currentTime, duration } = video;
      if (Number.isFinite(duration) && duration > 0) {
        const fadeIn = Math.min(currentTime / FADE_SECONDS, 1);
        const fadeOut = Math.min((duration - currentTime) / FADE_SECONDS, 1);
        video.style.opacity = String(Math.max(0, Math.min(fadeIn, fadeOut)));
      }
    };

    const tick = () => {
      applyFade();
      frame = requestAnimationFrame(tick);
    };

    // Browsers pause rAF in hidden/occluded tabs; timeupdate keeps opacity in step there.
    const handleTimeUpdate = () => applyFade();
    const handleCanPlay = () => {
      if (video.paused) void video.play().catch(() => {});
    };

    const handleEnded = () => {
      video.style.opacity = "0";
      restartTimer = window.setTimeout(() => {
        video.currentTime = 0;
        void video.play().catch(() => {});
      }, RESTART_DELAY_MS);
    };

    video.style.opacity = "0";
    video.addEventListener("ended", handleEnded);
    video.addEventListener("timeupdate", handleTimeUpdate);
    video.addEventListener("canplay", handleCanPlay);
    frame = requestAnimationFrame(tick);
    void video.play().catch(() => {});

    return () => {
      cancelAnimationFrame(frame);
      window.clearTimeout(restartTimer);
      video.removeEventListener("ended", handleEnded);
      video.removeEventListener("timeupdate", handleTimeUpdate);
      video.removeEventListener("canplay", handleCanPlay);
    };
  }, []);

  return (
    <div className="absolute z-0" style={{ inset: "auto 0 0 0", top: "300px" }} aria-hidden="true">
      <video
        ref={videoRef}
        src={src}
        className="h-full w-full object-cover"
        muted
        playsInline
        preload="auto"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-background via-transparent to-background" />
    </div>
  );
}
