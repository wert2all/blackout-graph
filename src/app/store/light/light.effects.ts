import { inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { map } from 'rxjs';

import { StoreDispatchEffect } from '../../app.types';
import { NotificationActions } from '../notification/notification.actions';
import { LightActions } from './light.actions';

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

export const lightEffects = {
  lightOnNotification: createEffect(lightOnNotification, StoreDispatchEffect),
  lightOffNotification: createEffect(lightOffNotification, StoreDispatchEffect),
};
