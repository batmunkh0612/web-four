"use client";

export default function AdvantagesIframeView() {
  const externalWebsiteUrl = "https://holowits.com/show/";

  return (
    <div className="h-full w-full">
      <iframe
        src={externalWebsiteUrl}
        className="h-full w-full border-0"
        title="eKit - Давуу тал"
        allow="fullscreen"
      />
    </div>
  );
}
