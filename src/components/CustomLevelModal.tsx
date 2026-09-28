import React, { useState } from 'react';
import { X, Plus, Trash2, Check, Clock } from 'lucide-react';
import { LevelConfig, GemType } from '../types/game';

interface CustomLevelModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveLevel: (level: LevelConfig) => void;
}

type CellMode = 'NORMAL' | 'CHAINED' | 'VOID';

export const CustomLevelModal: React.FC<CustomLevelModalProps> = ({
  isOpen,
  onClose,
  onSaveLevel,
}) => {
  const [size, setSize] = useState<number>(7);
  const [title, setTitle] = useState<string>('My Custom Tomb');
  const [subtitle, setSubtitle] = useState<string>('비밀의 성소');
  const [timeLimit, setTimeLimit] = useState<number>(120);
  const [hammers, setHammers] = useState<number>(3);
  const [bags, setBags] = useState<number>(2);

  // Brush tool
  const [brushMode, setBrushMode] = useState<CellMode>('NORMAL');

  // Grid state: 'NORMAL' | 'CHAINED' | 'VOID'
  const [grid, setGrid] = useState<CellMode[][]>(() => {
    return Array.from({ length: 7 }, () => Array(7).fill('NORMAL'));
  });

  // Gem choices
  const [selectedGems, setSelectedGems] = useState<GemType[]>([
    'ruby',
    'sapphire',
    'emerald',
    'topaz',
    'diamond',
  ]);

  if (!isOpen) return null;

  const handleSizeChange = (newSize: number) => {
    setSize(newSize);
    setGrid(Array.from({ length: newSize }, () => Array(newSize).fill('NORMAL')));
  };

  const handleCellClick = (r: number, c: number) => {
    const next = grid.map(row => [...row]);
    next[r][c] = brushMode;
    setGrid(next);
  };

  const toggleGem = (gem: GemType) => {
    if (selectedGems.includes(gem)) {
      if (selectedGems.length <= 3) return; // Keep at least 3 gems
      setSelectedGems(selectedGems.filter(g => g !== gem));
    } else {
      setSelectedGems([...selectedGems, gem]);
    }
  };

  const handleSave = () => {
    let validCount = 0;
    const validMask: boolean[][] = [];
    const initialChains: [number, number][] = [];

    for (let r = 0; r < size; r++) {
      const rowMask: boolean[] = [];
      for (let c = 0; c < size; c++) {
        const state = grid[r][c];
        if (state === 'VOID') {
          rowMask.push(false);
        } else {
          rowMask.push(true);
          validCount++;
          if (state === 'CHAINED') {
            initialChains.push([r, c]);
          }
        }
      }
      validMask.push(rowMask);
    }

    if (validCount < 9) {
      alert('보드에 최소 9개 이상의 플레이 가능한 타일이 있어야 합니다!');
      return;
    }

    const newLevel: LevelConfig = {
      id: `custom-${Date.now()}`,
      levelNumber: 99,
      size,
      title: title.trim() || `Custom Level (${size}×${size})`,
      subtitle: subtitle.trim() || 'Custom Challenge',
      timeLimit: Math.max(30, Number(timeLimit) || 120),
      gemTypes: selectedGems,
      initialChains,
      validMask,
      targetScore: validCount * 250,
      availableHammers: Math.max(0, Number(hammers) || 2),
      availableBags: Math.max(0, Number(bags) || 1),
      isCustom: true,
    };

    onSaveLevel(newLevel);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/85 backdrop-blur-sm animate-fade-in select-none">
      <div className="relative w-full max-w-2xl max-h-[92vh] flex flex-col pixel-stone-panel overflow-hidden text-[#e7decb]">
        
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3.5 bg-[#1b1712] border-b-2 border-[#544333]">
          <div className="flex items-center gap-2.5">
            <span className="text-2xl">🛠️</span>
            <div>
              <h2 className="font-pixel font-bold text-sm sm:text-base text-[#fef08a]">
                커스텀 레벨 메이커 (LEVEL MAKER)
              </h2>
              <p className="text-xs text-[#d4af37] font-pixel mt-0.5">
                5×5 ~ 12×12 그리드 · 잠금/보이드 블록 자유 배치
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

        {/* Editor Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 text-xs sm:text-sm font-pixel bg-[#1d1813]">
          
          {/* Level Info & Size controls */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="block text-xs font-pixel text-[#fbbf24] mb-1">레벨 제목 (Title)</label>
              <input
                type="text"
                value={title}
                onChange={e => setTitle(e.target.value)}
                placeholder="Ex: Montezuma's Revenge"
                className="w-full px-3 py-2 bg-[#120f0c] border-2 border-[#544333] text-[#fffbeb] font-pixel focus:outline-none focus:border-[#fbbf24]"
              />
            </div>

            <div>
              <label className="block text-xs font-pixel text-[#fbbf24] mb-1">보드 크기 (Grid Size)</label>
              <div className="flex items-center gap-1 overflow-x-auto pb-1">
                {[5, 6, 7, 8, 9, 10, 11, 12].map(s => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => handleSizeChange(s)}
                    className={`px-2.5 py-1.5 text-xs font-pixel transition ${
                      size === s
                        ? 'pixel-gold-btn'
                        : 'pixel-stone-btn text-[#a89b88]'
                    }`}
                  >
                    {s}×{s}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Time & Item counts */}
          <div className="grid grid-cols-3 gap-2.5">
            <div>
              <label className="block text-xs font-pixel text-[#a89b88] mb-1">제한시간(초)</label>
              <input
                type="number"
                min={30}
                max={600}
                value={timeLimit}
                onChange={e => setTimeLimit(Number(e.target.value))}
                className="w-full px-2.5 py-1.5 bg-[#120f0c] border-2 border-[#544333] text-[#fef08a] font-pixel text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-pixel text-[#a89b88] mb-1">해머(🔨)</label>
              <input
                type="number"
                min={0}
                max={10}
                value={hammers}
                onChange={e => setHammers(Number(e.target.value))}
                className="w-full px-2.5 py-1.5 bg-[#120f0c] border-2 border-[#544333] text-[#fef08a] font-pixel text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-pixel text-[#a89b88] mb-1">자루(💰)</label>
              <input
                type="number"
                min={0}
                max={10}
                value={bags}
                onChange={e => setBags(Number(e.target.value))}
                className="w-full px-2.5 py-1.5 bg-[#120f0c] border-2 border-[#544333] text-[#fef08a] font-pixel text-sm"
              />
            </div>
          </div>

          {/* Brush Tool Selector */}
          <div className="p-3 bg-[#17130e] border-2 border-[#3d3125] flex flex-wrap items-center justify-between gap-2.5">
            <span className="text-xs font-pixel text-[#fde047]">배치 브러시:</span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setBrushMode('NORMAL')}
                className={`px-3 py-1.5 text-xs font-pixel flex items-center gap-1.5 ${
                  brushMode === 'NORMAL'
                    ? 'pixel-gold-btn'
                    : 'pixel-stone-btn text-[#a89b88]'
                }`}
              >
                <span className="w-2.5 h-2.5 bg-[#10b981] inline-block" />
                <span>일반 블록</span>
              </button>

              <button
                type="button"
                onClick={() => setBrushMode('CHAINED')}
                className={`px-3 py-1.5 text-xs font-pixel flex items-center gap-1.5 ${
                  brushMode === 'CHAINED'
                    ? 'pixel-gold-btn'
                    : 'pixel-stone-btn text-[#a89b88]'
                }`}
              >
                <span>⛓️</span>
                <span>잠금(사슬)</span>
              </button>

              <button
                type="button"
                onClick={() => setBrushMode('VOID')}
                className={`px-3 py-1.5 text-xs font-pixel flex items-center gap-1.5 ${
                  brushMode === 'VOID'
                    ? 'pixel-gold-btn'
                    : 'pixel-stone-btn text-[#a89b88]'
                }`}
              >
                <span className="w-2.5 h-2.5 border border-dashed border-[#a89b88] inline-block" />
                <span>보이드(빈칸)</span>
              </button>
            </div>
          </div>

          {/* Grid Canvas - Fluid & responsive to prevent mobile block overlapping */}
          <div className="flex flex-col items-center justify-center p-2.5 sm:p-4 bg-[#120f0c] border-2 border-[#3d3125] w-full">
            <div className="w-full max-w-[min(82vw,400px)] sm:max-w-[440px] aspect-square flex items-center justify-center">
              <div
                className={`w-full h-full grid ${
                  size >= 10 ? 'gap-0.5 p-1' : size >= 8 ? 'gap-1 p-1.5' : 'gap-1.5 p-2'
                } bg-[#181410] border-2 border-[#544333] shadow-inner`}
                style={{
                  gridTemplateColumns: `repeat(${size}, minmax(0, 1fr))`,
                  gridTemplateRows: `repeat(${size}, minmax(0, 1fr))`,
                }}
              >
                {grid.map((row, r) =>
                  row.map((cellState, c) => {
                    return (
                      <button
                        key={`${r}-${c}`}
                        type="button"
                        onClick={() => handleCellClick(r, c)}
                        className={`w-full h-full aspect-square min-w-0 min-h-0 flex items-center justify-center transition-all select-none ${
                          cellState === 'VOID'
                            ? 'bg-[#1e1913]/30 border border-dashed border-[#574635] opacity-25'
                            : cellState === 'CHAINED'
                            ? 'bg-[#451a03] border sm:border-2 border-[#f59e0b] text-yellow-300'
                            : 'bg-[#2e261d] border sm:border-2 border-[#574635] hover:border-[#fbbf24]'
                        }`}
                      >
                        {cellState === 'CHAINED' && (
                          <span className={size >= 10 ? 'text-[8px] sm:text-[10px]' : 'text-xs'}>⛓️</span>
                        )}
                        {cellState === 'NORMAL' && (
                          <span
                            className={`${
                              size >= 10 ? 'w-1 h-1 sm:w-1.5 sm:h-1.5' : 'w-2 h-2'
                            } bg-[#d97706] rounded-none inline-block`}
                          />
                        )}
                      </button>
                    );
                  })
                )}
              </div>
            </div>
            <div className="flex items-center justify-between w-full max-w-[min(82vw,400px)] mt-2 text-[11px] text-[#a89b88] font-pixel">
              <span>보드 크기: {size}×{size} ({size * size}칸)</span>
              <span>터치/클릭하여 타일 모드 변경</span>
            </div>
          </div>

          {/* Gem types selection */}
          <div className="p-3 bg-[#17130e] border-2 border-[#3d3125] space-y-2">
            <span className="text-xs font-pixel text-[#fde047]">등장할 보석 종류 선택 (최소 3개):</span>
            <div className="flex flex-wrap gap-2 pt-0.5">
              {(['ruby', 'sapphire', 'emerald', 'topaz', 'diamond', 'amethyst', 'relic'] as GemType[]).map(gem => {
                const isSelected = selectedGems.includes(gem);
                return (
                  <button
                    key={gem}
                    type="button"
                    onClick={() => toggleGem(gem)}
                    className={`px-3 py-1.5 text-xs capitalize flex items-center gap-1.5 font-pixel ${
                      isSelected
                        ? 'pixel-gold-btn'
                        : 'pixel-stone-btn text-[#a89b88]'
                    }`}
                  >
                    <span>{isSelected ? '✓' : '+'}</span>
                    <span>{gem}</span>
                  </button>
                );
              })}
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-5 py-3 bg-[#14110d] border-t-2 border-[#544333]">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 pixel-stone-btn text-xs font-pixel"
          >
            취소 (Cancel)
          </button>

          <button
            type="button"
            onClick={handleSave}
            className="px-6 py-2 pixel-gold-btn text-xs font-pixel font-bold"
          >
            커스텀 레벨 저장 & 등록 (SAVE)
          </button>
        </div>

      </div>
    </div>
  );
};
