import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Store } from '@ngrx/store';
import { Duration } from 'luxon';
import { interval } from 'rxjs';

import { ContentComponent } from '../../share/layout/content/content.component';
import { HeaderComponent } from '../../share/layout/header/header.component';
import { LayoutComponent } from '../../share/layout/layout.component';
import { WeekDayActions } from '../../store/graph/graph.actions';
import { graphFeature } from '../../store/graph/graph.reducers';
import { TimelineComponent } from './timeline/timeline.component';
import { WeekGraphComponent } from './week-graph/week-graph.component';
import { WeekdaysComponent } from './weekdays/weekdays.component';
@Component({
  selector: 'app-index-page',
  templateUrl: './index-page.component.html',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    LayoutComponent,
    HeaderComponent,
    TimelineComponent,
    WeekdaysComponent,
    ContentComponent,
    WeekGraphComponent,
  ],
})
export class IndexPageComponent {
  private readonly store = inject(Store);
  private readonly timer$ = interval(
    Duration.fromObject({ minute: 10 }).toMillis(),
  ).pipe(takeUntilDestroyed());

  isWeekActive = this.store.selectSignal(graphFeature.selectIsWeek);

  constructor() {
    this.timer$.subscribe(() => {
      this.store.dispatch(WeekDayActions.autoRefresh());
    });
  }
}
