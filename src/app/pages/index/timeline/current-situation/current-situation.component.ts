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
  Duration,
  LightStatus,
  LightType,
} from '../../../../store/graph/graph.types';
import { LightActions } from '../../../../store/light/light.actions';
import { lightFeature } from '../../../../store/light/light.reducers';
import { LightSwitch, Status } from '../../../../store/light/light.types';
import { LightSwitchComponent } from '../light-switch/light-switch.component';

interface Current {
  title: string;
  lightStatus: LightStatus;
  nextBlockTitle: string;
  time: string;
  duration: Duration | undefined;
  toEnd: Duration | undefined;
  nextBlockStart: string | undefined;
  restProcents: number | undefined;
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
  private readonly activeLight: Signal<LightSwitch | undefined> =
    this.store.selectSignal(lightFeature.selectCurrentLight);

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
          lightStatus: this.getLightStatus(activeLight, activeItem.type),
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
