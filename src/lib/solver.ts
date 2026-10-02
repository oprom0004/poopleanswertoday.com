import { FOUR_LETTER_WORDS, WORD_SET, WORD_DEFINITIONS } from './dictionary';

export interface StepDiff {
  step: number;
  from: string;
  to: string;
  position: number; // 1-indexed (1, 2, 3, 4)
  fromChar: string;
  toChar: string;
  stepsRemaining: number;
  definition?: string;
}

export interface SolveResult {
  startWord: string;
  targetWord: string;
  isValidStart: boolean;
  minSteps: number;
  optimalPath: string[];
  allOptimalPaths: string[][];
  stepDiffs: StepDiff[];
  hints: {
    stepCount: number;
    firstChangePos: number;
    firstStepWord: string;
  };
  difficulty: 'Easy' | 'Moderate' | 'Tricky' | 'Hard' | 'Brutal';
  traps: {
    word: string;
    reason: string;
  }[];
}

// Check if two words differ by exactly 1 character
export function isOneLetterDiff(w1: string, w2: string): boolean {
  if (w1.length !== 4 || w2.length !== 4) return false;
  let diff = 0;
  for (let i = 0; i < 4; i++) {
    if (w1[i] !== w2[i]) diff++;
    if (diff > 1) return false;
  }
  return diff === 1;
}

// Find position and chars difference
export function getDiffDetails(from: string, to: string): { position: number; fromChar: string; toChar: string } {
  for (let i = 0; i < 4; i++) {
    if (from[i] !== to[i]) {
      return {
        position: i + 1,
        fromChar: from[i].toUpperCase(),
        toChar: to[i].toUpperCase(),
      };
    }
  }
  return { position: 1, fromChar: '', toChar: '' };
}

// Get valid neighbor words from dictionary
export function getNeighbors(word: string, dictSet: Set<string> = WORD_SET): string[] {
  const neighbors: string[] = [];
  const chars = 'abcdefghijklmnopqrstuvwxyz';
  const lower = word.toLowerCase();

  for (let i = 0; i < 4; i++) {
    const originalChar = lower[i];
    for (let c of chars) {
      if (c === originalChar) continue;
      const candidate = lower.slice(0, i) + c + lower.slice(i + 1);
      if (dictSet.has(candidate)) {
        neighbors.push(candidate);
      }
    }
  }
  return neighbors;
}

// Breadth-First Search (BFS) for all shortest paths
export function solvePoople(
  startWordInput: string,
  targetWordInput: string = 'poop',
  dictSet: Set<string> = WORD_SET,
  includeTraps: boolean = true
): SolveResult {
  const start = startWordInput.toLowerCase().trim();
  const target = targetWordInput.toLowerCase().trim();

  // If start is invalid
  if (start.length !== 4 || !dictSet.has(start)) {
    return {
      startWord: start.toUpperCase(),
      targetWord: target.toUpperCase(),
      isValidStart: false,
      minSteps: -1,
      optimalPath: [],
      allOptimalPaths: [],
      stepDiffs: [],
      hints: { stepCount: 0, firstChangePos: 1, firstStepWord: '' },
      difficulty: 'Moderate',
      traps: [],
    };
  }

  if (start === target) {
    return {
      startWord: start.toUpperCase(),
      targetWord: target.toUpperCase(),
      isValidStart: true,
      minSteps: 0,
      optimalPath: [start.toUpperCase()],
      allOptimalPaths: [[start.toUpperCase()]],
      stepDiffs: [],
      hints: { stepCount: 0, firstChangePos: 1, firstStepWord: target.toUpperCase() },
      difficulty: 'Easy',
      traps: [],
    };
  }

  // BFS Queue to find all shortest paths
  const queue: string[][] = [[start]];
  const visitedDist: Map<string, number> = new Map();
  visitedDist.set(start, 0);

  const allOptimalPaths: string[][] = [];
  let foundMinSteps = -1;

  while (queue.length > 0) {
    const currentPath = queue.shift()!;
    const currentWord = currentPath[currentPath.length - 1];
    const currentDist = currentPath.length - 1;

    if (foundMinSteps !== -1 && currentDist >= foundMinSteps) {
      // Don't search further if current distance exceeds shortest found
      if (currentWord === target) {
        allOptimalPaths.push(currentPath.map(w => w.toUpperCase()));
      }
      continue;
    }

    if (currentWord === target) {
      foundMinSteps = currentDist;
      allOptimalPaths.push(currentPath.map(w => w.toUpperCase()));
      continue;
    }

    const neighbors = getNeighbors(currentWord, dictSet);
    for (const neighbor of neighbors) {
      const neighborDist = currentDist + 1;
      const recordedDist = visitedDist.get(neighbor);

      if (recordedDist === undefined || recordedDist >= neighborDist) {
        visitedDist.set(neighbor, neighborDist);
        queue.push([...currentPath, neighbor]);
      }
    }
  }

  const optimalPath = allOptimalPaths.length > 0 ? allOptimalPaths[0] : [];
  const minSteps = optimalPath.length > 0 ? optimalPath.length - 1 : -1;

  // Build step diffs
  const stepDiffs: StepDiff[] = [];
  for (let i = 0; i < optimalPath.length - 1; i++) {
    const from = optimalPath[i];
    const to = optimalPath[i + 1];
    const diff = getDiffDetails(from, to);
    stepDiffs.push({
      step: i + 1,
      from,
      to,
      position: diff.position,
      fromChar: diff.fromChar,
      toChar: diff.toChar,
      stepsRemaining: optimalPath.length - 1 - (i + 1),
      definition: WORD_DEFINITIONS[to.toLowerCase()],
    });
  }

  // Traps analysis on first step (only when includeTraps is true to avoid infinite recursion)
  const traps: { word: string; reason: string }[] = [];
  if (includeTraps) {
    const firstNeighbors = getNeighbors(start, dictSet);
    const optimalFirstWords = new Set(allOptimalPaths.map(p => p[1]?.toLowerCase()));

    for (const n of firstNeighbors) {
      if (!optimalFirstWords.has(n)) {
        // Calculate distance of this neighbor without recursion
        const subSolve = solvePoople(n, target, dictSet, false);
        if (subSolve.minSteps === -1) {
          traps.push({ word: n.toUpperCase(), reason: 'Dead end: cannot reach POOP directly' });
        } else {
          traps.push({
            word: n.toUpperCase(),
            reason: `Suboptimal move: takes ${subSolve.minSteps + 1} steps (${subSolve.minSteps + 1 - minSteps} step longer)`,
          });
        }
      }
    }
  }


  // Difficulty rating
  let difficulty: 'Easy' | 'Moderate' | 'Tricky' | 'Hard' | 'Brutal' = 'Moderate';
  if (minSteps <= 4) difficulty = 'Easy';
  else if (minSteps === 5) difficulty = 'Moderate';
  else if (minSteps === 6) difficulty = 'Tricky';
  else if (minSteps === 7) difficulty = 'Hard';
  else difficulty = 'Brutal';

  const firstStepDiff = stepDiffs[0];

  return {
    startWord: start.toUpperCase(),
    targetWord: target.toUpperCase(),
    isValidStart: true,
    minSteps,
    optimalPath,
    allOptimalPaths,
    stepDiffs,
    hints: {
      stepCount: minSteps,
      firstChangePos: firstStepDiff ? firstStepDiff.position : 1,
      firstStepWord: optimalPath[1] || '',
    },
    difficulty,
    traps: traps.slice(0, 4), // Top 4 traps
  };
}
