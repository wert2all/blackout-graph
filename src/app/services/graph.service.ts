import { Injectable } from '@angular/core';

import {
  GraphGroups,
  GraphLightItem,
  LightItem,
  LightType,
  WeekDay,
} from '../app.types';
import { GraphStore } from './graph.store';

@Injectable({ providedIn: 'root' })
export class GraphService {
  private readonly graph = GraphStore;

  getLightItems(
    group: GraphGroups,
    weekday: WeekDay,
    hour: number,
  ): LightItem[] {
    const hourString = hour < 10 ? `0${hour}:00` : `${hour}:00`;
    const currentWeekDay = weekday;
    const previousWeekDay = this.getPreviousWeekDay(currentWeekDay);
    const nextWeekDay = this.getNextWeekDay(currentWeekDay);

    const currentWeekdayItems = this.graph[group][weekday];
    const previousWeekdayItems = this.graph[group][previousWeekDay];
    const newWeekdayItems = this.graph[group][nextWeekDay];

    const currentItems = this.getListItems(
      currentWeekdayItems,
      currentWeekDay,
      (item) => item.time === hourString,
    );
    const previousItems = this.getListItems(
      previousWeekdayItems,
      previousWeekDay,
      () => false,
    );
    const nextItems = this.getListItems(
      newWeekdayItems,
      nextWeekDay,
      () => false,
    );

    return [...previousItems, ...currentItems, ...nextItems];
  }

  private getNextWeekDay(weekDay: number): WeekDay {
    return weekDay === 7 ? 1 : ((weekDay + 1) as WeekDay);
  }

  private getPreviousWeekDay(weekday: WeekDay): WeekDay {
    return weekday === 1 ? 7 : ((weekday - 1) as WeekDay);
  }

  private generateTime(): string[] {
    return Array.from({ length: 24 }, (_, i) => i).map(
      (hour) => (hour < 10 ? '0' : '') + `${hour}:00`,
    );
  }

  private getListItems(
    items: GraphLightItem[],
    weekday: WeekDay,
    isActive: (item: GraphLightItem) => boolean,
  ): LightItem[] {
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
        active: isActive(item),
        weekday: weekday,
      }));
  }
}
