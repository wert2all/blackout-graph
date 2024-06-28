import { saxFlash1Bold } from '@ng-icons/iconsax/bold';
import { saxFlashBulk, saxFlashSlashBulk } from '@ng-icons/iconsax/bulk';
import { createFeature, createReducer, createSelector, on } from '@ngrx/store';
import { DateTime } from 'luxon';

import {
  GraphGroups,
  GraphLightItem,
  LightItem,
  LightItemWithBlock,
  LightType,
  WeekDay,
} from '../app.types';
import { WeekDayActions } from './graph.actions';
import { GraphState, GraphStore } from './graph.types';

const initialState: GraphState = {
  isToday: true,
  selectedWeekDay: null,
  selectedGroup: 'group3',
};

const store = GraphStore;
const selectItems = (weekday: WeekDay, group: GraphGroups) =>
  store[group][weekday];

const hourToString = (hour: number) =>
  hour < 10 ? `0${hour}:00` : `${hour}:00`;

const getIcon = (type: LightType): string => {
  switch (type) {
    case LightType.BLACKOUT:
      return saxFlashSlashBulk;
    case LightType.MAYBE_BLACKOUT:
      return saxFlashBulk;
    case LightType.NORMAL:
      return saxFlash1Bold;
  }
};

const createItemsUpdateProjector =
  (currentWeekday: WeekDay, hourString: string) =>
  (items: GraphLightItem[], weekday: WeekDay): LightItem[] =>
    Array.from({ length: 24 }, (_, i) => i)
      .map((hour) => hourToString(hour))
      .map(
        (time) =>
          items.find((item) => item.time === time) || {
            time: time,
            type: LightType.NORMAL,
          },
      )
      .map((item) => ({
        ...item,
        active: currentWeekday == weekday && item.time === hourString,
        weekday: weekday,
        icon: getIcon(item.type),
      }));

const updateBlock = (items: LightItem[]): LightItemWithBlock[] =>
  items.map((item, index) => ({
    ...item,
    blockStart: isStartBlock(item, index, items),
    blockEnd: isEndBlock(item, index, items),
  }));

const getSearchStartCheck = (type: LightType) =>
  type === LightType.NORMAL
    ? (type: LightType) => type !== LightType.NORMAL
    : (type: LightType) => type === LightType.NORMAL;

const isStartBlock = (item: LightItem, index: number, items: LightItem[]) => {
  return isBlockChange(item, items[index - 1]);
};

const isEndBlock = (item: LightItem, index: number, items: LightItem[]) => {
  return isBlockChange(item, items[index + 1]);
};

const isBlockChange = (item: LightItem, second: LightItem | undefined) => {
  if (second === undefined) {
    return true;
  }
  switch (item.type) {
    case LightType.NORMAL:
      return second.type !== LightType.NORMAL;
    case LightType.MAYBE_BLACKOUT:
      return second.type === LightType.NORMAL;
    case LightType.BLACKOUT:
      return second.type === LightType.NORMAL;
  }
};

export const graphFeature = createFeature({
  name: 'graph',
  reducer: createReducer(
    initialState,
    on(
      WeekDayActions.switchToToday,
      (state): GraphState => ({
        ...state,
        isToday: true,
        selectedWeekDay: null,
      }),
    ),
    on(
      WeekDayActions.switchWeekDay,
      (state, { weekday }): GraphState => ({
        ...state,
        selectedWeekDay: weekday,
        isToday: false,
      }),
    ),
  ),
  extraSelectors: ({
    selectIsToday,
    selectSelectedGroup,
    selectSelectedWeekDay,
  }) => {
    const datetime = DateTime.now();
    const hour = datetime.hour;
    const weekday = datetime.weekday;

    const selectItemProjector = createItemsUpdateProjector(
      weekday,
      hourToString(hour),
    );

    const selectCurrentWeekday = createSelector(
      selectIsToday,
      selectSelectedWeekDay,
      (isToday, selectedWeekDay): WeekDay =>
        isToday ? weekday : selectedWeekDay || 1,
    );
    const selectPreviousWeekday = createSelector(
      selectCurrentWeekday,
      (weekday): WeekDay => (weekday === 1 ? 7 : ((weekday - 1) as WeekDay)),
    );

    const selectNextWeekday = createSelector(
      selectCurrentWeekday,
      (weekday): WeekDay => (weekday === 7 ? 1 : ((weekday + 1) as WeekDay)),
    );

    const selectCurrentWeekdayItems = createSelector(
      selectCurrentWeekday,
      selectSelectedGroup,
      selectItems,
    );
    const selectPreviousWeekdayItems = createSelector(
      selectPreviousWeekday,
      selectSelectedGroup,
      selectItems,
    );
    const selectNextWeekdayItems = createSelector(
      selectNextWeekday,
      selectSelectedGroup,
      selectItems,
    );

    const selectCurrentItems = createSelector(
      selectCurrentWeekdayItems,
      selectCurrentWeekday,
      selectItemProjector,
    );
    const selectPreviousItems = createSelector(
      selectPreviousWeekdayItems,
      selectPreviousWeekday,
      selectItemProjector,
    );
    const selectNextItems = createSelector(
      selectNextWeekdayItems,
      selectNextWeekday,
      selectItemProjector,
    );

    const selectThreeDaysItems = createSelector(
      selectPreviousItems,
      selectCurrentItems,
      selectNextItems,
      (prev, cur, nex) => [...prev, ...cur, ...nex],
    );
    const selectTodayItems = createSelector(
      selectThreeDaysItems,
      selectCurrentItems,
      (allItems: LightItem[], currentItems): LightItem[] => {
        const activeItemIndex = allItems.findIndex((item) => item.active) - 1;
        if (activeItemIndex < 0) {
          return currentItems;
        }
        const searchStartCheck = getSearchStartCheck(
          allItems[activeItemIndex].type,
        );
        const startReverse = allItems.splice(0, activeItemIndex + 1).reverse();
        const start = startReverse
          .slice(
            0,
            startReverse.findIndex((item) => searchStartCheck(item.type)),
          )
          .reverse();

        return [...start, ...allItems].slice(0, 14);
      },
    );
    const selectTimeline = createSelector(
      selectCurrentItems,
      selectTodayItems,
      selectIsToday,
      (current, today, isToday) => (isToday ? today : current),
    );

    const selectThreeDaysItemsWithBlock = createSelector(
      selectThreeDaysItems,
      updateBlock,
    );

    const selectTimelineWithBlocks = createSelector(
      selectTimeline,
      updateBlock,
    );

    const selectActiveItem = createSelector(selectCurrentItems, (items) =>
      items.find((item) => item.active),
    );
    return {
      selectTimelineWithBlocks,
      selectThreeDaysItemsWithBlock,
      selectActiveItem,
    };
  },
});
