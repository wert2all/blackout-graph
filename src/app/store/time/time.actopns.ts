import { createActionGroup, emptyProps } from '@ngrx/store';

export const TimeActions = createActionGroup({
  source: 'Time',
  events: {
    AutoRefresh: emptyProps(),
  },
});
