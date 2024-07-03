export enum NotificationType {
  ERROR,
  SUCCESS,
  WARNING,
}

export interface NotificationMessage {
  uuid: string;
  type: NotificationType;
  message: string;
  isRead: boolean;
}

export interface NotificationState {
  messages: NotificationMessage[];
}
