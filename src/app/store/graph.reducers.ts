import { saxFlash1Bold } from '@ng-icons/iconsax/bold';
import { saxFlashBulk, saxFlashSlashBulk } from '@ng-icons/iconsax/bulk';
import { createFeature, createReducer, createSelector, on } from '@ngrx/store';
import { DateTime, WeekdayNumbers } from 'luxon';
import { Valid } from 'luxon/src/_util';

import { GraphGroups, hourToString, toPercents } from '../app.types';
import { WeekDayActions } from './graph.actions';
import {
  ActiveItem,
  GraphLightItem,
  GraphState,
  GraphStore,
  LightItem,
  LightItemWithBlock,
  LightType,
} from './graph.types';

const initialState: GraphState = {
  isToday: true,
  isWeek: false,
  selectedWeekDay: null,
  selectedGroup: 'group3',
  nowDateTime: DateTime.now(),
};

const store = GraphStore;
const selectItems = (weekday: WeekdayNumbers, group: GraphGroups) =>
  store[group][weekday];

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
  () =>
  (
    items: GraphLightItem[],
    weekday: WeekdayNumbers,
    nowWeekday: WeekdayNumbers,
    nowHourString: string,
  ): LightItem[] =>
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
        active: nowWeekday == weekday && item.time === nowHourString,
        weekday: weekday,
        icon: getIcon(item.type),
      }));

const updateBlock = (items: LightItem[]): LightItemWithBlock[] =>
  items.map((item, index) => ({
    ...item,
    block: {
      isStart: isStartBlock(item, index, items),
      isEnd: isEndBlock(item, index, items),
    },
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
const extractBlockHour = (
  items: LightItemWithBlock[],
  filter: (item: LightItemWithBlock) => boolean,
) => {
  const item = items.find(filter)?.time.split(':')[0];
  const hour = item ? Number.parseInt(item, 10) : undefined;
  return hour == undefined ? undefined : isNaN(hour) ? undefined : hour;
};

const getActiveItemDuration = (from: DateTime<Valid>, to: DateTime<Valid>) => {
  const duration = from
    .diff(to)
    .shiftTo('hours', 'minutes', 'seconds')
    .toObject();
  if (duration.hours || duration.minutes) {
    return {
      hours: Math.round(duration.hours || 0),
      minutes: Math.round(duration.minutes || 0),
    };
  }
  return undefined;
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
        isWeek: false,
        selectedWeekDay: null,
      }),
    ),
    on(
      WeekDayActions.switchWeekDay,
      (state, { weekday }): GraphState => ({
        ...state,
        selectedWeekDay: weekday,
        isToday: false,
        isWeek: false,
      }),
    ),
  ),
  extraSelectors: ({
    selectNowDateTime,
    selectIsToday,
    selectSelectedGroup,
    selectSelectedWeekDay,
  }) => {
    const selectNow = createSelector(() => DateTime.now());
    const selectNowHourString = createSelector(selectNowDateTime, (now) =>
      hourToString(now.hour),
    );
    const selectNowWeekday = createSelector(
      selectNowDateTime,
      (now): WeekdayNumbers => now.plus(0).weekday as WeekdayNumbers,
    );

    const selectCurrentWeekday = createSelector(
      selectIsToday,
      selectSelectedWeekDay,
      selectNowWeekday,
      (isToday, selectedWeekDay, weekday): WeekdayNumbers =>
        isToday ? weekday : selectedWeekDay || 1,
    );
    const selectPreviousWeekday = createSelector(
      selectCurrentWeekday,
      (weekday): WeekdayNumbers =>
        weekday === 1 ? 7 : ((weekday - 1) as WeekdayNumbers),
    );

    const selectNextWeekday = createSelector(
      selectCurrentWeekday,
      (weekday): WeekdayNumbers =>
        weekday === 7 ? 1 : ((weekday + 1) as WeekdayNumbers),
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
      selectNowWeekday,
      selectNowHourString,
      createItemsUpdateProjector(),
    );
    const selectPreviousItems = createSelector(
      selectPreviousWeekdayItems,
      selectPreviousWeekday,
      selectNowWeekday,
      selectNowHourString,
      createItemsUpdateProjector(),
    );
    const selectNextItems = createSelector(
      selectNextWeekdayItems,
      selectNextWeekday,
      selectNowWeekday,
      selectNowHourString,
      createItemsUpdateProjector(),
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

    const selectActiveBlock = createSelector(
      selectTimelineWithBlocks,
      (items) => {
        const activeItemIndex = items.findIndex((item) => item.active);

        const endList = items.slice(activeItemIndex);
        const endIndex = endList.findIndex((item) => item.block.isEnd);

        const startList = items.slice(0, activeItemIndex + 1).reverse();
        const startIndex = startList.findIndex((item) => item.block.isStart);

        return [
          ...startList.slice(0, startIndex + 1).reverse(),
          ...endList.slice(0, endIndex + 1),
        ];
      },
    );

    const selectActiveBlockStartEnd = createSelector(
      selectActiveBlock,
      selectNow,
      (items, now) => {
        const startHour = extractBlockHour(items, (item) => item.block.isStart);
        const endHour = extractBlockHour(items, (item) => item.block.isEnd);

        const start =
          startHour != undefined
            ? now.set({
                hour: startHour,
                minute: 0,
                second: 0,
                millisecond: 0,
              })
            : undefined;

        const end =
          startHour != undefined && endHour != undefined
            ? now
                .set({
                  hour: endHour,
                  minute: 0,
                  second: 0,
                  millisecond: 0,
                })
                .plus({
                  hour: 1,
                  ...(startHour >= endHour ? { day: 1 } : undefined),
                })
            : undefined;

        return {
          start: start,
          end: end,
        };
      },
    );

    const selectActiveItem = createSelector(
      selectNow,
      selectActiveBlock,
      selectActiveBlockStartEnd,
      (now, items, startEnd): ActiveItem | undefined => {
        const activeItem = items.find((item) => item.active);

        const duration =
          startEnd.start != undefined
            ? getActiveItemDuration(now, startEnd.start)
            : undefined;
        const toEnd =
          startEnd.end != undefined
            ? getActiveItemDuration(startEnd.end, now)
            : undefined;

        const blockDuration =
          startEnd.start != undefined && startEnd.end != undefined
            ? startEnd.end.diff(startEnd.start)
            : undefined;

        const rest: number | undefined =
          blockDuration != undefined && startEnd.start != undefined
            ? blockDuration.toMillis() - now.diff(startEnd.start).toMillis()
            : undefined;

        return activeItem
          ? {
              ...activeItem,
              block: {
                ...activeItem.block,
                startHour: startEnd.start,
                endHour: startEnd.end,
                blockMillisDuration: blockDuration?.toMillis() || undefined,
                blockMillisRest: rest,
                restInPercents: toPercents(rest, blockDuration?.toMillis()),
                toNowDuration: duration,
                toEndDuration: toEnd,
              },
            }
          : undefined;
      },
    );

    return {
      selectTimelineWithBlocks,
      selectThreeDaysItemsWithBlock,
      selectActiveItem,
      selectActiveBlock,
    };
  },
});
