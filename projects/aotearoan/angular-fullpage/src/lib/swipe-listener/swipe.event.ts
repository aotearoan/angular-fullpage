import {SwipeDirection} from './swipe-direction.model';

export class SwipeEvent {
  public direction: SwipeDirection;
  public startEvent: TouchEvent;
  public endEvent: TouchEvent;
}
