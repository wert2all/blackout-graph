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
import { Info } from 'luxon';

import { LightItem, LightType } from '../../../app.types';
import { graphFeature } from '../../../store/graph.reducers';

type ViewLigthItem = LightItem & {
  icon: string | undefined;
  weekdayName: string;
};

@Component({
  selector: 'app-timeline',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgIconComponent],
  viewProviders: [
    provideIcons({
      saxFlashSlashBold,
      saxFlash1Bold,
      saxFlashBulk,
      saxFlashSlashBulk,
    }),
  ],
  templateUrl: './timeline.component.html',
  styleUrls: ['./timeline.component.scss'],
})
export class TimelineComponent {
  private readonly store = inject(Store);
  private readonly timeline = this.store.selectSignal(
    graphFeature.selectTimeline,
  );

  LightType = LightType;

  viewItems = computed(() =>
    this.timeline().map(
      (item): ViewLigthItem => ({
        ...item,
        icon: this.getIcon(item.type),
        weekdayName: Info.weekdays()[item.weekday - 1],
      }),
    ),
  );

  isStartBlock(item: LightItem, index: number) {
    return this.isBlockChange(item, this.timeline()[index - 1]);
  }

  isEndBlock(item: LightItem, index: number) {
    return this.isBlockChange(item, this.timeline()[index + 1]);
  }

  private isBlockChange(item: LightItem, second: LightItem | undefined) {
    if (second === undefined) {
      return true;
    }
    switch (item.type) {
      case LightType.NORMAL:
        return second.type !== LightType.NORMAL;
      case LightType.MAYBE_BLACKOUT:
        return second.type === LightType.NORMAL;
      case LightType.BLACKOUT:
        return second.type === LightType.NORMAL;
    }
  }

  private getIcon(type: LightType): string | undefined {
    switch (type) {
      case LightType.BLACKOUT:
        return saxFlashSlashBulk;
      case LightType.MAYBE_BLACKOUT:
        return saxFlashBulk;
      case LightType.NORMAL:
        return saxFlash1Bold;
    }
  }
}
