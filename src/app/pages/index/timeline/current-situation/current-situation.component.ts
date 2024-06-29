import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  signal,
} from '@angular/core';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import { saxFlash1Bold, saxFlashSlashBold } from '@ng-icons/iconsax/bold';
import { Store } from '@ngrx/store';

import { hourToString } from '../../../../app.types';
import { graphFeature } from '../../../../store/graph.reducers';
import { Duration, LightType } from '../../../../store/graph.types';

interface Future {
  title: string;
  when: string;
  after: string;
}

interface Current {
  title: string;
  nextBlockTitle: string;
  time: string;
  duration: Duration | undefined;
  toEnd: Duration | undefined;
  icon: string;
  type: LightType;
  nextBlockStart: string | undefined;
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

  current = computed<Current | null>(() => {
    const activeItem = this.activeItem();
    console.log(activeItem);
    return activeItem
      ? {
          title: this.createActiveTitle(activeItem.type),
          nextBlockTitle: this.createNextBlockTitle(activeItem.type),
          duration: activeItem.block.toNowDuration,
          toEnd: activeItem.block.toEndDuration,
          type: activeItem.type,
          icon: activeItem.icon,
          time: activeItem.time,
          nextBlockStart: activeItem.block.endHour
            ? hourToString(activeItem.block.endHour)
            : undefined,
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
  private createNextBlockTitle(type: LightType): string {
    switch (type) {
      case LightType.NORMAL:
        return 'Світла не стане через';

      case LightType.MAYBE_BLACKOUT:
        return 'Світло мабуть буде через';

      case LightType.BLACKOUT:
        return 'Світло мабуть буде через';
    }
  }
}
