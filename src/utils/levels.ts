import { LevelConfig, GemType } from '../types/game';

// Helper to create square full mask
function createFullMask(size: number): boolean[][] {
  const mask: boolean[][] = [];
  for (let r = 0; r < size; r++) {
    const row: boolean[] = [];
    for (let c = 0; c < size; c++) {
      row.push(true);
    }
    mask.push(row);
  }
  return mask;
}

// Helper to create trimmed corners mask
function createCornerTrimMask(size: number, trim: number): boolean[][] {
  const mask: boolean[][] = [];
  for (let r = 0; r < size; r++) {
    const row: boolean[] = [];
    for (let c = 0; c < size; c++) {
      const topL = r + c < trim;
      const topR = r + (size - 1 - c) < trim;
      const botL = (size - 1 - r) + c < trim;
      const botR = (size - 1 - r) + (size - 1 - c) < trim;
      row.push(!(topL || topR || botL || botR));
    }
    mask.push(row);
  }
  return mask;
}

// 8 Difficulty Stages (5x5 to 12x12)
export const DEFAULT_LEVELS: LevelConfig[] = [
  {
    id: 'stage-1',
    levelNumber: 1,
    size: 5,
    title: 'LEVEL 1 (5×5)',
    subtitle: 'Novice Lagoon (초심자의 산호만)',
    timeLimit: 90,
    gemTypes: ['ruby', 'sapphire', 'emerald', 'topaz'],
    initialChains: [[2, 2]],
    validMask: createFullMask(5),
    targetScore: 3000,
    availableHammers: 2,
    availableBags: 2,
  },
  {
    id: 'stage-2',
    levelNumber: 2,
    size: 6,
    title: 'LEVEL 2 (6×6)',
    subtitle: 'Emerald Ruins (비취빛 유적지)',
    timeLimit: 120,
    gemTypes: ['ruby', 'sapphire', 'emerald', 'topaz', 'diamond'],
    initialChains: [[2, 2], [3, 3]],
    validMask: createCornerTrimMask(6, 1),
    targetScore: 6000,
    availableHammers: 2,
    availableBags: 2,
  },
  {
    id: 'stage-3',
    levelNumber: 3,
    size: 7,
    title: 'LEVEL 3 (7×7)',
    subtitle: 'Sapphire Shrine (사파이어 신단)',
    timeLimit: 140,
    gemTypes: ['ruby', 'sapphire', 'emerald', 'topaz', 'diamond'],
    initialChains: [[2, 3], [3, 2], [3, 4], [4, 3]],
    validMask: createFullMask(7),
    targetScore: 10000,
    availableHammers: 3,
    availableBags: 2,
  },
  {
    id: 'stage-4',
    levelNumber: 4,
    size: 8,
    title: 'LEVEL 4 (8×8)',
    subtitle: 'Golden Citadel (황금 요새 성채)',
    timeLimit: 160,
    gemTypes: ['ruby', 'sapphire', 'emerald', 'topaz', 'diamond', 'amethyst'],
    initialChains: [[2, 2], [2, 5], [5, 2], [5, 5]],
    validMask: createCornerTrimMask(8, 2),
    targetScore: 18000,
    availableHammers: 3,
    availableBags: 2,
  },
  {
    id: 'stage-5',
    levelNumber: 5,
    size: 9,
    title: 'LEVEL 5 (9×9)',
    subtitle: 'Serpent Catacombs (뱀의 지하묘지)',
    timeLimit: 180,
    gemTypes: ['ruby', 'sapphire', 'emerald', 'topaz', 'diamond', 'amethyst'],
    initialChains: [
      [3, 4], [4, 3], [4, 5], [5, 4],
      [2, 2], [2, 6], [6, 2], [6, 6]
    ],
    validMask: createCornerTrimMask(9, 2),
    targetScore: 28000,
    availableHammers: 3,
    availableBags: 2,
  },
  {
    id: 'stage-6',
    levelNumber: 6,
    size: 10,
    title: 'LEVEL 6 (10×10)',
    subtitle: 'Obsidian Temple (흑요석 대성당)',
    timeLimit: 200,
    gemTypes: ['ruby', 'sapphire', 'emerald', 'topaz', 'diamond', 'amethyst'],
    initialChains: [
      [3, 3], [3, 6], [6, 3], [6, 6],
      [4, 4], [4, 5], [5, 4], [5, 5]
    ],
    validMask: createCornerTrimMask(10, 2),
    targetScore: 40000,
    availableHammers: 4,
    availableBags: 3,
  },
  {
    id: 'stage-7',
    levelNumber: 7,
    size: 11,
    title: 'LEVEL 7 (11×11)',
    subtitle: 'The Lost Tomb of Montezuma (몬테주마의 묘)',
    timeLimit: 220,
    gemTypes: ['ruby', 'sapphire', 'emerald', 'topaz', 'diamond', 'amethyst'],
    initialChains: [
      [4, 4], [4, 6], [6, 4], [6, 6],
      [5, 3], [5, 7], [3, 5], [7, 5],
      [2, 5], [8, 5]
    ],
    validMask: createCornerTrimMask(11, 3),
    targetScore: 60000,
    availableHammers: 4,
    availableBags: 3,
  },
  {
    id: 'stage-8',
    levelNumber: 8,
    size: 12,
    title: 'LEVEL 8 (12×12)',
    subtitle: 'Sun God Sanctuary (태양신의 절대 제단)',
    timeLimit: 240,
    gemTypes: ['ruby', 'sapphire', 'emerald', 'topaz', 'diamond', 'amethyst', 'relic'],
    initialChains: [
      [3, 3], [3, 8], [8, 3], [8, 8],
      [4, 5], [4, 6], [7, 5], [7, 6],
      [5, 4], [6, 4], [5, 7], [6, 7]
    ],
    validMask: createCornerTrimMask(12, 3),
    targetScore: 85000,
    availableHammers: 5,
    availableBags: 3,
  },
];

const CUSTOM_LEVELS_KEY = 'jewel_quest_custom_levels_v1';

export function loadSavedCustomLevels(): LevelConfig[] {
  try {
    const raw = localStorage.getItem(CUSTOM_LEVELS_KEY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch (e) {
    console.error('Failed to load custom levels', e);
    return [];
  }
}

export function saveCustomLevel(level: LevelConfig): LevelConfig[] {
  try {
    const existing = loadSavedCustomLevels();
    const updated = [...existing.filter(l => l.id !== level.id), level];
    localStorage.setItem(CUSTOM_LEVELS_KEY, JSON.stringify(updated));
    return updated;
  } catch (e) {
    console.error('Failed to save custom level', e);
    return [];
  }
}

export function deleteCustomLevel(id: string): LevelConfig[] {
  try {
    const existing = loadSavedCustomLevels();
    const updated = existing.filter(l => l.id !== id);
    localStorage.setItem(CUSTOM_LEVELS_KEY, JSON.stringify(updated));
    return updated;
  } catch (e) {
    console.error('Failed to delete custom level', e);
    return [];
  }
}

// Calculate stars based on elapsed time ratio (totalTime - timeLeft) / totalTime
// 가장 빠르게 1/3의 시간 안에 완료: 3개의 별
// 2/3의 시간 안에 완료: 2개의 별
// 그 외 (제한시간 내 완료): 1개의 별
export function calculateStars(timeLeft: number, totalTime: number): number {
  const timeUsed = Math.max(0, totalTime - timeLeft);
  const ratio = totalTime > 0 ? timeUsed / totalTime : 1;

  if (ratio <= 1 / 3) {
    return 3;
  } else if (ratio <= 2 / 3) {
    return 2;
  } else {
    return 1;
  }
}
