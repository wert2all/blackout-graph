import { Component, computed, inject, signal } from '@angular/core';
import { Store } from '@ngrx/store';
import { Info, WeekdayNumbers } from 'luxon';

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
  isWeekActive = this.store.selectSignal(graphFeature.selectIsWeek);

  selectedWeekDay = this.store.selectSignal(graphFeature.selectSelectedWeekDay);

  weekdays = computed(() => {
    return this.info().map((name, index) => {
      return {
        name: name,
        day: (index + 1) as WeekdayNumbers,
        active: index + 1 === this.selectedWeekDay(),
      };
    });
  });

  switchToToday() {
    this.store.dispatch(WeekDayActions.switchToToday());
  }

  switchWeekDay(weekday: WeekdayNumbers) {
    this.store.dispatch(WeekDayActions.switchWeekDay({ weekday: weekday }));
  }

  switchToWeek() {
    throw new Error('Method not implemented.');
  }
}
