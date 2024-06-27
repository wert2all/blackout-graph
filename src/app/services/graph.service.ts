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
    limit: number,
  ): LightItem[] {
    const hourString = this.hourToString(hour);
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

    return (
      this.sliceTimelime([...previousItems, ...currentItems, ...nextItems]) ||
      currentItems
    ).slice(0, limit);
  }

  private sliceTimelime(allItems: LightItem[]): LightItem[] | undefined {
    const activeItemIndex = allItems.findIndex((item) => item.active) - 1;
    if (activeItemIndex < 0) {
      return undefined;
    }
    const searchStartCheck = this.getSearchStartCheck(
      allItems[activeItemIndex].type,
    );
    const startReverse = allItems.splice(0, activeItemIndex + 1).reverse();
    const start = startReverse
      .slice(
        0,
        startReverse.findIndex((item) => searchStartCheck(item.type)),
      )
      .reverse();

    return [...start, ...allItems];
  }

  private getSearchStartCheck(type: LightType) {
    return type === LightType.NORMAL
      ? (type: LightType) => type !== LightType.NORMAL
      : (type: LightType) => type === LightType.NORMAL;
  }

  private getNextWeekDay(weekDay: number): WeekDay {
    return weekDay === 7 ? 1 : ((weekDay + 1) as WeekDay);
  }

  private getPreviousWeekDay(weekday: WeekDay): WeekDay {
    return weekday === 1 ? 7 : ((weekday - 1) as WeekDay);
  }

  private getListItems(
    items: GraphLightItem[],
    weekday: WeekDay,
    isActive: (item: GraphLightItem) => boolean,
  ): LightItem[] {
    return Array.from({ length: 24 }, (_, i) => i)
      .map((hour) => this.hourToString(hour))
      .map(
        (time) =>
          items.find((item) => item.time === time) || this.getDefaultItem(time),
      )
      .map((item) => ({
        ...item,
        active: isActive(item),
        weekday: weekday,
      }));
  }
  private hourToString(hour: number) {
    return hour < 10 ? `0${hour}:00` : `${hour}:00`;
  }

  private getDefaultItem(time: string): GraphLightItem {
    return {
      time: time,
      type: LightType.NORMAL,
    };
  }
}
