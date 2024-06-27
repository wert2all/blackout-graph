import { ChangeDetectionStrategy, Component } from '@angular/core';
enum LightType {
  BLACKOUT = 'blackout',
  MAYBE_BLACKOUT = 'maybe-blackout',
  NORMAL = 'normal',
}

interface LightItem {
  time: string;
  active: boolean;
  type: LightType;
}

@Component({
  selector: 'app-timeline',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './timeline.component.html',
  styleUrls: ['./timeline.component.scss'],
})
export class TimelineComponent {
  LightType = LightType;
  timeItems = [
    { time: '10:00', active: false, type: LightType.NORMAL },
    { time: '11:00', active: false, type: LightType.BLACKOUT },
    { time: '12:00', active: false, type: LightType.BLACKOUT },
    { time: '13:00', active: false, type: LightType.BLACKOUT },
    { time: '14:00', active: true, type: LightType.BLACKOUT },
    { time: '15:00', active: false, type: LightType.MAYBE_BLACKOUT },
    { time: '16:00', active: false, type: LightType.MAYBE_BLACKOUT },
    { time: '17:00', active: false, type: LightType.NORMAL },
  ];

  isFirst(item: LightItem, itemIndex: number): boolean {
    if (item.type !== LightType.NORMAL) {
      const previous = this.timeItems[itemIndex - 1];
      return previous === undefined || previous.type === LightType.NORMAL;
    }
    return false;
  }
  isLast(item: LightItem, itemIndex: number): boolean {
    if (item.type !== LightType.NORMAL) {
      const next = this.timeItems[itemIndex + 1];
      return next === undefined || next.type === LightType.NORMAL;
    }
    return false;
  }
}
