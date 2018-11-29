import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FullpageComponent } from './fullpage.component';
import {ScrollToModule} from '@nicky-lenaers/ngx-scroll-to';

@NgModule({
  declarations: [FullpageComponent],
  imports: [
    CommonModule,
    ScrollToModule.forRoot()
  ],
  exports: [FullpageComponent]
})
export class FullpageModule { }
