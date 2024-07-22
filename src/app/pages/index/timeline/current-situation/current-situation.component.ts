import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
} from '@angular/core';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import { hugeIdea, hugeIdea01 } from '@ng-icons/huge-icons';
import { saxFlash1Bold, saxFlashSlashBold } from '@ng-icons/iconsax/bold';
import { Store } from '@ngrx/store';

import { hourToString } from '../../../../app.types';
import { graphFeature } from '../../../../store/graph/graph.reducers';
import { Duration, LightType } from '../../../../store/graph/graph.types';
import { LightActions } from '../../../../store/light/light.actions';
import {
  LightSwitchComponent,
  ViewLight,
} from '../light-switch/light-switch.component';

interface Current {
  title: string;
  nextBlockTitle: string;
  time: string;
  duration: Duration | undefined;
  toEnd: Duration | undefined;
  type: LightType;
  nextBlockStart: string | undefined;
  restProcents: number | undefined;
  light: ViewLight;
}

@Component({
  selector: 'app-current-situation',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './current-situation.component.html',
  viewProviders: [
    provideIcons({ saxFlash1Bold, saxFlashSlashBold, hugeIdea, hugeIdea01 }),
  ],
  imports: [NgIconComponent, LightSwitchComponent],
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
          time: activeItem.time,
          nextBlockStart: activeItem.block.endHour
            ? hourToString(activeItem.block.endHour.hour)
            : undefined,
          restProcents: activeItem.block.restInPercents
            ? 100 - Math.round(activeItem.block.restInPercents)
            : undefined,
          light: {
            on: false,
            icon: hugeIdea01,
          },
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
    return this.current()?.type === LightType.NORMAL
      ? switchElement.checked
      : !switchElement.checked;
  }

  private createActiveTitle(type: LightType): string {
    switch (type) {
      case LightType.NORMAL:
        return 'Світлo мабуть є';

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
