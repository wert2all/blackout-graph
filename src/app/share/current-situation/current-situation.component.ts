import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
  signal,
} from '@angular/core';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import { saxFlash1Bold, saxFlashSlashBold } from '@ng-icons/iconsax/bold';
import { Store } from '@ngrx/store';

import { LightType } from '../../app.types';
import { graphFeature } from '../../store/graph.reducers';

interface Future {
  title: string;
  when: string;
  after: string;
}

interface Current {
  title: string;
  time: string;
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
  private readonly store = inject(Store);
  private readonly activeItem = this.store.selectSignal(
    graphFeature.selectActiveItem,
  );

  LightType = LightType;
  accent = input<boolean>(false);

  current = computed<Current | null>(() => {
    const activeItem = this.activeItem();
    return activeItem
      ? {
          title: 'Світло мабуть є',
          duration: '2год 23хв',
          type: activeItem.type,
          icon: activeItem.icon,
          time: activeItem.time,
        }
      : null;
  });

  progressValue = signal(74);

  future = signal<Future>({
    title: 'Світла не буде через',
    when: 'Після 5:00',
    after: '2год 23хв',
  });
}
