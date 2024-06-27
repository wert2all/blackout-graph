import { Routes } from '@angular/router';

import { IndexPageComponent } from './pages/index/index-page.component';

export const routes: Routes = [
  {
    path: '**',
    component: IndexPageComponent,
  },
];
