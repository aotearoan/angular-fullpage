import { OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
export declare class ScrollEventService implements OnDestroy {
    subscription: any;
    listeners: {};
    eventsSubject: Subject<{}>;
    constructor();
    ngOnDestroy(): void;
    addListener(key: string, listener: IScrollEventListener): void;
    removeListener(key: string): void;
    scroll(index: number): void;
}
export interface IScrollEventListener {
    scroll(index: number): any;
}
