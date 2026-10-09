export type Level = {
  level: number;
  name: string;
  minScore: number;
  maxScore: number;
  color: string;
};

export const LEVELS: Level[] = [
  { level: 1, name: 'Novato', minScore: 0, maxScore: 500, color: '#6B7280' },
  { level: 2, name: 'Aprendiz', minScore: 500, maxScore: 1500, color: '#10B981' },
  { level: 3, name: 'Jugador', minScore: 1500, maxScore: 3000, color: '#3B82F6' },
  { level: 4, name: 'Veterano', minScore: 3000, maxScore: 5000, color: '#8B5CF6' },
  { level: 5, name: 'Experto', minScore: 5000, maxScore: 8000, color: '#F59E0B' },
  { level: 6, name: 'Maestro', minScore: 8000, maxScore: 12000, color: '#EF4444' },
  { level: 7, name: 'Leyenda', minScore: 12000, maxScore: Infinity, color: '#EC4899' },
];

export function getUserLevel(score: number): Level {
  for (let i = LEVELS.length - 1; i >= 0; i--) {
    if (score >= LEVELS[i].minScore) return LEVELS[i];
  }
  return LEVELS[0];
}

export function getLevelProgress(score: number): number {
  const level = getUserLevel(score);
  const nextLevel = LEVELS.find(l => l.level === level.level + 1);
  if (!nextLevel) return 100;
  return ((score - level.minScore) / (nextLevel.minScore - level.minScore)) * 100;
}
