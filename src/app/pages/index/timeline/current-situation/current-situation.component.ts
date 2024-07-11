import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
} from '@angular/core';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import { saxFlash1Bold, saxFlashSlashBold } from '@ng-icons/iconsax/bold';
import { saxFlashBulk, saxFlashSlashBulk } from '@ng-icons/iconsax/bulk';
import { Store } from '@ngrx/store';

import { hourToString } from '../../../../app.types';
import { graphFeature } from '../../../../store/graph/graph.reducers';
import { Duration, LightType } from '../../../../store/graph/graph.types';
import { LightActions } from '../../../../store/light/light.actions';

interface Icon {
  current: string;
  nigate: string;
}

interface Current {
  title: string;
  nextBlockTitle: string;
  time: string;
  duration: Duration | undefined;
  toEnd: Duration | undefined;
  icon: Icon;
  type: LightType;
  nextBlockStart: string | undefined;
  restProcents: number | undefined;
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
    return activeItem
      ? {
          title: this.createActiveTitle(activeItem.type),
          nextBlockTitle: this.createNextBlockTitle(activeItem.type),
          duration: activeItem.block.toNowDuration,
          toEnd: activeItem.block.toEndDuration,
          type: activeItem.type,
          icon: {
            current: activeItem.icon,
            nigate: this.getNigateIcon(activeItem.type),
          },
          time: activeItem.time,
          nextBlockStart: activeItem.block.endHour
            ? hourToString(activeItem.block.endHour.hour)
            : undefined,
          restProcents: activeItem.block.restInPercents
            ? 100 - Math.round(activeItem.block.restInPercents)
            : undefined,
        }
      : null;
  });

  lightChange(event: Event) {
    const time = this.current()?.time;
    if (time) {
      const switchElement = event.currentTarget as HTMLInputElement;
      const action = this.isLightOn(switchElement)
        ? LightActions.setLightOn({ time: time })
        : LightActions.setLightOff({ time: time });

      this.store.dispatch(action);
    }
  }

  private isLightOn(switchElement: HTMLInputElement) {
    return switchElement.checked && this.current()?.type !== LightType.NORMAL;
  }

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

  private getNigateIcon(type: LightType): string {
    switch (type) {
      case LightType.NORMAL:
        return saxFlashSlashBulk;
      case LightType.MAYBE_BLACKOUT:
        return saxFlashBulk;
      case LightType.BLACKOUT:
        return saxFlashBulk;
    }
  }
}
