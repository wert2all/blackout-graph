export type WeekDay = 1 | 2 | 3 | 4 | 5 | 6 | 7;

export type GraphGroups = 'group3';
export interface GraphLightItem {
  time: string;
  type: LightType;
}
export enum LightType {
  BLACKOUT = 'blackout',
  MAYBE_BLACKOUT = 'maybe-blackout',
  NORMAL = 'normal',
}

export type LightItem = GraphLightItem & {
  active: boolean;
  weekday: WeekDay;
  icon: string;
};

export type LightItemWithBlock = LightItem & {
  blockStart: boolean;
  blockEnd: boolean;
};

export const hourToString = (hour: number) =>
  hour < 10 ? `0${hour}:00` : `${hour}:00`;
