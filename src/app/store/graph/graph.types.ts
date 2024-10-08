import { DateTime, WeekdayNumbers } from 'luxon';

import { GraphGroups } from '../../app.types';

export interface GraphLightItem {
  time: string;
  type: LightType;
}

export enum LightType {
  BLACKOUT = 'blackout',
  MAYBE_BLACKOUT = 'maybe-blackout',
  NORMAL = 'normal',
}

export enum LightStatus {
  MAYBE_OFF = 'maybe-off',
  MAYBE_ON = 'maybe-on',
  OFF = 'off',
  ON = 'on',
}

export type LightItem = GraphLightItem & {
  active: boolean;
  weekday: WeekdayNumbers;
  icon: string;
};

interface BlockLimit {
  isStart: boolean;
  isEnd: boolean;
}

export interface BlockItems {
  items: LightItemWithBlock[];
}

type Block = BlockLimit &
  BlockItems & {
    startHour: DateTime | undefined;
    endHour: DateTime | undefined;
    blockMillisDuration: number | undefined;
    blockMillisRest: number | undefined;
    restInPercents: number | undefined;
    toNowDuration: Duration | undefined;
    toEndDuration: Duration | undefined;
  };

export type LightItemWithBlock = LightItem & {
  block: BlockLimit;
};

export interface GraphState {
  isToday: boolean;
  isWeek: boolean;
  selectedWeekDay: WeekdayNumbers | null;
  selectedGroup: GraphGroups;
}

export interface Duration {
  hours: number;
  minutes: number;
}

export type ActiveItem = LightItem & {
  block: Block;
  next: BlockItems & {
    end: string | undefined;
  };
};

export interface WeekGraphWeekDay {
  name: string;
  isActive: boolean;
}

export interface GraphWeek {
  hours: string[];
  weekdays: { weekday: WeekGraphWeekDay; items: LightItem[] }[];
}
export type Graph = Record<
  GraphGroups,
  Record<WeekdayNumbers, GraphLightItem[]>
>;

export const GraphStore: Graph = {
  group3: {
    1: [
      { time: '00:00', type: LightType.MAYBE_BLACKOUT },
      { time: '03:00', type: LightType.BLACKOUT },
      { time: '04:00', type: LightType.BLACKOUT },
      { time: '05:00', type: LightType.BLACKOUT },
      { time: '06:00', type: LightType.BLACKOUT },
      { time: '07:00', type: LightType.MAYBE_BLACKOUT },
      { time: '08:00', type: LightType.MAYBE_BLACKOUT },
      { time: '09:00', type: LightType.MAYBE_BLACKOUT },
      { time: '12:00', type: LightType.BLACKOUT },
      { time: '13:00', type: LightType.BLACKOUT },
      { time: '14:00', type: LightType.BLACKOUT },
      { time: '15:00', type: LightType.BLACKOUT },
      { time: '16:00', type: LightType.MAYBE_BLACKOUT },
      { time: '17:00', type: LightType.MAYBE_BLACKOUT },
      { time: '18:00', type: LightType.MAYBE_BLACKOUT },
      { time: '21:00', type: LightType.BLACKOUT },
      { time: '22:00', type: LightType.BLACKOUT },
      { time: '23:00', type: LightType.BLACKOUT },
    ],
    2: [
      { time: '00:00', type: LightType.BLACKOUT },
      { time: '01:00', type: LightType.MAYBE_BLACKOUT },
      { time: '02:00', type: LightType.MAYBE_BLACKOUT },
      { time: '03:00', type: LightType.MAYBE_BLACKOUT },
      { time: '06:00', type: LightType.BLACKOUT },
      { time: '07:00', type: LightType.BLACKOUT },
      { time: '08:00', type: LightType.BLACKOUT },
      { time: '09:00', type: LightType.BLACKOUT },
      { time: '10:00', type: LightType.MAYBE_BLACKOUT },
      { time: '11:00', type: LightType.MAYBE_BLACKOUT },
      { time: '12:00', type: LightType.MAYBE_BLACKOUT },
      { time: '15:00', type: LightType.BLACKOUT },
      { time: '16:00', type: LightType.BLACKOUT },
      { time: '17:00', type: LightType.BLACKOUT },
      { time: '18:00', type: LightType.BLACKOUT },
      { time: '19:00', type: LightType.MAYBE_BLACKOUT },
      { time: '20:00', type: LightType.MAYBE_BLACKOUT },
      { time: '21:00', type: LightType.MAYBE_BLACKOUT },
    ],
    3: [
      { time: '00:00', type: LightType.BLACKOUT },
      { time: '01:00', type: LightType.BLACKOUT },
      { time: '02:00', type: LightType.BLACKOUT },
      { time: '03:00', type: LightType.BLACKOUT },
      { time: '04:00', type: LightType.MAYBE_BLACKOUT },
      { time: '05:00', type: LightType.MAYBE_BLACKOUT },
      { time: '06:00', type: LightType.MAYBE_BLACKOUT },
      { time: '09:00', type: LightType.BLACKOUT },
      { time: '10:00', type: LightType.BLACKOUT },
      { time: '11:00', type: LightType.BLACKOUT },
      { time: '12:00', type: LightType.BLACKOUT },
      { time: '13:00', type: LightType.MAYBE_BLACKOUT },
      { time: '14:00', type: LightType.MAYBE_BLACKOUT },
      { time: '15:00', type: LightType.MAYBE_BLACKOUT },
      { time: '18:00', type: LightType.BLACKOUT },
      { time: '19:00', type: LightType.BLACKOUT },
      { time: '20:00', type: LightType.BLACKOUT },
      { time: '21:00', type: LightType.BLACKOUT },
      { time: '22:00', type: LightType.MAYBE_BLACKOUT },
      { time: '23:00', type: LightType.MAYBE_BLACKOUT },
    ],
    4: [
      { time: '00:00', type: LightType.MAYBE_BLACKOUT },
      { time: '03:00', type: LightType.BLACKOUT },
      { time: '04:00', type: LightType.BLACKOUT },
      { time: '05:00', type: LightType.BLACKOUT },
      { time: '06:00', type: LightType.BLACKOUT },
      { time: '07:00', type: LightType.MAYBE_BLACKOUT },
      { time: '08:00', type: LightType.MAYBE_BLACKOUT },
      { time: '09:00', type: LightType.MAYBE_BLACKOUT },
      { time: '12:00', type: LightType.BLACKOUT },
      { time: '13:00', type: LightType.BLACKOUT },
      { time: '14:00', type: LightType.BLACKOUT },
      { time: '15:00', type: LightType.BLACKOUT },
      { time: '16:00', type: LightType.MAYBE_BLACKOUT },
      { time: '17:00', type: LightType.MAYBE_BLACKOUT },
      { time: '18:00', type: LightType.MAYBE_BLACKOUT },
      { time: '21:00', type: LightType.BLACKOUT },
      { time: '22:00', type: LightType.BLACKOUT },
      { time: '23:00', type: LightType.BLACKOUT },
    ],
    5: [
      { time: '00:00', type: LightType.BLACKOUT },
      { time: '01:00', type: LightType.MAYBE_BLACKOUT },
      { time: '02:00', type: LightType.MAYBE_BLACKOUT },
      { time: '03:00', type: LightType.MAYBE_BLACKOUT },
      { time: '06:00', type: LightType.BLACKOUT },
      { time: '07:00', type: LightType.BLACKOUT },
      { time: '08:00', type: LightType.BLACKOUT },
      { time: '09:00', type: LightType.BLACKOUT },
      { time: '10:00', type: LightType.MAYBE_BLACKOUT },
      { time: '11:00', type: LightType.MAYBE_BLACKOUT },
      { time: '12:00', type: LightType.MAYBE_BLACKOUT },
      { time: '15:00', type: LightType.BLACKOUT },
      { time: '16:00', type: LightType.BLACKOUT },
      { time: '17:00', type: LightType.BLACKOUT },
      { time: '18:00', type: LightType.BLACKOUT },
      { time: '19:00', type: LightType.MAYBE_BLACKOUT },
      { time: '20:00', type: LightType.MAYBE_BLACKOUT },
      { time: '21:00', type: LightType.MAYBE_BLACKOUT },
    ],
    6: [
      { time: '00:00', type: LightType.BLACKOUT },
      { time: '01:00', type: LightType.BLACKOUT },
      { time: '02:00', type: LightType.BLACKOUT },
      { time: '03:00', type: LightType.BLACKOUT },
      { time: '04:00', type: LightType.MAYBE_BLACKOUT },
      { time: '05:00', type: LightType.MAYBE_BLACKOUT },
      { time: '06:00', type: LightType.MAYBE_BLACKOUT },
      { time: '09:00', type: LightType.BLACKOUT },
      { time: '10:00', type: LightType.BLACKOUT },
      { time: '11:00', type: LightType.BLACKOUT },
      { time: '12:00', type: LightType.BLACKOUT },
      { time: '13:00', type: LightType.MAYBE_BLACKOUT },
      { time: '14:00', type: LightType.MAYBE_BLACKOUT },
      { time: '15:00', type: LightType.MAYBE_BLACKOUT },
      { time: '18:00', type: LightType.BLACKOUT },
      { time: '19:00', type: LightType.BLACKOUT },
      { time: '20:00', type: LightType.BLACKOUT },
      { time: '21:00', type: LightType.BLACKOUT },
      { time: '22:00', type: LightType.MAYBE_BLACKOUT },
      { time: '23:00', type: LightType.MAYBE_BLACKOUT },
    ],
    7: [
      { time: '02:00', type: LightType.BLACKOUT },
      { time: '03:00', type: LightType.BLACKOUT },
      { time: '04:00', type: LightType.BLACKOUT },
      { time: '05:00', type: LightType.MAYBE_BLACKOUT },
      { time: '08:00', type: LightType.BLACKOUT },
      { time: '09:00', type: LightType.BLACKOUT },
      { time: '10:00', type: LightType.BLACKOUT },
      { time: '11:00', type: LightType.MAYBE_BLACKOUT },
      { time: '14:00', type: LightType.BLACKOUT },
      { time: '15:00', type: LightType.BLACKOUT },
      { time: '16:00', type: LightType.BLACKOUT },
      { time: '17:00', type: LightType.MAYBE_BLACKOUT },
      { time: '20:00', type: LightType.BLACKOUT },
      { time: '21:00', type: LightType.BLACKOUT },
      { time: '22:00', type: LightType.BLACKOUT },
      { time: '23:00', type: LightType.MAYBE_BLACKOUT },
    ],
  },
};
