import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { WeekdayNumbers } from 'luxon';

export const WeekDayActions = createActionGroup({
  source: 'WeekDay',
  events: {
    'Switch to Today': emptyProps(),
    'Switch Week Day': props<{ weekday: WeekdayNumbers }>(),
  },
});
