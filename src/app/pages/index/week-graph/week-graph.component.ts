import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  standalone: true,
  selector: 'app-week-graph',
  templateUrl: './week-graph.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WeekGraphComponent {}
