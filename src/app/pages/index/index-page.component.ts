import { ChangeDetectionStrategy, Component } from '@angular/core';

import { ContentComponent } from '../../share/layout/content/content.component';
import { HeaderComponent } from '../../share/layout/header/header.component';
import { LayoutComponent } from '../../share/layout/layout.component';
import { TimelineComponent } from './timeline/timeline.component';

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
  ],
})
export class IndexPageComponent {}
