import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SwipeListenerModule} from '../swipe-listener/swipe-listener.module';
import { WindowRefModule } from '../window-ref/window-ref.module';
import { FullpageComponent } from './fullpage.component';
import { ScrollEventService } from './scroll-event.service';

@NgModule({
  declarations: [
    FullpageComponent,
  ],
  exports: [FullpageComponent],
  imports: [
    CommonModule,
    WindowRefModule,
    SwipeListenerModule,
  ],
  providers: [ScrollEventService],
})
export class FullpageModule { }
