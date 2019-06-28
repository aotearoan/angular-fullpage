import { ModuleWithProviders } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SectionAComponent } from './section-a/section-a.component';
import { SectionBComponent } from './section-b/section-b.component';
import { SectionCComponent } from './section-c/section-c.component';
import { SectionDComponent } from './section-d/section-d.component';

export const routes: Routes = [
  { path: '', redirectTo: 'section-a', pathMatch: 'full' },
  { path: 'section-a', component: SectionAComponent, data: { animation: '0' } },
  { path: 'section-b', component: SectionBComponent, data: { animation: '1' } },
  { path: 'section-c', component: SectionCComponent, data: { animation: '2' } },
  { path: 'section-d', component: SectionDComponent, data: { animation: '3' } },
];

export const routing: ModuleWithProviders = RouterModule.forRoot(routes);
