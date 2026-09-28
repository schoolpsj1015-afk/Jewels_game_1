import React from 'react';

interface HourglassProps {
  timeLeft: number;
  maxTime: number;
  compact?: boolean;
}

export const Hourglass: React.FC<HourglassProps> = ({ timeLeft, maxTime, compact = false }) => {
  const fraction = Math.max(0, Math.min(1, timeLeft / maxTime));
  const isUrgent = timeLeft <= 20;

  // Percentage top sand remaining vs bottom accumulated
  const topPercent = fraction * 100;
  const botPercent = (1 - fraction) * 100;

  if (compact) {
    return (
      <div className="flex items-center gap-2 px-3 py-1.5 pixel-stone-btn">
        <span className="text-lg drop-shadow">⏳</span>
        <div className="w-20 sm:w-24 h-3.5 bg-[#15120e] border-2 border-[#574635] p-0.5">
          <div
            className="h-full bg-gradient-to-r from-[#d97706] to-[#fde047] transition-all duration-300"
            style={{ width: `${topPercent}%` }}
          />
        </div>
        <span className="font-pixel text-sm font-bold text-[#fef08a] tabular-nums drop-shadow tracking-wider">
          {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
        </span>
      </div>
    );
  }

  return (
    <div className="relative flex flex-col items-center">
      {/* 90s Pixelated Stone Relic Hourglass Stand */}
      <div
        className={`relative w-24 h-40 flex flex-col items-center justify-between p-2 pixel-stone-panel ${
          isUrgent ? 'animate-pulse ring-2 ring-red-500' : ''
        }`}
      >
        {/* Top Stone Pedestal */}
        <div className="w-full h-4 bg-[#4a3e30] border-b-2 border-[#2b241c] shadow flex items-center justify-center">
          <div className="w-8 h-1 bg-[#d97706]" />
        </div>

        {/* Pixel Glass Bulb Frame */}
        <div className="relative w-16 h-28 flex items-center justify-center bg-[#100e0b] border-2 border-[#3d3327] overflow-hidden">
          <svg viewBox="0 0 40 70" className="w-full h-full" shapeRendering="crispEdges">
            <defs>
              <clipPath id="pixelTopBulb">
                <path d="M4,4 h32 v4 h-4 v4 h-4 v6 h-4 v6 h-8 v-6 h-4 v-6 h-4 v-4 h-4 Z" />
              </clipPath>
              <clipPath id="pixelBottomBulb">
                <path d="M16,38 h8 v6 h4 v6 h4 v6 h4 v10 h-32 v-10 h4 v-6 h4 v-6 h4 Z" />
              </clipPath>
            </defs>

            {/* Glass Interior */}
            <rect x="2" y="2" width="36" height="66" fill="#171410" />

            {/* Top Sand Pixel Level */}
            <g clipPath="url(#pixelTopBulb)">
              <rect
                x="2"
                y={30 - (26 * (topPercent / 100))}
                width="36"
                height="30"
                fill="#eab308"
              />
              <rect
                x="2"
                y={30 - (26 * (topPercent / 100))}
                width="36"
                height="3"
                fill="#fef08a"
              />
            </g>

            {/* Trickling Pixel Stream */}
            {fraction > 0 && (
              <g>
                <rect x="19" y="28" width="2" height="18" fill="#fde047" className="animate-pulse" />
              </g>
            )}

            {/* Bottom Sand Pixel Level */}
            <g clipPath="url(#pixelBottomBulb)">
              <rect
                x="2"
                y={68 - (28 * (botPercent / 100))}
                width="36"
                height="30"
                fill="#eab308"
              />
              <rect
                x="2"
                y={68 - (28 * (botPercent / 100))}
                width="36"
                height="3"
                fill="#fef08a"
              />
            </g>

            {/* Pixel Glass Specular Lines */}
            <rect x="6" y="6" width="2" height="12" fill="#ffffff" opacity="0.4" />
            <rect x="8" y="8" width="1" height="6" fill="#ffffff" opacity="0.6" />
          </svg>
        </div>

        {/* Bottom Stone Pedestal */}
        <div className="w-full h-4 bg-[#4a3e30] border-t-2 border-[#5e4f3f] shadow flex items-center justify-center">
          <div className="w-8 h-1 bg-[#d97706]" />
        </div>
      </div>

      {/* Retro Digital / Stone Readout */}
      <div className="mt-1.5 px-3.5 py-1 bg-[#14110d] border-2 border-[#544333] shadow font-pixel text-sm sm:text-base font-bold tabular-nums tracking-widest text-[#fde047]">
        {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
      </div>
    </div>
  );
};
