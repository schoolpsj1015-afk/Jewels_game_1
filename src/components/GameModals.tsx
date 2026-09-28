import React from 'react';
import { Trophy, RefreshCw, ArrowRight, Star, Clock } from 'lucide-react';

interface VictoryModalProps {
  isOpen: boolean;
  score: number;
  levelNumber: number;
  levelTitle: string;
  stars: number;
  timeLeft: number;
  totalTime: number;
  hasNextLevel: boolean;
  onNextLevel: () => void;
  onReplay: () => void;
}

export const VictoryModal: React.FC<VictoryModalProps> = ({
  isOpen,
  score,
  levelTitle,
  stars,
  timeLeft,
  totalTime,
  hasNextLevel,
  onNextLevel,
  onReplay,
}) => {
  if (!isOpen) return null;

  const timeUsed = Math.max(0, totalTime - timeLeft);
  const timeUsedPercent = Math.round((timeUsed / totalTime) * 100);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-fade-in select-none">
      <div className="relative w-full max-w-md p-6 pixel-stone-panel text-center text-[#e7decb]">
        
        {/* Crown/Trophy Icon */}
        <div className="mx-auto w-16 h-16 pixel-gold-btn flex items-center justify-center shadow-lg -mt-12 mb-3">
          <Trophy className="w-8 h-8 text-[#1c1917]" />
        </div>

        <h2 className="font-pixel font-bold text-lg sm:text-2xl text-[#fef08a] tracking-wider drop-shadow">
          STAGE COMPLETED!
        </h2>
        <p className="text-xs uppercase tracking-wider text-[#d4af37] font-pixel mt-1">
          {levelTitle} 황금화 정복 완료!
        </p>

        {/* STARS RATING DISPLAY */}
        <div className="my-5 py-4 px-4 bg-[#14110d] border-2 border-[#544333] flex flex-col items-center gap-2">
          <div className="flex items-center gap-3">
            {[1, 2, 3].map((starNum) => {
              const isEarned = starNum <= stars;
              return (
                <div
                  key={starNum}
                  className={`transition-all duration-300 ${
                    isEarned
                      ? 'scale-125 text-yellow-400 drop-shadow-[0_0_10px_#eab308] animate-bounce'
                      : 'text-[#44382c] opacity-35'
                  }`}
                  style={{ animationDelay: `${starNum * 150}ms` }}
                >
                  <Star className={`w-9 h-9 ${isEarned ? 'fill-yellow-400' : ''}`} />
                </div>
              );
            })}
          </div>

          <div className="font-pixel font-bold text-xs sm:text-sm text-[#fef08a] mt-1.5 text-center">
            {stars === 3 && '★★★ 마스터 탐험가 (시간의 1/3 이내 클리어!)'}
            {stars === 2 && '★★☆ 숙련된 탐험가 (시간의 2/3 이내 클리어!)'}
            {stars === 1 && '★☆☆ 스테이지 클리어 달성!'}
          </div>

          <div className="flex items-center gap-3 text-xs font-pixel text-[#a89b88] mt-1">
            <span className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-[#fbbf24]" />
              <span>소요 시간: {timeUsed}초 / {totalTime}초 ({timeUsedPercent}%)</span>
            </span>
          </div>
        </div>

        {/* SCORE BREAKDOWN */}
        <div className="mb-6 p-3.5 bg-[#17130e] border-2 border-[#3d3125] text-xs text-[#dcd1be] font-pixel">
          <div className="flex justify-between items-center">
            <span>EXPEDITION SCORE:</span>
            <span className="text-base sm:text-lg font-bold text-[#fef08a] tabular-nums">
              {score.toLocaleString()} PTS
            </span>
          </div>
        </div>

        {/* ACTION BUTTONS */}
        <div className="flex items-center justify-center gap-3">
          <button
            onClick={onReplay}
            className="flex items-center gap-2 px-5 py-2.5 pixel-stone-btn text-xs sm:text-sm font-pixel font-bold text-stone-200"
          >
            <RefreshCw className="w-4 h-4" />
            <span>다시하기</span>
          </button>

          {hasNextLevel ? (
            <button
              onClick={onNextLevel}
              className="flex items-center gap-2 px-6 py-2.5 pixel-gold-btn text-xs sm:text-sm font-pixel font-bold transition transform hover:scale-105"
            >
              <span>다음 난이도</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={onReplay}
              className="flex items-center gap-2 px-6 py-2.5 pixel-gold-btn text-xs sm:text-sm font-pixel font-bold"
            >
              <span>최고 난이도 완료!</span>
            </button>
          )}
        </div>

      </div>
    </div>
  );
};

interface GameOverModalProps {
  isOpen: boolean;
  score: number;
  onRetry: () => void;
}

export const GameOverModal: React.FC<GameOverModalProps> = ({
  isOpen,
  score,
  onRetry,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-fade-in select-none">
      <div className="relative w-full max-w-md p-6 pixel-stone-panel text-center text-[#e7decb] border-red-900">
        <div className="mx-auto w-14 h-14 bg-[#450a0a] border-2 border-[#ef4444] flex items-center justify-center shadow-lg -mt-10 mb-3">
          <span className="text-2xl">⏳</span>
        </div>

        <h2 className="font-pixel font-bold text-lg sm:text-2xl text-[#f87171] tracking-wider">
          TIME HAS EXPIRED
        </h2>
        <p className="text-xs sm:text-sm uppercase tracking-wider text-[#a89b88] font-pixel mt-1">
          모래시계의 모래가 모두 떨어졌습니다
        </p>

        <div className="my-5 p-3.5 bg-[#17130e] border-2 border-[#3d3125] font-pixel text-sm">
          <span className="text-[#a89b88]">FINAL SCORE: </span>
          <span className="text-base sm:text-lg font-bold text-[#fef08a] tabular-nums">
            {score.toLocaleString()}
          </span>
        </div>

        <button
          onClick={onRetry}
          className="w-full py-3 pixel-gold-btn text-xs sm:text-sm font-pixel font-bold"
        >
          Try Again (재도전)
        </button>
      </div>
    </div>
  );
};
