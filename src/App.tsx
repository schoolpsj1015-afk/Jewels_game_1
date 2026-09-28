/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useRef, useCallback } from 'react';
import { Cell, BoardPosition, GemType, LevelConfig } from './types/game';
import {
  DEFAULT_LEVELS,
  loadSavedCustomLevels,
  saveCustomLevel,
  deleteCustomLevel,
  calculateStars,
} from './utils/levels';
import {
  initBoard,
  findMatches,
  checkSwapProducesMatch,
  findPossibleMoves,
  shuffleBoard,
  createRandomGem,
  generateCellId,
  calculateMatchScore,
} from './utils/matchEngine';
import { sound } from './services/audio';
import { Board } from './components/Board';
import { TopHeader } from './components/TopHeader';
import { Hourglass } from './components/Hourglass';
import { SideTotem } from './components/SideTotem';
import { MobileControls } from './components/MobileControls';
import { TutorialModal } from './components/TutorialModal';
import { CustomLevelModal } from './components/CustomLevelModal';
import { LevelSelectModal } from './components/LevelSelectModal';
import { VictoryModal, GameOverModal } from './components/GameModals';
import bgImage from './assets/images/retro_jewel_backdrop_1790582067747.jpg';
import { Monitor, HelpCircle, Layers, Plus, FileDown } from 'lucide-react';
import { generateImplementationPlanPDF } from './utils/pdfGenerator';

export default function App() {
  // Levels state (official 1~8 + custom levels)
  const [customLevels, setCustomLevels] = useState<LevelConfig[]>(() => loadSavedCustomLevels());
  const allLevels = [...DEFAULT_LEVELS, ...customLevels];

  const [currentLevel, setCurrentLevel] = useState<LevelConfig>(DEFAULT_LEVELS[0]);

  const [board, setBoard] = useState<Cell[][]>(() => initBoard(currentLevel));
  const [selectedCell, setSelectedCell] = useState<BoardPosition | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(4);
  const [timeLeft, setTimeLeft] = useState(currentLevel.timeLimit);
  const [isPaused, setIsPaused] = useState(false);

  // Power-ups
  const [isHammerActive, setIsHammerActive] = useState(false);
  const [hammerCount, setHammerCount] = useState(currentLevel.availableHammers);
  const [bagCount, setBagCount] = useState(currentLevel.availableBags);

  // Modals & UI states
  const [isTutorialOpen, setIsTutorialOpen] = useState(false);
  const [isLevelSelectOpen, setIsLevelSelectOpen] = useState(false);
  const [isCreateCustomOpen, setIsCreateCustomOpen] = useState(false);
  const [isVictoryOpen, setIsVictoryOpen] = useState(false);
  const [isGameOverOpen, setIsGameOverOpen] = useState(false);
  const [earnedStars, setEarnedStars] = useState(1);

  const [isMuted, setIsMuted] = useState(false);
  const [isCrtMode, setIsCrtMode] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);

  // PDF plan generator handler
  const handleDownloadPlanPdf = async () => {
    if (isGeneratingPdf) return;
    try {
      setIsGeneratingPdf(true);
      showToast('📄 고해상도 PDF 계획서 생성 중...');
      await generateImplementationPlanPDF();
      showToast('✅ 계획서 PDF 다운로드 완료!');
    } catch (err) {
      console.error('PDF generation error:', err);
      showToast('❌ PDF 생성 중 오류가 발생했습니다.');
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  // Timer interval
  useEffect(() => {
    if (isPaused || isVictoryOpen || isGameOverOpen) return;

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          handleTimeExpired();
          return 0;
        }
        if (prev <= 6) {
          sound.playTick();
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isPaused, isVictoryOpen, isGameOverOpen]);

  // Display temporary toast
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2500);
  };

  // Check victory condition: all valid cells are gold
  const checkVictory = useCallback((currentBoard: Cell[][], targetLevel: LevelConfig) => {
    const size = targetLevel.size || currentBoard.length;
    let allGold = true;
    for (let r = 0; r < size; r++) {
      for (let c = 0; c < size; c++) {
        if (targetLevel.validMask[r]?.[c] && !currentBoard[r]?.[c]?.isObstacle) {
          if (!currentBoard[r][c].isGold) {
            allGold = false;
            break;
          }
        }
      }
      if (!allGold) break;
    }
    return allGold;
  }, []);

  // Handle stage timeout
  const handleTimeExpired = () => {
    sound.playGameOver();
    if (lives > 1) {
      setLives(l => l - 1);
      setTimeLeft(currentLevel.timeLimit);
      showToast('Life Lost! Extra time granted.');
    } else {
      setLives(0);
      setIsGameOverOpen(true);
    }
  };

  // Reset or start level
  const startLevel = useCallback((lvl: LevelConfig) => {
    setCurrentLevel(lvl);
    setBoard(initBoard(lvl));
    setSelectedCell(null);
    setIsProcessing(false);
    setIsHammerActive(false);
    setTimeLeft(lvl.timeLimit);
    setHammerCount(lvl.availableHammers);
    setBagCount(lvl.availableBags);
    setIsVictoryOpen(false);
    setIsGameOverOpen(false);
  }, []);

  // Save new custom level
  const handleSaveCustomLevel = (lvl: LevelConfig) => {
    const updated = saveCustomLevel(lvl);
    setCustomLevels(updated);
    startLevel(lvl);
    showToast(`커스텀 레벨 "${lvl.title}" 저장 및 시작!`);
  };

  // Delete custom level
  const handleDeleteCustomLevel = (id: string) => {
    const updated = deleteCustomLevel(id);
    setCustomLevels(updated);
    if (currentLevel.id === id) {
      startLevel(DEFAULT_LEVELS[0]);
    }
    showToast('커스텀 레벨이 삭제되었습니다.');
  };

  // Main Cascade Loop with Progressive Cluster Scoring
  const runCascade = useCallback(async (startBoard: Cell[][]) => {
    setIsProcessing(true);
    let workingBoard = startBoard.map(row => row.map(c => ({ ...c })));
    let combo = 1;
    let keepChecking = true;
    const size = currentLevel.size || workingBoard.length;

    while (keepChecking) {
      const matchRes = findMatches(workingBoard, currentLevel.validMask);

      if (matchRes.matchedCells.size === 0) {
        keepChecking = false;
        break;
      }

      // 1. Play sounds & convert matched cells to gold
      sound.playMatch(combo);
      let newlyTurnedGold = false;

      matchRes.matchedCells.forEach(coord => {
        const [r, c] = coord.split(',').map(Number);
        if (!workingBoard[r][c].isGold) {
          workingBoard[r][c].isGold = true;
          newlyTurnedGold = true;
        }
        if (workingBoard[r][c].isChained) {
          workingBoard[r][c].isChained = false;
          sound.playChainBreak();
        }
        workingBoard[r][c].isMatched = true;
      });

      if (newlyTurnedGold) {
        sound.playGoldTile();
      }

      // Calculate progressive score: gem count scales score exponentially higher
      let stepScore = 0;
      let maxClusterSize = 0;
      for (const group of matchRes.matches) {
        stepScore += calculateMatchScore(group.length, combo);
        if (group.length > maxClusterSize) {
          maxClusterSize = group.length;
        }
      }

      setScore(s => s + stepScore);

      // Toast feedback based on cluster size and shape
      if (maxClusterSize >= 7) {
        showToast(`💥 전설의 대형 클러스터 (${maxClusterSize}개)! +${stepScore.toLocaleString()}점`);
      } else if (maxClusterSize >= 5) {
        showToast(`⭐ ${maxClusterSize}개 X/라인 클러스터 매치! +${stepScore.toLocaleString()}점`);
      } else if (maxClusterSize === 4) {
        showToast(`💎 4개 클러스터 (유물 탄생!) +${stepScore.toLocaleString()}점`);
      } else if (combo >= 2) {
        showToast(`🔥 ${combo}연속 콤보! +${stepScore.toLocaleString()}점`);
      }

      setBoard(workingBoard.map(r => r.map(c => ({ ...c }))));

      // Wait 200ms for explosion visual
      await new Promise(res => setTimeout(res, 200));

      // 2. Clear matched cells & Apply Gravity
      for (let c = 0; c < size; c++) {
        // Collect surviving gems from bottom to top
        const surviving: { type: GemType; isGold: boolean; isChained: boolean }[] = [];
        for (let r = size - 1; r >= 0; r--) {
          const cell = workingBoard[r][c];
          if (currentLevel.validMask[r]?.[c] && !cell.isObstacle && !cell.isMatched) {
            surviving.push({
              type: cell.type,
              isGold: cell.isGold,
              isChained: cell.isChained,
            });
          }
        }

        // Refill from bottom up into valid cells
        let survivorIdx = 0;
        for (let r = size - 1; r >= 0; r--) {
          if (currentLevel.validMask[r]?.[c] && !workingBoard[r][c].isObstacle) {
            if (survivorIdx < surviving.length) {
              const item = surviving[survivorIdx++];
              workingBoard[r][c] = {
                r,
                c,
                type: item.type,
                id: workingBoard[r][c].id,
                isGold: workingBoard[r][c].isGold,
                isChained: item.isChained,
                isMatched: false,
                isObstacle: false,
              };
            } else {
              // Spawn new gem at top (or relic if spawned at this coordinate)
              const isSpecialSpawn =
                matchRes.specialCreated &&
                matchRes.specialCreated.pos.r === r &&
                matchRes.specialCreated.pos.c === c;

              workingBoard[r][c] = {
                r,
                c,
                type: isSpecialSpawn ? 'relic' : createRandomGem(currentLevel.gemTypes),
                id: generateCellId(),
                isGold: workingBoard[r][c].isGold,
                isChained: false,
                isMatched: false,
                isObstacle: false,
              };
            }
          }
        }
      }

      setBoard(workingBoard.map(r => r.map(c => ({ ...c }))));
      combo++;
      await new Promise(res => setTimeout(res, 180));
    }

    // 3. Cascade settled: Check victory!
    if (checkVictory(workingBoard, currentLevel)) {
      sound.playVictory();
      const stars = calculateStars(timeLeft, currentLevel.timeLimit);
      setEarnedStars(stars);
      setIsVictoryOpen(true);
      setIsProcessing(false);
      return;
    }

    // 4. Check deadlock
    const moves = findPossibleMoves(workingBoard, currentLevel.validMask);
    if (moves.length === 0) {
      showToast('No Moves Left! Shuffling relics...');
      sound.playShuffle();
      await new Promise(res => setTimeout(res, 400));
      workingBoard = shuffleBoard(workingBoard, currentLevel.validMask, currentLevel.gemTypes);
      setBoard(workingBoard.map(r => r.map(c => ({ ...c }))));
    }

    setIsProcessing(false);
  }, [currentLevel, checkVictory, timeLeft]);

  // Core Swap execution
  const attemptSwap = async (r1: number, c1: number, r2: number, c2: number) => {
    if (isProcessing) return;

    if (!currentLevel.validMask[r1]?.[c1] || !currentLevel.validMask[r2]?.[c2]) return;
    if (board[r1]?.[c1]?.isObstacle || board[r2]?.[c2]?.isObstacle) return;

    // Chained gems cannot be moved
    if (board[r1][c1].isChained || board[r2][c2].isChained) {
      showToast('Chained gems are locked in place!');
      setSelectedCell(null);
      return;
    }

    const cell1 = board[r1][c1];
    const cell2 = board[r2][c2];
    const isRelic1 = cell1.type === 'relic';
    const isRelic2 = cell2.type === 'relic';

    // Special Sun Relic Swap Mechanics
    if (isRelic1 && isRelic2) {
      // Dual Relic: Solar Flare turns all valid board tiles into Gold!
      sound.playVictory();
      setSelectedCell(null);
      const nextBoard = board.map(row => row.map(c => ({ ...c })));
      nextBoard.forEach(row =>
        row.forEach(c => {
          if (currentLevel.validMask[c.r]?.[c.c] && !c.isObstacle) {
            c.isGold = true;
            c.isMatched = true;
          }
        })
      );
      setScore(s => s + 10000);
      showToast('☀️☀️ 쌍둥이 유물 태양 폭발! 모든 석판 황금화! (+10,000점)');
      setBoard(nextBoard);
      await new Promise(res => setTimeout(res, 300));
      await runCascade(nextBoard);
      return;
    }

    if (isRelic1 || isRelic2) {
      // Relic + Color Swap: Clears all gems of that matching color!
      const targetType = isRelic1 ? cell2.type : cell1.type;
      sound.playGoldTile();
      sound.playMatch(2);
      setSelectedCell(null);
      const nextBoard = board.map(row => row.map(c => ({ ...c })));
      let clearedCount = 0;
      nextBoard[r1][c1].isMatched = true;
      nextBoard[r1][c1].isGold = true;
      nextBoard[r2][c2].isMatched = true;
      nextBoard[r2][c2].isGold = true;

      nextBoard.forEach(row =>
        row.forEach(c => {
          if (currentLevel.validMask[c.r]?.[c.c] && !c.isObstacle && c.type === targetType) {
            c.isGold = true;
            c.isChained = false;
            c.isMatched = true;
            clearedCount++;
          }
        })
      );

      const relicScore = Math.max(clearedCount, 1) * 400;
      setScore(s => s + relicScore);
      showToast(`☀️ 태양 유물 발동! 모든 [${targetType.toUpperCase()}] 정화 (+${relicScore.toLocaleString()}점)!`);
      setBoard(nextBoard);
      await new Promise(res => setTimeout(res, 300));
      await runCascade(nextBoard);
      return;
    }

    // Check if swap produces a match
    const isValid = checkSwapProducesMatch(r1, c1, r2, c2, board, currentLevel.validMask);

    if (!isValid) {
      sound.playSwap();
      showToast('No match formed!');
      setSelectedCell(null);
      return;
    }

    // Perform swap
    sound.playSwap();
    setSelectedCell(null);

    const nextBoard = board.map(row => row.map(cell => ({ ...cell })));
    const tempType = nextBoard[r1][c1].type;
    const tempId = nextBoard[r1][c1].id;

    nextBoard[r1][c1].type = nextBoard[r2][c2].type;
    nextBoard[r1][c1].id = nextBoard[r2][c2].id;

    nextBoard[r2][c2].type = tempType;
    nextBoard[r2][c2].id = tempId;

    setBoard(nextBoard);

    // Launch cascade loop
    await runCascade(nextBoard);
  };

  // Cell Selection & Swap Handler
  const handleSelectCell = async (r: number, c: number) => {
    if (isProcessing) return;

    if (!selectedCell) {
      sound.playSelect();
      setSelectedCell({ r, c });
      return;
    }

    // Clicked same cell -> deselect
    if (selectedCell.r === r && selectedCell.c === c) {
      setSelectedCell(null);
      return;
    }

    // Check adjacency
    const dist = Math.abs(selectedCell.r - r) + Math.abs(selectedCell.c - c);
    if (dist !== 1) {
      sound.playSelect();
      setSelectedCell({ r, c });
      return;
    }

    await attemptSwap(selectedCell.r, selectedCell.c, r, c);
  };

  // Mobile Swipe move handler
  const handleSwipeMove = (from: BoardPosition, dir: 'UP' | 'DOWN' | 'LEFT' | 'RIGHT') => {
    let targetR = from.r;
    let targetC = from.c;
    const size = currentLevel.size || 8;

    if (dir === 'UP') targetR--;
    else if (dir === 'DOWN') targetR++;
    else if (dir === 'LEFT') targetC--;
    else if (dir === 'RIGHT') targetC++;

    if (targetR >= 0 && targetR < size && targetC >= 0 && targetC < size) {
      attemptSwap(from.r, from.c, targetR, targetC);
    }
  };

  // Mobile D-pad button handler
  const handleDpadMove = (dir: 'UP' | 'DOWN' | 'LEFT' | 'RIGHT') => {
    if (!selectedCell) return;
    handleSwipeMove(selectedCell, dir);
  };

  // Hammer Power-up Handler
  const handleHammerCell = async (r: number, c: number) => {
    if (hammerCount <= 0) return;

    sound.playHammerSmash();
    setIsHammerActive(false);
    setHammerCount(h => h - 1);

    const nextBoard = board.map(row => row.map(cell => ({ ...cell })));
    const cell = nextBoard[r][c];

    if (cell.isChained) {
      cell.isChained = false;
      sound.playChainBreak();
    }

    if (!cell.isGold) {
      cell.isGold = true;
      sound.playGoldTile();
    }

    cell.isMatched = true;
    setScore(s => s + 500);
    setBoard(nextBoard);

    showToast('Tile Smashed into Pure Gold!');

    await new Promise(res => setTimeout(res, 200));
    await runCascade(nextBoard);
  };

  // Bag Shuffle Power-up
  const handleUseBag = async () => {
    if (bagCount <= 0 || isProcessing) return;

    sound.playShuffle();
    setBagCount(b => b - 1);

    const size = currentLevel.size || 8;
    const nextBoard = board.map(row => row.map(cell => ({ ...cell })));
    const ungoldCells: BoardPosition[] = [];

    for (let r = 0; r < size; r++) {
      for (let c = 0; c < size; c++) {
        if (currentLevel.validMask[r]?.[c] && !nextBoard[r][c].isObstacle && !nextBoard[r][c].isGold) {
          ungoldCells.push({ r, c });
        }
      }
    }

    if (ungoldCells.length > 0) {
      const chosen = ungoldCells[Math.floor(Math.random() * ungoldCells.length)];
      nextBoard[chosen.r][chosen.c].isGold = true;
      sound.playGoldTile();
    }

    const shuffled = shuffleBoard(nextBoard, currentLevel.validMask, currentLevel.gemTypes);
    setBoard(shuffled);
    showToast("Explorer's Blessing: Board Shuffled & Gold Tile Bestowed!");

    if (checkVictory(shuffled, currentLevel)) {
      sound.playVictory();
      setEarnedStars(calculateStars(timeLeft, currentLevel.timeLimit));
      setIsVictoryOpen(true);
    }
  };

  // Next level navigation
  const currentIndex = allLevels.findIndex(l => l.id === currentLevel.id);
  const hasNextLevel = currentIndex >= 0 && currentIndex + 1 < allLevels.length;

  const handleNextLevel = () => {
    if (hasNextLevel) {
      startLevel(allLevels[currentIndex + 1]);
    }
  };

  // Count gold tiles
  const totalValidTiles = board.reduce((acc, row, r) => {
    return acc + row.filter((c, col) => currentLevel.validMask[r]?.[col] && !c.isObstacle).length;
  }, 0);

  const goldCount = board.reduce((acc, row, r) => {
    return acc + row.filter((c, col) => currentLevel.validMask[r]?.[col] && !c.isObstacle && c.isGold).length;
  }, 0);

  return (
    <div
      className={`relative min-h-screen w-full flex flex-col items-center justify-between text-[#f5ede0] overflow-x-hidden font-pixel ${
        isCrtMode ? 'crt-scanlines' : ''
      }`}
      style={{
        backgroundImage: `url(${bgImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
      }}
    >
      {/* 90s Vignette and Matte Gradient Overlay */}
      <div className="absolute inset-0 bg-radial-gradient from-transparent via-stone-950/40 to-black/85 pointer-events-none" />

      {/* Retro CRT Scanlines CSS effect */}
      {isCrtMode && (
        <div className="absolute inset-0 pointer-events-none z-40 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.35)_50%)] bg-[length:100%_4px]" />
      )}

      {/* TOP HEADER */}
      <TopHeader
        levelTitle={currentLevel.title}
        levelSize={currentLevel.size}
        lives={lives}
        score={score}
        isHammerActive={isHammerActive}
        hammerCount={hammerCount}
        bagCount={bagCount}
        isMuted={isMuted}
        onToggleHammer={() => setIsHammerActive(prev => !prev)}
        onUseBag={handleUseBag}
        onToggleMute={() => {
          sound.isMuted = !sound.isMuted;
          setIsMuted(sound.isMuted);
        }}
        onOpenTutorial={() => setIsTutorialOpen(true)}
        onOpenLevelSelect={() => setIsLevelSelectOpen(true)}
        onOpenCreateCustom={() => setIsCreateCustomOpen(true)}
        onRestart={() => startLevel(currentLevel)}
        onDownloadPlanPdf={handleDownloadPlanPdf}
      />

      {/* MAIN PLAYING ARENA */}
      <div className="relative w-full max-w-5xl mx-auto flex-1 flex flex-col md:flex-row items-center justify-center gap-3 sm:gap-5 px-2 py-1.5 z-10">
        
        {/* Left: Desktop subtitle / info badge */}
        <div className="hidden lg:flex flex-col items-start w-44 p-3.5 pixel-stone-panel text-sm space-y-2">
          <div className="flex items-center justify-between w-full border-b border-[#544333] pb-1">
            <span className="font-pixel font-bold text-[#fbbf24] text-sm">EXPEDITION</span>
            <span className="font-pixel text-xs font-bold text-[#fef08a] bg-[#14110d] px-1.5 py-0.5 border border-[#544333]">
              {currentLevel.size}×{currentLevel.size}
            </span>
          </div>
          <p className="text-xs sm:text-sm text-[#dcd1be] line-clamp-3 leading-snug font-pixel">
            {currentLevel.subtitle}
          </p>
          <div className="pt-1.5 text-xs sm:text-sm text-[#fbbf24] font-pixel font-bold border-t border-[#544333]">
            목표: 석판 {totalValidTiles}개 황금화
          </div>
          <button
            onClick={() => setIsLevelSelectOpen(true)}
            className="w-full mt-1.5 py-1.5 pixel-stone-btn text-[#fde047] text-xs sm:text-sm font-pixel font-bold flex items-center justify-center gap-1.5 hover:text-white"
          >
            <Layers className="w-4 h-4" />
            <span>난이도 변경</span>
          </button>
        </div>

        {/* Center: The Game Board */}
        <div className="relative flex flex-col items-center w-full max-w-[min(94vw,500px)]">
          {/* Mobile Top Status Pill (Time & Gold progress) */}
          <div className="flex md:hidden items-center justify-between w-full max-w-[460px] mb-1.5 px-1">
            <Hourglass timeLeft={timeLeft} maxTime={currentLevel.timeLimit} compact={true} />
            <div className="px-3 py-1.5 pixel-stone-btn font-pixel text-xs sm:text-sm font-bold text-[#fde047] flex items-center gap-1.5">
              <span>☀ GOLD:</span>
              <span className="text-[#fef08a] tabular-nums">{goldCount}/{totalValidTiles}</span>
            </div>
          </div>

          <Board
            board={board}
            size={currentLevel.size}
            validMask={currentLevel.validMask}
            selectedCell={selectedCell}
            isHammerActive={isHammerActive}
            onSelectCell={handleSelectCell}
            onHammerCell={handleHammerCell}
            onSwipeMove={handleSwipeMove}
            isProcessing={isProcessing}
          />

          {/* Floating Toast Notification */}
          {toastMessage && (
            <div className="absolute -bottom-8 md:-bottom-10 px-4 py-2 pixel-gold-btn text-xs sm:text-sm font-pixel font-bold shadow-2xl animate-bounce z-30">
              {toastMessage}
            </div>
          )}
        </div>

        {/* Right: Side Totem + Hourglass (Desktop only) */}
        <div className="hidden md:flex flex-col items-center justify-center gap-3.5">
          <SideTotem
            goldCount={goldCount}
            totalValidTiles={totalValidTiles}
            gemCounts={{
              ruby: 0,
              sapphire: 0,
              emerald: 0,
              topaz: 0,
              diamond: 0,
              amethyst: 0,
              relic: 0,
            }}
          />
          <Hourglass timeLeft={timeLeft} maxTime={currentLevel.timeLimit} />
        </div>
      </div>

      {/* MOBILE CONTROLS & D-PAD (Only on mobile) */}
      <MobileControls
        selectedCell={selectedCell}
        onMove={handleDpadMove}
        onDeselect={() => setSelectedCell(null)}
        isProcessing={isProcessing}
        hammerCount={hammerCount}
        bagCount={bagCount}
        isHammerActive={isHammerActive}
        onToggleHammer={() => setIsHammerActive(prev => !prev)}
        onUseBag={handleUseBag}
        onOpenTutorial={() => setIsTutorialOpen(true)}
        onOpenLevelSelect={() => setIsLevelSelectOpen(true)}
      />

      {/* FOOTER BAR: Retro Controls & Tutorial Trigger (Desktop / Tablet) */}
      <div className="hidden md:flex relative w-full max-w-4xl mx-auto items-center justify-between px-4 py-2.5 text-xs text-[#d4af37] z-20">
        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setIsTutorialOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 pixel-stone-btn text-[#fde047] font-pixel text-xs hover:text-white"
          >
            <HelpCircle className="w-4 h-4 text-yellow-300" />
            <span>도움말 (매뉴얼 & 별점)</span>
          </button>

          <button
            onClick={handleDownloadPlanPdf}
            disabled={isGeneratingPdf}
            className="flex items-center gap-1.5 px-3 py-1.5 pixel-gold-btn text-[#1c1917] font-pixel text-xs font-bold hover:brightness-110 active:translate-y-0.5 transition shadow"
            title="게임 시스템 및 구현 계획서 PDF 다운로드"
          >
            <FileDown className="w-4 h-4" />
            <span>{isGeneratingPdf ? 'PDF 생성 중...' : '계획서 다운로드 (PDF)'}</span>
          </button>

          <button
            onClick={() => setIsLevelSelectOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 pixel-stone-btn text-[#fbbf24] font-pixel text-xs hover:text-white"
          >
            <Layers className="w-4 h-4" />
            <span>난이도 (1~8단계)</span>
          </button>

          <button
            onClick={() => setIsCreateCustomOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 pixel-stone-btn text-[#fef08a] font-pixel text-xs hover:text-white"
          >
            <Plus className="w-4 h-4" />
            <span>커스텀 레벨 추가</span>
          </button>

          <button
            onClick={() => setIsCrtMode(m => !m)}
            className={`flex items-center gap-1.5 px-3 py-1.5 font-pixel text-xs transition ${
              isCrtMode
                ? 'pixel-gold-btn text-black'
                : 'pixel-stone-btn text-stone-300 hover:text-white'
            }`}
          >
            <Monitor className="w-4 h-4" />
            <span>90s CRT Mode {isCrtMode ? 'ON' : 'OFF'}</span>
          </button>
        </div>

        <div className="hidden sm:flex items-center gap-2.5 font-pixel text-xs text-[#a89b88]">
          <span className="text-[#fde047]">GOLD: {goldCount}/{totalValidTiles}</span>
          <span>·</span>
          <span>LVL {currentLevel.levelNumber} ({currentLevel.size}×{currentLevel.size})</span>
        </div>
      </div>

      {/* MODALS */}
      <TutorialModal
        isOpen={isTutorialOpen}
        onClose={() => setIsTutorialOpen(false)}
        onDownloadedToast={showToast}
      />

      <LevelSelectModal
        isOpen={isLevelSelectOpen}
        onClose={() => setIsLevelSelectOpen(false)}
        levels={allLevels}
        currentLevelId={currentLevel.id}
        onSelectLevel={startLevel}
        onOpenCreateCustom={() => {
          setIsLevelSelectOpen(false);
          setIsCreateCustomOpen(true);
        }}
        onDeleteCustomLevel={handleDeleteCustomLevel}
      />

      <CustomLevelModal
        isOpen={isCreateCustomOpen}
        onClose={() => setIsCreateCustomOpen(false)}
        onSaveLevel={handleSaveCustomLevel}
      />

      <VictoryModal
        isOpen={isVictoryOpen}
        score={score}
        levelNumber={currentLevel.levelNumber}
        levelTitle={currentLevel.title}
        stars={earnedStars}
        timeLeft={timeLeft}
        totalTime={currentLevel.timeLimit}
        hasNextLevel={hasNextLevel}
        onNextLevel={handleNextLevel}
        onReplay={() => startLevel(currentLevel)}
      />

      <GameOverModal
        isOpen={isGameOverOpen}
        score={score}
        onRetry={() => {
          setLives(4);
          startLevel(currentLevel);
        }}
      />
    </div>
  );
}
