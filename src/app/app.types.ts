import { EffectConfig } from '@ngrx/effects';

export type GraphGroups = 'group3';
export const AppLocale = 'uk';

export type DateString = {} & string;

export const StoreDispatchEffect: EffectConfig & {
  functional: true;
  dispatch?: true;
} = { functional: true };

export const StoreUnDispatchEffect: EffectConfig & {
  functional: true;
  dispatch: false;
} = {
  functional: true,
  dispatch: false,
};

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
