import { createActionGroup, emptyProps, props } from '@ngrx/store';

import { WeekDay } from '../app.types';

export const WeekDayActions = createActionGroup({
  source: 'WeekDay',
  events: {
    'Switch to Today': emptyProps(),
    'Switch Week Day': props<{ weekday: WeekDay }>(),
  },
});
