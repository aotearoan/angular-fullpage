(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('@angular/common'), require('@angular/router'), require('@nicky-lenaers/ngx-scroll-to'), require('rxjs/operators'), require('@angular/core'), require('rxjs')) :
    typeof define === 'function' && define.amd ? define('@aotearoan/angular-fullpage', ['exports', '@angular/common', '@angular/router', '@nicky-lenaers/ngx-scroll-to', 'rxjs/operators', '@angular/core', 'rxjs'], factory) :
    (factory((global.aotearoan = global.aotearoan || {}, global.aotearoan['angular-fullpage'] = {}),global.ng.common,global.ng.router,global.ngxScrollTo,global.rxjs.operators,global.ng.core,global.rxjs));
}(this, (function (exports,common,router,ngxScrollTo,operators,core,rxjs) { 'use strict';

    /**
     * @fileoverview added by tsickle
     * @suppress {checkTypes,extraRequire,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
     */
    var WindowRefService = /** @class */ (function () {
        function WindowRefService() {
        }
        /**
         * @return {?}
         */
        WindowRefService.prototype.getNativeWindow = /**
         * @return {?}
         */
            function () {
                return window;
            };
        WindowRefService.decorators = [
            { type: core.Injectable, args: [{
                        providedIn: 'root',
                    },] },
        ];
        return WindowRefService;
    }());

    /**
     * @fileoverview added by tsickle
     * @suppress {checkTypes,extraRequire,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
     */
    var WindowRefModule = /** @class */ (function () {
        function WindowRefModule() {
        }
        WindowRefModule.decorators = [
            { type: core.NgModule, args: [{
                        providers: [WindowRefService],
                    },] },
        ];
        return WindowRefModule;
    }());

    /**
     * @fileoverview added by tsickle
     * @suppress {checkTypes,extraRequire,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
     */
    var ScrollEventService = /** @class */ (function () {
        function ScrollEventService() {
            var _this = this;
            this.listeners = {};
            this.eventsSubject = new rxjs.Subject();
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
            { type: core.Injectable },
        ];
        /** @nocollapse */
        ScrollEventService.ctorParameters = function () { return []; };
        return ScrollEventService;
    }());

    /**
     * @fileoverview added by tsickle
     * @suppress {checkTypes,extraRequire,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
     */
    var FullpageComponent = /** @class */ (function () {
        function FullpageComponent(scrollToService, route, router$$1, document, windowRef, scrollEventService, platformLocation) {
            var _this = this;
            this.scrollToService = scrollToService;
            this.route = route;
            this.router = router$$1;
            this.document = document;
            this.windowRef = windowRef;
            this.scrollEventService = scrollEventService;
            this.platformLocation = platformLocation;
            this.scrollSensitivity = 1250;
            this.sectionChange = new core.EventEmitter();
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
                    .pipe(operators.finalize(function () {
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
            { type: core.Component, args: [{
                        selector: 'ao-fullpage',
                        styles: ["\n    ::ng-deep .fullpage {\n      display: flex;\n      flex-direction: column;\n      margin: 0;\n    }\n\n    ::ng-deep .fullpage .fullpage-section {\n      width: 100vw;\n      height: 100vh;\n      overflow-y: scroll;\n      overflow-x: hidden;\n    }\n\n    ::ng-deep .fullpage .fullpage-section-fit-content {\n      width: 100vw;\n    }\n\n    ::ng-deep body {\n      padding: 0;\n      margin: 0;\n    }\n\n    ::ng-deep html,\n    ::ng-deep body,\n    ::ng-deep .fullpage-section {\n      -ms-overflow-style: -ms-autohiding-scrollbar;\n    }\n\n    ::ng-deep html::-webkit-scrollbar,\n    ::ng-deep body::-webkit-scrollbar,\n    ::ng-deep .fullpage-section::-webkit-scrollbar {\n      width: 0;\n    }\n  "],
                        template: "\n    <div class=\"fullpage\" *ngIf=\"sections\" [class.scrolling]=\"scrolling\">\n      <ng-content></ng-content>\n    </div>\n  ",
                    },] },
        ];
        /** @nocollapse */
        FullpageComponent.ctorParameters = function () {
            return [
                { type: ngxScrollTo.ScrollToService },
                { type: router.ActivatedRoute },
                { type: router.Router },
                { type: undefined, decorators: [{ type: core.Inject, args: [common.DOCUMENT,] }] },
                { type: WindowRefService },
                { type: ScrollEventService },
                { type: common.PlatformLocation }
            ];
        };
        FullpageComponent.propDecorators = {
            sections: [{ type: core.Input }],
            lockScrolling: [{ type: core.Input }],
            scrollSensitivity: [{ type: core.Input }],
            sectionChange: [{ type: core.Output }],
            fullpageWindowScroll: [{ type: core.HostListener, args: ['window:wheel', ['$event'],] }],
            fullpageArrowUpEvent: [{ type: core.HostListener, args: ['window:keydown.PageUp', ['$event'],] }, { type: core.HostListener, args: ['window:keydown.ArrowUp', ['$event'],] }, { type: core.HostListener, args: ['window:keydown.shift.space', ['$event'],] }],
            fullpageArrowDownEvent: [{ type: core.HostListener, args: ['window:keydown.PageDown', ['$event'],] }, { type: core.HostListener, args: ['window:keydown.ArrowDown', ['$event'],] }, { type: core.HostListener, args: ['window:keydown.space', ['$event'],] }],
            fullpageResizeEvent: [{ type: core.HostListener, args: ['window:resize',] }]
        };
        return FullpageComponent;
    }());

    /**
     * @fileoverview added by tsickle
     * @suppress {checkTypes,extraRequire,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
     */
    var FullpageModule = /** @class */ (function () {
        function FullpageModule() {
        }
        FullpageModule.decorators = [
            { type: core.NgModule, args: [{
                        declarations: [
                            FullpageComponent,
                        ],
                        exports: [FullpageComponent],
                        imports: [
                            common.CommonModule,
                            ngxScrollTo.ScrollToModule.forRoot(),
                            WindowRefModule,
                        ],
                        providers: [ScrollEventService],
                    },] },
        ];
        return FullpageModule;
    }());

    /**
     * @fileoverview added by tsickle
     * @suppress {checkTypes,extraRequire,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
     */
    var SectionModel = /** @class */ (function () {
        function SectionModel() {
        }
        return SectionModel;
    }());

    /**
     * @fileoverview added by tsickle
     * @suppress {checkTypes,extraRequire,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
     */

    /**
     * @fileoverview added by tsickle
     * @suppress {checkTypes,extraRequire,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
     */

    exports.FullpageModule = FullpageModule;
    exports.WindowRefModule = WindowRefModule;
    exports.FullpageComponent = FullpageComponent;
    exports.SectionModel = SectionModel;
    exports.ScrollEventService = ScrollEventService;
    exports.WindowRefService = WindowRefService;

    Object.defineProperty(exports, '__esModule', { value: true });

})));

//# sourceMappingURL=aotearoan-angular-fullpage.umd.js.map