import { TUserSession, TGroupedSessions, TMaxScores } from '../types/user';

export function calculatePercentage(total: number, progress: number): number {
  if (total === 0 || progress === 0) {
      return 0;
  }
  return (progress / total) * 100;
}

export function formatNumber(num: number | string, decimal: boolean = false) {
  const numberValue = parseFloat(num.toString());

  if (isNaN(numberValue)) {
    return 'Número inválido';
  }

  if(decimal) {
    return new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(numberValue);
  }

  return new Intl.NumberFormat('en-US').format(numberValue);
}

export function divideNumberIntoPortions(num: number = 100): number[] {
  const portions = [
    Math.round(num * 0),
    Math.round(num * 0.25),
    Math.round(num * 0.5),
    Math.round(num * 0.75),
    num,
  ];
  return portions;
}

function getMonthName(monthNumber: number): string {
  const months = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre',
  ];
  return months[monthNumber - 1];
}

export function groupSessionsByMonth(sessions: TUserSession[]): TGroupedSessions {
  return sessions.reduce((acc: TGroupedSessions, session: TUserSession) => {
    const monthNumber = parseInt(session.timestamp.slice(5, 7), 10);
    const monthName = getMonthName(monthNumber);

    if (!acc[monthName]) {
      acc[monthName] = [];
    }

    acc[monthName].push(session.score);

    return acc;
  }, {});
}

export function getMonthTextByNumber(monthNumber: string) {
  const newMonthNumber = parseInt(monthNumber.slice(5, 7), 10);
  const monthName = getMonthName(newMonthNumber);
  return monthName;
}

export function getMaxScore(sessions: TUserSession[]): number {
  return sessions.reduce((maxScore, session) => {
    return session.score > maxScore ? session.score : maxScore;
  }, 0);
}

export function getMaxScorePerMonth(monthlyScores: TGroupedSessions): TMaxScores {
  const maxScores: TMaxScores = {};

  for (const month in monthlyScores) {
    if (monthlyScores.hasOwnProperty(month)) {
      const scores = monthlyScores[month];
      maxScores[month] = Math.max(...scores);
    }
  }

  return maxScores;
}


export function getMonthWithHighestScore(maxScores: TMaxScores): string {
  let highestMonth = '';
  let highestScore = -Infinity;

  for (const month in maxScores) {
    if (maxScores[month] > highestScore) {
      highestScore = maxScores[month];
      highestMonth = month;
    }
  }

  return highestMonth;
}
