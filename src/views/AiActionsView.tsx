 "use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { MdTouchApp } from "react-icons/md";
import { VideoDialog } from "@/components/VideoDialog";

const SWIPE_THRESHOLD_PX = 50;

const CARDS = [
  {
    id: "behavior",
    title: "Behavior Analytics",
    image: "/card-image-1.png",
    videoSrc: "htthttps://www.youtube.com/watch?v=bQUZVYxcIXA&list=PPSV",
    startSeconds: 76,
    endSeconds: 87,
    features: [
      "Abandon, removal detection",
      "Intrusion detection",
      "Loitering detection",
      "Tripwire detection",
      "Area enter, exit",
      "Fast movement",
    ],
  },
  {
    id: "vehicles",
    title: "Vehicle Analytics",
    image: "/card-image-2.png",
    videoSrc: "https://www.youtube.com/watch?v=bQUZVYxcIXA&list=PPSV",
    startSeconds: 0,
    endSeconds: 20,
    features: [
      "License plate recognition",
      "Vehicle snapshot",
      "Vehicle alert",
    ],
  },
  {
    id: "target",
    title: "Target Analytics",
    image: "/card-image-3.png",
    videoSrc: "https://www.youtube.com/watch?v=GOgjKxn6_Ug",
    startSeconds: 4,
    endSeconds: 16,
    features: [
      "Target recognition",
      "Mask recognition",
      "Target attribute",
      "Target snapshot",
      "Target trend",
      "Image search",
    ],
  },
  {
    id: "situational",
    title: "Crowd Analytics",
    image: "/card-image-4.png",
    videoSrc: "https://www.youtube.com/watch?v=bQUZVYxcIXA&list=PPSV",
    startSeconds: 47,
    endSeconds: 54,
    features: [
      "Abnormal crowd density",
      "Cross line statistic",
      "Person leave detect",
      "Queue length",
    ],
  },
  {
    id: "Ai analysis",
    title: "Safety, Risk Analytics",
    image: "/card-image-5.png",
    videoSrc: "https://www.youtube.com/watch?v=bQUZVYxcIXA&list=PPSV",
    startSeconds: 55,
    endSeconds: 71,
    features: [
      "Cell phone detection",
      "Garbage overflow",
      "Smoke detection",
      "Safety helmet",
      "Security suit",
      "Falling down",
      "Fume fire",
      "Sleeping",
      "Fight",
    ],
  },
] as const;

const CAROUSEL_DURATION_MS = 2000;
const CAROUSEL_EASING = "cubic-bezier(0.22, 0.61, 0.36, 1)";

type CardItem = (typeof CARDS)[number];

export default function AiActionsView() {
  const [index, setIndex] = useState(0);
  const [videoCard, setVideoCard] = useState<CardItem | null>(null);
  const [dragOffset, setDragOffset] = useState(0);
  const touchStartX = useRef(0);
  const lastDragOffset = useRef(0);

  const goPrev = useCallback(
    () => setIndex((i) => (i <= 0 ? CARDS.length - 1 : i - 1)),
    []
  );
  const goNext = useCallback(
    () => setIndex((i) => (i >= CARDS.length - 1 ? 0 : i + 1)),
    []
  );

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    lastDragOffset.current = 0;
    setDragOffset(0);
  }, []);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    const dx = e.touches[0].clientX - touchStartX.current;
    lastDragOffset.current = dx;
    setDragOffset(dx);
  }, []);

  const handleTouchEnd = useCallback(() => {
    const dx = lastDragOffset.current;
    if (Math.abs(dx) > SWIPE_THRESHOLD_PX) {
      if (dx > 0) goPrev();
      else goNext();
    }
    lastDragOffset.current = 0;
    setDragOffset(0);
  }, [goPrev, goNext]);

  useEffect(() => {
    if (videoCard) return;
    const interval = setInterval(() => {
      setIndex((i) => (i >= CARDS.length - 1 ? 0 : i + 1));
    }, 6000);
    return () => clearInterval(interval);
  }, [videoCard]);

  const firstVisible = (index - 1 + CARDS.length) % CARDS.length;
  const trackOffset = firstVisible * (100 / (CARDS.length * 2));

  return (
    <div className="relative flex h-full w-full flex-col overflow-hidden">
      <div className="relative z-10 flex flex-1 flex-col items-center justify-center px-4 py-4">
        <div
          className="relative w-full max-w-5xl overflow-hidden touch-none"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          onTouchCancel={handleTouchEnd}
        >
          <div
            className="flex will-change-transform"
            style={{
              width: `${CARDS.length * 2 * (100 / 3)}%`,
              transform: `translateX(calc(-${trackOffset}% + ${dragOffset}px))`,
              transition:
                dragOffset !== 0
                  ? "none"
                  : `transform ${CAROUSEL_DURATION_MS}ms ${CAROUSEL_EASING}`,
            }}
          >
            {[...CARDS, ...CARDS].map((card, slotIndex) => {
              const centerSlot = firstVisible + 1;
              const isCenter = slotIndex === centerSlot;
              const sideStyle = !isCenter
                ? "scale-[0.82] opacity-90 blur-[3px] pointer-events-none"
                : "scale-100 z-10";
              return (
                <div
                  key={`${card.id}-${slotIndex}`}
                  className="flex min-w-0 flex-1 flex-col items-center justify-center px-2"
                  style={{
                    flexBasis: `${100 / (CARDS.length * 2)}%`,
                    flexGrow: 0,
                    flexShrink: 0,
                  }}
                >
                  <div
                    className={`relative flex h-[600px] w-full max-w-[380px] flex-col gap-6 overflow-hidden rounded-[24px] p-6 shadow-lg bg-white/20 ${sideStyle} ${isCenter ? "cursor-pointer" : ""}`}
                    style={{
                      transition: `transform ${CAROUSEL_DURATION_MS}ms ${CAROUSEL_EASING}, opacity ${CAROUSEL_DURATION_MS}ms ${CAROUSEL_EASING}, filter ${CAROUSEL_DURATION_MS}ms ${CAROUSEL_EASING}`,
                    }}
                    role={isCenter ? "button" : undefined}
                    tabIndex={isCenter ? 0 : undefined}
                    onClick={isCenter ? () => setVideoCard(card) : undefined}
                    onKeyDown={
                      isCenter
                        ? (e) => {
                            if (e.key === "Enter" || e.key === " ") {
                              e.preventDefault();
                              setVideoCard(card);
                            }
                          }
                        : undefined
                    }
                    onKeyUp={
                      isCenter
                        ? (e) => {
                            if (e.key === "Enter" || e.key === " ") e.preventDefault();
                          }
                        : undefined
                    }
                  >
                    <div className="relative aspect-375/277 w-full shrink-0 overflow-hidden rounded-[16px] bg-linear-to-br from-slate-600 to-slate-800">
                      <Image
                        src={card.image}
                        alt={card.title}
                        fill
                        className="object-cover opacity-100"
                        unoptimized
                      />
                    </div>
                    <div className="flex flex-1 flex-col gap-2">
                      <h2 className="text-lg font-bold text-white">{card.title}</h2>
                      <ul className="space-y-1 text-sm text-slate-200">
                        {card.features.map((feature) => (
                          <li key={feature} className="flex items-start gap-2">
                            <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-white" />
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setVideoCard(card);
                      }}
                      className="absolute bottom-4 right-4 z-10 flex h-11 w-11 items-center justify-center rounded-full border border-white/70 bg-white/10 text-white shadow-lg backdrop-blur-sm transition hover:bg-white/20 hover:shadow-xl pointer-events-auto"
                      aria-label={`Тоглуулах: ${card.title}`}
                    >
                      <span className="sr-only">Видео тоглуулах</span>
                      <MdTouchApp className="h-5 w-5" aria-hidden />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
          <button
            type="button"
            onClick={goPrev}
            className="absolute left-2 top-1/2 z-20 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/30 text-white shadow-md transition hover:bg-white/50"
            aria-label="Previous card"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <title>Previous</title>
              <path d="M15 18l-6-6 6-6" />
            </svg>
          </button>
          <button
            type="button"
            onClick={goNext}
            className="absolute right-2 top-1/2 z-20 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/30 text-white shadow-md transition hover:bg-white/50"
            aria-label="Next card"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <title>Next</title>
              <path d="M9 18l6-6-6-6" />
            </svg>
          </button>
        </div>
        <div className="mt-4 flex gap-2">
          {CARDS.map((card, i) => (
            <button
              key={card.id}
              type="button"
              onClick={() => setIndex(i)}
              className={`h-2 rounded-full transition-all ${
                i === index ? "w-6 bg-white" : "w-2 bg-white/40 hover:bg-white/60"
              }`}
              aria-label={`Go to card ${i + 1}`}
            />
          ))}
        </div>
      </div>

      {videoCard ? (
        <VideoDialog
          open
          videoSrc={videoCard.videoSrc}
          title={videoCard.title}
          startSeconds={"startSeconds" in videoCard ? videoCard.startSeconds : undefined}
          endSeconds={"endSeconds" in videoCard ? videoCard.endSeconds : undefined}
          onClose={() => setVideoCard(null)}
        />
      ) : null}
    </div>
  );
}
