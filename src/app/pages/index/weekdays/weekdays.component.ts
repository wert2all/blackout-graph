import { Component, computed, inject, signal } from '@angular/core';
import { Store } from '@ngrx/store';
import { Info, WeekdayNumbers } from 'luxon';

import { AppLocale } from '../../../app.types';
import { WeekDayActions } from '../../../store/graph/graph.actions';
import { graphFeature } from '../../../store/graph/graph.reducers';

@Component({
  standalone: true,
  selector: 'app-weekdays',
  templateUrl: './weekdays.component.html',
})
export class WeekdaysComponent {
  private readonly info = signal(Info.weekdays('long', { locale: AppLocale }));
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
  hideWeekPanel = signal(true);

  switchToToday() {
    this.store.dispatch(WeekDayActions.switchToToday());
  }

  switchWeekDay(weekday: WeekdayNumbers) {
    this.store.dispatch(WeekDayActions.switchToWeekday({ weekday: weekday }));
  }

  switchToWeek() {
    this.store.dispatch(WeekDayActions.switchToWeek());
  }

  togglePanel() {
    this.hideWeekPanel.update((value) => !value);
  }
}
