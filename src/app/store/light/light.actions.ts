import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { DateTime } from 'luxon';

import { LightSwitch, ListLights } from './light.types';

export const LightActions = createActionGroup({
  source: 'Light',
  events: {
    'Success load light': props<{ lights: ListLights }>(),

    'Set light on': props<{ time: DateTime }>(),
    'Set light off': props<{ time: DateTime }>(),

    'Update light': props<{ light: LightSwitch }>(),

    'Couldnt update': emptyProps(),
    'Couldnt load': emptyProps(),
  },
});
