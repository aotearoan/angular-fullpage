import {InputType} from './input-type.model';
import {SwipeDirection} from './swipe-direction.model';

export class SwipeEvent {
  public inputType: InputType;
  public direction: SwipeDirection;
  public startEvent: Event;
  public endEvent: Event;
}
