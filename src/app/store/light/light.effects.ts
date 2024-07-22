import { inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { DateTime } from 'luxon';
import { catchError, exhaustMap, map, of } from 'rxjs';

import { StoreDispatchEffect } from '../../app.types';
import { LightService } from '../../services/light.service';
import { NotificationActions } from '../notification/notification.actions';
import { LightActions } from './light.actions';
import { LightEntity, LightSwitch } from './light.types';

const switchFromEntity = (entity: LightEntity): LightSwitch => ({
  status: entity.status == 'on' ? 'on' : 'off',
  time: DateTime.fromISO(entity.time),
});

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
  lightOnNotification: createEffect(lightOnNotification, StoreDispatchEffect),
  lightOffNotification: createEffect(lightOffNotification, StoreDispatchEffect),
  updateStatusOnFirestore: createEffect(
    updateStatusOnFirestore,
    StoreDispatchEffect,
  ),
};
