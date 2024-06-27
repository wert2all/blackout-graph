import { ChangeDetectionStrategy, Component } from '@angular/core';

import { LayoutComponent } from '../../share/layout/layout.component';
import { ContentComponent } from '../../share/layout/content/content.component';
import { HeaderComponent } from '../../share/layout/header/header.component';

@Component({
  selector: 'app-index-page',
  templateUrl: './index-page.component.html',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [LayoutComponent, ContentComponent, HeaderComponent],
})
export class IndexPageComponent { }
