export type WeekDay = 1 | 2 | 3 | 4 | 5 | 6 | 7;

export type GraphGroups = 'group3';

export const hourToString = (hour: number) =>
  hour < 10 ? `0${hour}:00` : `${hour}:00`;

export const toPercents = (
  rest: number | undefined,
  all: number | undefined,
): number | undefined => {
  if (rest == undefined || all == undefined) {
    return undefined;
  }
  return (rest / all) * 100;
};
