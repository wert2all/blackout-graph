import { DateTime } from 'luxon';

export type LightStatus = 'on' | 'off';

export interface LightSwitch {
  time: DateTime;
  status: LightStatus;
}

export interface LightState {
  list: Record<string, LightSwitch>;
}
