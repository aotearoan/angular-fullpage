import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SwipeListenerDirective } from './swipe-listener.directive';

@NgModule({
  declarations: [SwipeListenerDirective],
  imports: [
    CommonModule,
  ],
  exports: [SwipeListenerDirective],
})
export class SwipeListenerModule { }
