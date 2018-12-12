import { ModuleWithProviders } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PageComponent } from './page/page.component';

export const routes: Routes = [
  { path: '', component: PageComponent },
];

export const routing: ModuleWithProviders = RouterModule.forRoot(routes);
