import { createFeature, createReducer, createSelector, on } from '@ngrx/store';
import { DateTime } from 'luxon';

import {
  GraphGroups,
  GraphLightItem,
  LightItem,
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

const selectActiveItems = (isActive: (item: GraphLightItem) => boolean) => {
  return (items: GraphLightItem[], weekday: WeekDay): LightItem[] => {
    return Array.from({ length: 24 }, (_, i) => i)
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
        active: isActive(item),
        weekday: weekday,
      }));
  };
};

const getSearchStartCheck = (type: LightType) =>
  type === LightType.NORMAL
    ? (type: LightType) => type !== LightType.NORMAL
    : (type: LightType) => type === LightType.NORMAL;

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

    const selectCurrentWeekday = createSelector(
      selectIsToday,
      selectSelectedWeekDay,
      (isToday, selectedWeekDay): WeekDay =>
        isToday ? datetime.weekday : selectedWeekDay || 1,
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
      selectActiveItems((item) => item.time === hourToString(hour)),
    );
    const selectPreviousItems = createSelector(
      selectPreviousWeekdayItems,
      selectPreviousWeekday,
      selectActiveItems(() => false),
    );
    const selectNextItems = createSelector(
      selectNextWeekdayItems,
      selectNextWeekday,
      selectActiveItems(() => false),
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
    return { selectThreeDaysItems, selectTimeline };
  },
});
