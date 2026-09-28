import React, { useState, useRef } from 'react';
import { Cell, BoardPosition } from '../types/game';
import { JewelSprite } from './JewelSprite';

interface BoardProps {
  board: Cell[][];
  size: number;
  validMask: boolean[][];
  selectedCell: BoardPosition | null;
  isHammerActive: boolean;
  onSelectCell: (r: number, c: number) => void;
  onHammerCell: (r: number, c: number) => void;
  onSwipeMove?: (from: BoardPosition, dir: 'UP' | 'DOWN' | 'LEFT' | 'RIGHT') => void;
  isProcessing: boolean;
}

export const Board: React.FC<BoardProps> = ({
  board,
  size,
  validMask,
  selectedCell,
  isHammerActive,
  onSelectCell,
  onHammerCell,
  onSwipeMove,
  isProcessing,
}) => {
  const [hoveredCell, setHoveredCell] = useState<BoardPosition | null>(null);

  // Touch Swipe tracking
  const touchStartRef = useRef<{ x: number; y: number; cell: BoardPosition } | null>(null);

  const handleClick = (r: number, c: number) => {
    if (isProcessing) return;
    if (!validMask[r]?.[c] || board[r]?.[c]?.isObstacle) return;

    if (isHammerActive) {
      onHammerCell(r, c);
    } else {
      onSelectCell(r, c);
    }
  };

  const handleTouchStart = (e: React.TouchEvent, r: number, c: number) => {
    if (isProcessing) return;
    if (!validMask[r]?.[c] || board[r]?.[c]?.isObstacle) return;

    const touch = e.touches[0];
    touchStartRef.current = {
      x: touch.clientX,
      y: touch.clientY,
      cell: { r, c },
    };
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!touchStartRef.current || isProcessing) return;

    const touch = e.changedTouches[0];
    const dx = touch.clientX - touchStartRef.current.x;
    const dy = touch.clientY - touchStartRef.current.y;
    const startCell = touchStartRef.current.cell;
    touchStartRef.current = null;

    const threshold = 16;
    if (Math.abs(dx) > threshold || Math.abs(dy) > threshold) {
      let dir: 'UP' | 'DOWN' | 'LEFT' | 'RIGHT';
      if (Math.abs(dx) > Math.abs(dy)) {
        dir = dx > 0 ? 'RIGHT' : 'LEFT';
      } else {
        dir = dy > 0 ? 'DOWN' : 'UP';
      }

      if (onSwipeMove) {
        onSwipeMove(startCell, dir);
      }
    }
  };

  return (
    <div className="relative w-full max-w-[min(94vw,460px)] sm:max-w-[480px] md:max-w-[520px] aspect-square flex flex-col p-1.5 sm:p-2.5 rounded-none pixel-stone-panel select-none touch-none">
      {/* Ancient Temple Carved Stone Grid Header Plate */}
      <div className="flex items-center justify-between px-2 pb-1 mb-1 border-b-2 border-[#574635] text-[11px] sm:text-xs font-pixel font-bold text-[#d6c4a8]">
        <span className="flex items-center gap-1.5">
          <span className="w-2 h-2 sm:w-2.5 sm:h-2.5 bg-[#8c6d48] border border-[#2d2217]" />
          <span>RUIN GRID {size}×{size}</span>
        </span>
        <span className="text-[#eab308]">90S RETRO SLAB</span>
      </div>

      {/* Dynamic Grid Layout with pixelated stone relief bricks - Fluid sizing prevents block overlapping */}
      <div
        className={`relative flex-1 w-full h-full aspect-square grid ${
          size >= 10 ? 'gap-0.5 p-0.5 sm:p-1' : 'gap-1 p-1'
        } bg-[#15120e] border-2 border-[#3b3126] shadow-inner`}
        style={{
          gridTemplateColumns: `repeat(${size}, minmax(0, 1fr))`,
          gridTemplateRows: `repeat(${size}, minmax(0, 1fr))`,
        }}
      >
        {board.map((row, r) =>
          row.map((cell, c) => {
            const isValid = validMask[r]?.[c] && !cell.isObstacle;
            const isSelected = selectedCell?.r === r && selectedCell?.c === c;
            const isHovered = hoveredCell?.r === r && hoveredCell?.c === c;

            // Inactive corner/void cell
            if (!isValid) {
              return (
                <div
                  key={`empty-${r}-${c}`}
                  className="w-full h-full aspect-square min-w-0 min-h-0 invisible pointer-events-none"
                />
              );
            }

            return (
              <div
                key={cell.id || `cell-${r}-${c}`}
                onClick={() => handleClick(r, c)}
                onTouchStart={(e) => handleTouchStart(e, r, c)}
                onTouchEnd={handleTouchEnd}
                onMouseEnter={() => setHoveredCell({ r, c })}
                onMouseLeave={() => setHoveredCell(null)}
                className={`relative w-full h-full aspect-square min-w-0 min-h-0 flex items-center justify-center cursor-pointer transition-all ${
                  cell.isGold
                    ? 'bg-[#b45309] shadow-[inset_1px_1px_0px_#fef08a,inset_-1px_-1px_0px_#78350f] sm:shadow-[inset_2px_2px_0px_#fef08a,inset_-2px_-2px_0px_#78350f] border border-[#f59e0b]'
                    : 'bg-[#2b251d] shadow-[inset_1px_1px_0px_#4a3f32,inset_-1px_-1px_0px_#14110c] sm:shadow-[inset_2px_2px_0px_#4a3f32,inset_-2px_-2px_0px_#14110c] border border-[#1f1a14] hover:bg-[#383025]'
                } ${
                  isSelected
                    ? 'ring-2 ring-[#fde047] z-10 scale-[1.03] shadow-[0_0_8px_#eab308]'
                    : ''
                } ${
                  isHammerActive && isHovered
                    ? 'ring-2 ring-[#ef4444] bg-[#450a0a] z-10'
                    : ''
                }`}
              >
                {/* Gold Tile Pixel Rune Engraving (when turned gold) */}
                {cell.isGold && (
                  <div className="absolute inset-0 pointer-events-none opacity-40 flex items-center justify-center">
                    <div className={`${size >= 10 ? 'w-2 h-2' : 'w-3 h-3 sm:w-4 sm:h-4'} border sm:border-2 border-[#78350f] rotate-45`} />
                  </div>
                )}

                {/* The Pixel Jewel Sprite */}
                <div className={`w-full h-full ${size >= 10 ? 'p-0.5' : 'p-0.5 sm:p-1'} flex items-center justify-center overflow-hidden`}>
                  <JewelSprite
                    type={cell.type}
                    isSelected={isSelected}
                    isMatched={cell.isMatched}
                    isChained={cell.isChained}
                  />
                </div>

                {/* Hammer cursor overlay indicator */}
                {isHammerActive && isHovered && (
                  <div className="absolute inset-0 flex items-center justify-center bg-red-900/60 pointer-events-none">
                    <span className="text-xs sm:text-sm font-bold text-white drop-shadow">🔨</span>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
