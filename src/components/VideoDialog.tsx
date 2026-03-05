"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

const ReactPlayer = dynamic(() => import("react-player").then((m) => m.default), {
  ssr: false,
  loading: () => (
    <div className="absolute inset-0 flex items-center justify-center bg-black/80 text-white">
      Ачааллаж байна...
    </div>
  ),
});

export interface VideoDialogProps {
  open: boolean;
  videoSrc: string;
  title?: string;
  startSeconds?: number;
  endSeconds?: number;
  onClose: () => void;
}

function parseYoutubeStart(url: string): number {
  try {
    const u = new URL(url);
    const raw = u.searchParams.get("t") ?? u.searchParams.get("start");
    if (!raw) return 0;

    if (/^\d+$/.test(raw)) return Number(raw);

    const match = raw.match(/(?:(\d+)h)?(?:(\d+)m)?(?:(\d+)s)?/);
    if (!match) return 0;
    const [, h = "0", m = "0", s = "0"] = match;
    return Number(h) * 3600 + Number(m) * 60 + Number(s);
  } catch {
    return 0;
  }
}

function parseYoutubeEnd(url: string): number {
  try {
    const u = new URL(url);
    const raw = u.searchParams.get("end");
    if (!raw) return 0;

    if (/^\d+$/.test(raw)) return Number(raw);

    const match = raw.match(/(?:(\d+)h)?(?:(\d+)m)?(?:(\d+)s)?/);
    if (!match) return 0;
    const [, h = "0", m = "0", s = "0"] = match;
    return Number(h) * 3600 + Number(m) * 60 + Number(s);
  } catch {
    return 0;
  }
}

export function VideoDialog({
  open,
  videoSrc,
  startSeconds: startProp,
  endSeconds: endProp,
  onClose,
}: VideoDialogProps) {
  const [playing, setPlaying] = useState(false);
  const [ready, setReady] = useState(false);

  const startSeconds = startProp ?? parseYoutubeStart(videoSrc);
  const endSeconds = endProp ?? parseYoutubeEnd(videoSrc);

  const youtubeConfig = {
    rel: 0 as const,
    iv_load_policy: 3 as const,
    fs: 0 as const,
    disablekb: 1 as const,
    cc_load_policy: 0 as const,
    start: startSeconds,
    ...(endSeconds > 0 && { end: endSeconds }),
    ...({ modestbranding: 1, showinfo: 0, playsinline: 1 } as Record<string, number>),
  };

  useEffect(() => {
    if (open) setPlaying(true);
    else {
      setPlaying(false);
      setReady(false);
    }
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60"
      role="dialog"
      aria-modal="true"
      aria-label="Video dialog"
    >
      <button
        type="button"
        className="absolute inset-0 border-0 bg-transparent p-0"
        onClick={onClose}
        aria-label="Close dialog"
      />

      <div
        className="relative z-10 w-full max-w-3xl px-4"
        onClick={(e) => e.stopPropagation()}
        onKeyDown={(e) => e.stopPropagation()}
      >
        <div className="relative aspect-video w-full overflow-hidden rounded-xl bg-black shadow-2xl">
          <ReactPlayer
            src={videoSrc}
            width="100%"
            height="100%"
            style={{ position: "absolute", inset: 0 }}
            playing={playing}
            muted
            controls={false}
            config={{ youtube: youtubeConfig }}
            onReady={() => setReady(true)}
          />

          <button
            type="button"
            className="absolute inset-0 z-10 cursor-pointer bg-transparent"
            onClick={() => setPlaying((p) => !p)}
            aria-label={playing ? "Pause" : "Play"}
          />

          {!playing && ready && (
            <div className="pointer-events-none absolute inset-0 z-20 flex items-center justify-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-black/70">
                <svg
                  className="h-8 w-8 text-white"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  role="img"
                  aria-label="Play"
                >
                  <title>Play</title>
                  <path d="M8 5v14l11-7z" />
                </svg>
              </div>
            </div>
          )}

          <button
            type="button"
            onClick={onClose}
            className="absolute right-2 top-2 z-30 flex h-9 w-9 items-center justify-center rounded-full bg-black/75 text-white transition hover:bg-black/90 focus:outline-none focus:ring-2 focus:ring-white/50"
            aria-label="Close video"
          >
            <svg
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              role="img"
              aria-label="Close"
            >
              <title>Close</title>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}