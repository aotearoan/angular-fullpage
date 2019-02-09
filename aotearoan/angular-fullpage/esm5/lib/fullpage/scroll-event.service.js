/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
var ScrollEventService = /** @class */ (function () {
    function ScrollEventService() {
        var _this = this;
        this.listeners = {};
        this.eventsSubject = new Subject();
        this.subscription = this.eventsSubject.subscribe(function (index) {
            Object.keys(_this.listeners).forEach(function (key) { return _this.listeners[key].scroll(index); });
        });
    }
    /**
     * @return {?}
     */
    ScrollEventService.prototype.ngOnDestroy = /**
     * @return {?}
     */
    function () {
        this.eventsSubject.complete();
        this.subscription.unsubscribe();
        this.subscription.destroy();
        this.listeners = {};
    };
    /**
     * @param {?} key
     * @param {?} listener
     * @return {?}
     */
    ScrollEventService.prototype.addListener = /**
     * @param {?} key
     * @param {?} listener
     * @return {?}
     */
    function (key, listener) {
        this.listeners[key] = listener;
    };
    /**
     * @param {?} key
     * @return {?}
     */
    ScrollEventService.prototype.removeListener = /**
     * @param {?} key
     * @return {?}
     */
    function (key) {
        if (this.listeners[key]) {
            delete this.listeners[key];
        }
    };
    /**
     * @param {?} index
     * @return {?}
     */
    ScrollEventService.prototype.scroll = /**
     * @param {?} index
     * @return {?}
     */
    function (index) {
        this.eventsSubject.next(index);
    };
    ScrollEventService.decorators = [
        { type: Injectable },
    ];
    /** @nocollapse */
    ScrollEventService.ctorParameters = function () { return []; };
    return ScrollEventService;
}());
export { ScrollEventService };
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2Nyb2xsLWV2ZW50LnNlcnZpY2UuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9AYW90ZWFyb2FuL2FuZ3VsYXItZnVsbHBhZ2UvIiwic291cmNlcyI6WyJsaWIvZnVsbHBhZ2Uvc2Nyb2xsLWV2ZW50LnNlcnZpY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7OztBQUFBLE9BQU8sRUFBRSxVQUFVLEVBQWEsTUFBTSxlQUFlLENBQUM7QUFDdEQsT0FBTyxFQUFFLE9BQU8sRUFBRSxNQUFNLE1BQU0sQ0FBQztBQUUvQjtJQU9FO1FBQUEsaUJBTUM7UUFUTSxjQUFTLEdBQUcsRUFBRSxDQUFDO1FBQ2Ysa0JBQWEsR0FBRyxJQUFJLE9BQU8sRUFBRSxDQUFDO1FBR25DLElBQUksQ0FBQyxZQUFZLEdBQUcsSUFBSSxDQUFDLGFBQWEsQ0FBQyxTQUFTLENBQzlDLFVBQUMsS0FBSztZQUNKLE1BQU0sQ0FBQyxJQUFJLENBQUMsS0FBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxVQUFDLEdBQUcsSUFBSyxPQUFBLEtBQUksQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxFQUFqQyxDQUFpQyxDQUFDLENBQUM7UUFDbEYsQ0FBQyxDQUNGLENBQUM7SUFDSixDQUFDOzs7O0lBRU0sd0NBQVc7OztJQUFsQjtRQUNFLElBQUksQ0FBQyxhQUFhLENBQUMsUUFBUSxFQUFFLENBQUM7UUFDOUIsSUFBSSxDQUFDLFlBQVksQ0FBQyxXQUFXLEVBQUUsQ0FBQztRQUNoQyxJQUFJLENBQUMsWUFBWSxDQUFDLE9BQU8sRUFBRSxDQUFDO1FBQzVCLElBQUksQ0FBQyxTQUFTLEdBQUcsRUFBRSxDQUFDO0lBQ3RCLENBQUM7Ozs7OztJQUVNLHdDQUFXOzs7OztJQUFsQixVQUFtQixHQUFXLEVBQUUsUUFBOEI7UUFDNUQsSUFBSSxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsR0FBRyxRQUFRLENBQUM7SUFDakMsQ0FBQzs7Ozs7SUFFTSwyQ0FBYzs7OztJQUFyQixVQUFzQixHQUFXO1FBQy9CLElBQUksSUFBSSxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsRUFBRTtZQUN2QixPQUFPLElBQUksQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLENBQUM7U0FDNUI7SUFDSCxDQUFDOzs7OztJQUVNLG1DQUFNOzs7O0lBQWIsVUFBYyxLQUFhO1FBQ3pCLElBQUksQ0FBQyxhQUFhLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO0lBQ2pDLENBQUM7O2dCQWxDRixVQUFVOzs7O0lBbUNYLHlCQUFDO0NBQUEsQUFuQ0QsSUFtQ0M7U0FsQ1ksa0JBQWtCOzs7SUFFN0IsMENBQW9COztJQUNwQix1Q0FBc0I7O0lBQ3RCLDJDQUFxQzs7Ozs7QUFnQ3ZDLDBDQUVDOzs7Ozs7SUFEQyw2REFBc0IiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBJbmplY3RhYmxlLCBPbkRlc3Ryb3kgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IFN1YmplY3QgfSBmcm9tICdyeGpzJztcblxuQEluamVjdGFibGUoKVxuZXhwb3J0IGNsYXNzIFNjcm9sbEV2ZW50U2VydmljZSBpbXBsZW1lbnRzIE9uRGVzdHJveSB7XG5cbiAgcHVibGljIHN1YnNjcmlwdGlvbjtcbiAgcHVibGljIGxpc3RlbmVycyA9IHt9O1xuICBwdWJsaWMgZXZlbnRzU3ViamVjdCA9IG5ldyBTdWJqZWN0KCk7XG5cbiAgY29uc3RydWN0b3IoKSB7XG4gICAgdGhpcy5zdWJzY3JpcHRpb24gPSB0aGlzLmV2ZW50c1N1YmplY3Quc3Vic2NyaWJlKFxuICAgICAgKGluZGV4KSA9PiB7XG4gICAgICAgIE9iamVjdC5rZXlzKHRoaXMubGlzdGVuZXJzKS5mb3JFYWNoKChrZXkpID0+IHRoaXMubGlzdGVuZXJzW2tleV0uc2Nyb2xsKGluZGV4KSk7XG4gICAgICB9LFxuICAgICk7XG4gIH1cblxuICBwdWJsaWMgbmdPbkRlc3Ryb3koKSB7XG4gICAgdGhpcy5ldmVudHNTdWJqZWN0LmNvbXBsZXRlKCk7XG4gICAgdGhpcy5zdWJzY3JpcHRpb24udW5zdWJzY3JpYmUoKTtcbiAgICB0aGlzLnN1YnNjcmlwdGlvbi5kZXN0cm95KCk7XG4gICAgdGhpcy5saXN0ZW5lcnMgPSB7fTtcbiAgfVxuXG4gIHB1YmxpYyBhZGRMaXN0ZW5lcihrZXk6IHN0cmluZywgbGlzdGVuZXI6IElTY3JvbGxFdmVudExpc3RlbmVyKSB7XG4gICAgdGhpcy5saXN0ZW5lcnNba2V5XSA9IGxpc3RlbmVyO1xuICB9XG5cbiAgcHVibGljIHJlbW92ZUxpc3RlbmVyKGtleTogc3RyaW5nKSB7XG4gICAgaWYgKHRoaXMubGlzdGVuZXJzW2tleV0pIHtcbiAgICAgIGRlbGV0ZSB0aGlzLmxpc3RlbmVyc1trZXldO1xuICAgIH1cbiAgfVxuXG4gIHB1YmxpYyBzY3JvbGwoaW5kZXg6IG51bWJlcikge1xuICAgIHRoaXMuZXZlbnRzU3ViamVjdC5uZXh0KGluZGV4KTtcbiAgfVxufVxuXG5leHBvcnQgaW50ZXJmYWNlIElTY3JvbGxFdmVudExpc3RlbmVyIHtcbiAgc2Nyb2xsKGluZGV4OiBudW1iZXIpO1xufVxuIl19