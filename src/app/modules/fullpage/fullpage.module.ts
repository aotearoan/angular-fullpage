import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ScrollToModule } from '@nicky-lenaers/ngx-scroll-to';
import { FullpageComponent } from './fullpage.component';
import { ScrollEventService } from './scroll-event.service';

@NgModule({
  declarations: [
    FullpageComponent,
  ],
  exports: [FullpageComponent],
  imports: [
    CommonModule,
    ScrollToModule.forRoot(),
  ],
  providers: [ScrollEventService],
})
export class FullpageModule { }
