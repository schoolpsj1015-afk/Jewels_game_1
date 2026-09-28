import React from 'react';
import { GemType } from '../types/game';

interface SideTotemProps {
  goldCount: number;
  totalValidTiles: number;
  gemCounts: Record<GemType, number>;
}

export const SideTotem: React.FC<SideTotemProps> = ({
  goldCount,
  totalValidTiles,
}) => {
  const percentage = totalValidTiles > 0 ? Math.round((goldCount / totalValidTiles) * 100) : 0;

  const vials: { color: string; label: string }[] = [
    { color: 'bg-[#dc2626] border-[#7f1d1d]', label: 'Ruby' },
    { color: 'bg-[#2563eb] border-[#1e3a8a]', label: 'Sapphire' },
    { color: 'bg-[#059669] border-[#022c22]', label: 'Emerald' },
    { color: 'bg-[#eab308] border-[#713f12]', label: 'Topaz' },
    { color: 'bg-[#38bdf8] border-[#075985]', label: 'Diamond' },
    { color: 'bg-[#9333ea] border-[#581c87]', label: 'Amethyst' },
  ];

  return (
    <div className="hidden md:flex flex-col items-center justify-between w-16 py-3 px-1.5 pixel-stone-panel shadow-2xl">
      {/* Ancient Aztec Stone Relief Totem Head */}
      <div className="w-10 h-10 pixel-gold-btn flex items-center justify-center shadow-md">
        <span className="font-pixel font-bold text-sm">☀</span>
      </div>

      {/* Gold Progress Vertical Stone Well */}
      <div className="my-2.5 flex-1 w-6 flex flex-col justify-end bg-[#13100c] border-2 border-[#544333] p-0.5 relative overflow-hidden">
        {/* Shimmering pixel gold blocks */}
        <div
          className="w-full bg-[#f59e0b] shadow-[inset_0_2px_0_#fef08a] transition-all duration-300 relative"
          style={{ height: `${percentage}%` }}
        >
          {percentage > 5 && (
            <div className="absolute top-0 inset-x-0 h-1 bg-[#ffffff] animate-pulse" />
          )}
        </div>
      </div>

      {/* Percentage Readout */}
      <div className="text-xs font-pixel font-bold text-[#fde047] tabular-nums tracking-wider">
        {percentage}%
      </div>

      {/* Miniature Pixel Gem Vials */}
      <div className="flex flex-col gap-1.5 mt-2">
        {vials.map((v, i) => (
          <div
            key={i}
            title={v.label}
            className={`w-6 h-6 ${v.color} border-2 shadow flex items-center justify-center hover:scale-110 transition-transform`}
          >
            <div className="w-1.5 h-1.5 bg-[#ffffff] opacity-80 -translate-y-0.5 -translate-x-0.5" />
          </div>
        ))}
      </div>
    </div>
  );
};
