import React from 'react';
import { X, Play, Plus, Trash2, Layers } from 'lucide-react';
import { LevelConfig } from '../types/game';

interface LevelSelectModalProps {
  isOpen: boolean;
  onClose: () => void;
  levels: LevelConfig[];
  currentLevelId: string;
  onSelectLevel: (lvl: LevelConfig) => void;
  onOpenCreateCustom: () => void;
  onDeleteCustomLevel: (id: string) => void;
}

export const LevelSelectModal: React.FC<LevelSelectModalProps> = ({
  isOpen,
  onClose,
  levels,
  currentLevelId,
  onSelectLevel,
  onOpenCreateCustom,
  onDeleteCustomLevel,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/85 backdrop-blur-sm animate-fade-in select-none">
      <div className="relative w-full max-w-2xl max-h-[90vh] flex flex-col pixel-stone-panel overflow-hidden text-[#e7decb]">
        
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3.5 bg-[#1b1712] border-b-2 border-[#544333]">
          <div className="flex items-center gap-2.5">
            <Layers className="w-5 h-5 text-[#fbbf24]" />
            <div>
              <h2 className="font-pixel font-bold text-base sm:text-lg text-[#fef08a]">
                난이도 & 스테이지 선택 (LEVEL SELECT)
              </h2>
              <p className="text-xs sm:text-sm text-[#d4af37] font-pixel mt-0.5">
                1~8단계 난이도 (5×5 ~ 12×12) 및 커스텀 원정
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 pixel-stone-btn text-stone-300 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content list */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-3 bg-[#1d1813]">
          
          <div className="flex items-center justify-between pb-1">
            <span className="font-pixel text-xs sm:text-sm text-[#fbbf24] font-bold uppercase tracking-wider">
              공식 난이도 스테이지 (1~8단계)
            </span>
            <button
              onClick={onOpenCreateCustom}
              className="flex items-center gap-1.5 px-3 py-1.5 pixel-gold-btn text-xs sm:text-sm font-pixel font-bold"
            >
              <Plus className="w-4 h-4" />
              <span>+ 커스텀 레벨 추가</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {levels.map((lvl) => {
              const isCurrent = lvl.id === currentLevelId;
              return (
                <div
                  key={lvl.id}
                  onClick={() => {
                    onSelectLevel(lvl);
                    onClose();
                  }}
                  className={`group relative p-3.5 cursor-pointer transition-all ${
                    isCurrent
                      ? 'bg-[#3b2d1c] border-2 border-[#fbbf24] shadow-[0_0_12px_#f59e0b]'
                      : 'pixel-stone-btn hover:border-[#fbbf24]'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-pixel font-bold text-sm sm:text-base text-[#fffbeb] group-hover:text-yellow-300">
                          {lvl.title}
                        </span>
                        {lvl.isCustom && (
                          <span className="px-1.5 py-0.5 bg-[#4c1d95] text-[#e9d5ff] border border-[#a855f7] font-pixel text-[10px] font-bold">
                            CUSTOM
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-[#a89b88] line-clamp-1 mt-1 font-pixel">
                        {lvl.subtitle}
                      </p>
                    </div>

                    {lvl.isCustom && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          if (confirm(`"${lvl.title}" 레벨을 삭제하시겠습니까?`)) {
                            onDeleteCustomLevel(lvl.id);
                          }
                        }}
                        className="p-1 pixel-stone-btn text-red-400 hover:text-red-300"
                        title="Delete custom level"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>

                  <div className="mt-2.5 flex items-center justify-between text-xs sm:text-sm font-pixel text-[#d4af37] border-t border-[#3d3125] pt-2">
                    <span>크기: {lvl.size}×{lvl.size}</span>
                    <span>시간: {lvl.timeLimit}초</span>
                    <span className="text-[#fde047] flex items-center gap-1 font-bold">
                      <Play className="w-3 h-3 fill-[#fde047]" />
                      <span>{isCurrent ? '진행 중' : '선택'}</span>
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-5 py-3 bg-[#14110d] border-t-2 border-[#544333]">
          <span className="text-xs sm:text-sm text-[#a89b88] font-pixel">
            시간의 1/3 안에 클리어 시 별 3개(★★★) 획득
          </span>
          <button
            onClick={onClose}
            className="px-5 py-2 pixel-stone-btn text-xs sm:text-sm font-pixel font-bold"
          >
            닫기
          </button>
        </div>

      </div>
    </div>
  );
};
