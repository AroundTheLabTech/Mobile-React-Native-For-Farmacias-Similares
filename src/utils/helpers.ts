import { TUserSession, TGroupedSessions, TMaxScores, TTopTwenty, TLeaderBoard } from '../types/user';

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

  if (decimal) {
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

export function formarGameCardNumber(number: number): string {

  if (!number) {
    return null;
  }

  let numberString = number.toString();
  let formattedString = '';

  for (let i = numberString.length; i > 0; i -= 4) {
    const start = Math.max(0, i - 4);
    const segment = numberString.slice(start, i);
    formattedString = segment + (formattedString ? '-' : '') + formattedString;
  }

  return formattedString;
}

export function splitTopTwenty(topTwenty: TTopTwenty[]): { topThree: TLeaderBoard[], topRest: TLeaderBoard[], all: TLeaderBoard[] } {
  // Dividir el array en el top 3 y el resto (top 4-20)
  const topThree = topTwenty.slice(0, 3).map((item, index) => ({
    ...item,
    position: index + 1,
  }));

  const topRest = topTwenty.slice(3).map((item, index) => ({
    ...item,
    position: index + 4,
  }));

  const all = topTwenty.map((item, index) => ({
    ...item,
    position: index + 1,
  }));

  return {
    topThree,
    topRest,
    all,
  };
}

export function calculatePercent(valor: number, min: number, max: number): number {
  return ((valor - min) / (max - min)) * 100;
}

export function validateObjectValues(obj: Record<string, any>): boolean {
  for (const key in obj) {
    const value = obj[key];

    if (value === null || value === undefined) {
      console.log(`La clave "${key}" no tiene un valor válido.`);
      return false;
    }

    if (typeof value === 'string') {
      if (value.trim() === '') {
        console.log(`La clave "${key}" tiene una cadena vacía.`);
        return false;
      }
    } else if (typeof value === 'number') {
      if (isNaN(value)) {
        console.log(`La clave "${key}" tiene un número no válido.`);
        return false;
      }
    } else {
      console.log(`La clave "${key}" tiene un tipo no soportado (${typeof value}).`);
      return false;
    }
  }

  // Si todas las claves pasan las validaciones
  return true;
}

export const calculateScreenSizeInInches = (Dimensions, PixelRatio) => {
  const { width, height } = Dimensions.get('screen');
  const pixelDensity = PixelRatio.get();
  const dpi = pixelDensity * 160;

  const widthInInches = width / dpi;
  const heightInInches = height / dpi;

  const screenSizeInInches = Math.sqrt(
    Math.pow(widthInInches, 2) + Math.pow(heightInInches, 2)
  );

  return screenSizeInInches.toFixed(2);
};


