import React from 'react';
import { GemType } from '../types/game';

interface JewelSpriteProps {
  type: GemType;
  size?: number;
  isSelected?: boolean;
  isMatched?: boolean;
  isChained?: boolean;
}

export const JewelSprite: React.FC<JewelSpriteProps> = ({
  type,
  size,
  isSelected = false,
  isMatched = false,
  isChained = false,
}) => {
  return (
    <div
      className={`relative w-full h-full flex items-center justify-center transition-transform select-none ${
        isSelected
          ? 'scale-115 drop-shadow-[0_0_8px_rgba(255,230,100,0.95)] animate-pulse'
          : 'hover:scale-105 active:scale-95'
      } ${isMatched ? 'scale-0 opacity-0 duration-150' : 'duration-100'}`}
      style={size ? { width: size, height: size } : undefined}
    >
      {/* 16x16 / 20x20 Crisp Pixel Art Canvas via SVG pixel blocks */}
      <svg
        viewBox="0 0 20 20"
        className="w-full h-full image-pixelated filter drop-shadow-[0_2px_3px_rgba(0,0,0,0.8)]"
        shapeRendering="crispEdges"
      >
        {/* 1. RUBY (Red Octagonal Cut Pixel Gem) */}
        {type === 'ruby' && (
          <g>
            {/* Outline */}
            <path d="M6,2 h8 v2 h2 v2 h2 v8 h-2 v2 h-2 v2 h-8 v-2 h-2 v-2 h-2 v-8 h2 v-2 h2 Z" fill="#2d050d" />
            {/* Dark Facet base */}
            <path d="M6,3 h8 v2 h2 v2 h1 v6 h-1 v2 h-2 v2 h-8 v-2 h-2 v-2 h-1 v-6 h1 v-2 h2 Z" fill="#7a0d24" />
            {/* Mid Red Body */}
            <path d="M7,4 h6 v2 h2 v6 h-2 v2 h-6 v-2 h-2 v-6 h2 Z" fill="#c4183c" />
            {/* Bright Red Highlights */}
            <rect x="7" y="5" width="4" height="4" fill="#f43f5e" />
            <rect x="6" y="7" width="2" height="4" fill="#fb7185" />
            {/* Specular White Pixel Glint */}
            <rect x="7" y="5" width="2" height="2" fill="#ffffff" />
            <rect x="9" y="4" width="2" height="1" fill="#ffffff" />
            {/* Bottom Dark Shade */}
            <path d="M7,13 h6 v1 h-2 v1 h-2 v-1 h-2 Z" fill="#4a0413" />
            <rect x="13" y="10" width="2" height="3" fill="#520718" />
          </g>
        )}

        {/* 2. SAPPHIRE (Blue Pixel Cabochon) */}
        {type === 'sapphire' && (
          <g>
            {/* Outline */}
            <path d="M7,2 h6 v1 h2 v2 h2 v10 h-2 v2 h-2 v1 h-6 v-1 h-2 v-2 h-2 v-10 h2 v-2 h2 Z" fill="#091124" />
            {/* Dark Blue Base */}
            <path d="M7,3 h6 v1 h2 v2 h1 v8 h-1 v2 h-2 v1 h-6 v-1 h-2 v-2 h-1 v-8 h1 v-2 h2 Z" fill="#1e3a8a" />
            {/* Royal Blue Core */}
            <rect x="6" y="5" width="8" height="10" fill="#2563eb" />
            {/* Light Blue Shimmer */}
            <rect x="6" y="5" width="5" height="5" fill="#60a5fa" />
            <rect x="5" y="7" width="2" height="5" fill="#93c5fd" />
            {/* White Glint */}
            <rect x="7" y="5" width="2" height="2" fill="#ffffff" />
            <rect x="6" y="7" width="1" height="2" fill="#ffffff" />
            {/* Shadow Depth */}
            <rect x="10" y="12" width="4" height="3" fill="#172554" />
          </g>
        )}

        {/* 3. EMERALD (Green Beveled Rectangle) */}
        {type === 'emerald' && (
          <g>
            {/* Outline */}
            <path d="M5,3 h10 v2 h2 v10 h-2 v2 h-10 v-2 h-2 v-10 h2 Z" fill="#022115" />
            {/* Dark Emerald */}
            <rect x="4" y="4" width="12" height="12" fill="#064e3b" />
            {/* Bright Emerald Table */}
            <rect x="5" y="5" width="10" height="10" fill="#059669" />
            {/* Center Table Highlight */}
            <rect x="6" y="6" width="6" height="6" fill="#10b981" />
            <rect x="7" y="7" width="4" height="4" fill="#34d399" />
            {/* Specular White Pixel Reflection */}
            <rect x="6" y="6" width="3" height="2" fill="#ffffff" />
            <rect x="5" y="7" width="1" height="2" fill="#ffffff" />
            {/* Bottom Dark bevel */}
            <rect x="6" y="13" width="8" height="2" fill="#022c22" />
            <rect x="13" y="6" width="2" height="8" fill="#022c22" />
          </g>
        )}

        {/* 4. TOPAZ / CITRINE (Amber Yellow Teardrop) */}
        {type === 'topaz' && (
          <g>
            {/* Outline */}
            <path d="M9,2 h2 v2 h2 v2 h2 v2 h1 v6 h-1 v2 h-2 v1 h-2 v1 h-2 v-1 h-2 v-1 h-2 v-2 h-1 v-6 h1 v-2 h2 v-2 h2 Z" fill="#422006" />
            {/* Dark Topaz */}
            <path d="M9,3 h2 v2 h2 v2 h1 v8 h-1 v1 h-2 v1 h-2 v-1 h-2 v-1 h-1 v-8 h1 v-2 h2 Z" fill="#a16207" />
            {/* Bright Gold Yellow Body */}
            <rect x="7" y="7" width="6" height="8" fill="#eab308" />
            <rect x="8" y="5" width="4" height="8" fill="#facc15" />
            {/* Pale Yellow Core */}
            <rect x="8" y="7" width="3" height="4" fill="#fef08a" />
            {/* Sparkle Glint */}
            <rect x="8" y="5" width="2" height="2" fill="#ffffff" />
            <rect x="7" y="7" width="1" height="2" fill="#ffffff" />
            {/* Shadow */}
            <rect x="9" y="14" width="3" height="1" fill="#713f12" />
            <rect x="11" y="10" width="2" height="3" fill="#854d0e" />
          </g>
        )}

        {/* 5. DIAMOND (White/Cyan Brilliant Cut Pixel Diamond) */}
        {type === 'diamond' && (
          <g>
            {/* Outline */}
            <path d="M9,2 h2 v1 h3 v2 h2 v2 h2 v2 h-1 v2 h-2 v2 h-2 v2 h-2 v2 h-2 v-2 h-2 v-2 h-2 v-2 h-2 v-2 h-1 v-2 h2 v-2 h2 v-2 h3 Z" fill="#082f49" />
            {/* Dark Cyan Edge */}
            <path d="M9,3 h2 v1 h3 v2 h1 v2 h-1 v2 h-2 v2 h-2 v2 h-1 v-2 h-2 v-2 h-2 v-2 h-1 v-2 h1 v-2 h3 Z" fill="#0284c7" />
            {/* Bright Cyan */}
            <polygon points="10,4 15,8 10,16 5,8" fill="#38bdf8" />
            {/* Inner Light Core */}
            <polygon points="10,5 14,8 10,14 6,8" fill="#bae6fd" />
            {/* Pure White Facet */}
            <polygon points="10,5 12,8 10,12 8,8" fill="#ffffff" />
            {/* Glint Cross */}
            <rect x="9" y="6" width="2" height="2" fill="#ffffff" />
            <rect x="10" y="5" width="1" height="4" fill="#ffffff" />
            <rect x="8" y="6" width="4" height="1" fill="#ffffff" />
          </g>
        )}

        {/* 6. AMETHYST (Purple Hexagonal Pixel Gem) */}
        {type === 'amethyst' && (
          <g>
            {/* Outline */}
            <path d="M8,2 h4 v2 h3 v3 h2 v6 h-2 v3 h-3 v2 h-4 v-2 h-3 v-3 h-2 v-6 h2 v-3 h3 Z" fill="#2e0854" />
            {/* Deep Purple */}
            <path d="M8,3 h4 v2 h2 v3 h1 v4 h-1 v3 h-2 v2 h-4 v-2 h-2 v-3 h-1 v-4 h1 v-3 h2 Z" fill="#581c87" />
            {/* Mid Purple */}
            <rect x="6" y="6" width="8" height="8" fill="#9333ea" />
            {/* Light Magenta/Violet */}
            <rect x="7" y="6" width="5" height="5" fill="#c084fc" />
            {/* Glint */}
            <rect x="7" y="6" width="2" height="2" fill="#ffffff" />
            <rect x="9" y="5" width="2" height="1" fill="#ffffff" />
            {/* Shade */}
            <rect x="11" y="10" width="2" height="3" fill="#3b0764" />
            <rect x="8" y="13" width="3" height="1" fill="#3b0764" />
          </g>
        )}

        {/* 7. RELIC / SUN ARTIFACT (Ancient Golden Sun Wheel) */}
        {type === 'relic' && (
          <g>
            {/* Sun Rays */}
            <rect x="9" y="1" width="2" height="3" fill="#f59e0b" />
            <rect x="9" y="16" width="2" height="3" fill="#f59e0b" />
            <rect x="1" y="9" width="3" height="2" fill="#f59e0b" />
            <rect x="16" y="9" width="3" height="2" fill="#f59e0b" />
            {/* Diagonal Rays */}
            <rect x="3" y="3" width="2" height="2" fill="#d97706" />
            <rect x="15" y="3" width="2" height="2" fill="#d97706" />
            <rect x="3" y="15" width="2" height="2" fill="#d97706" />
            <rect x="15" y="15" width="2" height="2" fill="#d97706" />
            {/* Outer Bronze Ring */}
            <circle cx="10" cy="10" r="6" fill="#78350f" />
            {/* Inner Gold Disc */}
            <circle cx="10" cy="10" r="4.5" fill="#fbbf24" />
            {/* Glowing Core Gem */}
            <rect x="8" y="8" width="4" height="4" fill="#ef4444" />
            <rect x="9" y="9" width="2" height="2" fill="#ffffff" />
          </g>
        )}
      </svg>

      {/* Pixel Art Chained Overlay */}
      {isChained && (
        <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
          <svg viewBox="0 0 20 20" className="w-full h-full image-pixelated filter drop-shadow-[0_2px_2px_rgba(0,0,0,0.9)]" shapeRendering="crispEdges">
            {/* Pixel Metal Chains */}
            <path d="M2,2 h2 v2 h2 v2 h2 v2 h-2 v2 h-2 v2 h-2 Z" fill="#94a3b8" />
            <path d="M3,3 h1 v1 h1 v1 h1 v1 h-1 v1 h-1 v1 h-1 Z" fill="#f1f5f9" />
            <path d="M16,2 h2 v2 h-2 v2 h-2 v2 h2 v2 h2 v2 h-2 Z" fill="#94a3b8" />
            <path d="M16,3 h1 v1 h-1 v1 h-1 v1 h1 v1 h1 v1 h-1 Z" fill="#f1f5f9" />
            {/* Center Heavy Padlock Body */}
            <rect x="7" y="8" width="6" height="5" fill="#b45309" />
            <rect x="8" y="9" width="4" height="3" fill="#d97706" />
            {/* Padlock Shackle */}
            <path d="M8,6 h4 v2 h-1 v-1 h-2 v1 h-1 Z" fill="#cbd5e1" />
            {/* Keyhole */}
            <rect x="9.5" y="10" width="1" height="1.5" fill="#451a03" />
          </svg>
        </div>
      )}
    </div>
  );
};
