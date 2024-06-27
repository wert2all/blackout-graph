import { Component, computed, inject, signal } from '@angular/core';
import { Store } from '@ngrx/store';
import { Info } from 'luxon';

import { WeekDay } from '../../../app.types';
import { WeekDayActions } from '../../../store/graph.actions';
import { graphFeature } from '../../../store/graph.reducers';

@Component({
  standalone: true,
  selector: 'app-weekdays',
  templateUrl: './weekdays.component.html',
})
export class WeekdaysComponent {
  private readonly info = signal(Info.weekdays());
  private readonly store = inject(Store);

  isTodayActive = this.store.selectSignal(graphFeature.selectIsToday);
  selectedWeekDay = this.store.selectSignal(graphFeature.selectSelectedWeekDay);
  weekdays = computed(() => {
    return this.info().map((name, index) => {
      return {
        name: name,
        day: (index + 1) as WeekDay,
        active: index + 1 === this.selectedWeekDay(),
      };
    });
  });

  switchToToday() {
    this.store.dispatch(WeekDayActions.switchToToday());
  }

  switchWeekDay(weekday: WeekDay) {
    this.store.dispatch(WeekDayActions.switchWeekDay({ weekday: weekday }));
  }
}
