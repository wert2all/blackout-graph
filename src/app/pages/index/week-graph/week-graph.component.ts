import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
} from '@angular/core';
import { NgIconComponent } from '@ng-icons/core';
import { Store } from '@ngrx/store';

import { graphFeature } from '../../../store/graph/graph.reducers';
import { LightType } from '../../../store/graph/graph.types';

@Component({
  standalone: true,
  selector: 'app-week-graph',
  templateUrl: './week-graph.component.html',
  imports: [NgIconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WeekGraphComponent {
  private readonly graph = inject(Store).selectSignal(
    graphFeature.selectWeekGraph,
  );

  viewGraph = computed(() => {
    const graph = this.graph();
    return {
      hours: graph.hours,
      weekdays: graph.weekdays.map((weekday) => {
        return {
          ...weekday,
          items: weekday.items.map((item) => {
            return {
              ...item,
              tooltip: this.getTooltip(item.type),
            };
          }),
        };
      }),
    };
  });

  private getTooltip(type: LightType): string {
    switch (type) {
      case LightType.NORMAL:
        return 'Світлo є';
      case LightType.BLACKOUT:
        return 'Світла немає';
      case LightType.MAYBE_BLACKOUT:
        return 'Світла мабуть немає';
    }
  }
}
