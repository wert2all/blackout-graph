import {
  ChangeDetectionStrategy,
  Component,
  computed,
  signal,
} from '@angular/core';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import { saxFlash1Bold, saxFlashSlashBold } from '@ng-icons/iconsax/bold';
import { saxFlashBulk, saxFlashSlashBulk } from '@ng-icons/iconsax/bulk';
import { DateTime } from 'luxon';
enum LightType {
  BLACKOUT = 'blackout',
  MAYBE_BLACKOUT = 'maybe-blackout',
  NORMAL = 'normal',
}

interface LightItem {
  time: string;
  type: LightType;
}
type ViewLigthItem = LightItem & { active: boolean; icon: string | undefined };

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
  LightType = LightType;
  timeItems = signal<LightItem[]>([
    { time: '10:00', type: LightType.NORMAL },
    { time: '11:00', type: LightType.BLACKOUT },
    { time: '12:00', type: LightType.BLACKOUT },
    { time: '13:00', type: LightType.BLACKOUT },
    { time: '14:00', type: LightType.BLACKOUT },
    { time: '15:00', type: LightType.MAYBE_BLACKOUT },
    { time: '16:00', type: LightType.MAYBE_BLACKOUT },
    { time: '17:00', type: LightType.NORMAL },
  ]);

  viewItems = computed(() => {
    const dt = DateTime.now();

    return this.timeItems().map((item): ViewLigthItem => {
      return {
        ...item,
        active: item.time === dt.toFormat('HH:00'),
        icon: this.getIcon(item.type),
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
