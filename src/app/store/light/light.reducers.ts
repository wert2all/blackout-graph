import { createFeature, createReducer, on } from '@ngrx/store';
import { DateTime } from 'luxon';

import { LightActions } from './light.actions';
import { LightState, LightStatus, LightSwitch } from './light.types';

const updateLight = (
  state: LightState,
  status: LightStatus,
  time: string,
): LightState => {
  const list = { ...state.list };
  const switchValue: LightSwitch = {
    status: status,
    time: DateTime.now(),
  };

  list[time] = switchValue;

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
      LightActions.setLightOn,
      (state, { time }): LightState => updateLight(state, 'on', time),
    ),
    on(
      LightActions.setLightOff,
      (state, { time }): LightState => updateLight(state, 'off', time),
    ),
  ),
});
