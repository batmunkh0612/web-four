"use client";

import { useEffect, useRef, useState } from "react";

import BackButton from "@/components/BackButton";
import IconPressLink from "@/components/IconPressLink";
import AdvantagesIframeView from "@/views/AdvantagesIframeView";
import AiActionsView from "@/views/AiActionsView";

type ViewName = "home" | "aiActions" | "aiActionsDetail" | "advantages";

const TRANSITION_MS = 260;

const Home = () => {
  const [stack, setStack] = useState<ViewName[]>(["home"]);
  const [activeView, setActiveView] = useState<ViewName>("home");
  const [isVisible, setIsVisible] = useState(true);
  const isTransitioningRef = useRef(false);
  const nextViewRef = useRef<ViewName | null>(null);

  const canGoBack = stack.length > 1;

  const startTransitionTo = (next: ViewName) => {
    if (next === activeView) return;
    if (isTransitioningRef.current) return;

    isTransitioningRef.current = true;
    nextViewRef.current = next;

    setIsVisible(false);

    window.setTimeout(() => {
      const viewToShow = nextViewRef.current;
      if (viewToShow) setActiveView(viewToShow);
      requestAnimationFrame(() => setIsVisible(true));
      window.setTimeout(() => {
        isTransitioningRef.current = false;
        nextViewRef.current = null;
      }, TRANSITION_MS);
    }, TRANSITION_MS);
  };

  const navigateTo = (next: ViewName) => {
    setStack((prev) => [...prev, next]);
    startTransitionTo(next);
  };

  const goBack = () => {
    setStack((prev) => {
      if (prev.length <= 1) return prev;
      const nextStack = prev.slice(0, -1);
      const nextView = nextStack[nextStack.length - 1] ?? "home";
      startTransitionTo(nextView);
      return nextStack;
    });
  };

  useEffect(() => {
    const top = stack[stack.length - 1] ?? "home";
    if (top !== activeView && !isTransitioningRef.current) {
      setActiveView(top);
    }
  }, [stack, activeView]);

  const renderView = () => {
    switch (activeView) {
      case "home":
        return (
          <div className="flex flex-col h-full w-full items-center justify-center gap-20">
            <h1 className="absolute top-35 font-manrope uppercase text-5xl font-bold text-center text-white">
              Vision видео хяналтын платформ
            </h1>

            <div className="flex gap-24">
              <IconPressLink
                onActivate={() => navigateTo("aiActions")}
                className="flex flex-col items-center"
                iconSrc="/ai.png"
                iconAlt="video үйлдлүүд"
                label="Видео аналитик"
                labelClassName="font-medium text-[clamp(1rem,2vw,40px)] leading-none tracking-normal text-center whitespace-nowrap text-white"
              />
              <IconPressLink
                onActivate={() => navigateTo("advantages")}
                className="flex flex-col items-center"
                iconSrc="/icon.png"
                iconAlt="Камерийн давуу тал"
                label="Камерийн давуу тал"
                labelClassName="font-medium text-[clamp(1rem,2vw,40px)] leading-none tracking-normal text-center text-white"
              />
            </div>
          </div>
        );
      case "aiActions":
        return <AiActionsView />;
      case "advantages":
        return <AdvantagesIframeView />;
      default:
        return null;
    }
  };

  return (
    <main className="relative h-screen w-screen overflow-hidden">
      <video
        className="absolute inset-0 h-full w-full object-cover object-center"
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
      >
        <source src="/videos/background.mp4" type="video/mp4" />
      </video>

      <div className="absolute inset-0 bg-black/45" />

      {canGoBack ? <BackButton onBack={goBack} /> : null}

      <div className="relative z-10 h-full w-full">
        <div
          className={`absolute inset-0 transition-[opacity,transform] duration-[${TRANSITION_MS}ms] ease-out ${
            isVisible ? "opacity-100 scale-100" : "opacity-0 scale-[0.985]"
          }`}
        >
          {renderView()}
        </div>
      </div>
    </main>
  );
};

export default Home;
