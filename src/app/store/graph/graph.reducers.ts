import { saxFlash1Bold } from '@ng-icons/iconsax/bold';
import { saxFlashBulk, saxFlashSlashBulk } from '@ng-icons/iconsax/bulk';
import { createFeature, createReducer, createSelector, on } from '@ngrx/store';
import { DateTime, Info, WeekdayNumbers } from 'luxon';
import { Valid } from 'luxon/src/_util';

import {
  AppLocale,
  GraphGroups,
  hourToString,
  toPercents,
} from '../../app.types';
import { timeFeature } from '../time/time.reducers';
import { WeekDayActions } from './graph.actions';
import {
  ActiveItem,
  GraphLightItem,
  GraphState,
  GraphStore,
  GraphWeek,
  LightItem,
  LightItemWithBlock,
  LightType,
  WeekGraphWeekDay,
} from './graph.types';

const initialState: GraphState = {
  isToday: true,
  isWeek: false,
  selectedWeekDay: null,
  selectedGroup: 'group3',
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
const generateHours = () =>
  Array.from({ length: 24 }, (_, i) => i).map((hour) => hourToString(hour));

const createItemsUpdateProjector =
  () =>
  (
    items: GraphLightItem[],
    weekday: WeekdayNumbers,
    nowWeekday: WeekdayNumbers,
    nowHourString: string,
  ): LightItem[] =>
    generateHours()
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
  if (hour != undefined && !isNaN(hour)) {
    return hour;
  }
  return undefined;
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
      WeekDayActions.switchToWeekday,
      (state, { weekday }): GraphState => ({
        ...state,
        selectedWeekDay: weekday,
        isToday: false,
        isWeek: false,
      }),
    ),
    on(
      WeekDayActions.switchToWeek,
      (state): GraphState => ({
        ...state,
        selectedWeekDay: null,
        isToday: false,
        isWeek: true,
      }),
    ),
  ),
  extraSelectors: ({
    selectIsToday,
    selectSelectedGroup,
    selectSelectedWeekDay,
  }) => {
    const selectCurrentWeekday = createSelector(
      selectIsToday,
      selectSelectedWeekDay,
      timeFeature.selectNowWeekday,
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
      timeFeature.selectNowWeekday,
      timeFeature.selectNowHourString,
      createItemsUpdateProjector(),
    );
    const selectPreviousItems = createSelector(
      selectPreviousWeekdayItems,
      selectPreviousWeekday,
      timeFeature.selectNowWeekday,
      timeFeature.selectNowHourString,
      createItemsUpdateProjector(),
    );
    const selectNextItems = createSelector(
      selectNextWeekdayItems,
      selectNextWeekday,
      timeFeature.selectNowWeekday,
      timeFeature.selectNowHourString,
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

    const selectTimelineBlockGroups = createSelector(
      selectTimelineWithBlocks,
      (items) => {
        return items.reduce(
          (prev: LightItemWithBlock[][], curr: LightItemWithBlock) => {
            const lastString = Object.keys(prev).at(-1);
            let last = lastString ? Number.parseInt(lastString) : 0;
            if (!prev[last]) {
              prev[last] = [];
            }

            const lastElement = prev[last].at(-1);

            if (lastElement) {
              if (curr.type === LightType.NORMAL) {
                if (lastElement.type != curr.type) {
                  last = last + 1;
                  prev[last] = [];
                }
              } else {
                if (lastElement.type === LightType.NORMAL) {
                  last = last + 1;
                  prev[last] = [];
                }
              }
              prev[last].push(curr);
            } else {
              prev[last] = [curr];
            }
            return prev;
          },
          [],
        );
      },
    );

    const selectActiveBlock = createSelector(
      selectTimelineBlockGroups,
      (groups): LightItemWithBlock[] => {
        return (
          groups
            .filter((block) => !!block.find((item) => item.active))
            .at(-1) || []
        );
      },
    );

    const selectNextActiveBlock = createSelector(
      selectTimelineBlockGroups,
      (groups): LightItemWithBlock[] => {
        const activeIndex = groups.findIndex((block) => {
          return !!block.find((item) => item.active);
        });

        return activeIndex >= 0 ? groups[activeIndex + 1] || [] : [];
      },
    );

    const selectActiveBlockStartEnd = createSelector(
      selectActiveBlock,
      timeFeature.selectNow,
      (items, now) => {
        const startHour = extractBlockHour(items, (item) => item.block.isStart);
        const endHour = extractBlockHour(items, (item) => item.block.isEnd);

        if (startHour == undefined || endHour == undefined) {
          return {
            start: undefined,
            end: undefined,
          };
        }

        const start = now.set({
          hour: startHour,
          minute: 0,
          second: 0,
          millisecond: 0,
        });

        const end = now
          .set({
            hour: endHour,
            minute: 0,
            second: 0,
            millisecond: 0,
          })
          .plus({
            hour: 1,
            ...(startHour >= endHour ? { day: 1 } : undefined),
          });

        return {
          start: startHour <= now.hour ? start : start.minus({ day: 1 }),
          end: startHour <= now.hour ? end : end.minus({ day: 1 }),
        };
      },
    );

    const selectActiveItem = createSelector(
      timeFeature.selectNow,
      selectActiveBlock,
      selectActiveBlockStartEnd,
      selectNextActiveBlock,
      (now, items, startEnd, nextBlock): ActiveItem | undefined => {
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
                items: items,
                startHour: startEnd.start,
                endHour: startEnd.end,
                blockMillisDuration: blockDuration?.toMillis() || undefined,
                blockMillisRest: rest,
                restInPercents: toPercents(rest, blockDuration?.toMillis()),
                toNowDuration: duration,
                toEndDuration: toEnd,
              },
              next: {
                items: nextBlock,
                end: nextBlock.at(-1)?.time,
              },
            }
          : undefined;
      },
    );

    const selectWeekGraph = createSelector(
      selectSelectedGroup,
      timeFeature.selectNowWeekday,
      timeFeature.selectNowHourString,
      (group, nowWeekday, nowHourString): GraphWeek => {
        const weekdays = Info.weekdays('long', { locale: AppLocale }).map(
          (name, index) => {
            const weekday = (index + 1) as WeekdayNumbers;
            const items = createItemsUpdateProjector()(
              selectItems(weekday, group),
              weekday,
              nowWeekday,
              nowHourString,
            );
            const returnWeekday: WeekGraphWeekDay = {
              name: name,
              isActive: weekday === nowWeekday,
            };
            return { weekday: returnWeekday, items };
          },
        );
        return {
          hours: generateHours(),
          weekdays: weekdays,
        };
      },
    );
    return {
      selectTimelineWithBlocks,
      selectThreeDaysItemsWithBlock,
      selectActiveItem,
      selectActiveBlock,
      selectWeekGraph,
    };
  },
});
