export type WeekDay = 1 | 2 | 3 | 4 | 5 | 6 | 7;

export type GraphGroups = 'group3';

export enum LightType {
  BLACKOUT = 'blackout',
  MAYBE_BLACKOUT = 'maybe-blackout',
  NORMAL = 'normal',
}

export interface LightItem {
  time: string;
  type: LightType;
}
