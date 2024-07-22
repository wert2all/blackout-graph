import { createActionGroup, props } from '@ngrx/store';
import { DateTime } from 'luxon';

export const LightActions = createActionGroup({
  source: 'Light',
  events: {
    'Set light on': props<{ time: DateTime }>(),
    'Set light off': props<{ time: DateTime }>(),
  },
});
