import { RouterModule, Routes } from '@angular/router';
import {PageComponent} from './page/page.component';
import {ModuleWithProviders} from '@angular/core';

export const routes: Routes = [
  { path: '', redirectTo: '/a/b', pathMatch: 'full' },
  { path: 'a', children: [
      { path: 'b', component: PageComponent }
    ]}
];

export const routing: ModuleWithProviders = RouterModule.forRoot(routes);
