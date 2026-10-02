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

// Known Historical sequence of starting words (most recent first)
// Epoch: 2025-08-15 UTC is puzzle #1 (or offset accordingly)
export const SEED_PUZZLES: { number: number; date: string; startWord: string }[] = [
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
  const d = new Date(dateStr + 'T08:00:00Z');
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

export function getAllPuzzles(): DailyPuzzle[] {
  return SEED_PUZZLES.map(buildPuzzle);
}

export function getTodayPuzzle(): DailyPuzzle {
  // If today matches a known seed puzzle, return it directly
  const now = new Date();
  const utcHours = now.getUTCHours();
  
  // If current UTC time is before 08:00 UTC, the daily puzzle is technically from the previous calendar day
  const effectiveDate = new Date(now);
  if (utcHours < 8) {
    effectiveDate.setUTCDate(effectiveDate.getUTCDate() - 1);
  }
  
  const yyyy = effectiveDate.getUTCFullYear();
  const mm = String(effectiveDate.getUTCMonth() + 1).padStart(2, '0');
  const dd = String(effectiveDate.getUTCDate()).padStart(2, '0');
  const todayStr = `${yyyy}-${mm}-${dd}`;

  const found = SEED_PUZZLES.find(p => p.date === todayStr);
  if (found) {
    return buildPuzzle(found);
  }

  // If beyond seed list, extrapolate puzzle number from Epoch (#1 = 2025-08-15)
  const epoch = new Date('2025-08-15T08:00:00Z').getTime();
  const currentEpochTime = new Date(`${todayStr}T08:00:00Z`).getTime();
  const daysDiff = Math.floor((currentEpochTime - epoch) / (1000 * 60 * 60 * 24)) + 1;

  // Fallback / extrapolated start word from pool
  const wordPool = ['ICED', 'TEES', 'GAGE', 'PAIN', 'FOES', 'RISE', 'YARD', 'FUNK', 'COLD', 'WARM', 'SAFE', 'CALM', 'DUST', 'ROPE', 'BEAR', 'LACK'];
  const assignedWord = wordPool[Math.abs(daysDiff) % wordPool.length];

  return buildPuzzle({
    number: Math.max(1, daysDiff),
    date: todayStr,
    startWord: assignedWord,
  });
}

export function getYesterdayPuzzle(): DailyPuzzle {
  const today = getTodayPuzzle();
  const prevDate = new Date(`${today.dateStr}T08:00:00Z`);
  prevDate.setUTCDate(prevDate.getUTCDate() - 1);
  
  const yyyy = prevDate.getUTCFullYear();
  const mm = String(prevDate.getUTCMonth() + 1).padStart(2, '0');
  const dd = String(prevDate.getUTCDate()).padStart(2, '0');
  const yesterdayStr = `${yyyy}-${mm}-${dd}`;

  const found = SEED_PUZZLES.find(p => p.date === yesterdayStr);
  if (found) {
    return buildPuzzle(found);
  }

  return buildPuzzle({
    number: today.number - 1,
    date: yesterdayStr,
    startWord: SEED_PUZZLES[1]?.startWord || 'TEES',
  });
}

export function getRecentPuzzles(count: number = 8): DailyPuzzle[] {
  return SEED_PUZZLES.slice(0, count).map(buildPuzzle);
}

