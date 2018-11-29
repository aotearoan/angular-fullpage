import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PageComponent } from './page.component';
import { SectionModule} from '../section/section.module';
import {FullpageModule} from '../fullpage/fullpage.module';

@NgModule({
  declarations: [PageComponent],
  imports: [
    CommonModule,
    SectionModule,
    FullpageModule
  ],
  exports: [PageComponent]
})
export class PageModule { }
