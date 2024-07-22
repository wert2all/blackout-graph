import { createFeature, createReducer, createSelector, on } from '@ngrx/store';
import { DateTime, WeekdayNumbers } from 'luxon';

import { AppLocale, hourToString } from '../../app.types';
import { TimeActions } from './time.actopns';

const generateNow = () => DateTime.now().setLocale(AppLocale);

const initialState = {
  now: generateNow(),
};

export const timeFeature = createFeature({
  name: 'time',
  reducer: createReducer(
    initialState,
    on(TimeActions.autoRefresh, (state) => ({
      ...state,
      now: generateNow(),
    })),
  ),
  extraSelectors: ({ selectNow }) => {
    const selectNowHourString = createSelector(selectNow, (now) =>
      hourToString(now.hour),
    );
    const selectNowWeekday = createSelector(
      selectNow,
      (now): WeekdayNumbers => now.plus(0).weekday as WeekdayNumbers,
    );

    return {
      selectNowHourString,
      selectNowWeekday,
    };
  },
});
