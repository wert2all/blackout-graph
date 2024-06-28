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
import { Duration } from '../../store/graph.types';

interface Future {
  title: string;
  when: string;
  after: string;
}

interface Current {
  title: string;
  time: string;
  duration: Duration | undefined;
  toEnd: Duration | undefined;
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
          title: this.createActiveTitle(activeItem.type),
          duration: activeItem.duration,
          toEnd: activeItem.toEnd,
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

  private createActiveTitle(type: LightType): string {
    switch (type) {
      case LightType.NORMAL:
        return 'Світлo є';

      case LightType.MAYBE_BLACKOUT:
        return 'Світла мабуть немає';

      case LightType.BLACKOUT:
        return 'Світла немає';
    }
  }
}
