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
export class FullpageComponent {
    /**
     * @param {?} scrollToService
     * @param {?} route
     * @param {?} router
     * @param {?} document
     * @param {?} windowRef
     * @param {?} scrollEventService
     * @param {?} platformLocation
     */
    constructor(scrollToService, route, router, document, windowRef, scrollEventService, platformLocation) {
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
        platformLocation.onPopState(() => {
            this.window.location.reload();
        });
    }
    /**
     * @return {?}
     */
    ngOnInit() {
        // listen to scroll events from other components
        this.scrollEventService.addListener(FullpageComponent.eventListenerKey, this);
        // capture all scroll wheel events while scrolling is active (prevents the default action)
        this.window.onwheel = () => !this.scrolling;
        // needs to happen after rendering
        setTimeout(() => {
            /** @type {?} */
            const fragment = this.route.snapshot.fragment;
            /** @type {?} */
            const index = Math.max(this.sections.findIndex((s) => s.url === fragment), 0);
            this.switchSections(index);
            this.scroll(index);
        }, 200);
    }
    /**
     * @return {?}
     */
    ngOnDestroy() {
        this.scrollEventService.removeListener(FullpageComponent.eventListenerKey);
    }
    /**
     * @param {?} index
     * @return {?}
     */
    scroll(index) {
        if (!this.lockScrolling && index !== this.sectionIndex && !this.sectionScrolling) {
            this.scrolling = true;
            this.switchSections(index);
            this.invokeScroll();
        }
    }
    /**
     * @private
     * @param {?} index
     * @return {?}
     */
    switchSections(index) {
        this.previousSectionIndex = this.sectionIndex;
        this.sectionIndex = index;
        if (this.activeSection) {
            this.activeSection.classList.remove(FullpageComponent.activeClass);
        }
        /** @type {?} */
        const section = this.sections[this.sectionIndex];
        this.activeSection = this.document.getElementById(section.url);
        if (this.activeSection) {
            this.activeSection.classList.add(FullpageComponent.activeClass);
        }
        this.sections.forEach((s) => s.active = s.url === section.url);
        this.sectionChange.emit(section.url);
    }
    /**
     * @private
     * @return {?}
     */
    invokeScroll() {
        /** @type {?} */
        const section = this.sections[this.sectionIndex];
        /** @type {?} */
        const config = {
            target: section.url,
        };
        this.router.navigate([this.window.location.pathname], { fragment: section.url });
        this.scrollToService.scrollTo(config)
            .pipe(finalize(() => {
            setTimeout(() => {
                this.scrolling = false;
            }, FullpageComponent.scrollingCompleteSensitivity);
        })).subscribe();
    }
    /**
     * @param {?} event
     * @return {?}
     */
    scrollUp(event) {
        /** @type {?} */
        const sectionPosition = this.calcSectionPosition();
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
    }
    /**
     * @param {?} event
     * @return {?}
     */
    scrollDown(event) {
        /** @type {?} */
        const sectionPosition = this.calcSectionPosition();
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
    }
    /**
     * @private
     * @return {?}
     */
    activateSectionScrolling() {
        this.sectionScrolling = true;
        if (this.sectionScrollingTimeout) {
            clearTimeout(this.sectionScrollingTimeout);
        }
        this.sectionScrollingTimeout = setTimeout(() => {
            this.sectionScrolling = false;
            if (this.sectionScrollingTimeout) {
                clearTimeout(this.sectionScrollingTimeout);
            }
        }, this.scrollSensitivity);
    }
    /**
     * @private
     * @param {?} event
     * @return {?}
     */
    canScroll(event) {
        return event.type !== 'keydown' || this.checkFocus();
    }
    /**
     * @return {?}
     */
    checkFocus() {
        return !FullpageComponent.ignoreWhenFocused.includes(this.document.activeElement.localName);
    }
    /**
     * @private
     * @param {?} event
     * @param {?} sectionPosition
     * @return {?}
     */
    canScrollUp(event, sectionPosition) {
        return event.type !== 'wheel' || sectionPosition.atSectionTop;
    }
    /**
     * @private
     * @param {?} event
     * @param {?} sectionPosition
     * @return {?}
     */
    canScrollDown(event, sectionPosition) {
        return event.type !== 'wheel' || sectionPosition.atSectionBottom;
    }
    /**
     * @private
     * @return {?}
     */
    calcSectionPosition() {
        return {
            atSectionTop: !!this.activeSection && this.activeSection.scrollTop === 0,
            atSectionBottom: !!this.activeSection &&
                this.activeSection.offsetHeight + this.activeSection.scrollTop >= this.activeSection.scrollHeight,
        };
    }
    /**
     * @param {?} event
     * @return {?}
     */
    fullpageWindowScroll(event) {
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
    }
    /**
     * @param {?} event
     * @return {?}
     */
    fullpageArrowUpEvent(event) {
        this.scrollUp(event);
    }
    /**
     * @param {?} event
     * @return {?}
     */
    fullpageArrowDownEvent(event) {
        this.scrollDown(event);
    }
    /**
     * @return {?}
     */
    fullpageResizeEvent() {
        /** @type {?} */
        const section = this.sections[this.sectionIndex];
        /** @type {?} */
        const config = {
            target: section.url,
        };
        this.scrollToService.scrollTo(config);
    }
}
// if focus is on a form input then disable scrolling so that the form is usable
FullpageComponent.ignoreWhenFocused = ['textarea', 'input'];
FullpageComponent.eventListenerKey = 'fullpage';
FullpageComponent.activeClass = 'fullpage-active';
FullpageComponent.scrollingCompleteSensitivity = 750;
FullpageComponent.decorators = [
    { type: Component, args: [{
                selector: 'ao-fullpage',
                styles: [`
    ::ng-deep .fullpage {
      display: flex;
      flex-direction: column;
      margin: 0;
    }

    ::ng-deep .fullpage .fullpage-section {
      width: 100vw;
      height: 100vh;
      overflow-y: scroll;
      overflow-x: hidden;
    }

    ::ng-deep .fullpage .fullpage-section-fit-content {
      width: 100vw;
    }

    ::ng-deep body {
      padding: 0;
      margin: 0;
    }

    ::ng-deep html,
    ::ng-deep body,
    ::ng-deep .fullpage-section {
      -ms-overflow-style: -ms-autohiding-scrollbar;
    }

    ::ng-deep html::-webkit-scrollbar,
    ::ng-deep body::-webkit-scrollbar,
    ::ng-deep .fullpage-section::-webkit-scrollbar {
      width: 0;
    }
  `],
                template: `
    <div class="fullpage" *ngIf="sections" [class.scrolling]="scrolling">
      <ng-content></ng-content>
    </div>
  `,
            },] },
];
/** @nocollapse */
FullpageComponent.ctorParameters = () => [
    { type: ScrollToService },
    { type: ActivatedRoute },
    { type: Router },
    { type: undefined, decorators: [{ type: Inject, args: [DOCUMENT,] }] },
    { type: WindowRefService },
    { type: ScrollEventService },
    { type: PlatformLocation }
];
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZnVsbHBhZ2UuY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6Im5nOi8vQGFvdGVhcm9hbi9hbmd1bGFyLWZ1bGxwYWdlLyIsInNvdXJjZXMiOlsibGliL2Z1bGxwYWdlL2Z1bGxwYWdlLmNvbXBvbmVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7O0FBQUEsT0FBTyxFQUFFLFFBQVEsRUFBRSxnQkFBZ0IsRUFBRSxNQUFNLGlCQUFpQixDQUFDO0FBQzdELE9BQU8sRUFBRSxTQUFTLEVBQUUsWUFBWSxFQUFFLFlBQVksRUFBRSxNQUFNLEVBQUUsS0FBSyxFQUFxQixNQUFNLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFDaEgsT0FBTyxFQUFFLGNBQWMsRUFBRSxNQUFNLEVBQUUsTUFBTSxpQkFBaUIsQ0FBQztBQUN6RCxPQUFPLEVBQXlCLGVBQWUsRUFBRSxNQUFNLDhCQUE4QixDQUFDO0FBQ3RGLE9BQU8sRUFBRSxRQUFRLEVBQUUsTUFBTSxnQkFBZ0IsQ0FBQztBQUMxQyxPQUFPLEVBQUUsZ0JBQWdCLEVBQUUsTUFBTSxrQ0FBa0MsQ0FBQztBQUNwRSxPQUFPLEVBQXdCLGtCQUFrQixFQUFFLE1BQU0sd0JBQXdCLENBQUM7QUErQ2xGLE1BQU0sT0FBTyxpQkFBaUI7Ozs7Ozs7Ozs7SUFxQjVCLFlBQTJCLGVBQWdDLEVBQ2hDLEtBQXFCLEVBQ3JCLE1BQWMsRUFDSSxRQUFhLEVBQy9CLFNBQTJCLEVBQzNCLGtCQUFzQyxFQUN0QyxnQkFBa0M7UUFObEMsb0JBQWUsR0FBZixlQUFlLENBQWlCO1FBQ2hDLFVBQUssR0FBTCxLQUFLLENBQWdCO1FBQ3JCLFdBQU0sR0FBTixNQUFNLENBQVE7UUFDSSxhQUFRLEdBQVIsUUFBUSxDQUFLO1FBQy9CLGNBQVMsR0FBVCxTQUFTLENBQWtCO1FBQzNCLHVCQUFrQixHQUFsQixrQkFBa0IsQ0FBb0I7UUFDdEMscUJBQWdCLEdBQWhCLGdCQUFnQixDQUFrQjtRQVQ3QyxzQkFBaUIsR0FBRyxJQUFJLENBQUM7UUFDeEIs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QUFDLFFBQVE7WUF4RTVCLGdCQUFnQjtZQUNNLGtCQUFrQjtZQU45QixnQkFBZ0I7Ozt1QkFxRWhDLEtBQUs7NEJBQ0wsS0FBSztnQ0FDTCxLQUFLOzRCQUNMLE1BQU07bUNBOEpOLFlBQVksU0FBQyxjQUFjLEVBQUUsQ0FBQyxRQUFRLENBQUM7bUNBYXZDLFlBQVksU0FBQyx1QkFBdUIsRUFBRSxDQUFDLFFBQVEsQ0FBQyxjQUNoRCxZQUFZLFNBQUMsd0JBQXdCLEVBQUUsQ0FBQyxRQUFRLENBQUMsY0FDakQsWUFBWSxTQUFDLDRCQUE0QixFQUFFLENBQUMsUUFBUSxDQUFDO3FDQUtyRCxZQUFZLFNBQUMseUJBQXlCLEVBQUUsQ0FBQyxRQUFRLENBQUMsY0FDbEQsWUFBWSxTQUFDLDBCQUEwQixFQUFFLENBQUMsUUFBUSxDQUFDLGNBQ25ELFlBQVksU0FBQyxzQkFBc0IsRUFBRSxDQUFDLFFBQVEsQ0FBQztrQ0FLL0MsWUFBWSxTQUFDLGVBQWU7Ozs7SUF6TTdCLG9DQUF3RDs7SUFDeEQsbUNBQTRDOztJQUM1Qyw4QkFBOEM7O0lBQzlDLCtDQUFpRDs7SUFFakQsbUNBQWM7O0lBQ2QsMENBQXFCOztJQUNyQixpREFBb0M7O0lBQ3BDLHlDQUE0Qjs7SUFDNUIsc0NBQTBCOztJQUMxQiw2Q0FBaUM7O0lBQ2pDLG9EQUErQjs7SUFFL0IscUNBQXlDOztJQUN6QywwQ0FBdUM7O0lBQ3ZDLDhDQUF5Qzs7SUFDekMsMENBQTREOzs7OztJQUV6Qyw0Q0FBd0M7Ozs7O0lBQ3hDLGtDQUE2Qjs7Ozs7SUFDN0IsbUNBQXNCOzs7OztJQUN0QixxQ0FBdUM7Ozs7O0lBQ3ZDLHNDQUFtQzs7Ozs7SUFDbkMsK0NBQThDOzs7OztJQUM5Qyw2Q0FBMEMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBET0NVTUVOVCwgUGxhdGZvcm1Mb2NhdGlvbiB9IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbic7XG5pbXBvcnQgeyBDb21wb25lbnQsIEV2ZW50RW1pdHRlciwgSG9zdExpc3RlbmVyLCBJbmplY3QsIElucHV0LCBPbkRlc3Ryb3ksIE9uSW5pdCwgT3V0cHV0IH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBBY3RpdmF0ZWRSb3V0ZSwgUm91dGVyIH0gZnJvbSAnQGFuZ3VsYXIvcm91dGVyJztcbmltcG9ydCB7IFNjcm9sbFRvQ29uZmlnT3B0aW9ucywgU2Nyb2xsVG9TZXJ2aWNlIH0gZnJvbSAnQG5pY2t5LWxlbmFlcnMvbmd4LXNjcm9sbC10byc7XG5pbXBvcnQgeyBmaW5hbGl6ZSB9IGZyb20gJ3J4anMvb3BlcmF0b3JzJztcbmltcG9ydCB7IFdpbmRvd1JlZlNlcnZpY2UgfSBmcm9tICcuLi93aW5kb3ctcmVmL3dpbmRvdy1yZWYuc2VydmljZSc7XG5pbXBvcnQgeyBJU2Nyb2xsRXZlbnRMaXN0ZW5lciwgU2Nyb2xsRXZlbnRTZXJ2aWNlIH0gZnJvbSAnLi9zY3JvbGwtZXZlbnQuc2VydmljZSc7XG5pbXBvcnQgeyBTZWN0aW9uUG9zaXRpb25Nb2RlbCB9IGZyb20gJy4vc2VjdGlvbi1wb3NpdGlvbi5tb2RlbCc7XG5pbXBvcnQgeyBTZWN0aW9uTW9kZWwgfSBmcm9tICcuL3NlY3Rpb24ubW9kZWwnO1xuXG5AQ29tcG9uZW50KHtcbiAgc2VsZWN0b3I6ICdhby1mdWxscGFnZScsXG4gIHN0eWxlczogW2BcbiAgICA6Om5nLWRlZXAgLmZ1bGxwYWdlIHtcbiAgICAgIGRpc3BsYXk6IGZsZXg7XG4gICAgICBmbGV4LWRpcmVjdGlvbjogY29sdW1uO1xuICAgICAgbWFyZ2luOiAwO1xuICAgIH1cblxuICAgIDo6bmctZGVlcCAuZnVsbHBhZ2UgLmZ1bGxwYWdlLXNlY3Rpb24ge1xuICAgICAgd2lkdGg6IDEwMHZ3O1xuICAgICAgaGVpZ2h0OiAxMDB2aDtcbiAgICAgIG92ZXJmbG93LXk6IHNjcm9sbDtcbiAgICAgIG92ZXJmbG93LXg6IGhpZGRlbjtcbiAgICB9XG5cbiAgICA6Om5nLWRlZXAgLmZ1bGxwYWdlIC5mdWxscGFnZS1zZWN0aW9uLWZpdC1jb250ZW50IHtcbiAgICAgIHdpZHRoOiAxMDB2dztcbiAgICB9XG5cbiAgICA6Om5nLWRlZXAgYm9keSB7XG4gICAgICBwYWRkaW5nOiAwO1xuICAgICAgbWFyZ2luOiAwO1xuICAgIH1cblxuICAgIDo6bmctZGVlcCBodG1sLFxuICAgIDo6bmctZGVlcCBib2R5LFxuICAgIDo6bmctZGVlcCAuZnVsbHBhZ2Utc2VjdGlvbiB7XG4gICAgICAtbXMtb3ZlcmZsb3ctc3R5bGU6IC1tcy1hdXRvaGlkaW5nLXNjcm9sbGJhcjtcbiAgICB9XG5cbiAgICA6Om5nLWRlZXAgaHRtbDo6LXdlYmtpdC1zY3JvbGxiYXIsXG4gICAgOjpuZy1kZWVwIGJvZHk6Oi13ZWJraXQtc2Nyb2xsYmFyLFxuICAgIDo6bmctZGVlcCAuZnVsbHBhZ2Utc2VjdGlvbjo6LXdlYmtpdC1zY3JvbGxiYXIge1xuICAgICAgd2lkdGg6IDA7XG4gICAgfVxuICBgXSxcbiAgdGVtcGxhdGU6IGBcbiAgICA8ZGl2IGNsYXNzPVwiZnVsbHBhZ2VcIiAqbmdJZj1cInNlY3Rpb25zXCIgW2NsYXNzLnNjcm9sbGluZ109XCJzY3JvbGxpbmdcIj5cbiAgICAgIDxuZy1jb250ZW50PjwvbmctY29udGVudD5cbiAgICA8L2Rpdj5cbiAgYCxcbn0pXG5leHBvcnQgY2xhc3MgRnVsbHBhZ2VDb21wb25lbnQgaW1wbGVtZW50cyBPbkluaXQsIE9uRGVzdHJveSwgSVNjcm9sbEV2ZW50TGlzdGVuZXIge1xuXG4gIC8vIGlmIGZvY3VzIGlzIG9uIGEgZm9ybSBpbnB1dCB0aGVuIGRpc2FibGUgc2Nyb2xsaW5nIHNvIHRoYXQgdGhlIGZvcm0gaXMgdXNhYmxlXG4gIHB1YmxpYyBzdGF0aWMgaWdub3JlV2hlbkZvY3VzZWQgPSBbJ3RleHRhcmVhJywgJ2lucHV0J107XG4gIHB1YmxpYyBzdGF0aWMgZXZlbnRMaXN0ZW5lcktleSA9ICdmdWxscGFnZSc7XG4gIHB1YmxpYyBzdGF0aWMgYWN0aXZlQ2xhc3MgPSAnZnVsbHBhZ2UtYWN0aXZlJztcbiAgcHVibGljIHN0YXRpYyBzY3JvbGxpbmdDb21wbGV0ZVNlbnNpdGl2aXR5ID0gNzUwO1xuXG4gIHB1YmxpYyB3aW5kb3c7XG4gIHB1YmxpYyBhY3RpdmVTZWN0aW9uO1xuICBwdWJsaWMgcHJldmlvdXNTZWN0aW9uSW5kZXg6IG51bWJlcjtcbiAgcHVibGljIHNlY3Rpb25JbmRleDogbnVtYmVyO1xuICBwdWJsaWMgc2Nyb2xsaW5nOiBib29sZWFuO1xuICBwdWJsaWMgc2VjdGlvblNjcm9sbGluZzogYm9vbGVhbjtcbiAgcHVibGljIHNlY3Rpb25TY3JvbGxpbmdUaW1lb3V0O1xuXG4gIEBJbnB1dCgpIHB1YmxpYyBzZWN0aW9uczogU2VjdGlvbk1vZGVsW107XG4gIEBJbnB1dCgpIHB1YmxpYyBsb2NrU2Nyb2xsaW5nOiBib29sZWFuO1xuICBASW5wdXQoKSBwdWJsaWMgc2Nyb2xsU2Vuc2l0aXZpdHkgPSAxMjUwO1xuICBAT3V0cHV0KCkgcHVibGljIHNlY3Rpb25DaGFuZ2UgPSBuZXcgRXZlbnRFbWl0dGVyPHN0cmluZz4oKTtcblxuICBwdWJsaWMgY29uc3RydWN0b3IocHJpdmF0ZSBzY3JvbGxUb1NlcnZpY2U6IFNjcm9sbFRvU2VydmljZSxcbiAgICAgICAgICAgICAgICAgICAgIHByaXZhdGUgcm91dGU6IEFjdGl2YXRlZFJvdXRlLFxuICAgICAgICAgICAgICAgICAgICAgcHJpdmF0ZSByb3V0ZXI6IFJvdXRlcixcbiAgICAgICAgICAgICAgICAgICAgIEBJbmplY3QoRE9DVU1FTlQpIHByaXZhdGUgZG9jdW1lbnQ6IGFueSxcbiAgICAgICAgICAgICAgICAgICAgIHByaXZhdGUgd2luZG93UmVmOiBXaW5kb3dSZWZTZXJ2aWNlLFxuICAgICAgICAgICAgICAgICAgICAgcHJpdmF0ZSBzY3JvbGxFdmVudFNlcnZpY2U6IFNjcm9sbEV2ZW50U2VydmljZSxcbiAgICAgICAgICAgICAgICAgICAgIHByaXZhdGUgcGxhdGZvcm1Mb2NhdGlvbjogUGxhdGZvcm1Mb2NhdGlvbikge1xuICAgIHRoaXMud2luZG93ID0gd2luZG93UmVmLmdldE5hdGl2ZVdpbmRvdygpO1xuICAgIHBsYXRmb3JtTG9jYXRpb24ub25Qb3BTdGF0ZSgoKSA9PiB7XG4gICAgICB0aGlzLndpbmRvdy5sb2NhdGlvbi5yZWxvYWQoKTtcbiAgICB9KTtcbiAgfVxuXG4gIHB1YmxpYyBuZ09uSW5pdCgpIHtcbiAgICAvLyBsaXN0ZW4gdG8gc2Nyb2xsIGV2ZW50cyBmcm9tIG90aGVyIGNvbXBvbmVudHNcbiAgICB0aGlzLnNjcm9sbEV2ZW50U2VydmljZS5hZGRMaXN0ZW5lcihGdWxscGFnZUNvbXBvbmVudC5ldmVudExpc3RlbmVyS2V5LCB0aGlzKTtcblxuICAgIC8vIGNhcHR1cmUgYWxsIHNjcm9sbCB3aGVlbCBldmVudHMgd2hpbGUgc2Nyb2xsaW5nIGlzIGFjdGl2ZSAocHJldmVudHMgdGhlIGRlZmF1bHQgYWN0aW9uKVxuICAgIHRoaXMud2luZG93Lm9ud2hlZWwgPSAoKSA9PiAhdGhpcy5zY3JvbGxpbmc7XG5cbiAgICAvLyBuZWVkcyB0byBoYXBwZW4gYWZ0ZXIgcmVuZGVyaW5nXG4gICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICBjb25zdCBmcmFnbWVudCA9IHRoaXMucm91dGUuc25hcHNob3QuZnJhZ21lbnQ7XG4gICAgICBjb25zdCBpbmRleCA9IE1hdGgubWF4KHRoaXMuc2VjdGlvbnMuZmluZEluZGV4KChzKSA9PiBzLnVybCA9PT0gZnJhZ21lbnQpLCAwKTtcbiAgICAgIHRoaXMuc3dpdGNoU2VjdGlvbnMoaW5kZXgpO1xuICAgICAgdGhpcy5zY3JvbGwoaW5kZXgpO1xuICAgIH0sIDIwMCk7XG4gIH1cblxuICBwdWJsaWMgbmdPbkRlc3Ryb3koKSB7XG4gICAgdGhpcy5zY3JvbGxFdmVudFNlcnZpY2UucmVtb3ZlTGlzdGVuZXIoRnVsbHBhZ2VDb21wb25lbnQuZXZlbnRMaXN0ZW5lcktleSk7XG4gIH1cblxuICBwdWJsaWMgc2Nyb2xsKGluZGV4OiBudW1iZXIpIHtcbiAgICBpZiAoIXRoaXMubG9ja1Njcm9sbGluZyAmJiBpbmRleCAhPT0gdGhpcy5zZWN0aW9uSW5kZXggJiYgIXRoaXMuc2VjdGlvblNjcm9sbGluZykge1xuICAgICAgdGhpcy5zY3JvbGxpbmcgPSB0cnVlO1xuICAgICAgdGhpcy5zd2l0Y2hTZWN0aW9ucyhpbmRleCk7XG4gICAgICB0aGlzLmludm9rZVNjcm9sbCgpO1xuICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgc3dpdGNoU2VjdGlvbnMoaW5kZXg6IG51bWJlcikge1xuICAgIHRoaXMucHJldmlvdXNTZWN0aW9uSW5kZXggPSB0aGlzLnNlY3Rpb25JbmRleDtcbiAgICB0aGlzLnNlY3Rpb25JbmRleCA9IGluZGV4O1xuXG4gICAgaWYgKHRoaXMuYWN0aXZlU2VjdGlvbikge1xuICAgICAgdGhpcy5hY3RpdmVTZWN0aW9uLmNsYXNzTGlzdC5yZW1vdmUoRnVsbHBhZ2VDb21wb25lbnQuYWN0aXZlQ2xhc3MpO1xuICAgIH1cblxuICAgIGNvbnN0IHNlY3Rpb24gPSB0aGlzLnNlY3Rpb25zW3RoaXMuc2VjdGlvbkluZGV4XTtcbiAgICB0aGlzLmFjdGl2ZVNlY3Rpb24gPSB0aGlzLmRvY3VtZW50LmdldEVsZW1lbnRCeUlkKHNlY3Rpb24udXJsKTtcblxuICAgIGlmICh0aGlzLmFjdGl2ZVNlY3Rpb24pIHtcbiAgICAgIHRoaXMuYWN0aXZlU2VjdGlvbi5jbGFzc0xpc3QuYWRkKEZ1bGxwYWdlQ29tcG9uZW50LmFjdGl2ZUNsYXNzKTtcbiAgICB9XG5cbiAgICB0aGlzLnNlY3Rpb25zLmZvckVhY2goKHMpID0+IHMuYWN0aXZlID0gcy51cmwgPT09IHNlY3Rpb24udXJsKTtcbiAgICB0aGlzLnNlY3Rpb25DaGFuZ2UuZW1pdChzZWN0aW9uLnVybCk7XG4gIH1cblxuICBwcml2YXRlIGludm9rZVNjcm9sbCgpIHtcbiAgICBjb25zdCBzZWN0aW9uID0gdGhpcy5zZWN0aW9uc1t0aGlzLnNlY3Rpb25JbmRleF07XG4gICAgY29uc3QgY29uZmlnOiBTY3JvbGxUb0NvbmZpZ09wdGlvbnMgPSB7XG4gICAgICB0YXJnZXQ6IHNlY3Rpb24udXJsLFxuICAgIH07XG5cbiAgICB0aGlzLnJvdXRlci5uYXZpZ2F0ZShbdGhpcy53aW5kb3cubG9jYXRpb24ucGF0aG5hbWVdLCB7ZnJhZ21lbnQ6IHNlY3Rpb24udXJsfSk7XG4gICAgdGhpcy5zY3JvbGxUb1NlcnZpY2Uuc2Nyb2xsVG8oY29uZmlnKVxuICAgICAgLnBpcGUoXG4gICAgICAgIGZpbmFsaXplKCgpID0+IHtcbiAgICAgICAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgICAgIHRoaXMuc2Nyb2xsaW5nID0gZmFsc2U7XG4gICAgICAgICAgfSwgRnVsbHBhZ2VDb21wb25lbnQuc2Nyb2xsaW5nQ29tcGxldGVTZW5zaXRpdml0eSk7XG4gICAgICAgIH0pLFxuICAgICAgKS5zdWJzY3JpYmUoKTtcbiAgfVxuXG4gIHB1YmxpYyBzY3JvbGxVcChldmVudDogRXZlbnQpIHtcbiAgICBjb25zdCBzZWN0aW9uUG9zaXRpb24gPSB0aGlzLmNhbGNTZWN0aW9uUG9zaXRpb24oKTtcbiAgICBpZiAodGhpcy5sb2NrU2Nyb2xsaW5nKSB7XG4gICAgICBpZiAoc2VjdGlvblBvc2l0aW9uLmF0U2VjdGlvblRvcCkge1xuICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgLy8gaWYgc2Nyb2xsaW5nIHNlY3Rpb25zIGlzIGxvY2tlZCBhbmQgd2UncmUgbm90IGF0IHRoZSB0b3Agb2YgdGhlIHNlY3Rpb24gLSBhY3RpdmF0ZSBzZWN0aW9uIHNjcm9sbGluZ1xuICAgICAgICB0aGlzLmFjdGl2YXRlU2VjdGlvblNjcm9sbGluZygpO1xuICAgICAgfVxuICAgIH0gZWxzZSBpZiAodGhpcy5jYW5TY3JvbGwoZXZlbnQpICYmIHRoaXMuY2FuU2Nyb2xsVXAoZXZlbnQsIHNlY3Rpb25Qb3NpdGlvbikpIHtcbiAgICAgIGlmICh0aGlzLnNlY3Rpb25JbmRleCA+IDApIHtcbiAgICAgICAgdGhpcy5zY3JvbGwodGhpcy5zZWN0aW9uSW5kZXggLSAxKTtcbiAgICAgIH0gZWxzZSBpZiAoZXZlbnQudHlwZSAhPT0gJ3doZWVsJykge1xuICAgICAgICAvLyBwcmV2ZW50IGRlZmF1bHQgd2hlbiB0aGlzIGlzIHRoZSB0b3Agc2VjdGlvbiBhbmQgd2UgYXJlIHNjcm9sbGluZyB1cFxuICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLmFjdGl2YXRlU2VjdGlvblNjcm9sbGluZygpO1xuICAgIH1cbiAgfVxuXG4gIHB1YmxpYyBzY3JvbGxEb3duKGV2ZW50OiBFdmVudCkge1xuICAgIGNvbnN0IHNlY3Rpb25Qb3NpdGlvbiA9IHRoaXMuY2FsY1NlY3Rpb25Qb3NpdGlvbigpO1xuICAgIGlmICh0aGlzLmxvY2tTY3JvbGxpbmcpIHtcbiAgICAgIGlmIChzZWN0aW9uUG9zaXRpb24uYXRTZWN0aW9uQm90dG9tKSB7XG4gICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICAvLyBpZiBzY3JvbGxpbmcgc2VjdGlvbnMgaXMgbG9ja2VkIGFuZCB3ZSdyZSBub3QgYXQgdGhlIGJvdHRvbSBvZiB0aGUgc2VjdGlvbiAtIGFjdGl2YXRlIHNlY3Rpb24gc2Nyb2xsaW5nXG4gICAgICAgIHRoaXMuYWN0aXZhdGVTZWN0aW9uU2Nyb2xsaW5nKCk7XG4gICAgICB9XG4gICAgfSBlbHNlIGlmICh0aGlzLmNhblNjcm9sbChldmVudCkgJiYgdGhpcy5jYW5TY3JvbGxEb3duKGV2ZW50LCBzZWN0aW9uUG9zaXRpb24pKSB7XG4gICAgICBpZiAodGhpcy5zZWN0aW9uSW5kZXggPCB0aGlzLnNlY3Rpb25zLmxlbmd0aCAtIDEpIHtcbiAgICAgICAgdGhpcy5zY3JvbGwodGhpcy5zZWN0aW9uSW5kZXggKyAxKTtcbiAgICAgIH0gZWxzZSBpZiAoZXZlbnQudHlwZSAhPT0gJ3doZWVsJykge1xuICAgICAgICAvLyBwcmV2ZW50IGRlZmF1bHQgd2hlbiB0aGlzIGlzIHRoZSBib3R0b20gc2VjdGlvbiBhbmQgd2UgYXJlIHNjcm9sbGluZyBkb3duXG4gICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuYWN0aXZhdGVTZWN0aW9uU2Nyb2xsaW5nKCk7XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSBhY3RpdmF0ZVNlY3Rpb25TY3JvbGxpbmcoKSB7XG4gICAgdGhpcy5zZWN0aW9uU2Nyb2xsaW5nID0gdHJ1ZTtcbiAgICBpZiAodGhpcy5zZWN0aW9uU2Nyb2xsaW5nVGltZW91dCkge1xuICAgICAgY2xlYXJUaW1lb3V0KHRoaXMuc2VjdGlvblNjcm9sbGluZ1RpbWVvdXQpO1xuICAgIH1cbiAgICB0aGlzLnNlY3Rpb25TY3JvbGxpbmdUaW1lb3V0ID0gc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICB0aGlzLnNlY3Rpb25TY3JvbGxpbmcgPSBmYWxzZTtcbiAgICAgIGlmICh0aGlzLnNlY3Rpb25TY3JvbGxpbmdUaW1lb3V0KSB7XG4gICAgICAgIGNsZWFyVGltZW91dCh0aGlzLnNlY3Rpb25TY3JvbGxpbmdUaW1lb3V0KTtcbiAgICAgIH1cbiAgICB9LCB0aGlzLnNjcm9sbFNlbnNpdGl2aXR5KTtcbiAgfVxuXG4gIHByaXZhdGUgY2FuU2Nyb2xsKGV2ZW50OiBFdmVudCkge1xuICAgIHJldHVybiBldmVudC50eXBlICE9PSAna2V5ZG93bicgfHwgdGhpcy5jaGVja0ZvY3VzKCk7XG4gIH1cblxuICBwdWJsaWMgY2hlY2tGb2N1cygpIHtcbiAgICByZXR1cm4gIUZ1bGxwYWdlQ29tcG9uZW50Lmlnbm9yZVdoZW5Gb2N1c2VkLmluY2x1ZGVzKHRoaXMuZG9jdW1lbnQuYWN0aXZlRWxlbWVudC5sb2NhbE5hbWUpO1xuICB9XG5cbiAgcHJpdmF0ZSBjYW5TY3JvbGxVcChldmVudDogRXZlbnQsIHNlY3Rpb25Qb3NpdGlvbjogU2VjdGlvblBvc2l0aW9uTW9kZWwpIHtcbiAgICByZXR1cm4gZXZlbnQudHlwZSAhPT0gJ3doZWVsJyB8fCBzZWN0aW9uUG9zaXRpb24uYXRTZWN0aW9uVG9wO1xuICB9XG5cbiAgcHJpdmF0ZSBjYW5TY3JvbGxEb3duKGV2ZW50OiBFdmVudCwgc2VjdGlvblBvc2l0aW9uOiBTZWN0aW9uUG9zaXRpb25Nb2RlbCkge1xuICAgIHJldHVybiBldmVudC50eXBlICE9PSAnd2hlZWwnIHx8IHNlY3Rpb25Qb3NpdGlvbi5hdFNlY3Rpb25Cb3R0b207XG4gIH1cblxuICBwcml2YXRlIGNhbGNTZWN0aW9uUG9zaXRpb24oKTogU2VjdGlvblBvc2l0aW9uTW9kZWwge1xuICAgIHJldHVybiB7XG4gICAgICBhdFNlY3Rpb25Ub3A6ICEhdGhpcy5hY3RpdmVTZWN0aW9uICYmIHRoaXMuYWN0aXZlU2VjdGlvbi5zY3JvbGxUb3AgPT09IDAsXG4gICAgICBhdFNlY3Rpb25Cb3R0b206ICEhdGhpcy5hY3RpdmVTZWN0aW9uICYmXG4gICAgICAgIHRoaXMuYWN0aXZlU2VjdGlvbi5vZmZzZXRIZWlnaHQgKyB0aGlzLmFjdGl2ZVNlY3Rpb24uc2Nyb2xsVG9wID49IHRoaXMuYWN0aXZlU2VjdGlvbi5zY3JvbGxIZWlnaHQsXG4gICAgfTtcbiAgfVxuXG4gIEBIb3N0TGlzdGVuZXIoJ3dpbmRvdzp3aGVlbCcsIFsnJGV2ZW50J10pXG4gIHB1YmxpYyBmdWxscGFnZVdpbmRvd1Njcm9sbChldmVudDogV2hlZWxFdmVudCkge1xuICAgIGlmICghdGhpcy5zY3JvbGxpbmcpIHtcbiAgICAgIGlmIChldmVudC5kZWx0YVkgPiAwKSB7XG4gICAgICAgIHRoaXMuc2Nyb2xsRG93bihldmVudCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLnNjcm9sbFVwKGV2ZW50KTtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICB9XG4gIH1cblxuICBASG9zdExpc3RlbmVyKCd3aW5kb3c6a2V5ZG93bi5QYWdlVXAnLCBbJyRldmVudCddKVxuICBASG9zdExpc3RlbmVyKCd3aW5kb3c6a2V5ZG93bi5BcnJvd1VwJywgWyckZXZlbnQnXSlcbiAgQEhvc3RMaXN0ZW5lcignd2luZG93OmtleWRvd24uc2hpZnQuc3BhY2UnLCBbJyRldmVudCddKVxuICBwdWJsaWMgZnVsbHBhZ2VBcnJvd1VwRXZlbnQoZXZlbnQ6IEtleWJvYXJkRXZlbnQpIHtcbiAgICB0aGlzLnNjcm9sbFVwKGV2ZW50KTtcbiAgfVxuXG4gIEBIb3N0TGlzdGVuZXIoJ3dpbmRvdzprZXlkb3duLlBhZ2VEb3duJywgWyckZXZlbnQnXSlcbiAgQEhvc3RMaXN0ZW5lcignd2luZG93OmtleWRvd24uQXJyb3dEb3duJywgWyckZXZlbnQnXSlcbiAgQEhvc3RMaXN0ZW5lcignd2luZG93OmtleWRvd24uc3BhY2UnLCBbJyRldmVudCddKVxuICBwdWJsaWMgZnVsbHBhZ2VBcnJvd0Rvd25FdmVudChldmVudDogS2V5Ym9hcmRFdmVudCkge1xuICAgIHRoaXMuc2Nyb2xsRG93bihldmVudCk7XG4gIH1cblxuICBASG9zdExpc3RlbmVyKCd3aW5kb3c6cmVzaXplJylcbiAgcHVibGljIGZ1bGxwYWdlUmVzaXplRXZlbnQoKSB7XG4gICAgY29uc3Qgc2VjdGlvbiA9IHRoaXMuc2VjdGlvbnNbdGhpcy5zZWN0aW9uSW5kZXhdO1xuICAgIGNvbnN0IGNvbmZpZzogU2Nyb2xsVG9Db25maWdPcHRpb25zID0ge1xuICAgICAgdGFyZ2V0OiBzZWN0aW9uLnVybCxcbiAgICB9O1xuXG4gICAgdGhpcy5zY3JvbGxUb1NlcnZpY2Uuc2Nyb2xsVG8oY29uZmlnKTtcbiAgfVxufVxuIl19