import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  signal,
} from '@angular/core';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import { saxFlash1Bold, saxFlashSlashBold } from '@ng-icons/iconsax/bold';
import { saxFlashBulk, saxFlashSlashBulk } from '@ng-icons/iconsax/bulk';
import { DateTime, Info } from 'luxon';

import { GraphGroups, LightItem, LightType } from '../../../app.types';
import { GraphService } from '../../../services/graph.service';

type ViewLigthItem = LightItem & {
  active: boolean;
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
  private readonly graphService = inject(GraphService);
  private readonly dateTime = DateTime.now();
  private readonly group: GraphGroups = 'group3';

  LightType = LightType;
  timeItems = signal<LightItem[]>(
    this.graphService.getLightItems(
      this.group,
      this.dateTime.weekday,
      this.dateTime.hour,
    ),
  );

  viewItems = computed(() => {
    return this.timeItems().map((item): ViewLigthItem => {
      return {
        ...item,
        active:
          item.weekday === this.dateTime.weekday &&
          item.time === this.dateTime.toFormat('HH:00'),
        icon: this.getIcon(item.type),
        weekdayName: Info.weekdays()[item.weekday - 1],
      };
    });
  });

  isFirst(item: ViewLigthItem, itemIndex: number): boolean {
    if (item.type !== LightType.NORMAL) {
      const previous = this.timeItems()[itemIndex - 1];
      return previous === undefined || previous.type === LightType.NORMAL;
    }
    return false;
  }
  isLast(item: ViewLigthItem, itemIndex: number): boolean {
    if (item.type !== LightType.NORMAL) {
      const next = this.timeItems()[itemIndex + 1];
      return next === undefined || next.type === LightType.NORMAL;
    }
    return false;
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
