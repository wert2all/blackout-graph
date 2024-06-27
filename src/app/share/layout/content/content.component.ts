import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-layout-content',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './content.component.html',
})
export class ContentComponent { }
