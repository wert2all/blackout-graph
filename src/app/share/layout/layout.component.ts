import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

import { NotificationsContainerComponent } from '../notifications/notifications-container.component';

@Component({
  selector: 'app-layout',
  standalone: true,
  templateUrl: './layout.component.html',
  imports: [CommonModule, NotificationsContainerComponent],
})
export class LayoutComponent {}
