import { Injectable } from '@angular/core';

import {
  GraphGroups,
  GraphLightItem,
  LightItem,
  LightType,
  WeekDay,
} from '../app.types';

type Graph = Record<GraphGroups, Record<WeekDay, GraphLightItem[]>>;

@Injectable({ providedIn: 'root' })
export class GraphService {
  private readonly graph: Graph = {
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
  getLightItems(
    group: GraphGroups,
    weekday: WeekDay,
    hour: number,
  ): LightItem[] {
    const currentWeekDay = weekday;
    const previousWeekDay = this.getPreviousWeekDay(weekday);

    const currentWeekdayItems = this.graph[group][weekday];
    const previousWeekdayItems = this.graph[group][previousWeekDay];

    const previousItems = this.getListItems(
      previousWeekdayItems,
      previousWeekDay,
    );
    const currentItems = this.getListItems(currentWeekdayItems, currentWeekDay);

    return [...previousItems, ...currentItems];
  }
  private getPreviousWeekDay(weekday: WeekDay): WeekDay {
    return weekday === 1 ? 7 : ((weekday - 1) as WeekDay);
  }

  private generateTime(): string[] {
    return Array.from({ length: 24 }, (_, i) => i).map(
      (hour) => (hour < 10 ? '0' : '') + `${hour}:00`,
    );
  }

  private getListItems(items: GraphLightItem[], weekday: WeekDay): LightItem[] {
    return this.generateTime()
      .map(
        (time) =>
          items.find((item) => item.time === time) || {
            time,
            type: LightType.NORMAL,
          },
      )
      .map((item) => ({
        ...item,
        weekday: weekday,
      }));
  }
}
