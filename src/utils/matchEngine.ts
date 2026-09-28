import { Cell, GemType, LevelConfig, BoardPosition, MatchResult } from '../types/game';

let idCounter = 1;
export function generateCellId(): string {
  return `gem-${idCounter++}`;
}

const DEFAULT_GEM_TYPES: GemType[] = ['ruby', 'sapphire', 'emerald', 'topaz'];

export function createRandomGem(types?: GemType[]): GemType {
  const pool = (types && types.length > 0) ? types : DEFAULT_GEM_TYPES;
  const idx = Math.floor(Math.random() * pool.length);
  return pool[idx] || 'ruby';
}

// Generate a gem type strictly different from avoidType to prevent >= 2 consecutive vertical blocks
export function createSafeGem(types?: GemType[], avoidType?: GemType | null): GemType {
  const baseTypes = (types && types.length > 0) ? types : DEFAULT_GEM_TYPES;
  const pool = avoidType ? baseTypes.filter(t => t !== avoidType) : baseTypes;
  const targetPool = pool.length > 0 ? pool : baseTypes;
  const idx = Math.floor(Math.random() * targetPool.length);
  return targetPool[idx] || 'ruby';
}

// Generate board without pre-existing matches
export function initBoard(level: LevelConfig): Cell[][] {
  const size = level.size || level.validMask.length || 8;
  const rows = size;
  const cols = size;
  const chainedSet = new Set(level.initialChains.map(([r, c]) => `${r},${c}`));

  // Generate initial board
  const board: Cell[][] = [];
  for (let r = 0; r < rows; r++) {
    const row: Cell[] = [];
    for (let c = 0; c < cols; c++) {
      const isValid = level.validMask[r]?.[c] ?? false;
      if (!isValid) {
        row.push({
          r,
          c,
          type: 'ruby',
          id: generateCellId(),
          isGold: false,
          isChained: false,
          isObstacle: true,
          isMatched: false,
        });
      } else {
        const available = [...level.gemTypes].sort(() => Math.random() - 0.5);
        row.push({
          r,
          c,
          type: available[0] || createRandomGem(level.gemTypes),
          id: generateCellId(),
          isGold: false,
          isChained: chainedSet.has(`${r},${c}`),
          isObstacle: false,
          isMatched: false,
        });
      }
    }
    board.push(row);
  }

  // Eliminate any pre-existing 3+ connected clusters
  for (let attempt = 0; attempt < 40; attempt++) {
    const matches = findMatches(board, level.validMask);
    if (matches.matchedCells.size === 0) break;

    for (const group of matches.matches) {
      // Pick cell in cluster and assign a different random gem
      const target = group[Math.floor(group.length / 2)];
      if (!board[target.r][target.c].isObstacle) {
        const otherTypes = level.gemTypes.filter(t => t !== board[target.r][target.c].type);
        if (otherTypes.length > 0) {
          board[target.r][target.c].type = otherTypes[Math.floor(Math.random() * otherTypes.length)];
        }
      }
    }
  }

  // Ensure at least one valid swap move exists
  const moves = findPossibleMoves(board, level.validMask);
  if (moves.length === 0) {
    return shuffleBoard(board, level.validMask, level.gemTypes);
  }

  return board;
}

// Score calculation: 3 or 4 gems per match group (5+ cannot connect)
export function calculateMatchScore(groupSize: number, combo: number): number {
  let baseScore: number;
  if (groupSize === 3) {
    baseScore = 300; // 100 per gem (1x3 or 3x1 line)
  } else {
    // 4 gems match: 1x4 line, 4x1 line, or 2x2 square
    baseScore = 600; // 150 per gem
  }
  return baseScore * combo;
}

// Find matches: 
// 1. Straight lines (가로/세로 일자형 최소 1x3, 최대 4개 제한)
// 2. Square (정사각형 2x2)
// 3. Strictly NO diagonals (대각선 매칭 제외)
export function findMatches(board: Cell[][], validMask: boolean[][]): MatchResult {
  const rows = board.length;
  const cols = board[0].length;
  const matchedPositions = new Set<string>();
  const matchGroups: BoardPosition[][] = [];

  // Helper to check if a cell can be matched
  const isMatchable = (r: number, c: number): boolean => {
    const cell = board[r]?.[c];
    return !!(validMask[r]?.[c] && cell && !cell.isObstacle && cell.type !== 'relic');
  };

  // 1. Horizontal straight lines (가로 일자형, 최소 1x3, 최대 4개)
  for (let r = 0; r < rows; r++) {
    let c = 0;
    while (c < cols) {
      if (!isMatchable(r, c)) {
        c++;
        continue;
      }

      const targetType = board[r][c].type;
      let end = c + 1;
      while (end < cols && isMatchable(r, end) && board[r][end].type === targetType) {
        end++;
      }

      const runLength = end - c;
      if (runLength >= 3) {
        if (runLength >= 6) {
          // Two separate 3-matches
          const g1: BoardPosition[] = [{ r, c }, { r, c: c + 1 }, { r, c: c + 2 }];
          const g2: BoardPosition[] = [{ r, c: c + 3 }, { r, c: c + 4 }, { r, c: c + 5 }];
          matchGroups.push(g1, g2);
          for (let i = 0; i < 6; i++) {
            matchedPositions.add(`${r},${c + i}`);
          }
        } else {
          // 3, 4, or 5 (capped at 4 per "5개 이상은 연결 안되겠다" rule)
          const matchLen = Math.min(runLength, 4);
          const group: BoardPosition[] = [];
          for (let i = 0; i < matchLen; i++) {
            group.push({ r, c: c + i });
            matchedPositions.add(`${r},${c + i}`);
          }
          matchGroups.push(group);
        }
      }

      c = end;
    }
  }

  // 2. Vertical straight lines (세로 일자형, 최소 3x1, 최대 4개)
  for (let c = 0; c < cols; c++) {
    let r = 0;
    while (r < rows) {
      if (!isMatchable(r, c)) {
        r++;
        continue;
      }

      const targetType = board[r][c].type;
      let end = r + 1;
      while (end < rows && isMatchable(end, c) && board[end][c].type === targetType) {
        end++;
      }

      const runLength = end - r;
      if (runLength >= 3) {
        if (runLength >= 6) {
          const g1: BoardPosition[] = [{ r, c }, { r: r + 1, c }, { r: r + 2, c }];
          const g2: BoardPosition[] = [{ r: r + 3, c }, { r: r + 4, c }, { r: r + 5, c }];
          matchGroups.push(g1, g2);
          for (let i = 0; i < 6; i++) {
            matchedPositions.add(`${r + i},${c}`);
          }
        } else {
          // 3, 4, or 5 (capped at 4 per "5개 이상은 연결 안되겠다" rule)
          const matchLen = Math.min(runLength, 4);
          const group: BoardPosition[] = [];
          for (let i = 0; i < matchLen; i++) {
            group.push({ r: r + i, c });
            matchedPositions.add(`${r + i},${c}`);
          }
          matchGroups.push(group);
        }
      }

      r = end;
    }
  }

  // 3. 2x2 Square matches (정사각형 2x2, 대각선 제외)
  for (let r = 0; r < rows - 1; r++) {
    for (let c = 0; c < cols - 1; c++) {
      if (
        !isMatchable(r, c) ||
        !isMatchable(r, c + 1) ||
        !isMatchable(r + 1, c) ||
        !isMatchable(r + 1, c + 1)
      ) {
        continue;
      }

      const targetType = board[r][c].type;
      if (
        board[r][c + 1].type === targetType &&
        board[r + 1][c].type === targetType &&
        board[r + 1][c + 1].type === targetType
      ) {
        const squareGroup: BoardPosition[] = [
          { r, c },
          { r, c: c + 1 },
          { r: r + 1, c },
          { r: r + 1, c: c + 1 },
        ];

        // If not all 4 cells are already consumed by straight lines, add this 2x2 match
        const allAlreadyInLines = squareGroup.every(pos => matchedPositions.has(`${pos.r},${pos.c}`));
        if (!allAlreadyInLines) {
          matchGroups.push(squareGroup);
          for (const pos of squareGroup) {
            matchedPositions.add(`${pos.r},${pos.c}`);
          }
        }
      }
    }
  }

  // Check for 4 matches to spawn a special artifact relic
  let specialCreated: { pos: BoardPosition; type: GemType } | undefined;
  for (const group of matchGroups) {
    if (group.length === 4) {
      specialCreated = {
        pos: group[Math.floor(group.length / 2)],
        type: 'relic',
      };
      break;
    }
  }

  return {
    matches: matchGroups,
    matchedCells: matchedPositions,
    specialCreated,
  };
}

// Check if swap produces a match or involves special relic
export function checkSwapProducesMatch(
  r1: number,
  c1: number,
  r2: number,
  c2: number,
  board: Cell[][],
  validMask: boolean[][]
): boolean {
  if (board[r1]?.[c1]?.isChained || board[r2]?.[c2]?.isChained) {
    return false;
  }
  if (board[r1]?.[c1]?.isObstacle || board[r2]?.[c2]?.isObstacle) {
    return false;
  }

  // Special relic matches with anything
  if (board[r1]?.[c1]?.type === 'relic' || board[r2]?.[c2]?.type === 'relic') {
    return true;
  }

  // Simulate swap in a shallow cloned board
  const cloned = board.map(row => row.map(cell => ({ ...cell })));
  const tempType = cloned[r1][c1].type;
  cloned[r1][c1].type = cloned[r2][c2].type;
  cloned[r2][c2].type = tempType;

  const res = findMatches(cloned, validMask);
  return res.matchedCells.size > 0;
}

// Check if any valid moves remain
export function findPossibleMoves(board: Cell[][], validMask: boolean[][]): BoardPosition[][] {
  const moves: BoardPosition[][] = [];
  const rows = board.length;
  const cols = board[0].length;

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (!validMask[r]?.[c] || board[r][c].isObstacle || board[r][c].isChained) continue;

      // Check right swap
      if (c + 1 < cols && validMask[r]?.[c + 1] && !board[r][c + 1].isObstacle && !board[r][c + 1].isChained) {
        if (checkSwapProducesMatch(r, c, r, c + 1, board, validMask)) {
          moves.push([{ r, c }, { r, c: c + 1 }]);
        }
      }
      // Check down swap
      if (r + 1 < rows && validMask[r + 1]?.[c] && !board[r + 1][c].isObstacle && !board[r + 1][c].isChained) {
        if (checkSwapProducesMatch(r, c, r + 1, c, board, validMask)) {
          moves.push([{ r, c }, { r: r + 1, c }]);
        }
      }
    }
  }

  return moves;
}

// Shuffle board when deadlock occurs
export function shuffleBoard(board: Cell[][], validMask: boolean[][], gemTypes: GemType[]): Cell[][] {
  const newBoard = board.map(row => row.map(cell => ({ ...cell })));
  const rows = newBoard.length;
  const cols = newBoard[0].length;
  const validCells: Cell[] = [];

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (validMask[r]?.[c] && !newBoard[r][c].isObstacle && !newBoard[r][c].isChained) {
        validCells.push(newBoard[r][c]);
      }
    }
  }

  // Shuffle gem types among valid unchained cells
  for (let attempt = 0; attempt < 25; attempt++) {
    const gemPool = validCells.map(c => c.type).sort(() => Math.random() - 0.5);
    validCells.forEach((c, idx) => {
      c.type = gemPool[idx] || createRandomGem(gemTypes);
      c.isMatched = false;
      c.id = generateCellId();
    });

    const matches = findMatches(newBoard, validMask);
    if (matches.matchedCells.size === 0) {
      const moves = findPossibleMoves(newBoard, validMask);
      if (moves.length > 0) {
        return newBoard;
      }
    }
  }

  // Fallback: regenerate valid cells
  validCells.forEach(cell => {
    cell.type = createRandomGem(gemTypes);
    cell.isMatched = false;
    cell.id = generateCellId();
  });

  return newBoard;
}
