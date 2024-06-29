import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { WeekdayNumbers } from 'luxon';

export const WeekDayActions = createActionGroup({
  source: 'WeekDay',
  events: {
    'Switch to Today': emptyProps(),
    'Switch to Weekday': props<{ weekday: WeekdayNumbers }>(),
    'Switch to Week': emptyProps(),
  },
});
