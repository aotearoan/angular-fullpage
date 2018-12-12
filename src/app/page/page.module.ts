import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FullpageModule } from '../modules/fullpage/fullpage.module';
import { SectionModule } from '../section/section.module';
import { PageComponent } from './page.component';

@NgModule({
  declarations: [PageComponent],
  exports: [PageComponent],
  imports: [
    CommonModule,
    SectionModule,
    FullpageModule,
  ],
})
export class PageModule { }
