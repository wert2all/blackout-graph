import { inject } from '@angular/core';
import {
  Actions,
  createEffect,
  ofType,
  ROOT_EFFECTS_INIT,
} from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { DateTime } from 'luxon';
import { catchError, exhaustMap, map, of, switchMap } from 'rxjs';

import { hourToString, StoreDispatchEffect } from '../../app.types';
import { LightService } from '../../services/light.service';
import { dateStringFromTime } from '../../share/lib.functions';
import { NotificationActions } from '../notification/notification.actions';
import { timeFeature } from '../time/time.reducers';
import { LightActions } from './light.actions';
import { LightEntity, LightSwitch } from './light.types';

const switchFromEntity = (entity: LightEntity): LightSwitch => ({
  status: entity.status == 'on' ? 'on' : 'off',
  time: DateTime.fromISO(entity.time),
  hourString: hourToString(DateTime.fromISO(entity.time).hour),
});

const initLights = (
  actions$ = inject(Actions),
  store = inject(Store),
  service = inject(LightService),
) =>
  actions$.pipe(
    ofType(ROOT_EFFECTS_INIT),
    switchMap(() => store.select(timeFeature.selectNow)),
    exhaustMap((now) =>
      service.getLights(now).pipe(
        map((data) => ({
          [dateStringFromTime(now)]: Object.keys(data)
            .map((hour) => (data[hour] ? switchFromEntity(data[hour]) : null))
            .filter((light) => !!light)
            .map((light) => light as LightSwitch)
            .reduce(
              (previous: Record<string, LightSwitch>, current: LightSwitch) => {
                previous[hourToString(current.time.hour)] = current;
                return previous;
              },
              {},
            ),
        })),
        map((list) => LightActions.successLoadLight({ lights: list })),
        catchError(() => of(LightActions.couldntLoad())),
      ),
    ),
  );

const lightOnNotification = (actions = inject(Actions)) =>
  actions.pipe(
    ofType(LightActions.setLightOn),
    map(() => NotificationActions.sendSuccessMessage({ message: 'Світло є' })),
  );

const lightOffNotification = (actions = inject(Actions)) =>
  actions.pipe(
    ofType(LightActions.setLightOff),
    map(() =>
      NotificationActions.sendWarningMessage({ message: 'Світла немає' }),
    ),
  );

const updateStatusOnFirestore = (
  actions = inject(Actions),
  service = inject(LightService),
) =>
  actions.pipe(
    ofType(LightActions.setLightOn, LightActions.setLightOff),
    map((action) => {
      return {
        status: action.type === LightActions.setLightOn.type ? 'on' : 'off',
        time: action.time,
      };
    }),
    exhaustMap(({ status, time }) =>
      service.add(status, time).pipe(
        map((entity) => switchFromEntity(entity)),
        map((light) => LightActions.updateLight({ light: light })),
        catchError(() => of(LightActions.couldntUpdate())),
      ),
    ),
  );

export const lightEffects = {
  initLights: createEffect(initLights, StoreDispatchEffect),
  lightOnNotification: createEffect(lightOnNotification, StoreDispatchEffect),
  lightOffNotification: createEffect(lightOffNotification, StoreDispatchEffect),
  updateStatusOnFirestore: createEffect(
    updateStatusOnFirestore,
    StoreDispatchEffect,
  ),
};
