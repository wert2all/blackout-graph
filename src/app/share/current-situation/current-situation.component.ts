import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  signal,
} from '@angular/core';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import { saxFlash1Bold, saxFlashSlashBold } from '@ng-icons/iconsax/bold';

import { GraphLightItem, LightType } from '../../app.types';

interface Future {
  title: string;
  when: string;
  after: string;
}

interface Current {
  title: string;
  duration: string;
  icon: string;
  type: LightType;
}
@Component({
  selector: 'app-current-situation',
  standalone: true,
  imports: [NgIconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './current-situation.component.html',
  viewProviders: [provideIcons({ saxFlash1Bold, saxFlashSlashBold })],
})
export class CurrentSituationComponent {
  LightType = LightType;
  accent = input<boolean>(false);

  activeItem = signal<GraphLightItem>({
    type: LightType.NORMAL,
    time: '13:00',
  });

  activeTime = computed(() => this.activeItem().time);
  progressValue = signal(74);

  future = signal<Future>({
    title: 'Світла не буде через',
    when: 'Після 5:00',
    after: '2год 23хв',
  });

  current = signal<Current>({
    title: 'Світло мабуть є',
    duration: '2год 23хв',
    type: LightType.BLACKOUT,
    icon: saxFlashSlashBold,
  });
}
