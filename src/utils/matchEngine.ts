import { Cell, GemType, LevelConfig, BoardPosition, MatchResult } from '../types/game';

let idCounter = 1;
export function generateCellId(): string {
  return `gem-${idCounter++}`;
}

export function createRandomGem(types: GemType[]): GemType {
  const idx = Math.floor(Math.random() * types.length);
  return types[idx];
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
        });
      } else {
        const available = [...level.gemTypes].sort(() => Math.random() - 0.5);
        row.push({
          r,
          c,
          type: available[0],
          id: generateCellId(),
          isGold: false,
          isChained: chainedSet.has(`${r},${c}`),
          isObstacle: false,
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

// Find all matches on board: 3 or more connected gems (orthogonal or diagonal: lines, X-shapes, 2x2 squares, clusters)
const ADJACENT_DIRECTIONS = [
  [-1, 0], [1, 0], [0, -1], [0, 1], // Up, Down, Left, Right
  [-1, -1], [-1, 1], [1, -1], [1, 1], // Diagonals (X-shapes, diagonal chains)
];

// Progressive score calculation based on cluster size and combo
export function calculateMatchScore(groupSize: number, combo: number): number {
  let baseScore: number;
  if (groupSize === 3) {
    baseScore = 300; // 100 per gem
  } else if (groupSize === 4) {
    baseScore = 600; // 150 per gem (2x value of 3-match)
  } else if (groupSize === 5) {
    baseScore = 1000; // 200 per gem
  } else if (groupSize === 6) {
    baseScore = 1600; // 267 per gem
  } else if (groupSize === 7) {
    baseScore = 2400; // 343 per gem
  } else if (groupSize === 8) {
    baseScore = 3500; // 437 per gem
  } else {
    // 9+ massive cluster bonus
    baseScore = 3500 + (groupSize - 8) * 600;
  }
  return baseScore * combo;
}

export function findMatches(board: Cell[][], validMask: boolean[][]): MatchResult {
  const rows = board.length;
  const cols = board[0].length;
  const matchedPositions = new Set<string>();
  const matchGroups: BoardPosition[][] = [];
  const visited = Array.from({ length: rows }, () => Array(cols).fill(false));

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (visited[r][c]) continue;
      const startCell = board[r]?.[c];
      const isValid = validMask[r]?.[c] && startCell && !startCell.isObstacle;

      if (!isValid) {
        visited[r][c] = true;
        continue;
      }

      // BFS to find all 8-directionally connected gems of identical type
      const targetType = startCell.type;
      const component: BoardPosition[] = [];
      const queue: BoardPosition[] = [{ r, c }];
      visited[r][c] = true;

      while (queue.length > 0) {
        const curr = queue.shift()!;
        component.push(curr);

        for (const [dr, dc] of ADJACENT_DIRECTIONS) {
          const nr = curr.r + dr;
          const nc = curr.c + dc;

          if (
            nr >= 0 &&
            nr < rows &&
            nc >= 0 &&
            nc < cols &&
            !visited[nr][nc] &&
            validMask[nr]?.[nc] &&
            !board[nr][nc].isObstacle &&
            board[nr][nc].type === targetType
          ) {
            visited[nr][nc] = true;
            queue.push({ r: nr, c: nc });
          }
        }
      }

      // Any cluster of 3 or more is a match (lines, X, squares, L, T, clusters)
      if (component.length >= 3) {
        matchGroups.push(component);
        for (const pos of component) {
          matchedPositions.add(`${pos.r},${pos.c}`);
        }
      }
    }
  }

  // Check for 4 or more matches to spawn a special artifact relic
  let specialCreated: { pos: BoardPosition; type: GemType } | undefined;
  for (const group of matchGroups) {
    if (group.length >= 4) {
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
      c.type = gemPool[idx];
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
    cell.id = generateCellId();
  });

  return newBoard;
}
