import { Component, input } from '@angular/core';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import { hugeIdea, hugeIdea01 } from '@ng-icons/huge-icons';

export interface ViewLight {
  on: boolean;
  icon: string;
}

@Component({
  selector: 'app-light-switch',
  standalone: true,
  templateUrl: './light-switch.component.html',
  viewProviders: [provideIcons({ hugeIdea, hugeIdea01 })],
  imports: [NgIconComponent],
})
export class LightSwitchComponent {
  light = input.required<ViewLight>();
}
