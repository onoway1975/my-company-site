"use client";

import { useState } from "react";

export function ClientVideo({ videoSrc }: { videoSrc: string }) {
  const [loading, setLoading] = useState(true);

  return (
    <div className="relative bg-black rounded-[2.7rem] overflow-hidden aspect-[9/19.5]">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 z-20 w-24 h-7 bg-[#1a1a1a] rounded-b-2xl" />
      {loading && (
        <div className="absolute inset-0 z-10 flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin" />
        </div>
      )}
      <video
        className="absolute inset-0 w-full h-full object-cover"
        autoPlay
        muted
        loop
        playsInline
        onCanPlay={() => setLoading(false)}
      >
        <source src={videoSrc} type="video/mp4" />
        <source src={videoSrc} type="video/quicktime" />
      </video>
    </div>
  );
}
