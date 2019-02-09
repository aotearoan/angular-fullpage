/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
export class ScrollEventService {
    constructor() {
        this.listeners = {};
        this.eventsSubject = new Subject();
        this.subscription = this.eventsSubject.subscribe((index) => {
            Object.keys(this.listeners).forEach((key) => this.listeners[key].scroll(index));
        });
    }
    /**
     * @return {?}
     */
    ngOnDestroy() {
        this.eventsSubject.complete();
        this.subscription.unsubscribe();
        this.subscription.destroy();
        this.listeners = {};
    }
    /**
     * @param {?} key
     * @param {?} listener
     * @return {?}
     */
    addListener(key, listener) {
        this.listeners[key] = listener;
    }
    /**
     * @param {?} key
     * @return {?}
     */
    removeListener(key) {
        if (this.listeners[key]) {
            delete this.listeners[key];
        }
    }
    /**
     * @param {?} index
     * @return {?}
     */
    scroll(index) {
        this.eventsSubject.next(index);
    }
}
ScrollEventService.decorators = [
    { type: Injectable },
];
/** @nocollapse */
ScrollEventService.ctorParameters = () => [];
if (false) {
    /** @type {?} */
    ScrollEventService.prototype.subscription;
    /** @type {?} */
    ScrollEventService.prototype.listeners;
    /** @type {?} */
    ScrollEventService.prototype.eventsSubject;
}
/**
 * @record
 */
export function IScrollEventListener() { }
if (false) {
    /**
     * @param {?} index
     * @return {?}
     */
    IScrollEventListener.prototype.scroll = function (index) { };
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2Nyb2xsLWV2ZW50LnNlcnZpY2UuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9AYW90ZWFyb2FuL2FuZ3VsYXItZnVsbHBhZ2UvIiwic291cmNlcyI6WyJsaWIvZnVsbHBhZ2Uvc2Nyb2xsLWV2ZW50LnNlcnZpY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7OztBQUFBLE9BQU8sRUFBRSxVQUFVLEVBQWEsTUFBTSxlQUFlLENBQUM7QUFDdEQsT0FBTyxFQUFFLE9BQU8sRUFBRSxNQUFNLE1BQU0sQ0FBQztBQUcvQixNQUFNLE9BQU8sa0JBQWtCO0lBTTdCO1FBSE8sY0FBUyxHQUFHLEVBQUUsQ0FBQztRQUNmLGtCQUFhLEdBQUcsSUFBSSxPQUFPLEVBQUUsQ0FBQztRQUduQyxJQUFJLENBQUMsWUFBWSxHQUFHLElBQUksQ0FBQyxhQUFhLENBQUMsU0FBUyxDQUM5QyxDQUFDLEtBQUssRUFBRSxFQUFFO1lBQ1IsTUFBTSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsR0FBRyxFQUFFLEVBQUUsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDO1FBQ2xGLENBQUMsQ0FDRixDQUFDO0lBQ0osQ0FBQzs7OztJQUVNLFdBQVc7UUFDaEIsSUFBSSxDQUFDLGFBQWEsQ0FBQyxRQUFRLEVBQUUsQ0FBQztRQUM5QixJQUFJLENBQUMsWUFBWSxDQUFDLFdBQVcsRUFBRSxDQUFDO1FBQ2hDLElBQUksQ0FBQyxZQUFZLENBQUMsT0FBTyxFQUFFLENBQUM7UUFDNUIsSUFBSSxDQUFDLFNBQVMsR0FBRyxFQUFFLENBQUM7SUFDdEIsQ0FBQzs7Ozs7O0lBRU0sV0FBVyxDQUFDLEdBQVcsRUFBRSxRQUE4QjtRQUM1RCxJQUFJLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxHQUFHLFFBQVEsQ0FBQztJQUNqQyxDQUFDOzs7OztJQUVNLGNBQWMsQ0FBQyxHQUFXO1FBQy9CLElBQUksSUFBSSxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsRUFBRTtZQUN2QixPQUFPLElBQUksQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLENBQUM7U0FDNUI7SUFDSCxDQUFDOzs7OztJQUVNLE1BQU0sQ0FBQyxLQUFhO1FBQ3pCLElBQUksQ0FBQyxhQUFhLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO0lBQ2pDLENBQUM7OztZQWxDRixVQUFVOzs7Ozs7SUFHVCwwQ0FBb0I7O0lBQ3BCLHVDQUFzQjs7SUFDdEIsMkNBQXFDOzs7OztBQWdDdkMsMENBRUM7Ozs7OztJQURDLDZEQUFzQiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEluamVjdGFibGUsIE9uRGVzdHJveSB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgU3ViamVjdCB9IGZyb20gJ3J4anMnO1xuXG5ASW5qZWN0YWJsZSgpXG5leHBvcnQgY2xhc3MgU2Nyb2xsRXZlbnRTZXJ2aWNlIGltcGxlbWVudHMgT25EZXN0cm95IHtcblxuICBwdWJsaWMgc3Vic2NyaXB0aW9uO1xuICBwdWJsaWMgbGlzdGVuZXJzID0ge307XG4gIHB1YmxpYyBldmVudHNTdWJqZWN0ID0gbmV3IFN1YmplY3QoKTtcblxuICBjb25zdHJ1Y3RvcigpIHtcbiAgICB0aGlzLnN1YnNjcmlwdGlvbiA9IHRoaXMuZXZlbnRzU3ViamVjdC5zdWJzY3JpYmUoXG4gICAgICAoaW5kZXgpID0+IHtcbiAgICAgICAgT2JqZWN0LmtleXModGhpcy5saXN0ZW5lcnMpLmZvckVhY2goKGtleSkgPT4gdGhpcy5saXN0ZW5lcnNba2V5XS5zY3JvbGwoaW5kZXgpKTtcbiAgICAgIH0sXG4gICAgKTtcbiAgfVxuXG4gIHB1YmxpYyBuZ09uRGVzdHJveSgpIHtcbiAgICB0aGlzLmV2ZW50c1N1YmplY3QuY29tcGxldGUoKTtcbiAgICB0aGlzLnN1YnNjcmlwdGlvbi51bnN1YnNjcmliZSgpO1xuICAgIHRoaXMuc3Vic2NyaXB0aW9uLmRlc3Ryb3koKTtcbiAgICB0aGlzLmxpc3RlbmVycyA9IHt9O1xuICB9XG5cbiAgcHVibGljIGFkZExpc3RlbmVyKGtleTogc3RyaW5nLCBsaXN0ZW5lcjogSVNjcm9sbEV2ZW50TGlzdGVuZXIpIHtcbiAgICB0aGlzLmxpc3RlbmVyc1trZXldID0gbGlzdGVuZXI7XG4gIH1cblxuICBwdWJsaWMgcmVtb3ZlTGlzdGVuZXIoa2V5OiBzdHJpbmcpIHtcbiAgICBpZiAodGhpcy5saXN0ZW5lcnNba2V5XSkge1xuICAgICAgZGVsZXRlIHRoaXMubGlzdGVuZXJzW2tleV07XG4gICAgfVxuICB9XG5cbiAgcHVibGljIHNjcm9sbChpbmRleDogbnVtYmVyKSB7XG4gICAgdGhpcy5ldmVudHNTdWJqZWN0Lm5leHQoaW5kZXgpO1xuICB9XG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgSVNjcm9sbEV2ZW50TGlzdGVuZXIge1xuICBzY3JvbGwoaW5kZXg6IG51bWJlcik7XG59XG4iXX0=