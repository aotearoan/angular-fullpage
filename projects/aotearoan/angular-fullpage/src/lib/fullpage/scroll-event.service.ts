import { Injectable, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable()
export class ScrollEventService implements OnDestroy {

  public subscription;
  public listeners = {};
  public eventsSubject = new Subject();

  constructor() {
    this.subscription = this.eventsSubject.subscribe(
      (index) => {
        Object.keys(this.listeners).forEach((key) => this.listeners[key].scroll(index));
      },
    );
  }

  public ngOnDestroy() {
    this.eventsSubject.complete();
    this.subscription.unsubscribe();
    this.subscription.destroy();
    this.listeners = {};
  }

  public addListener(key: string, listener: IScrollEventListener) {
    this.listeners[key] = listener;
  }

  public removeListener(key: string) {
    if (this.listeners[key]) {
      delete this.listeners[key];
    }
  }

  public scroll(index: number) {
    this.eventsSubject.next(index);
  }
}

export interface IScrollEventListener {
  scroll(index: number);
}
