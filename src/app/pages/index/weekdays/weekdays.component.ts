import { Component, computed, signal } from '@angular/core';
import { DateTime, Info } from 'luxon';

import { WeekDay } from '../../../app.types';

@Component({
  standalone: true,
  selector: 'app-weekdays',
  templateUrl: './weekdays.component.html',
})
export class WeekdaysComponent {
  private readonly dateTime = DateTime.now();
  private readonly info = signal(Info.weekdays());
  weekdays = computed(() => {
    return this.info().map((name, index) => {
      return {
        name: name,
        day: index as WeekDay,
        active: this.dateTime.weekday === index + 1,
      };
    });
  });

  isTodayActive() {
    return true;
  }
}
