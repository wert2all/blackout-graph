import { DateTime } from 'luxon';

import { DateString } from '../../app.types';

export type Status = 'on' | 'off';

export interface LightSwitch {
  time: DateTime;
  status: Status;
}

export interface LightState {
  list: Record<DateString, Record<string, LightSwitch>>;
}
