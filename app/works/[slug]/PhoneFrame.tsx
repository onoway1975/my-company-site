"use client";

import Image from "next/image";

type Props = {
  video: string | null;
  thumbnail: string | null;
};

export function PhoneFrame({ video, thumbnail }: Props) {
  return (
    <div className="flex justify-center lg:justify-start">
      {/* Phone shell */}
      <div
        className="relative bg-ink rounded-[3rem] p-[3px] shadow-2xl"
        style={{ width: 280, flexShrink: 0 }}
      >
        {/* Screen area */}
        <div className="relative bg-black rounded-[2.7rem] overflow-hidden aspect-[9/19.5]">
          {/* Notch */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 z-20 w-24 h-7 bg-ink rounded-b-2xl" />

          {/* Content */}
          {video ? (
            <video
              autoPlay
              loop
              muted
              playsInline
              className="absolute inset-0 w-full h-full object-cover"
            >
              <source src={video} type="video/mp4" />
              <source src={video} type="video/quicktime" />
            </video>
          ) : thumbnail ? (
            <Image
              src={thumbnail}
              alt=""
              fill
              className="object-cover"
              sizes="280px"
            />
          ) : (
            <div className="absolute inset-0 bg-surface flex items-center justify-center">
              <span className="text-[10px] tracking-widest text-muted uppercase">
                ciraf
              </span>
            </div>
          )}
        </div>

        {/* Side button: power */}
        <div className="absolute -right-[3px] top-32 w-[3px] h-14 bg-[#333] rounded-r-sm" />
        {/* Side buttons: volume */}
        <div className="absolute -left-[3px] top-24 w-[3px] h-8 bg-[#333] rounded-l-sm" />
        <div className="absolute -left-[3px] top-36 w-[3px] h-8 bg-[#333] rounded-l-sm" />
      </div>
    </div>
  );
}
