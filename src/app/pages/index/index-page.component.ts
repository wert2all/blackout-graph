import { ChangeDetectionStrategy, Component } from '@angular/core';

import { CurrentSituationComponent } from '../../share/current-situation/current-situation.component';
import { ContentComponent } from '../../share/layout/content/content.component';
import { HeaderComponent } from '../../share/layout/header/header.component';
import { LayoutComponent } from '../../share/layout/layout.component';
import { TimelineComponent } from './timeline/timeline.component';
import { WeekdaysComponent } from './weekdays/weekdays.component';

@Component({
  selector: 'app-index-page',
  templateUrl: './index-page.component.html',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    LayoutComponent,
    ContentComponent,
    HeaderComponent,
    TimelineComponent,
    WeekdaysComponent,
    CurrentSituationComponent,
  ],
})
export class IndexPageComponent {}
