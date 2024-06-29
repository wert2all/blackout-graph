import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Store } from '@ngrx/store';

import { ContentComponent } from '../../share/layout/content/content.component';
import { HeaderComponent } from '../../share/layout/header/header.component';
import { LayoutComponent } from '../../share/layout/layout.component';
import { graphFeature } from '../../store/graph.reducers';
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
  isWeekActive = inject(Store).selectSignal(graphFeature.selectIsWeek);
}
