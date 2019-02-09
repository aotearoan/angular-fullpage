/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
import { DOCUMENT, PlatformLocation } from '@angular/common';
import { Component, EventEmitter, HostListener, Inject, Input, Output } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ScrollToService } from '@nicky-lenaers/ngx-scroll-to';
import { finalize } from 'rxjs/operators';
import { WindowRefService } from '../window-ref/window-ref.service';
import { ScrollEventService } from './scroll-event.service';
var FullpageComponent = /** @class */ (function () {
    function FullpageComponent(scrollToService, route, router, document, windowRef, scrollEventService, platformLocation) {
        var _this = this;
        this.scrollToService = scrollToService;
        this.route = route;
        this.router = router;
        this.document = document;
        this.windowRef = windowRef;
        this.scrollEventService = scrollEventService;
        this.platformLocation = platformLocation;
        this.scrollSensitivity = 1250;
        this.sectionChange = new EventEmitter();
        this.window = windowRef.getNativeWindow();
        platformLocation.onPopState(function () {
            _this.window.location.reload();
        });
    }
    /**
     * @return {?}
     */
    FullpageComponent.prototype.ngOnInit = /**
     * @return {?}
     */
    function () {
        var _this = this;
        // listen to scroll events from other components
        this.scrollEventService.addListener(FullpageComponent.eventListenerKey, this);
        // capture all scroll wheel events while scrolling is active (prevents the default action)
        this.window.onwheel = function () { return !_this.scrolling; };
        // needs to happen after rendering
        setTimeout(function () {
            /** @type {?} */
            var fragment = _this.route.snapshot.fragment;
            /** @type {?} */
            var index = Math.max(_this.sections.findIndex(function (s) { return s.url === fragment; }), 0);
            _this.switchSections(index);
            _this.scroll(index);
        }, 200);
    };
    /**
     * @return {?}
     */
    FullpageComponent.prototype.ngOnDestroy = /**
     * @return {?}
     */
    function () {
        this.scrollEventService.removeListener(FullpageComponent.eventListenerKey);
    };
    /**
     * @param {?} index
     * @return {?}
     */
    FullpageComponent.prototype.scroll = /**
     * @param {?} index
     * @return {?}
     */
    function (index) {
        if (!this.lockScrolling && index !== this.sectionIndex && !this.sectionScrolling) {
            this.scrolling = true;
            this.switchSections(index);
            this.invokeScroll();
        }
    };
    /**
     * @private
     * @param {?} index
     * @return {?}
     */
    FullpageComponent.prototype.switchSections = /**
     * @private
     * @param {?} index
     * @return {?}
     */
    function (index) {
        this.previousSectionIndex = this.sectionIndex;
        this.sectionIndex = index;
        if (this.activeSection) {
            this.activeSection.classList.remove(FullpageComponent.activeClass);
        }
        /** @type {?} */
        var section = this.sections[this.sectionIndex];
        this.activeSection = this.document.getElementById(section.url);
        if (this.activeSection) {
            this.activeSection.classList.add(FullpageComponent.activeClass);
        }
        this.sections.forEach(function (s) { return s.active = s.url === section.url; });
        this.sectionChange.emit(section.url);
    };
    /**
     * @private
     * @return {?}
     */
    FullpageComponent.prototype.invokeScroll = /**
     * @private
     * @return {?}
     */
    function () {
        var _this = this;
        /** @type {?} */
        var section = this.sections[this.sectionIndex];
        /** @type {?} */
        var config = {
            target: section.url,
        };
        this.router.navigate([this.window.location.pathname], { fragment: section.url });
        this.scrollToService.scrollTo(config)
            .pipe(finalize(function () {
            setTimeout(function () {
                _this.scrolling = false;
            }, FullpageComponent.scrollingCompleteSensitivity);
        })).subscribe();
    };
    /**
     * @param {?} event
     * @return {?}
     */
    FullpageComponent.prototype.scrollUp = /**
     * @param {?} event
     * @return {?}
     */
    function (event) {
        /** @type {?} */
        var sectionPosition = this.calcSectionPosition();
        if (this.lockScrolling) {
            if (sectionPosition.atSectionTop) {
                event.preventDefault();
            }
            else {
                // if scrolling sections is locked and we're not at the top of the section - activate section scrolling
                this.activateSectionScrolling();
            }
        }
        else if (this.canScroll(event) && this.canScrollUp(event, sectionPosition)) {
            if (this.sectionIndex > 0) {
                this.scroll(this.sectionIndex - 1);
            }
            else if (event.type !== 'wheel') {
                // prevent default when this is the top section and we are scrolling up
                event.preventDefault();
            }
        }
        else {
            this.activateSectionScrolling();
        }
    };
    /**
     * @param {?} event
     * @return {?}
     */
    FullpageComponent.prototype.scrollDown = /**
     * @param {?} event
     * @return {?}
     */
    function (event) {
        /** @type {?} */
        var sectionPosition = this.calcSectionPosition();
        if (this.lockScrolling) {
            if (sectionPosition.atSectionBottom) {
                event.preventDefault();
            }
            else {
                // if scrolling sections is locked and we're not at the bottom of the section - activate section scrolling
                this.activateSectionScrolling();
            }
        }
        else if (this.canScroll(event) && this.canScrollDown(event, sectionPosition)) {
            if (this.sectionIndex < this.sections.length - 1) {
                this.scroll(this.sectionIndex + 1);
            }
            else if (event.type !== 'wheel') {
                // prevent default when this is the bottom section and we are scrolling down
                event.preventDefault();
            }
        }
        else {
            this.activateSectionScrolling();
        }
    };
    /**
     * @private
     * @return {?}
     */
    FullpageComponent.prototype.activateSectionScrolling = /**
     * @private
     * @return {?}
     */
    function () {
        var _this = this;
        this.sectionScrolling = true;
        if (this.sectionScrollingTimeout) {
            clearTimeout(this.sectionScrollingTimeout);
        }
        this.sectionScrollingTimeout = setTimeout(function () {
            _this.sectionScrolling = false;
            if (_this.sectionScrollingTimeout) {
                clearTimeout(_this.sectionScrollingTimeout);
            }
        }, this.scrollSensitivity);
    };
    /**
     * @private
     * @param {?} event
     * @return {?}
     */
    FullpageComponent.prototype.canScroll = /**
     * @private
     * @param {?} event
     * @return {?}
     */
    function (event) {
        return event.type !== 'keydown' || this.checkFocus();
    };
    /**
     * @return {?}
     */
    FullpageComponent.prototype.checkFocus = /**
     * @return {?}
     */
    function () {
        return !FullpageComponent.ignoreWhenFocused.includes(this.document.activeElement.localName);
    };
    /**
     * @private
     * @param {?} event
     * @param {?} sectionPosition
     * @return {?}
     */
    FullpageComponent.prototype.canScrollUp = /**
     * @private
     * @param {?} event
     * @param {?} sectionPosition
     * @return {?}
     */
    function (event, sectionPosition) {
        return event.type !== 'wheel' || sectionPosition.atSectionTop;
    };
    /**
     * @private
     * @param {?} event
     * @param {?} sectionPosition
     * @return {?}
     */
    FullpageComponent.prototype.canScrollDown = /**
     * @private
     * @param {?} event
     * @param {?} sectionPosition
     * @return {?}
     */
    function (event, sectionPosition) {
        return event.type !== 'wheel' || sectionPosition.atSectionBottom;
    };
    /**
     * @private
     * @return {?}
     */
    FullpageComponent.prototype.calcSectionPosition = /**
     * @private
     * @return {?}
     */
    function () {
        return {
            atSectionTop: !!this.activeSection && this.activeSection.scrollTop === 0,
            atSectionBottom: !!this.activeSection &&
                this.activeSection.offsetHeight + this.activeSection.scrollTop >= this.activeSection.scrollHeight,
        };
    };
    /**
     * @param {?} event
     * @return {?}
     */
    FullpageComponent.prototype.fullpageWindowScroll = /**
     * @param {?} event
     * @return {?}
     */
    function (event) {
        if (!this.scrolling) {
            if (event.deltaY > 0) {
                this.scrollDown(event);
            }
            else {
                this.scrollUp(event);
            }
        }
        else {
            event.preventDefault();
        }
    };
    /**
     * @param {?} event
     * @return {?}
     */
    FullpageComponent.prototype.fullpageArrowUpEvent = /**
     * @param {?} event
     * @return {?}
     */
    function (event) {
        this.scrollUp(event);
    };
    /**
     * @param {?} event
     * @return {?}
     */
    FullpageComponent.prototype.fullpageArrowDownEvent = /**
     * @param {?} event
     * @return {?}
     */
    function (event) {
        this.scrollDown(event);
    };
    /**
     * @return {?}
     */
    FullpageComponent.prototype.fullpageResizeEvent = /**
     * @return {?}
     */
    function () {
        /** @type {?} */
        var section = this.sections[this.sectionIndex];
        /** @type {?} */
        var config = {
            target: section.url,
        };
        this.scrollToService.scrollTo(config);
    };
    // if focus is on a form input then disable scrolling so that the form is usable
    FullpageComponent.ignoreWhenFocused = ['textarea', 'input'];
    FullpageComponent.eventListenerKey = 'fullpage';
    FullpageComponent.activeClass = 'fullpage-active';
    FullpageComponent.scrollingCompleteSensitivity = 750;
    FullpageComponent.decorators = [
        { type: Component, args: [{
                    selector: 'ao-fullpage',
                    styles: ["\n    ::ng-deep .fullpage {\n      display: flex;\n      flex-direction: column;\n      margin: 0;\n    }\n\n    ::ng-deep .fullpage .fullpage-section {\n      width: 100vw;\n      height: 100vh;\n      overflow-y: scroll;\n      overflow-x: hidden;\n    }\n\n    ::ng-deep .fullpage .fullpage-section-fit-content {\n      width: 100vw;\n    }\n\n    ::ng-deep body {\n      padding: 0;\n      margin: 0;\n    }\n\n    ::ng-deep html,\n    ::ng-deep body,\n    ::ng-deep .fullpage-section {\n      -ms-overflow-style: -ms-autohiding-scrollbar;\n    }\n\n    ::ng-deep html::-webkit-scrollbar,\n    ::ng-deep body::-webkit-scrollbar,\n    ::ng-deep .fullpage-section::-webkit-scrollbar {\n      width: 0;\n    }\n  "],
                    template: "\n    <div class=\"fullpage\" *ngIf=\"sections\" [class.scrolling]=\"scrolling\">\n      <ng-content></ng-content>\n    </div>\n  ",
                },] },
    ];
    /** @nocollapse */
    FullpageComponent.ctorParameters = function () { return [
        { type: ScrollToService },
        { type: ActivatedRoute },
        { type: Router },
        { type: undefined, decorators: [{ type: Inject, args: [DOCUMENT,] }] },
        { type: WindowRefService },
        { type: ScrollEventService },
        { type: PlatformLocation }
    ]; };
    FullpageComponent.propDecorators = {
        sections: [{ type: Input }],
        lockScrolling: [{ type: Input }],
        scrollSensitivity: [{ type: Input }],
        sectionChange: [{ type: Output }],
        fullpageWindowScroll: [{ type: HostListener, args: ['window:wheel', ['$event'],] }],
        fullpageArrowUpEvent: [{ type: HostListener, args: ['window:keydown.PageUp', ['$event'],] }, { type: HostListener, args: ['window:keydown.ArrowUp', ['$event'],] }, { type: HostListener, args: ['window:keydown.shift.space', ['$event'],] }],
        fullpageArrowDownEvent: [{ type: HostListener, args: ['window:keydown.PageDown', ['$event'],] }, { type: HostListener, args: ['window:keydown.ArrowDown', ['$event'],] }, { type: HostListener, args: ['window:keydown.space', ['$event'],] }],
        fullpageResizeEvent: [{ type: HostListener, args: ['window:resize',] }]
    };
    return FullpageComponent;
}());
export { FullpageComponent };
if (false) {
    /** @type {?} */
    FullpageComponent.ignoreWhenFocused;
    /** @type {?} */
    FullpageComponent.eventListenerKey;
    /** @type {?} */
    FullpageComponent.activeClass;
    /** @type {?} */
    FullpageComponent.scrollingCompleteSensitivity;
    /** @type {?} */
    FullpageComponent.prototype.window;
    /** @type {?} */
    FullpageComponent.prototype.activeSection;
    /** @type {?} */
    FullpageComponent.prototype.previousSectionIndex;
    /** @type {?} */
    FullpageComponent.prototype.sectionIndex;
    /** @type {?} */
    FullpageComponent.prototype.scrolling;
    /** @type {?} */
    FullpageComponent.prototype.sectionScrolling;
    /** @type {?} */
    FullpageComponent.prototype.sectionScrollingTimeout;
    /** @type {?} */
    FullpageComponent.prototype.sections;
    /** @type {?} */
    FullpageComponent.prototype.lockScrolling;
    /** @type {?} */
    FullpageComponent.prototype.scrollSensitivity;
    /** @type {?} */
    FullpageComponent.prototype.sectionChange;
    /**
     * @type {?}
     * @private
     */
    FullpageComponent.prototype.scrollToService;
    /**
     * @type {?}
     * @private
     */
    FullpageComponent.prototype.route;
    /**
     * @type {?}
     * @private
     */
    FullpageComponent.prototype.router;
    /**
     * @type {?}
     * @private
     */
    FullpageComponent.prototype.document;
    /**
     * @type {?}
     * @private
     */
    FullpageComponent.prototype.windowRef;
    /**
     * @type {?}
     * @private
     */
    FullpageComponent.prototype.scrollEventService;
    /**
     * @type {?}
     * @private
     */
    FullpageComponent.prototype.platformLocation;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZnVsbHBhZ2UuY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6Im5nOi8vQGFvdGVhcm9hbi9hbmd1bGFyLWZ1bGxwYWdlLyIsInNvdXJjZXMiOlsibGliL2Z1bGxwYWdlL2Z1bGxwYWdlLmNvbXBvbmVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7O0FBQUEsT0FBTyxFQUFFLFFBQVEsRUFBRSxnQkFBZ0IsRUFBRSxNQUFNLGlCQUFpQixDQUFDO0FBQzdELE9BQU8sRUFBRSxTQUFTLEVBQUUsWUFBWSxFQUFFLFlBQVksRUFBRSxNQUFNLEVBQUUsS0FBSyxFQUFxQixNQUFNLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFDaEgsT0FBTyxFQUFFLGNBQWMsRUFBRSxNQUFNLEVBQUUsTUFBTSxpQkFBaUIsQ0FBQztBQUN6RCxPQUFPLEVBQXlCLGVBQWUsRUFBRSxNQUFNLDhCQUE4QixDQUFDO0FBQ3RGLE9BQU8sRUFBRSxRQUFRLEVBQUUsTUFBTSxnQkFBZ0IsQ0FBQztBQUMxQyxPQUFPLEVBQUUsZ0JBQWdCLEVBQUUsTUFBTSxrQ0FBa0MsQ0FBQztBQUNwRSxPQUFPLEVBQXdCLGtCQUFrQixFQUFFLE1BQU0sd0JBQXdCLENBQUM7QUFJbEY7SUFnRUUsMkJBQTJCLGVBQWdDLEVBQ2hDLEtBQXFCLEVBQ3JCLE1BQWMsRUFDSSxRQUFhLEVBQy9CLFNBQTJCLEVBQzNCLGtCQUFzQyxFQUN0QyxnQkFBa0M7UUFON0QsaUJBV0M7UUFYMEIsb0JBQWUsR0FBZixlQUFlLENBQWlCO1FBQ2hDLFVBQUssR0FBTCxLQUFLLENBQWdCO1FBQ3JCLFdBQU0sR0FBTixNQUFNLENBQVE7UUFDSSxhQUFRLEdBQVIsUUFBUSxDQUFLO1FBQy9CLGNBQVMsR0FBVCxTQUFTLENBQWtCO1FBQzNCLHVCQUFrQixHQUFsQixrQkFBa0IsQ0FBb0I7UUFDdEMscUJBQWdCLEdBQWhCLGdCQUFnQixDQUFrQjtRQVQ3QyxzQkFBaUIsR0FBRyxJQUFJLENBQUM7UUFDeEIsa0JBQWEsR0FBRyxJQUFJ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OEM7Ozs7O0lBQzlDLDZDQUEwQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IERPQ1VNRU5ULCBQbGF0Zm9ybUxvY2F0aW9uIH0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uJztcbmltcG9ydCB7IENvbXBvbmVudCwgRXZlbnRFbWl0dGVyLCBIb3N0TGlzdGVuZXIsIEluamVjdCwgSW5wdXQsIE9uRGVzdHJveSwgT25Jbml0LCBPdXRwdXQgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IEFjdGl2YXRlZFJvdXRlLCBSb3V0ZXIgfSBmcm9tICdAYW5ndWxhci9yb3V0ZXInO1xuaW1wb3J0IHsgU2Nyb2xsVG9Db25maWdPcHRpb25zLCBTY3JvbGxUb1NlcnZpY2UgfSBmcm9tICdAbmlja3ktbGVuYWVycy9uZ3gtc2Nyb2xsLXRvJztcbmltcG9ydCB7IGZpbmFsaXplIH0gZnJvbSAncnhqcy9vcGVyYXRvcnMnO1xuaW1wb3J0IHsgV2luZG93UmVmU2VydmljZSB9IGZyb20gJy4uL3dpbmRvdy1yZWYvd2luZG93LXJlZi5zZXJ2aWNlJztcbmltcG9ydCB7IElTY3JvbGxFdmVudExpc3RlbmVyLCBTY3JvbGxFdmVudFNlcnZpY2UgfSBmcm9tICcuL3Njcm9sbC1ldmVudC5zZXJ2aWNlJztcbmltcG9ydCB7IFNlY3Rpb25Qb3NpdGlvbk1vZGVsIH0gZnJvbSAnLi9zZWN0aW9uLXBvc2l0aW9uLm1vZGVsJztcbmltcG9ydCB7IFNlY3Rpb25Nb2RlbCB9IGZyb20gJy4vc2VjdGlvbi5tb2RlbCc7XG5cbkBDb21wb25lbnQoe1xuICBzZWxlY3RvcjogJ2FvLWZ1bGxwYWdlJyxcbiAgc3R5bGVzOiBbYFxuICAgIDo6bmctZGVlcCAuZnVsbHBhZ2Uge1xuICAgICAgZGlzcGxheTogZmxleDtcbiAgICAgIGZsZXgtZGlyZWN0aW9uOiBjb2x1bW47XG4gICAgICBtYXJnaW46IDA7XG4gICAgfVxuXG4gICAgOjpuZy1kZWVwIC5mdWxscGFnZSAuZnVsbHBhZ2Utc2VjdGlvbiB7XG4gICAgICB3aWR0aDogMTAwdnc7XG4gICAgICBoZWlnaHQ6IDEwMHZoO1xuICAgICAgb3ZlcmZsb3cteTogc2Nyb2xsO1xuICAgICAgb3ZlcmZsb3cteDogaGlkZGVuO1xuICAgIH1cblxuICAgIDo6bmctZGVlcCAuZnVsbHBhZ2UgLmZ1bGxwYWdlLXNlY3Rpb24tZml0LWNvbnRlbnQge1xuICAgICAgd2lkdGg6IDEwMHZ3O1xuICAgIH1cblxuICAgIDo6bmctZGVlcCBib2R5IHtcbiAgICAgIHBhZGRpbmc6IDA7XG4gICAgICBtYXJnaW46IDA7XG4gICAgfVxuXG4gICAgOjpuZy1kZWVwIGh0bWwsXG4gICAgOjpuZy1kZWVwIGJvZHksXG4gICAgOjpuZy1kZWVwIC5mdWxscGFnZS1zZWN0aW9uIHtcbiAgICAgIC1tcy1vdmVyZmxvdy1zdHlsZTogLW1zLWF1dG9oaWRpbmctc2Nyb2xsYmFyO1xuICAgIH1cblxuICAgIDo6bmctZGVlcCBodG1sOjotd2Via2l0LXNjcm9sbGJhcixcbiAgICA6Om5nLWRlZXAgYm9keTo6LXdlYmtpdC1zY3JvbGxiYXIsXG4gICAgOjpuZy1kZWVwIC5mdWxscGFnZS1zZWN0aW9uOjotd2Via2l0LXNjcm9sbGJhciB7XG4gICAgICB3aWR0aDogMDtcbiAgICB9XG4gIGBdLFxuICB0ZW1wbGF0ZTogYFxuICAgIDxkaXYgY2xhc3M9XCJmdWxscGFnZVwiICpuZ0lmPVwic2VjdGlvbnNcIiBbY2xhc3Muc2Nyb2xsaW5nXT1cInNjcm9sbGluZ1wiPlxuICAgICAgPG5nLWNvbnRlbnQ+PC9uZy1jb250ZW50PlxuICAgIDwvZGl2PlxuICBgLFxufSlcbmV4cG9ydCBjbGFzcyBGdWxscGFnZUNvbXBvbmVudCBpbXBsZW1lbnRzIE9uSW5pdCwgT25EZXN0cm95LCBJU2Nyb2xsRXZlbnRMaXN0ZW5lciB7XG5cbiAgLy8gaWYgZm9jdXMgaXMgb24gYSBmb3JtIGlucHV0IHRoZW4gZGlzYWJsZSBzY3JvbGxpbmcgc28gdGhhdCB0aGUgZm9ybSBpcyB1c2FibGVcbiAgcHVibGljIHN0YXRpYyBpZ25vcmVXaGVuRm9jdXNlZCA9IFsndGV4dGFyZWEnLCAnaW5wdXQnXTtcbiAgcHVibGljIHN0YXRpYyBldmVudExpc3RlbmVyS2V5ID0gJ2Z1bGxwYWdlJztcbiAgcHVibGljIHN0YXRpYyBhY3RpdmVDbGFzcyA9ICdmdWxscGFnZS1hY3RpdmUnO1xuICBwdWJsaWMgc3RhdGljIHNjcm9sbGluZ0NvbXBsZXRlU2Vuc2l0aXZpdHkgPSA3NTA7XG5cbiAgcHVibGljIHdpbmRvdztcbiAgcHVibGljIGFjdGl2ZVNlY3Rpb247XG4gIHB1YmxpYyBwcmV2aW91c1NlY3Rpb25JbmRleDogbnVtYmVyO1xuICBwdWJsaWMgc2VjdGlvbkluZGV4OiBudW1iZXI7XG4gIHB1YmxpYyBzY3JvbGxpbmc6IGJvb2xlYW47XG4gIHB1YmxpYyBzZWN0aW9uU2Nyb2xsaW5nOiBib29sZWFuO1xuICBwdWJsaWMgc2VjdGlvblNjcm9sbGluZ1RpbWVvdXQ7XG5cbiAgQElucHV0KCkgcHVibGljIHNlY3Rpb25zOiBTZWN0aW9uTW9kZWxbXTtcbiAgQElucHV0KCkgcHVibGljIGxvY2tTY3JvbGxpbmc6IGJvb2xlYW47XG4gIEBJbnB1dCgpIHB1YmxpYyBzY3JvbGxTZW5zaXRpdml0eSA9IDEyNTA7XG4gIEBPdXRwdXQoKSBwdWJsaWMgc2VjdGlvbkNoYW5nZSA9IG5ldyBFdmVudEVtaXR0ZXI8c3RyaW5nPigpO1xuXG4gIHB1YmxpYyBjb25zdHJ1Y3Rvcihwcml2YXRlIHNjcm9sbFRvU2VydmljZTogU2Nyb2xsVG9TZXJ2aWNlLFxuICAgICAgICAgICAgICAgICAgICAgcHJpdmF0ZSByb3V0ZTogQWN0aXZhdGVkUm91dGUsXG4gICAgICAgICAgICAgICAgICAgICBwcml2YXRlIHJvdXRlcjogUm91dGVyLFxuICAgICAgICAgICAgICAgICAgICAgQEluamVjdChET0NVTUVOVCkgcHJpdmF0ZSBkb2N1bWVudDogYW55LFxuICAgICAgICAgICAgICAgICAgICAgcHJpdmF0ZSB3aW5kb3dSZWY6IFdpbmRvd1JlZlNlcnZpY2UsXG4gICAgICAgICAgICAgICAgICAgICBwcml2YXRlIHNjcm9sbEV2ZW50U2VydmljZTogU2Nyb2xsRXZlbnRTZXJ2aWNlLFxuICAgICAgICAgICAgICAgICAgICAgcHJpdmF0ZSBwbGF0Zm9ybUxvY2F0aW9uOiBQbGF0Zm9ybUxvY2F0aW9uKSB7XG4gICAgdGhpcy53aW5kb3cgPSB3aW5kb3dSZWYuZ2V0TmF0aXZlV2luZG93KCk7XG4gICAgcGxhdGZvcm1Mb2NhdGlvbi5vblBvcFN0YXRlKCgpID0+IHtcbiAgICAgIHRoaXMud2luZG93LmxvY2F0aW9uLnJlbG9hZCgpO1xuICAgIH0pO1xuICB9XG5cbiAgcHVibGljIG5nT25Jbml0KCkge1xuICAgIC8vIGxpc3RlbiB0byBzY3JvbGwgZXZlbnRzIGZyb20gb3RoZXIgY29tcG9uZW50c1xuICAgIHRoaXMuc2Nyb2xsRXZlbnRTZXJ2aWNlLmFkZExpc3RlbmVyKEZ1bGxwYWdlQ29tcG9uZW50LmV2ZW50TGlzdGVuZXJLZXksIHRoaXMpO1xuXG4gICAgLy8gY2FwdHVyZSBhbGwgc2Nyb2xsIHdoZWVsIGV2ZW50cyB3aGlsZSBzY3JvbGxpbmcgaXMgYWN0aXZlIChwcmV2ZW50cyB0aGUgZGVmYXVsdCBhY3Rpb24pXG4gICAgdGhpcy53aW5kb3cub253aGVlbCA9ICgpID0+ICF0aGlzLnNjcm9sbGluZztcblxuICAgIC8vIG5lZWRzIHRvIGhhcHBlbiBhZnRlciByZW5kZXJpbmdcbiAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgIGNvbnN0IGZyYWdtZW50ID0gdGhpcy5yb3V0ZS5zbmFwc2hvdC5mcmFnbWVudDtcbiAgICAgIGNvbnN0IGluZGV4ID0gTWF0aC5tYXgodGhpcy5zZWN0aW9ucy5maW5kSW5kZXgoKHMpID0+IHMudXJsID09PSBmcmFnbWVudCksIDApO1xuICAgICAgdGhpcy5zd2l0Y2hTZWN0aW9ucyhpbmRleCk7XG4gICAgICB0aGlzLnNjcm9sbChpbmRleCk7XG4gICAgfSwgMjAwKTtcbiAgfVxuXG4gIHB1YmxpYyBuZ09uRGVzdHJveSgpIHtcbiAgICB0aGlzLnNjcm9sbEV2ZW50U2VydmljZS5yZW1vdmVMaXN0ZW5lcihGdWxscGFnZUNvbXBvbmVudC5ldmVudExpc3RlbmVyS2V5KTtcbiAgfVxuXG4gIHB1YmxpYyBzY3JvbGwoaW5kZXg6IG51bWJlcikge1xuICAgIGlmICghdGhpcy5sb2NrU2Nyb2xsaW5nICYmIGluZGV4ICE9PSB0aGlzLnNlY3Rpb25JbmRleCAmJiAhdGhpcy5zZWN0aW9uU2Nyb2xsaW5nKSB7XG4gICAgICB0aGlzLnNjcm9sbGluZyA9IHRydWU7XG4gICAgICB0aGlzLnN3aXRjaFNlY3Rpb25zKGluZGV4KTtcbiAgICAgIHRoaXMuaW52b2tlU2Nyb2xsKCk7XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSBzd2l0Y2hTZWN0aW9ucyhpbmRleDogbnVtYmVyKSB7XG4gICAgdGhpcy5wcmV2aW91c1NlY3Rpb25JbmRleCA9IHRoaXMuc2VjdGlvbkluZGV4O1xuICAgIHRoaXMuc2VjdGlvbkluZGV4ID0gaW5kZXg7XG5cbiAgICBpZiAodGhpcy5hY3RpdmVTZWN0aW9uKSB7XG4gICAgICB0aGlzLmFjdGl2ZVNlY3Rpb24uY2xhc3NMaXN0LnJlbW92ZShGdWxscGFnZUNvbXBvbmVudC5hY3RpdmVDbGFzcyk7XG4gICAgfVxuXG4gICAgY29uc3Qgc2VjdGlvbiA9IHRoaXMuc2VjdGlvbnNbdGhpcy5zZWN0aW9uSW5kZXhdO1xuICAgIHRoaXMuYWN0aXZlU2VjdGlvbiA9IHRoaXMuZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoc2VjdGlvbi51cmwpO1xuXG4gICAgaWYgKHRoaXMuYWN0aXZlU2VjdGlvbikge1xuICAgICAgdGhpcy5hY3RpdmVTZWN0aW9uLmNsYXNzTGlzdC5hZGQoRnVsbHBhZ2VDb21wb25lbnQuYWN0aXZlQ2xhc3MpO1xuICAgIH1cblxuICAgIHRoaXMuc2VjdGlvbnMuZm9yRWFjaCgocykgPT4gcy5hY3RpdmUgPSBzLnVybCA9PT0gc2VjdGlvbi51cmwpO1xuICAgIHRoaXMuc2VjdGlvbkNoYW5nZS5lbWl0KHNlY3Rpb24udXJsKTtcbiAgfVxuXG4gIHByaXZhdGUgaW52b2tlU2Nyb2xsKCkge1xuICAgIGNvbnN0IHNlY3Rpb24gPSB0aGlzLnNlY3Rpb25zW3RoaXMuc2VjdGlvbkluZGV4XTtcbiAgICBjb25zdCBjb25maWc6IFNjcm9sbFRvQ29uZmlnT3B0aW9ucyA9IHtcbiAgICAgIHRhcmdldDogc2VjdGlvbi51cmwsXG4gICAgfTtcblxuICAgIHRoaXMucm91dGVyLm5hdmlnYXRlKFt0aGlzLndpbmRvdy5sb2NhdGlvbi5wYXRobmFtZV0sIHtmcmFnbWVudDogc2VjdGlvbi51cmx9KTtcbiAgICB0aGlzLnNjcm9sbFRvU2VydmljZS5zY3JvbGxUbyhjb25maWcpXG4gICAgICAucGlwZShcbiAgICAgICAgZmluYWxpemUoKCkgPT4ge1xuICAgICAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICAgICAgdGhpcy5zY3JvbGxpbmcgPSBmYWxzZTtcbiAgICAgICAgICB9LCBGdWxscGFnZUNvbXBvbmVudC5zY3JvbGxpbmdDb21wbGV0ZVNlbnNpdGl2aXR5KTtcbiAgICAgICAgfSksXG4gICAgICApLnN1YnNjcmliZSgpO1xuICB9XG5cbiAgcHVibGljIHNjcm9sbFVwKGV2ZW50OiBFdmVudCkge1xuICAgIGNvbnN0IHNlY3Rpb25Qb3NpdGlvbiA9IHRoaXMuY2FsY1NlY3Rpb25Qb3NpdGlvbigpO1xuICAgIGlmICh0aGlzLmxvY2tTY3JvbGxpbmcpIHtcbiAgICAgIGlmIChzZWN0aW9uUG9zaXRpb24uYXRTZWN0aW9uVG9wKSB7XG4gICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICAvLyBpZiBzY3JvbGxpbmcgc2VjdGlvbnMgaXMgbG9ja2VkIGFuZCB3ZSdyZSBub3QgYXQgdGhlIHRvcCBvZiB0aGUgc2VjdGlvbiAtIGFjdGl2YXRlIHNlY3Rpb24gc2Nyb2xsaW5nXG4gICAgICAgIHRoaXMuYWN0aXZhdGVTZWN0aW9uU2Nyb2xsaW5nKCk7XG4gICAgICB9XG4gICAgfSBlbHNlIGlmICh0aGlzLmNhblNjcm9sbChldmVudCkgJiYgdGhpcy5jYW5TY3JvbGxVcChldmVudCwgc2VjdGlvblBvc2l0aW9uKSkge1xuICAgICAgaWYgKHRoaXMuc2VjdGlvbkluZGV4ID4gMCkge1xuICAgICAgICB0aGlzLnNjcm9sbCh0aGlzLnNlY3Rpb25JbmRleCAtIDEpO1xuICAgICAgfSBlbHNlIGlmIChldmVudC50eXBlICE9PSAnd2hlZWwnKSB7XG4gICAgICAgIC8vIHByZXZlbnQgZGVmYXVsdCB3aGVuIHRoaXMgaXMgdGhlIHRvcCBzZWN0aW9uIGFuZCB3ZSBhcmUgc2Nyb2xsaW5nIHVwXG4gICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuYWN0aXZhdGVTZWN0aW9uU2Nyb2xsaW5nKCk7XG4gICAgfVxuICB9XG5cbiAgcHVibGljIHNjcm9sbERvd24oZXZlbnQ6IEV2ZW50KSB7XG4gICAgY29uc3Qgc2VjdGlvblBvc2l0aW9uID0gdGhpcy5jYWxjU2VjdGlvblBvc2l0aW9uKCk7XG4gICAgaWYgKHRoaXMubG9ja1Njcm9sbGluZykge1xuICAgICAgaWYgKHNlY3Rpb25Qb3NpdGlvbi5hdFNlY3Rpb25Cb3R0b20pIHtcbiAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIC8vIGlmIHNjcm9sbGluZyBzZWN0aW9ucyBpcyBsb2NrZWQgYW5kIHdlJ3JlIG5vdCBhdCB0aGUgYm90dG9tIG9mIHRoZSBzZWN0aW9uIC0gYWN0aXZhdGUgc2VjdGlvbiBzY3JvbGxpbmdcbiAgICAgICAgdGhpcy5hY3RpdmF0ZVNlY3Rpb25TY3JvbGxpbmcoKTtcbiAgICAgIH1cbiAgICB9IGVsc2UgaWYgKHRoaXMuY2FuU2Nyb2xsKGV2ZW50KSAmJiB0aGlzLmNhblNjcm9sbERvd24oZXZlbnQsIHNlY3Rpb25Qb3NpdGlvbikpIHtcbiAgICAgIGlmICh0aGlzLnNlY3Rpb25JbmRleCA8IHRoaXMuc2VjdGlvbnMubGVuZ3RoIC0gMSkge1xuICAgICAgICB0aGlzLnNjcm9sbCh0aGlzLnNlY3Rpb25JbmRleCArIDEpO1xuICAgICAgfSBlbHNlIGlmIChldmVudC50eXBlICE9PSAnd2hlZWwnKSB7XG4gICAgICAgIC8vIHByZXZlbnQgZGVmYXVsdCB3aGVuIHRoaXMgaXMgdGhlIGJvdHRvbSBzZWN0aW9uIGFuZCB3ZSBhcmUgc2Nyb2xsaW5nIGRvd25cbiAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5hY3RpdmF0ZVNlY3Rpb25TY3JvbGxpbmcoKTtcbiAgICB9XG4gIH1cblxuICBwcml2YXRlIGFjdGl2YXRlU2VjdGlvblNjcm9sbGluZygpIHtcbiAgICB0aGlzLnNlY3Rpb25TY3JvbGxpbmcgPSB0cnVlO1xuICAgIGlmICh0aGlzLnNlY3Rpb25TY3JvbGxpbmdUaW1lb3V0KSB7XG4gICAgICBjbGVhclRpbWVvdXQodGhpcy5zZWN0aW9uU2Nyb2xsaW5nVGltZW91dCk7XG4gICAgfVxuICAgIHRoaXMuc2VjdGlvblNjcm9sbGluZ1RpbWVvdXQgPSBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgIHRoaXMuc2VjdGlvblNjcm9sbGluZyA9IGZhbHNlO1xuICAgICAgaWYgKHRoaXMuc2VjdGlvblNjcm9sbGluZ1RpbWVvdXQpIHtcbiAgICAgICAgY2xlYXJUaW1lb3V0KHRoaXMuc2VjdGlvblNjcm9sbGluZ1RpbWVvdXQpO1xuICAgICAgfVxuICAgIH0sIHRoaXMuc2Nyb2xsU2Vuc2l0aXZpdHkpO1xuICB9XG5cbiAgcHJpdmF0ZSBjYW5TY3JvbGwoZXZlbnQ6IEV2ZW50KSB7XG4gICAgcmV0dXJuIGV2ZW50LnR5cGUgIT09ICdrZXlkb3duJyB8fCB0aGlzLmNoZWNrRm9jdXMoKTtcbiAgfVxuXG4gIHB1YmxpYyBjaGVja0ZvY3VzKCkge1xuICAgIHJldHVybiAhRnVsbHBhZ2VDb21wb25lbnQuaWdub3JlV2hlbkZvY3VzZWQuaW5jbHVkZXModGhpcy5kb2N1bWVudC5hY3RpdmVFbGVtZW50LmxvY2FsTmFtZSk7XG4gIH1cblxuICBwcml2YXRlIGNhblNjcm9sbFVwKGV2ZW50OiBFdmVudCwgc2VjdGlvblBvc2l0aW9uOiBTZWN0aW9uUG9zaXRpb25Nb2RlbCkge1xuICAgIHJldHVybiBldmVudC50eXBlICE9PSAnd2hlZWwnIHx8IHNlY3Rpb25Qb3NpdGlvbi5hdFNlY3Rpb25Ub3A7XG4gIH1cblxuICBwcml2YXRlIGNhblNjcm9sbERvd24oZXZlbnQ6IEV2ZW50LCBzZWN0aW9uUG9zaXRpb246IFNlY3Rpb25Qb3NpdGlvbk1vZGVsKSB7XG4gICAgcmV0dXJuIGV2ZW50LnR5cGUgIT09ICd3aGVlbCcgfHwgc2VjdGlvblBvc2l0aW9uLmF0U2VjdGlvbkJvdHRvbTtcbiAgfVxuXG4gIHByaXZhdGUgY2FsY1NlY3Rpb25Qb3NpdGlvbigpOiBTZWN0aW9uUG9zaXRpb25Nb2RlbCB7XG4gICAgcmV0dXJuIHtcbiAgICAgIGF0U2VjdGlvblRvcDogISF0aGlzLmFjdGl2ZVNlY3Rpb24gJiYgdGhpcy5hY3RpdmVTZWN0aW9uLnNjcm9sbFRvcCA9PT0gMCxcbiAgICAgIGF0U2VjdGlvbkJvdHRvbTogISF0aGlzLmFjdGl2ZVNlY3Rpb24gJiZcbiAgICAgICAgdGhpcy5hY3RpdmVTZWN0aW9uLm9mZnNldEhlaWdodCArIHRoaXMuYWN0aXZlU2VjdGlvbi5zY3JvbGxUb3AgPj0gdGhpcy5hY3RpdmVTZWN0aW9uLnNjcm9sbEhlaWdodCxcbiAgICB9O1xuICB9XG5cbiAgQEhvc3RMaXN0ZW5lcignd2luZG93OndoZWVsJywgWyckZXZlbnQnXSlcbiAgcHVibGljIGZ1bGxwYWdlV2luZG93U2Nyb2xsKGV2ZW50OiBXaGVlbEV2ZW50KSB7XG4gICAgaWYgKCF0aGlzLnNjcm9sbGluZykge1xuICAgICAgaWYgKGV2ZW50LmRlbHRhWSA+IDApIHtcbiAgICAgICAgdGhpcy5zY3JvbGxEb3duKGV2ZW50KTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMuc2Nyb2xsVXAoZXZlbnQpO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgIH1cbiAgfVxuXG4gIEBIb3N0TGlzdGVuZXIoJ3dpbmRvdzprZXlkb3duLlBhZ2VVcCcsIFsnJGV2ZW50J10pXG4gIEBIb3N0TGlzdGVuZXIoJ3dpbmRvdzprZXlkb3duLkFycm93VXAnLCBbJyRldmVudCddKVxuICBASG9zdExpc3RlbmVyKCd3aW5kb3c6a2V5ZG93bi5zaGlmdC5zcGFjZScsIFsnJGV2ZW50J10pXG4gIHB1YmxpYyBmdWxscGFnZUFycm93VXBFdmVudChldmVudDogS2V5Ym9hcmRFdmVudCkge1xuICAgIHRoaXMuc2Nyb2xsVXAoZXZlbnQpO1xuICB9XG5cbiAgQEhvc3RMaXN0ZW5lcignd2luZG93OmtleWRvd24uUGFnZURvd24nLCBbJyRldmVudCddKVxuICBASG9zdExpc3RlbmVyKCd3aW5kb3c6a2V5ZG93bi5BcnJvd0Rvd24nLCBbJyRldmVudCddKVxuICBASG9zdExpc3RlbmVyKCd3aW5kb3c6a2V5ZG93bi5zcGFjZScsIFsnJGV2ZW50J10pXG4gIHB1YmxpYyBmdWxscGFnZUFycm93RG93bkV2ZW50KGV2ZW50OiBLZXlib2FyZEV2ZW50KSB7XG4gICAgdGhpcy5zY3JvbGxEb3duKGV2ZW50KTtcbiAgfVxuXG4gIEBIb3N0TGlzdGVuZXIoJ3dpbmRvdzpyZXNpemUnKVxuICBwdWJsaWMgZnVsbHBhZ2VSZXNpemVFdmVudCgpIHtcbiAgICBjb25zdCBzZWN0aW9uID0gdGhpcy5zZWN0aW9uc1t0aGlzLnNlY3Rpb25JbmRleF07XG4gICAgY29uc3QgY29uZmlnOiBTY3JvbGxUb0NvbmZpZ09wdGlvbnMgPSB7XG4gICAgICB0YXJnZXQ6IHNlY3Rpb24udXJsLFxuICAgIH07XG5cbiAgICB0aGlzLnNjcm9sbFRvU2VydmljZS5zY3JvbGxUbyhjb25maWcpO1xuICB9XG59XG4iXX0=