import React from 'react';
import { Volume2, VolumeX, HelpCircle, RotateCcw, Layers, FileDown } from 'lucide-react';

interface TopHeaderProps {
  levelTitle: string;
  levelSize: number;
  lives: number;
  score: number;
  isHammerActive: boolean;
  hammerCount: number;
  bagCount: number;
  isMuted: boolean;
  onToggleHammer: () => void;
  onUseBag: () => void;
  onToggleMute: () => void;
  onOpenTutorial: () => void;
  onOpenLevelSelect: () => void;
  onOpenCreateCustom: () => void;
  onRestart: () => void;
  onDownloadPlanPdf?: () => void;
}

export const TopHeader: React.FC<TopHeaderProps> = ({
  levelTitle,
  levelSize,
  lives,
  score,
  isHammerActive,
  hammerCount,
  bagCount,
  isMuted,
  onToggleHammer,
  onUseBag,
  onToggleMute,
  onOpenTutorial,
  onOpenLevelSelect,
  onRestart,
  onDownloadPlanPdf,
}) => {
  return (
    <header className="relative w-full max-w-4xl mx-auto flex items-center justify-between px-2 pt-2 pb-1 z-20 gap-1.5 sm:gap-3">
      {/* LEFT: Hammer Pixel Stone Medal (Visible on md+ screens; mobile has it in quick bottom console) */}
      <div className="hidden md:flex items-center gap-2 shrink-0">
        <button
          onClick={onToggleHammer}
          title="유물 해머: 클릭 후 보석 칸을 치면 즉시 황금화 & 사슬 파괴!"
          className={`relative flex flex-col items-center justify-center w-14 h-14 md:w-16 md:h-16 pixel-stone-btn transition-transform ${
            isHammerActive
              ? 'ring-3 ring-[#fbbf24] shadow-[0_0_15px_#f59e0b] scale-105 bg-[#b45309]'
              : 'hover:scale-105 active:scale-95'
          }`}
        >
          <span className="text-2xl drop-shadow">🔨</span>
          {/* Pixel Count Badge */}
          <span className="absolute -bottom-1.5 -right-1.5 px-2 py-0.5 bg-[#d97706] text-[#1c1917] font-pixel text-xs sm:text-sm font-bold border-2 border-[#1c1917] shadow">
            {hammerCount}
          </span>
        </button>

        <span className="hidden lg:inline text-xs sm:text-sm font-pixel text-[#fde047] drop-shadow font-bold">
          {isHammerActive ? 'SMASH!' : 'HAMMER'}
        </span>
      </div>

      {/* CENTER: Heavy 90s Carved Stone Plaque (Optimized with responsive padding & prevent overflow) */}
      <div className="relative flex-1 min-w-0 h-[68px] sm:h-18 flex items-center justify-between px-2.5 sm:px-4 md:px-6 pixel-stone-panel overflow-hidden">
        
        {/* Top Pixel Rune Rivets (Decorative) */}
        <div className="hidden sm:flex absolute -top-1.5 left-1/2 -translate-x-1/2 items-center gap-1.5 px-3 py-0.5 bg-[#17130e] border-2 border-[#544333]">
          <div className="w-2 h-2 bg-[#dc2626] border border-[#7f1d1d]" />
          <div className="w-2 h-2 bg-[#2563eb] border border-[#1e3a8a]" />
          <div className="w-2.5 h-2.5 bg-[#10b981] border border-[#064e3b] animate-pulse" />
          <div className="w-2 h-2 bg-[#eab308] border border-[#713f12]" />
          <div className="w-2 h-2 bg-[#9333ea] border border-[#581c87]" />
        </div>

        {/* Left: Level Select Trigger Button */}
        <button
          onClick={onOpenLevelSelect}
          className="flex flex-col items-start min-w-0 max-w-[105px] min-[400px]:max-w-[145px] sm:max-w-none hover:opacity-90 active:scale-95 group text-left mr-1"
          title="난이도 및 스테이지 선택창 열기"
        >
          <div className="flex items-center gap-1">
            <span className="text-xs sm:text-sm uppercase tracking-wider text-[#d4af37] font-pixel font-bold">
              STAGE
            </span>
            <Layers className="w-3.5 h-3.5 text-[#fbbf24] group-hover:scale-110 shrink-0" />
          </div>
          <span className="font-pixel font-bold text-xs sm:text-sm md:text-base text-[#fffbeb] tracking-wider drop-shadow truncate w-full underline decoration-[#d97706] decoration-dashed underline-offset-4">
            {levelTitle}
          </span>
          <span className="hidden min-[420px]:inline text-[11px] text-[#fde047] font-pixel">
            [{levelSize}×{levelSize}]
          </span>
        </button>

        {/* Mid-Left: Lives with larger pixel hearts */}
        <div className="flex flex-col items-center shrink-0 mx-1">
          <span className="text-xs sm:text-sm uppercase tracking-wider text-[#d4af37] font-pixel font-bold">
            LIVES
          </span>
          <div className="flex items-center gap-0.5 sm:gap-1 mt-0.5">
            {Array.from({ length: 5 }).map((_, idx) => (
              <span
                key={idx}
                className={`text-base sm:text-lg font-pixel transition-all ${
                  idx < lives
                    ? 'text-[#ef4444] drop-shadow-[0_0_8px_#dc2626]'
                    : 'text-[#44382c] opacity-35'
                }`}
              >
                ♥
              </span>
            ))}
          </div>
        </div>

        {/* Center/Right: Score Display with larger text */}
        <div className="flex flex-col items-end shrink-0 ml-1">
          <span className="text-xs sm:text-sm uppercase tracking-wider text-[#d4af37] font-pixel font-bold">
            SCORE
          </span>
          <span className="font-pixel font-bold text-sm sm:text-base md:text-xl text-[#fef08a] tabular-nums tracking-wider drop-shadow">
            {score.toLocaleString()}
          </span>
        </div>
      </div>

      {/* RIGHT: Explorer's Bag (Desktop) + 2-TIER (2중 정렬) Utility Buttons on Mobile */}
      <div className="flex items-center gap-1 sm:gap-2 shrink-0">
        {/* PDF Plan Download Button (Desktop view) */}
        {onDownloadPlanPdf && (
          <button
            onClick={onDownloadPlanPdf}
            title="게임 시스템 및 구현 계획서 PDF 다운로드"
            className="hidden lg:flex relative flex-col items-center justify-center w-14 h-14 md:w-16 md:h-16 pixel-stone-btn hover:scale-105 active:scale-95 transition-transform text-[#fbbf24] hover:text-white"
          >
            <FileDown className="w-6 h-6 text-[#fbbf24]" />
            <span className="text-[11px] font-pixel text-[#fde047] font-bold mt-0.5">
              계획서
            </span>
          </button>
        )}

        {/* Explorer's Bag (Desktop view) */}
        <button
          onClick={onUseBag}
          disabled={bagCount <= 0}
          title="탐험가의 자루: 전체 셔플 및 황금 타일 1개 부여!"
          className={`hidden md:flex relative flex-col items-center justify-center w-14 h-14 md:w-16 md:h-16 pixel-stone-btn transition-transform ${
            bagCount > 0 ? 'hover:scale-105 active:scale-95' : 'opacity-40 cursor-not-allowed'
          }`}
        >
          <span className="text-2xl drop-shadow">💰</span>
          <span className="absolute -bottom-1.5 -right-1.5 px-2 py-0.5 bg-[#d97706] text-[#1c1917] font-pixel text-xs sm:text-sm font-bold border-2 border-[#1c1917] shadow">
            {bagCount}
          </span>
        </button>

        {/* 2-TIER ALIGNED BUTTONS (모바일 2중 정렬: 2×2 그리드 배치, 데스크톱은 세로 1열) */}
        <div className="grid grid-cols-2 md:flex md:flex-col gap-1 sm:gap-1.5">
          {/* Row 1 / Tier 1 on Mobile */}
          <button
            onClick={onOpenTutorial}
            title="도움말 / 튜토리얼 (Tutorial & Guide)"
            aria-label="도움말 열기"
            className="w-8 h-8 sm:w-9 sm:h-9 md:w-auto md:h-auto p-1.5 sm:p-2 pixel-stone-btn text-[#fde047] hover:text-white flex items-center justify-center active:translate-y-0.5"
          >
            <HelpCircle className="w-4 h-4 sm:w-5 sm:h-5 text-[#fde047]" />
          </button>

          <button
            onClick={onOpenLevelSelect}
            title="난이도 / 스테이지 선택"
            aria-label="스테이지 선택"
            className="w-8 h-8 sm:w-9 sm:h-9 md:w-auto md:h-auto p-1.5 sm:p-2 pixel-stone-btn text-[#fbbf24] hover:text-white flex items-center justify-center active:translate-y-0.5"
          >
            <Layers className="w-4 h-4 sm:w-5 sm:h-5 text-[#fbbf24]" />
          </button>

          {/* Row 2 / Tier 2 on Mobile */}
          <button
            onClick={onToggleMute}
            title={isMuted ? '소리 켜기 (Unmute)' : '소리 끄기 (Mute)'}
            aria-label={isMuted ? '소리 켜기' : '소리 끄기'}
            className="w-8 h-8 sm:w-9 sm:h-9 md:w-auto md:h-auto p-1.5 sm:p-2 pixel-stone-btn text-[#e2e8f0] hover:text-white flex items-center justify-center active:translate-y-0.5"
          >
            {isMuted ? (
              <VolumeX className="w-4 h-4 sm:w-5 sm:h-5 text-red-400" />
            ) : (
              <Volume2 className="w-4 h-4 sm:w-5 sm:h-5 text-[#e2e8f0]" />
            )}
          </button>
          
          <button
            onClick={onRestart}
            title="스테이지 재시작 (Restart Stage)"
            aria-label="스테이지 재시작"
            className="w-8 h-8 sm:w-9 sm:h-9 md:w-auto md:h-auto p-1.5 sm:p-2 pixel-stone-btn text-[#cbd5e1] hover:text-white flex items-center justify-center active:translate-y-0.5"
          >
            <RotateCcw className="w-4 h-4 sm:w-5 sm:h-5 text-[#cbd5e1]" />
          </button>
        </div>
      </div>
    </header>
  );
};
