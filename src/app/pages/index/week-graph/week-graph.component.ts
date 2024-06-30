import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { NgIconComponent } from '@ng-icons/core';
import { Store } from '@ngrx/store';

import { graphFeature } from '../../../store/graph.reducers';

@Component({
  standalone: true,
  selector: 'app-week-graph',
  templateUrl: './week-graph.component.html',
  imports: [NgIconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WeekGraphComponent {
  graph = inject(Store).selectSignal(graphFeature.selectWeekGraph);
}
