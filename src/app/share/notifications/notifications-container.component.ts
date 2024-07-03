import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Store } from '@ngrx/store';

import { NotificationActions } from '../../store/notification/notification.actions';
import { notificationFeature } from '../../store/notification/notification.reducers';
import {
  NotificationMessage,
  NotificationType,
} from '../../store/notification/notification.types';

@Component({
  selector: 'app-notifications',
  standalone: true,
  imports: [CommonModule],
  styleUrls: ['./notifications-container.component.scss'],
  templateUrl: './notifications-container.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NotificationsContainerComponent {
  NotificationType = NotificationType;
  private readonly store = inject(Store);
  messages = this.store.selectSignal(notificationFeature.selectNonReadMessages);

  onItemClick(message: NotificationMessage) {
    this.read(message);
  }

  onClose(message: NotificationMessage) {
    this.read(message);
  }

  onAnimationEnd(message: NotificationMessage) {
    this.read(message);
  }

  private read(message: NotificationMessage) {
    this.store.dispatch(NotificationActions.markAsRead({ uuid: message.uuid }));
  }
}
