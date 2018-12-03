import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ScrollToModule } from '@nicky-lenaers/ngx-scroll-to';
import { FullpageComponent } from './fullpage.component';

@NgModule({
  declarations: [FullpageComponent],
  exports: [FullpageComponent],
  imports: [
    CommonModule,
    ScrollToModule.forRoot(),
  ],
})
export class FullpageModule { }
