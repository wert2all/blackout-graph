import { createActionGroup, props } from '@ngrx/store';

export const LightActions = createActionGroup({
  source: 'Light',
  events: {
    'Set light on': props<{ time: string }>(),
    'Set light off': props<{ time: string }>(),
  },
});
