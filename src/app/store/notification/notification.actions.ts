import { createActionGroup, props } from '@ngrx/store';

export const NotificationActions = createActionGroup({
  source: 'Notification',
  events: {
    'send success message': props<{ message: string }>(),
    'send warning message': props<{ message: string }>(),
    'send error message': props<{ message: string }>(),

    'mark as read': props<{ uuid: string }>(),
  },
});
