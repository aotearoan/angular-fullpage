import {Directive, EventEmitter, HostListener, Input, Output} from '@angular/core';
import {InputType} from './input-type.model';
import {SwipeDirection} from './swipe-direction.model';
import {SwipeEvent} from './swipe.event';

@Directive({
  selector: '[aoSwipeListener]',
})
export class SwipeListenerDirective {
  public lastTouchStartEvent: TouchEvent;
  public multitouch: boolean;
  @Input() public directSwipeTolerance = 30;
  @Input() public stylusSwipeTolerance = 10;
  @Output() public swipeEvent = new EventEmitter<SwipeEvent>();

  @HostListener('window:touchstart', ['$event'])
  @HostListener('window:touchmove', ['$event'])
  @HostListener('window:touchend', ['$event'])
  public swipeEventListener(event: TouchEvent) {
    if (event.type === 'touchstart') {
      this.multitouch = event.touches.length === 2;
      this.lastTouchStartEvent = event;
      event.preventDefault();
    } else if (event.type === 'touchend') {
      if (!this.multitouch) {
        const startX = this.lastTouchStartEvent.touches[0].screenX;
        const startY = this.lastTouchStartEvent.touches[0].screenY;

        const inputType = this.lastTouchStartEvent.touches[0].touchType === InputType.Stylus ? InputType.Stylus : InputType.Direct;
        const swipeTolerance = inputType === InputType.Stylus ? this.stylusSwipeTolerance : this.directSwipeTolerance;

        const endX = event.changedTouches[0].screenX;
        const endY = event.changedTouches[0].screenY;

        const xShift = Math.abs(startX - endX);
        const yShift = Math.abs(startY - endY);

        if (xShift > swipeTolerance || yShift > swipeTolerance) {
          const direction = xShift >= yShift
            ? (startX - endX > 0 ? SwipeDirection.Left : SwipeDirection.Right)
            : (startY - endY > 0 ? SwipeDirection.Up : SwipeDirection.Down);
          this.swipeEvent.emit({
            inputType,
            direction,
            startEvent: this.lastTouchStartEvent,
            endEvent: event,
          });
        } else {
            event.target.dispatchEvent(new MouseEvent('click', {bubbles: true}));
            event.preventDefault();
        }
      }
      this.lastTouchStartEvent = undefined;
      this.multitouch = undefined;
    } else {
      event.preventDefault();
    }
  }
}
