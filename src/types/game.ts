export type GemType = 'ruby' | 'sapphire' | 'emerald' | 'topaz' | 'diamond' | 'amethyst' | 'relic';

export interface Cell {
  r: number;
  c: number;
  type: GemType;
  id: string; // unique ID for smooth animation keys
  isGold: boolean; // has the background tile turned into gold?
  isChained: boolean; // is this gem locked in chains?
  isMatched?: boolean; // currently exploding/matching
  isDropping?: boolean;
  dropDistance?: number;
  isObstacle?: boolean; // out of board bounds or void
}

export type GameState = 'TITLE' | 'PLAYING' | 'PAUSED' | 'VICTORY' | 'GAMEOVER';

export interface BoardPosition {
  r: number;
  c: number;
}

export interface MatchResult {
  matches: BoardPosition[][];
  matchedCells: Set<string>; // 'r,c'
  specialCreated?: { pos: BoardPosition; type: GemType };
}

export interface LevelConfig {
  id: string;
  levelNumber: number;
  size: number; // e.g. 5 for 5x5, 8 for 8x8, 12 for 12x12
  title: string;
  subtitle: string;
  timeLimit: number; // in seconds
  gemTypes: GemType[];
  initialChains: [number, number][]; // coordinates of chained tiles
  validMask: boolean[][]; // size x size boolean mask (true if playable cell, false if void)
  targetScore: number;
  availableHammers: number;
  availableBags: number;
  isCustom?: boolean;
}
