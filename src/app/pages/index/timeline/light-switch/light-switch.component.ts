import { Component, computed, input, output } from '@angular/core';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import { hugeIdea, hugeIdea01 } from '@ng-icons/huge-icons';

import { getLightTooltip } from '../../../../share/lib.functions';
import { LightStatus } from '../../../../store/graph/graph.types';
import { Status } from '../../../../store/light/light.types';

@Component({
  selector: 'app-light-switch',
  standalone: true,
  templateUrl: './light-switch.component.html',
  viewProviders: [provideIcons({ hugeIdea, hugeIdea01 })],
  imports: [NgIconComponent],
})
export class LightSwitchComponent {
  status = input.required<LightStatus>();
  switch = output<Status>();

  light = computed(() => {
    const status = this.status();
    return {
      isMaybe:
        status == LightStatus.MAYBE_OFF || status == LightStatus.MAYBE_ON,
      icon:
        status == LightStatus.MAYBE_ON || status == LightStatus.ON
          ? hugeIdea01
          : hugeIdea,
      tooltip: getLightTooltip(status),
    };
  });

  toggle() {
    this.switch.emit(
      this.status() == LightStatus.MAYBE_ON || this.status() == LightStatus.ON
        ? 'off'
        : 'on',
    );
  }
}
