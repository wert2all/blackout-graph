import { DateTime } from 'luxon';

import { DateString } from '../../app.types';

export type Status = 'on' | 'off';

export interface LightSwitch {
  time: DateTime;
  hourString: string;
  status: Status;
}
export type ListLights = Record<DateString, Record<string, LightSwitch>>;
export interface LightState {
  list: ListLights;
}

export interface LightEntity {
  status: string;
  time: string;
}
