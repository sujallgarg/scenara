"use client";

import React, { useState } from "react";

interface ScenaraLogoMarkProps {
  className?: string;
  size?: number;
}

export default function ScenaraLogoMark({ className = "w-7 h-7", size = 28 }: ScenaraLogoMarkProps) {
  const [imgError, setImgError] = useState(false);

  if (!imgError) {
    return (
      <img
        src="/scenara-mark.png"
        alt="Scenara"
        width={size}
        height={size}
        className={`${className} object-contain`}
        onError={() => setImgError(true)}
      />
    );
  }

  // Pure SVG Fallback representing the Scenara infinity loop
  return (
    <svg
      viewBox="0 0 100 60"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <defs>
        <linearGradient id="scenaraGreen" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#00E599" />
          <stop offset="100%" stopColor="#00B370" />
        </linearGradient>
      </defs>
      {/* Mint green loop */}
      <path
        d="M 32 10 C 18 10 8 20 8 32 C 8 44 18 52 30 52 C 42 52 50 42 62 26 C 70 16 80 10 90 18 C 96 23 96 32 90 38 C 82 46 72 48 64 42"
        stroke="url(#scenaraGreen)"
        strokeWidth="12"
        strokeLinecap="round"
      />
      {/* Dark charcoal interlocking loop */}
      <path
        d="M 68 50 C 82 50 92 40 92 28 C 92 16 82 8 70 8 C 58 8 50 18 38 34 C 30 44 20 50 10 42 C 4 37 4 28 10 22 C 18 14 28 12 36 18"
        stroke="#0D1817"
        strokeWidth="12"
        strokeLinecap="round"
      />
    </svg>
  );
}

