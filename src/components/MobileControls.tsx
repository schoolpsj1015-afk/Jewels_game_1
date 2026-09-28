import React from 'react';
import { ArrowUp, ArrowDown, ArrowLeft, ArrowRight, X, Sparkles, Layers, HelpCircle } from 'lucide-react';
import { BoardPosition } from '../types/game';

interface MobileControlsProps {
  selectedCell: BoardPosition | null;
  onMove: (dir: 'UP' | 'DOWN' | 'LEFT' | 'RIGHT') => void;
  onDeselect: () => void;
  isProcessing: boolean;
  hammerCount: number;
  bagCount: number;
  isHammerActive: boolean;
  onToggleHammer: () => void;
  onUseBag: () => void;
  onOpenTutorial: () => void;
  onOpenLevelSelect: () => void;
}

export const MobileControls: React.FC<MobileControlsProps> = ({
  selectedCell,
  onMove,
  onDeselect,
  isProcessing,
  hammerCount,
  bagCount,
  isHammerActive,
  onToggleHammer,
  onUseBag,
  onOpenTutorial,
  onOpenLevelSelect,
}) => {
  return (
    <div className="w-full max-w-md mx-auto px-2 pt-1 pb-2 flex flex-col items-center gap-2 select-none md:hidden z-20">
      {/* 90s Carved Stone D-Pad Console */}
      <div className="w-full flex items-center justify-between gap-1.5 p-2.5 pixel-stone-panel">
        
        {/* Left: Quick Items (Hammer + Bag) */}
        <div className="flex items-center gap-1.5">
          {/* Hammer Button */}
          <button
            onClick={onToggleHammer}
            className={`relative flex items-center justify-center w-12 h-12 pixel-stone-btn ${
              isHammerActive
                ? 'ring-3 ring-[#fbbf24] bg-[#b45309]'
                : ''
            }`}
          >
            <span className="text-xl">🔨</span>
            <span className="absolute -top-1.5 -right-1.5 px-1.5 py-0.2 bg-[#d97706] text-[#1c1917] font-pixel text-xs sm:text-sm font-bold border border-[#1c1917]">
              {hammerCount}
            </span>
          </button>

          {/* Explorer's Bag */}
          <button
            onClick={onUseBag}
            disabled={bagCount <= 0 || isProcessing}
            className={`relative flex items-center justify-center w-12 h-12 pixel-stone-btn ${
              bagCount > 0
                ? ''
                : 'opacity-40 cursor-not-allowed'
            }`}
          >
            <span className="text-xl">💰</span>
            <span className="absolute -top-1.5 -right-1.5 px-1.5 py-0.2 bg-[#d97706] text-[#1c1917] font-pixel text-xs sm:text-sm font-bold border border-[#1c1917]">
              {bagCount}
            </span>
          </button>
        </div>

        {/* Center: Selected Cell Status or Directional Swap Pad */}
        <div className="flex-1 flex flex-col items-center justify-center px-1">
          {selectedCell ? (
            <div className="flex items-center gap-1">
              {/* Directional Swap Arrows D-Pad */}
              <div className="grid grid-cols-3 gap-1">
                <div />
                <button
                  disabled={isProcessing}
                  onClick={() => onMove('UP')}
                  aria-label="Swap Up"
                  className="w-9 h-9 pixel-gold-btn flex items-center justify-center text-lg active:translate-y-0.5"
                >
                  <ArrowUp className="w-5 h-5 stroke-[3]" />
                </button>
                <div />

                <button
                  disabled={isProcessing}
                  onClick={() => onMove('LEFT')}
                  aria-label="Swap Left"
                  className="w-9 h-9 pixel-gold-btn flex items-center justify-center text-lg active:translate-y-0.5"
                >
                  <ArrowLeft className="w-5 h-5 stroke-[3]" />
                </button>
                <button
                  onClick={onDeselect}
                  title="Cancel selection"
                  className="w-9 h-9 pixel-stone-btn text-red-400 hover:text-red-300 flex items-center justify-center"
                >
                  <X className="w-5 h-5 stroke-[3]" />
                </button>
                <button
                  disabled={isProcessing}
                  onClick={() => onMove('RIGHT')}
                  aria-label="Swap Right"
                  className="w-9 h-9 pixel-gold-btn flex items-center justify-center text-lg active:translate-y-0.5"
                >
                  <ArrowRight className="w-5 h-5 stroke-[3]" />
                </button>

                <div />
                <button
                  disabled={isProcessing}
                  onClick={() => onMove('DOWN')}
                  aria-label="Swap Down"
                  className="w-9 h-9 pixel-gold-btn flex items-center justify-center text-lg active:translate-y-0.5"
                >
                  <ArrowDown className="w-5 h-5 stroke-[3]" />
                </button>
                <div />
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center text-center">
              <span className="text-sm font-pixel text-[#fde047] flex items-center gap-1 font-bold">
                <Sparkles className="w-4 h-4 text-yellow-300 animate-pulse" />
                보석 터치 후 스와이프
              </span>
              <span className="text-xs text-[#a89b88] font-pixel mt-0.5">
                드래그 또는 인접칸 터치
              </span>
            </div>
          )}
        </div>

        {/* Right: Quick Level Select & Tutorial triggers */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={onOpenLevelSelect}
            title="난이도 / 스테이지 선택"
            className="flex flex-col items-center justify-center w-12 h-12 pixel-stone-btn text-[#fde047] text-xs font-pixel font-bold gap-0.5"
          >
            <Layers className="w-4.5 h-4.5 text-[#fbbf24]" />
            <span>난이도</span>
          </button>

          <button
            onClick={onOpenTutorial}
            title="튜토리얼 / 도움말"
            className="flex flex-col items-center justify-center w-12 h-12 pixel-stone-btn text-[#fef08a] text-xs font-pixel font-bold gap-0.5"
          >
            <HelpCircle className="w-4.5 h-4.5 text-[#fde047]" />
            <span>도움말</span>
          </button>
        </div>

      </div>
    </div>
  );
};
