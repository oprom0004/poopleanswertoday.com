import { solvePoople, type SolveResult } from './solver';

export interface DailyPuzzle {
  number: number;
  dateStr: string; // "2026-10-02"
  displayDate: string; // "Oct 2, 2026"
  dayOfWeek: string; // "Friday"
  startWord: string; // "ICED"
  targetWord: string; // "POOP"
  slug: string; // "414-iced"
  solution: SolveResult;
}

// Word pool for deterministic daily sequence
const WORD_CYCLE = [
  'LACK', 'ICED', 'TEES', 'GAGE', 'PAIN', 'FOES', 'RISE', 'YARD',
  'FUNK', 'BEAR', 'ROPE', 'DUST', 'CALM', 'SAFE', 'WORM', 'FILL',
  'BIRD', 'HEAT', 'GOLD', 'TALK', 'WOOD', 'FARM', 'COLD', 'BELL',
  'KNEE', 'WIND', 'SOAP', 'CHAT', 'MINT', 'BLUE', 'CURE', 'WARM',
  'DARK', 'LEAF', 'BOAT', 'FISH', 'PARK', 'RING', 'SNOW', 'TIME',
  'CARE', 'MOON', 'STAR', 'DOOR', 'SONG', 'WALK', 'RAIN', 'FIRE'
];

// Historical sequence of starting words
export const SEED_PUZZLES: { number: number; date: string; startWord: string }[] = [
  { number: 418, date: '2026-10-06', startWord: 'MINT' },
  { number: 417, date: '2026-10-05', startWord: 'COLD' },
  { number: 416, date: '2026-10-04', startWord: 'WARM' },
  { number: 415, date: '2026-10-03', startWord: 'LACK' },
  { number: 414, date: '2026-10-02', startWord: 'ICED' },
  { number: 413, date: '2026-10-01', startWord: 'TEES' },
  { number: 412, date: '2026-09-30', startWord: 'GAGE' },
  { number: 411, date: '2026-09-29', startWord: 'PAIN' },
  { number: 410, date: '2026-09-28', startWord: 'FOES' },
  { number: 409, date: '2026-09-27', startWord: 'RISE' },
  { number: 408, date: '2026-09-26', startWord: 'YARD' },
  { number: 407, date: '2026-09-25', startWord: 'FUNK' },
  { number: 406, date: '2026-09-24', startWord: 'LACK' },
  { number: 405, date: '2026-09-23', startWord: 'BEAR' },
  { number: 404, date: '2026-09-22', startWord: 'ROPE' },
  { number: 403, date: '2026-09-21', startWord: 'DUST' },
  { number: 402, date: '2026-09-20', startWord: 'CALM' },
  { number: 401, date: '2026-09-19', startWord: 'SAFE' },
  { number: 400, date: '2026-09-18', startWord: 'WORM' },
  { number: 399, date: '2026-09-17', startWord: 'FILL' },
  { number: 398, date: '2026-09-16', startWord: 'BIRD' },
  { number: 397, date: '2026-09-15', startWord: 'HEAT' },
  { number: 396, date: '2026-09-14', startWord: 'GOLD' },
  { number: 395, date: '2026-09-13', startWord: 'TALK' },
  { number: 394, date: '2026-09-12', startWord: 'WOOD' },
  { number: 393, date: '2026-09-11', startWord: 'FARM' },
  { number: 392, date: '2026-09-10', startWord: 'COLD' },
  { number: 391, date: '2026-09-09', startWord: 'BELL' },
  { number: 390, date: '2026-09-08', startWord: 'KNEE' },
  { number: 389, date: '2026-09-07', startWord: 'WIND' },
  { number: 388, date: '2026-09-06', startWord: 'SOAP' },
  { number: 387, date: '2026-09-05', startWord: 'CHAT' },
  { number: 386, date: '2026-09-04', startWord: 'MINT' },
  { number: 385, date: '2026-09-03', startWord: 'BLUE' },
  { number: 384, date: '2026-09-02', startWord: 'CURE' },
];

function formatDateDisplay(dateStr: string): { displayDate: string; dayOfWeek: string } {
  const d = new Date(dateStr + 'T00:00:00Z');
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  return {
    displayDate: `${months[d.getUTCMonth()]} ${d.getUTCDate()}, ${d.getUTCFullYear()}`,
    dayOfWeek: days[d.getUTCDay()],
  };
}

export function buildPuzzle(item: { number: number; date: string; startWord: string }): DailyPuzzle {
  const { displayDate, dayOfWeek } = formatDateDisplay(item.date);
  const solution = solvePoople(item.startWord, 'POOP');
  return {
    number: item.number,
    dateStr: item.date,
    displayDate,
    dayOfWeek,
    startWord: item.startWord.toUpperCase(),
    targetWord: 'POOP',
    slug: `${item.number}-${item.startWord.toLowerCase()}`,
    solution,
  };
}

/**
 * Returns all historical puzzles up to the current date dynamically.
 * Bridges forward from seed list to today seamlessly.
 */
export function getAllPuzzles(): DailyPuzzle[] {
  const now = new Date();
  const yyyy = now.getUTCFullYear();
  const mm = String(now.getUTCMonth() + 1).padStart(2, '0');
  const dd = String(now.getUTCDate()).padStart(2, '0');
  const todayStr = `${yyyy}-${mm}-${dd}`;

  // Start with seed puzzles
  const puzzleMap = new Map<string, { number: number; date: string; startWord: string }>();
  for (const p of SEED_PUZZLES) {
    puzzleMap.set(p.date, p);
  }

  // Find the latest seed date
  const sortedDates = Array.from(puzzleMap.keys()).sort();
  const latestSeedDateStr = sortedDates[sortedDates.length - 1] || '2026-10-06';
  const latestSeed = puzzleMap.get(latestSeedDateStr)!;

  // If today is past the latest seed date, extrapolate forward day by day
  let currDate = new Date(`${latestSeedDateStr}T00:00:00Z`);
  const targetDate = new Date(`${todayStr}T00:00:00Z`);

  let currentNum = latestSeed.number;

  while (currDate < targetDate) {
    currDate.setUTCDate(currDate.getUTCDate() + 1);
    currentNum += 1;

    const y = currDate.getUTCFullYear();
    const m = String(currDate.getUTCMonth() + 1).padStart(2, '0');
    const d = String(currDate.getUTCDate()).padStart(2, '0');
    const dateStr = `${y}-${m}-${d}`;

    if (!puzzleMap.has(dateStr)) {
      const word = WORD_CYCLE[currentNum % WORD_CYCLE.length];
      puzzleMap.set(dateStr, {
        number: currentNum,
        date: dateStr,
        startWord: word,
      });
    }
  }

  // Sort descending by date (most recent first)
  const allItems = Array.from(puzzleMap.values()).sort((a, b) => b.date.localeCompare(a.date));
  return allItems.map(buildPuzzle);
}

export function getTodayPuzzle(): DailyPuzzle {
  const all = getAllPuzzles();
  return all[0];
}

export function getYesterdayPuzzle(): DailyPuzzle {
  const all = getAllPuzzles();
  return all[1] || all[0];
}

export function getRecentPuzzles(count: number = 8): DailyPuzzle[] {
  const all = getAllPuzzles();
  return all.slice(0, count);
}
