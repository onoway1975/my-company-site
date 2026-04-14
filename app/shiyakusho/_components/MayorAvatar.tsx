export default function MayorAvatar({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 200 260"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="中井きいち市長のイラスト"
    >
      {/* Desk */}
      <rect x="20" y="195" width="160" height="45" rx="6" fill="#C4A882" />
      <rect x="20" y="195" width="160" height="8" rx="4" fill="#B89B6E" />

      {/* Body — dark navy suit */}
      <path
        d="M60 150 C60 130, 75 120, 100 118 C125 120, 140 130, 140 150 L145 200 L55 200 Z"
        fill="#1B2A4A"
      />

      {/* Shirt collar */}
      <path d="M88 118 L100 138 L112 118" fill="#FFFFFF" stroke="#E8E8E8" strokeWidth="1" />

      {/* Tie */}
      <path d="M97 128 L100 138 L103 128 L100 170 Z" fill="#8B2232" />

      {/* Head */}
      <ellipse cx="100" cy="90" rx="30" ry="35" fill="#F5D6B8" />

      {/* Hair */}
      <path
        d="M70 80 C70 55, 85 45, 100 45 C115 45, 130 55, 130 80 C130 72, 120 60, 100 58 C80 60, 70 72, 70 80 Z"
        fill="#2C2C2C"
      />

      {/* Eyes */}
      <ellipse cx="88" cy="88" rx="3" ry="3.5" fill="#2C2C2C" />
      <ellipse cx="112" cy="88" rx="3" ry="3.5" fill="#2C2C2C" />

      {/* Eyebrows */}
      <path d="M82 80 Q88 77, 94 80" stroke="#2C2C2C" strokeWidth="2" fill="none" strokeLinecap="round" />
      <path d="M106 80 Q112 77, 118 80" stroke="#2C2C2C" strokeWidth="2" fill="none" strokeLinecap="round" />

      {/* Nose */}
      <path d="M100 92 Q102 98, 100 100" stroke="#D4B89C" strokeWidth="1.5" fill="none" strokeLinecap="round" />

      {/* Smile */}
      <path d="M90 104 Q100 112, 110 104" stroke="#2C2C2C" strokeWidth="1.5" fill="none" strokeLinecap="round" />

      {/* Glasses */}
      <rect x="78" y="82" width="18" height="14" rx="4" stroke="#555555" strokeWidth="1.5" fill="none" />
      <rect x="104" y="82" width="18" height="14" rx="4" stroke="#555555" strokeWidth="1.5" fill="none" />
      <path d="M96 88 L104 88" stroke="#555555" strokeWidth="1.5" />

      {/* Arms on desk */}
      <path d="M55 200 L45 180 Q42 170, 50 165 L60 155" stroke="#1B2A4A" strokeWidth="14" strokeLinecap="round" fill="none" />
      <path d="M145 200 L155 180 Q158 170, 150 165 L140 155" stroke="#1B2A4A" strokeWidth="14" strokeLinecap="round" fill="none" />

      {/* Hands */}
      <circle cx="45" cy="182" r="8" fill="#F5D6B8" />
      <circle cx="155" cy="182" r="8" fill="#F5D6B8" />

      {/* Nameplate on desk */}
      <rect x="75" y="205" width="50" height="18" rx="2" fill="#FFFFFF" stroke="#D4B89C" strokeWidth="1" />
      <text x="100" y="218" textAnchor="middle" fontSize="8" fill="#1B2A4A" fontWeight="600">
        中井市長
      </text>

      {/* Ears */}
      <ellipse cx="69" cy="90" rx="5" ry="7" fill="#F5D6B8" />
      <ellipse cx="131" cy="90" rx="5" ry="7" fill="#F5D6B8" />
    </svg>
  );
}
