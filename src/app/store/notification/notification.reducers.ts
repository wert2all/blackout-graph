import { createFeature, createReducer, createSelector, on } from '@ngrx/store';
import { v4 as uuid } from 'uuid';

import { NotificationActions } from './notification.actions';
import {
  NotificationMessage,
  NotificationState,
  NotificationType,
} from './notification.types';

const createMessage = (
  type: NotificationType,
  message: string,
): NotificationMessage => ({
  uuid: uuid(),
  message: message,
  type: type,
  isRead: false,
});

const initialState: NotificationState = { messages: [] };

export const notificationFeature = createFeature({
  name: 'notification',
  reducer: createReducer(
    initialState,

    on(
      NotificationActions.markAsRead,
      (state, { uuid }): NotificationState => ({
        ...state,
        messages: state.messages.map((message) => ({
          ...message,
          isRead: message.uuid === uuid ? true : message.isRead,
        })),
      }),
    ),
    on(
      NotificationActions.sendSuccessMessage,
      (state, { message }): NotificationState => ({
        ...state,
        messages: [
          ...state.messages,
          createMessage(NotificationType.SUCCESS, message),
        ],
      }),
    ),
    on(
      NotificationActions.sendWarningMessage,
      (state, { message }): NotificationState => ({
        ...state,
        messages: [
          ...state.messages,
          createMessage(NotificationType.WARNING, message),
        ],
      }),
    ),
    on(
      NotificationActions.sendErrorMessage,
      (state, { message }): NotificationState => ({
        ...state,
        messages: [
          ...state.messages,
          createMessage(NotificationType.ERROR, message),
        ],
      }),
    ),
  ),
  extraSelectors: ({ selectMessages }) => {
    const selectNonReadMessages = createSelector(selectMessages, (messages) =>
      messages.filter((message) => message.isRead === false),
    );
    return { selectNonReadMessages: selectNonReadMessages };
  },
});
