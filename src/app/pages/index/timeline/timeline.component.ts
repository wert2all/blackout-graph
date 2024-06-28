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

import { LightItemWithBlock, LightType } from '../../../app.types';
import { graphFeature } from '../../../store/graph.reducers';

type ViewLigthItem = LightItemWithBlock & {
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
    graphFeature.selectTimelineWithBlocks,
  );

  LightType = LightType;

  viewItems = computed(() =>
    this.timeline().map(
      (item): ViewLigthItem => ({
        ...item,
        weekdayName: Info.weekdays()[item.weekday - 1],
      }),
    ),
  );
}
