import { Injectable } from '@angular/core';

import { GraphGroups, LightItem, LightType, WeekDay } from '../app.types';

type Graph = Record<GraphGroups, Record<WeekDay, LightItem[]>>;

@Injectable({ providedIn: 'root' })
export class GraphService {
  private readonly graph: Graph = {
    group3: {
      1: [],
      2: [],
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
      6: [],
      7: [],
    },
  };
  getLightItems(
    group: GraphGroups,
    weekday: WeekDay,
    hour: number,
  ): LightItem[] {
    const groupItems = this.graph[group][weekday];
    const listTime = this.generateTime();
    return listTime.map(
      (time) =>
        groupItems.find((item) => item.time === time) || {
          time,
          type: LightType.NORMAL,
        },
    );
  }
  private generateTime(): string[] {
    return Array.from({ length: 24 }, (_, i) => i).map(
      (hour) => (hour < 10 ? '0' : '') + `${hour}:00`,
    );
  }
}
