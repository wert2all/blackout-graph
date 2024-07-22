import { DateTime } from 'luxon';

import { DateString } from '../app.types';
import { LightStatus } from '../store/graph/graph.types';

export const getLightTooltip = (status: LightStatus): string => {
  switch (status) {
    case LightStatus.MAYBE_OFF:
      return 'Світла мабуть немає';
    case LightStatus.MAYBE_ON:
      return 'Світлo мабуть є';
    case LightStatus.OFF:
      return 'Світла немає';
    case LightStatus.ON:
      return 'Світлo є';
  }
};

export const dateStringFromTime = (time: DateTime): DateString =>
  time.toFormat('yyyy-MM-dd');
