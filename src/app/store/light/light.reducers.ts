import { createFeature, createReducer, createSelector, on } from '@ngrx/store';
import { DateTime } from 'luxon';

import { hourToString } from '../../app.types';
import { dateStringFromTime } from '../../share/lib.functions';
import { timeFeature } from '../time/time.reducers';
import { LightActions } from './light.actions';
import { LightState, LightSwitch, Status } from './light.types';

const updateLight = (
  state: LightState,
  status: Status,
  time: DateTime,
): LightState => {
  const list = { ...state.list };
  const dateString = dateStringFromTime(time);
  const hourString = hourToString(time.hour);

  const switchValue: LightSwitch = {
    status: status,
    time: time,
    hourString: hourToString(time.hour),
  };

  if (!list[dateString]) {
    list[dateString] = {};
  }
  list[dateString] = { ...list[dateString] };
  list[dateString][hourString] = switchValue;

  return { ...state, list: list };
};

const initialState: LightState = {
  list: {},
};

export const lightFeature = createFeature({
  name: 'light',
  reducer: createReducer(
    initialState,

    on(
      LightActions.successLoadLight,
      (state, { lights }): LightState => ({ ...state, list: lights }),
    ),
    on(
      LightActions.updateLight,
      (state, { light }): LightState =>
        updateLight(state, light.status, light.time),
    ),
  ),
  extraSelectors: ({ selectList }) => {
    const selectCurrentdayLightList = createSelector(
      timeFeature.selectNow,
      selectList,
      (now, list): Record<string, LightSwitch> | undefined =>
        list[dateStringFromTime(now)],
    );
    return { selectCurrentLight: selectCurrentdayLightList };
  },
});
