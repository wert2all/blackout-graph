import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { DateTime } from 'luxon';

import { LightSwitch } from './light.types';

export const LightActions = createActionGroup({
  source: 'Light',
  events: {
    'Set light on': props<{ time: DateTime }>(),
    'Set light off': props<{ time: DateTime }>(),

    'Update light': props<{ light: LightSwitch }>(),

    'Couldnt update': emptyProps(),
  },
});
