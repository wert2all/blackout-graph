import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  Signal,
} from '@angular/core';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import { saxFlash1Bold, saxFlashSlashBold } from '@ng-icons/iconsax/bold';
import { Store } from '@ngrx/store';
import { DateTime } from 'luxon';

import { hourToString } from '../../../../app.types';
import { getLightTooltip } from '../../../../share/lib.functions';
import { graphFeature } from '../../../../store/graph/graph.reducers';
import {
  ActiveItem,
  Duration,
  LightStatus,
  LightType,
} from '../../../../store/graph/graph.types';
import { LightActions } from '../../../../store/light/light.actions';
import { lightFeature } from '../../../../store/light/light.reducers';
import { LightSwitch, Status } from '../../../../store/light/light.types';
import { LightSwitchComponent } from '../light-switch/light-switch.component';

interface NextBlock {
  title: string;
  start: string | undefined;
}

interface Current {
  title: string;
  lightStatus: LightStatus;
  time: string;
  duration: Duration | undefined;
  toEnd: Duration | undefined;
  restProcents: number | undefined;
  nextBlock: NextBlock;
}

@Component({
  selector: 'app-current-situation',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './current-situation.component.html',
  viewProviders: [provideIcons({ saxFlash1Bold, saxFlashSlashBold })],
  imports: [NgIconComponent, LightSwitchComponent],
})
export class CurrentSituationComponent {
  private readonly store = inject(Store);

  private readonly activeItem = this.store.selectSignal(
    graphFeature.selectActiveItem,
  );
  private readonly currentDayLightList: Signal<
    Record<string, LightSwitch> | undefined
  > = this.store.selectSignal(lightFeature.selectCurrentLight);

  private readonly activeLight = computed(() => {
    const lightList = this.currentDayLightList();
    const blockTimes = this.activeItem()?.block.items.map((item) => item.time);

    if (lightList && blockTimes) {
      return Object.values(lightList)
        .filter((light) => blockTimes.includes(light.hourString))
        .sort((n1, n2) => {
          if (n1.hourString > n2.hourString) {
            return 1;
          }

          if (n1.hourString < n2.hourString) {
            return -1;
          }
          return 0;
        })
        .at(-1);
    }
    return undefined;
  });

  LightType = LightType;
  LightStatus = LightStatus;

  current = computed<Current | null>(() => {
    const activeItem = this.activeItem();
    const activeLight = this.activeLight();

    return activeItem
      ? {
          title: getLightTooltip(
            this.getLightStatus(activeLight, activeItem.type),
          ),
          duration: activeItem.block.toNowDuration,
          toEnd: activeItem.block.toEndDuration,
          type: activeItem.type,
          time: activeItem.time,
          restProcents: activeItem.block.restInPercents
            ? 100 - Math.round(activeItem.block.restInPercents)
            : undefined,
          lightStatus: this.getLightStatus(activeLight, activeItem.type),
          nextBlock: this.getNextBlock(activeItem),
        }
      : null;
  });

  switchLight(status: Status) {
    this.store.dispatch(
      status === 'on'
        ? LightActions.setLightOn({ time: DateTime.now() })
        : LightActions.setLightOff({ time: DateTime.now() }),
    );
  }

  isLightOn(current: Current) {
    return (
      current.lightStatus === LightStatus.ON ||
      current.lightStatus === LightStatus.MAYBE_ON
    );
  }

  private getNextBlock(activeItem: ActiveItem): NextBlock {
    return {
      title: this.createNextBlockTitle(activeItem.type),
      start: activeItem.block.endHour
        ? hourToString(activeItem.block.endHour.hour)
        : undefined,
    };
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

  private getLightStatus(
    activeLight: LightSwitch | undefined,
    type: LightType,
  ): LightStatus {
    if (activeLight) {
      return activeLight.status === 'off' ? LightStatus.OFF : LightStatus.ON;
    } else {
      return type === LightType.NORMAL
        ? LightStatus.MAYBE_ON
        : LightStatus.MAYBE_OFF;
    }
  }
}
