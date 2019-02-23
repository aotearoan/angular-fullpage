import {Directive, EventEmitter, HostListener, Input, Output} from '@angular/core';
import {SwipeDirection} from './swipe-direction.model';
import {SwipeEvent} from './swipe.event';

@Directive({
  selector: '[aoSwipeListener]',
})
export class SwipeListenerDirective {
  public lastTouchStartEvent: TouchEvent;
  @Input() public swipeTolerance = 10;
  @Output() public swipeEvent = new EventEmitter<SwipeEvent>();

  @HostListener('window:touchstart', ['$event'])
  @HostListener('window:touchmove', ['$event'])
  @HostListener('window:touchend', ['$event'])
  public swipeEventListener(event: TouchEvent) {
    if (event.type === 'touchstart') {
      this.lastTouchStartEvent = event;
      event.preventDefault();
    } else if (event.type === 'touchend') {
      const startX = this.lastTouchStartEvent.touches[0].screenX;
      const startY = this.lastTouchStartEvent.touches[0].screenY;

      const endX = event.changedTouches[0].screenX;
      const endY = event.changedTouches[0].screenY;

      const xShift = Math.abs(startX - endX);
      const yShift = Math.abs(startY - endY);

      if (xShift > this.swipeTolerance || yShift > this.swipeTolerance) {
        const direction = xShift >= yShift
          ? (startX - endX > 0 ? SwipeDirection.Left : SwipeDirection.Right)
          : (startY - endY > 0 ? SwipeDirection.Up : SwipeDirection.Down);
        this.swipeEvent.emit({
          direction,
          startEvent: this.lastTouchStartEvent,
          endEvent: event,
        });
      } else {
        event.preventDefault();
      }
      this.lastTouchStartEvent = undefined;
    } else {
      event.preventDefault();
    }
  }
}
