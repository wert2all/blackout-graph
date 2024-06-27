import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-index-page',
  templateUrl: './index-page.component.html',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IndexPageComponent {}
