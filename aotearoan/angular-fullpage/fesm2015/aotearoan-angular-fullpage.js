import { DOCUMENT, PlatformLocation, CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { ScrollToService, ScrollToModule } from '@nicky-lenaers/ngx-scroll-to';
import { finalize } from 'rxjs/operators';
import { Injectable, NgModule, Component, EventEmitter, HostListener, Inject, Input, Output } from '@angular/core';
import { Subject } from 'rxjs';

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
class WindowRefService {
    /**
     * @return {?}
     */
    getNativeWindow() {
        return window;
    }
}
WindowRefService.decorators = [
    { type: Injectable, args: [{
                providedIn: 'root',
            },] },
];

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
class WindowRefModule {
}
WindowRefModule.decorators = [
    { type: NgModule, args: [{
                providers: [WindowRefService],
            },] },
];

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
class ScrollEventService {
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

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
class FullpageComponent {
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

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
class FullpageModule {
}
FullpageModule.decorators = [
    { type: NgModule, args: [{
                declarations: [
                    FullpageComponent,
                ],
                exports: [FullpageComponent],
                imports: [
                    CommonModule,
                    ScrollToModule.forRoot(),
                    WindowRefModule,
                ],
                providers: [ScrollEventService],
            },] },
];

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
class SectionModel {
}

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */

export { FullpageModule, WindowRefModule, FullpageComponent, SectionModel, ScrollEventService, WindowRefService };

//# sourceMappingURL=aotearoan-angular-fullpage.js.map