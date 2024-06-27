import { createFeature, createReducer, on } from '@ngrx/store';

import { WeekDayActions } from './graph.actions';
import { GraphState } from './graph.types';

const initialState: GraphState = {
  isToday: true,
  selectedWeekDay: null,
};

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
});
