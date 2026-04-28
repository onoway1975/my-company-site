"use client";

type Props = {
  imageUrl: string;
  name?: string;
  tagline?: string;
};

const MONTHS = [
  "JAN", "FEB", "MAR", "APR", "MAY", "JUN",
  "JUL", "AUG", "SEP", "OCT", "NOV", "DEC",
];

const serifFont = "'Cormorant Garamond', 'Noto Serif JP', serif";

export function DogueOverlay({ imageUrl, name, tagline }: Props) {
  const now = new Date();
  const monthLabel = `${MONTHS[now.getMonth()]} ${now.getDate()}`;
  const yearLabel = now.getFullYear().toString();

  return (
    <div
      id="dogue-overlay-target"
      className="snap-fade-in"
      style={{
        position: "relative",
        width: "100%",
        aspectRatio: "4 / 5",
        overflow: "hidden",
        background: "#000",
      }}
    >
      {/* Background image */}
      <img
        src={imageUrl}
        alt=""
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
        }}
      />

      {/* DOGUE logo */}
      <div
        style={{
          position: "absolute",
          top: 16,
          left: 0,
          right: 0,
          padding: "0 16px",
        }}
      >
        <h1
          style={{
            fontFamily: serifFont,
            fontWeight: 300,
            fontSize: "clamp(48px, 18vw, 110px)",
            letterSpacing: "-0.02em",
            lineHeight: 1,
            textAlign: "center",
            color: "#fff",
            textShadow: "0 2px 8px rgba(0,0,0,0.2)",
            margin: 0,
          }}
        >
          DOGUE
        </h1>
      </div>

      {/* Date — top right */}
      <div
        style={{
          position: "absolute",
          top: "18%",
          right: 16,
          textAlign: "right",
          fontFamily: serifFont,
          fontSize: 11,
          letterSpacing: "0.1em",
          lineHeight: 1.4,
          color: "#fff",
          textShadow: "0 1px 4px rgba(0,0,0,0.3)",
        }}
      >
        <div>{monthLabel}</div>
        <div>{yearLabel}</div>
      </div>

      {/* Tagline — right center */}
      {tagline && (
        <div
          style={{
            position: "absolute",
            right: 16,
            top: "50%",
            transform: "translateY(-50%)",
            maxWidth: "35%",
          }}
        >
          <p
            style={{
              fontFamily: serifFont,
              fontStyle: "italic",
              fontSize: "clamp(14px, 4vw, 18px)",
              lineHeight: 1.3,
              textAlign: "right",
              color: "#fff",
              textShadow: "0 1px 4px rgba(0,0,0,0.3)",
              margin: 0,
            }}
          >
            &ldquo;{tagline}&rdquo;
          </p>
        </div>
      )}

      {/* Name — bottom center */}
      {name && (
        <div
          style={{
            position: "absolute",
            bottom: 16,
            left: 0,
            right: 0,
            textAlign: "center",
          }}
        >
          <h2
            style={{
              fontFamily: serifFont,
              fontWeight: 400,
              fontSize: "clamp(20px, 6vw, 32px)",
              letterSpacing: "0.3em",
              color: "#fff",
              textShadow: "0 2px 6px rgba(0,0,0,0.3)",
              margin: 0,
            }}
          >
            {name.toUpperCase()}
          </h2>
        </div>
      )}
    </div>
  );
}
