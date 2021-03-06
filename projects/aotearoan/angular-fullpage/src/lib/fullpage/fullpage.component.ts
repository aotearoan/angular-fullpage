import { DOCUMENT, PlatformLocation } from '@angular/common';
import { AfterViewInit, Component, EventEmitter, HostListener, Inject, Input, OnDestroy, Output } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import inViewport from 'in-viewport';
import { SwipeDirection } from '../swipe-listener/swipe-direction.model';
import { SwipeEvent } from '../swipe-listener/swipe.event';
import { WindowRefService } from '../window-ref/window-ref.service';
import { ScrollDirection } from './scroll-direction.enum';
import { IScrollEventListener, ScrollEventService } from './scroll-event.service';
import { SectionPositionModel } from './section-position.model';
import { SectionModel } from './section.model';

@Component({
  selector: 'ao-fullpage',
  styles: [`    
    ::ng-deep .fullpage {
      display: flex;
      flex-direction: column;
      margin: 0;
      position: fixed;
      top: 0;
      left: 0;
      overflow: hidden;
      transition: transform .7s ease-in;
    }

    ::ng-deep .fullpage .fullpage-section {
      width: 100vw;
      height: 100vh;
      height: calc(var(--vh, 1vh) * 100);
      overflow-y: scroll;
      overflow-x: hidden;
      -webkit-overflow-scrolling: touch;
      scrollbar-width: none;
    }

    ::ng-deep .fullpage .fullpage-section-fit-content {
      width: 100vw;
    }

    ::ng-deep .fullpage.section-1 {
      transform: translateY(-100vh);
      transform: translateY(calc(var(--vh, 1vh) * -100));
    }
    
    ::ng-deep .fullpage.section-2 {
      transform: translateY(-200vh);
      transform: translateY(calc(var(--vh, 1vh) * -200));
    }
    
    ::ng-deep .fullpage.section-3 {
      transform: translateY(-300vh);
      transform: translateY(calc(var(--vh, 1vh) * -300));
    }
    
    ::ng-deep .fullpage.section-4 {
      transform: translateY(-400vh);
      transform: translateY(calc(var(--vh, 1vh) * -400));
    }
    
    ::ng-deep .fullpage.section-5 {
      transform: translateY(-500vh);
      transform: translateY(calc(var(--vh, 1vh) * -500));
    }
    
    ::ng-deep .fullpage.section-6 {
      transform: translateY(-600vh);
      transform: translateY(calc(var(--vh, 1vh) * -600));
    }
    
    ::ng-deep .fullpage.section-7 {
      transform: translateY(-700vh);
      transform: translateY(calc(var(--vh, 1vh) * -700));
    }
    
    ::ng-deep .fullpage.section-8 {
      transform: translateY(-800vh);
      transform: translateY(calc(var(--vh, 1vh) * -800));
    }
    
    ::ng-deep .fullpage.section-9 {
      transform: translateY(-900vh);
      transform: translateY(calc(var(--vh, 1vh) * -900));
    }
    
    ::ng-deep .fullpage.section-10 {
      transform: translateY(-1000vh);
      transform: translateY(calc(var(--vh, 1vh) * -1000));
    }
    
    ::ng-deep .fullpage.section-11 {
      transform: translateY(-1100vh);
      transform: translateY(calc(var(--vh, 1vh) * -1100));
    }
    
    ::ng-deep .fullpage.section-12 {
      transform: translateY(-1200vh);
      transform: translateY(calc(var(--vh, 1vh) * -1200));
    }
    
    ::ng-deep .fullpage.section-13 {
      transform: translateY(-1300vh);
      transform: translateY(calc(var(--vh, 1vh) * -1300));
    }
    
    ::ng-deep .fullpage.section-14 {
      transform: translateY(-1400vh);
      transform: translateY(calc(var(--vh, 1vh) * -1400));
    }
    
    ::ng-deep .fullpage.section-15 {
      transform: translateY(-1500vh);
      transform: translateY(calc(var(--vh, 1vh) * -1500));
    }
    
    ::ng-deep .fullpage.section-16 {
      transform: translateY(-1600vh);
      transform: translateY(calc(var(--vh, 1vh) * -1600));
    }
    
    ::ng-deep .fullpage.section-17 {
      transform: translateY(-1700vh);
      transform: translateY(calc(var(--vh, 1vh) * -1700));
    }
    
    ::ng-deep .fullpage.section-18 {
      transform: translateY(-1800vh);
      transform: translateY(calc(var(--vh, 1vh) * -1800));
    }
    
    ::ng-deep .fullpage.section-19 {
      transform: translateY(-1900vh);
      transform: translateY(calc(var(--vh, 1vh) * -1900));
    }
    
    ::ng-deep .fullpage.section-20 {
      transform: translateY(-2000vh);
      transform: translateY(calc(var(--vh, 1vh) * -2000));
    }
    
    ::ng-deep .fullpage.last-section {
      transform: translateY(100vh) translateY(-100%);
      transform: translateY(calc(var(--vh, 1vh) * 100 - 100%));
    }
    
    ::ng-deep body {
      padding: 0;
      margin: 0;
    }

    ::ng-deep html,
    ::ng-deep body,
    ::ng-deep .fullpage-section {
      -ms-overflow-style: none;
      overflow: auto;
    }

    ::ng-deep html::-webkit-scrollbar,
    ::ng-deep body::-webkit-scrollbar,
    ::ng-deep .fullpage-section::-webkit-scrollbar {
      width: 0;
    }
  `],
  template: `
    <div *ngIf="sections"
         [ngClass]="sectionIndex + 1 === sections?.length ? 'fullpage last-section' : 'fullpage section-' + sectionIndex"
         aoSwipeListener (swipeEvent)="swipeEventHandler($event)">
      <ng-content></ng-content>
    </div>
  `,
})
export class FullpageComponent implements AfterViewInit, OnDestroy, IScrollEventListener {

  // if focus is on a form input then disable scrolling so that the form is usable
  public static ignoreWhenFocused = ['textarea', 'input'];
  public static eventListenerKey = 'fullpage';
  public static activeClass = 'fullpage-active';

  public window;
  public activeSection;
  public previousSectionIndex: number;
  public sectionIndex: number;
  public isScrolling: boolean;
  public sectionScrollingEnabled: boolean;

  public lastWheelEventDate = 0;

  @Input() public sections: SectionModel[];
  @Input() public lockScrolling: boolean;
  // ignore wheel events less than the scroll sensitivity apart, this prevents rapid
  // scrolling from changing several sections at once
  @Input() public scrollSensitivity = 125;
  @Output() public sectionChange = new EventEmitter<string>();

  public constructor(private route: ActivatedRoute,
                     private router: Router,
                     @Inject(DOCUMENT) private document: any,
                     private windowRef: WindowRefService,
                     private scrollEventService: ScrollEventService,
                     private platformLocation: PlatformLocation) {
    this.window = windowRef.getNativeWindow();
    platformLocation.onPopState(() => {
      this.window.location.reload();
    });
  }

  public ngAfterViewInit() {
    setTimeout(() => {
      this.fullpageResizeEvent(null);
      // if IE then change the scroll sensitivity as the events trickle through much slower
      if (this.window.navigator.msPointerEnabled && this.window.navigator.userAgent.indexOf('Windows') >= 0) {
        this.scrollSensitivity = 3 * this.scrollSensitivity;
      }
      // listen to scroll events from other components
      this.scrollEventService.addListener(FullpageComponent.eventListenerKey, this);
      const fragment = this.route.snapshot.fragment || this.sections[0].url;
      this.switchSectionsByFragment(fragment);
    });
    this.route.fragment.subscribe((fragment) => {
      setTimeout(() => {
        this.switchSectionsByFragment(fragment || this.sections[0].url);
      });
    });
  }

  public ngOnDestroy() {
    this.scrollEventService.removeListener(FullpageComponent.eventListenerKey);
  }

  public swipeEventHandler(swipeEvent: SwipeEvent) {
    switch (swipeEvent.direction) {
      case SwipeDirection.Up:
        this.handleScrollEvent(swipeEvent.endEvent, ScrollDirection.Down);
        break;
      case SwipeDirection.Down:
        this.handleScrollEvent(swipeEvent.endEvent, ScrollDirection.Up);
        break;
    }
  }

  private preventDefault(event: Event) {
    if (event && event.cancelable) {
      event.preventDefault();
    }
  }

  public scroll(index: number) {
    if (!this.lockScrolling) {
      this.doScroll(index);
    }
  }

  public scrollUp(event: Event) {
    if (this.sectionIndex > 0) {
      this.doScroll(this.sectionIndex - 1);
    }
    this.preventDefault(event);
  }

  public scrollDown(event: Event) {
    if (this.sectionIndex < this.sections.length - 1) {
      this.doScroll(this.sectionIndex + 1);
    }
    this.preventDefault(event);
  }

  private doScroll(index: number) {
    this.isScrolling = true;
    this.switchSections(index);
    const section = this.sections[this.sectionIndex];
    this.sectionChange.emit(section.url);
    setTimeout(() => {
      this.isScrolling = false;
    });
  }

  private switchSectionsByFragment(fragment: string) {
    const index = Math.max(this.sections.findIndex((s) => s.url === fragment), 0);
    this.switchSections(index);
    this.scroll(index);
  }

  private switchSections(index: number) {
    this.previousSectionIndex = this.sectionIndex;
    this.sectionIndex = index;

    if (this.activeSection) {
      this.activeSection.classList.remove(FullpageComponent.activeClass);
    }

    const section = this.sections[this.sectionIndex];
    this.activeSection = this.document.getElementById(section.url);

    if (this.activeSection) {
      this.activeSection.classList.add(FullpageComponent.activeClass);
    }

    this.sections.forEach((s) => s.active = s.url === section.url);
    const baseHref = this.platformLocation.getBaseHrefFromDOM();
    const pathName = this.window.location.pathname;
    const adjustedPathName = pathName.indexOf(baseHref) === 0 ? pathName.substring(baseHref.length) : pathName;
    if (section.pageTop) {
      this.router.navigate([adjustedPathName]);
    } else {
      this.router.navigate([adjustedPathName], {fragment: section.url});
    }
    const element = this.document.getElementById(section.url);
    if (element) {
      if (element.scrollTo) {
        element.scrollTo(0, 0);
      }
    }
  }

  private checkFocus() {
    return !FullpageComponent.ignoreWhenFocused.includes(this.document.activeElement.localName);
  }

  private canScroll(event: Event) {
    return event.type !== 'keydown' || this.checkFocus();
  }

  private handlePageScrolling(event: Event, scrollDirection: ScrollDirection) {
    if (this.canScroll(event)) {
      switch (scrollDirection) {
        case ScrollDirection.Down:
          this.scrollDown(event);
          break;
        case ScrollDirection.Up:
          this.scrollUp(event);
          break;
      }
    } else {
      this.preventDefault(event);
    }
  }

  private calcSectionPosition(): SectionPositionModel {
    return {
      atSectionTop: !!this.activeSection && this.activeSection.scrollTop === 0,
      atSectionBottom: !!this.activeSection &&
        this.activeSection.offsetHeight + this.activeSection.scrollTop >= this.activeSection.scrollHeight,
    };
  }

  private calculateSectionScrollingState(scrollDirection: ScrollDirection, event) {
    if (event.type === 'wheel' || event.type === 'touchend' || event.type.indexOf('pointer') === 0) {
      const sectionPosition = this.calcSectionPosition();
      if (scrollDirection === ScrollDirection.Down && !sectionPosition.atSectionBottom ||
        scrollDirection === ScrollDirection.Up && !sectionPosition.atSectionTop) {
        this.sectionScrollingEnabled = true;
      } else {
        this.sectionScrollingEnabled = false;
      }
    } else {
      this.sectionScrollingEnabled = false;
    }
  }

  private handleScrollEvent(event: Event, scrollDirection: ScrollDirection) {
    this.calculateSectionScrollingState(scrollDirection, event);

    if (!this.isScrolling) {
      if (this.lockScrolling) {
        if (!this.sectionScrollingEnabled) {
          this.preventDefault(event);
        }
      } else {
        // only section scrolling can be invoked if scrolling is locked
        if (!this.sectionScrollingEnabled) {
          this.handlePageScrolling(event, scrollDirection);
        }
      }
    } else {
      this.preventDefault(event);
    }
  }

  @HostListener('window:wheel', ['$event'])
  public fullpageWindowScroll(event: WheelEvent) {
    if (inViewport(this.activeSection)) {
      const newWheelEventDate = event.timeStamp;
      const eventTimeDelta = newWheelEventDate - this.lastWheelEventDate;
      this.lastWheelEventDate = newWheelEventDate;

      if (Math.abs(event.deltaY) > Math.abs(event.deltaX) && eventTimeDelta > this.scrollSensitivity) {
        this.handleScrollEvent(event, event.deltaY > 0 ? ScrollDirection.Down : ScrollDirection.Up);
      }
    }
  }

  @HostListener('window:keydown.PageUp', ['$event'])
  @HostListener('window:keydown.ArrowUp', ['$event'])
  @HostListener('window:keydown.shift.space', ['$event'])
  public fullpageArrowUpEvent(event: KeyboardEvent) {
    if (inViewport(this.activeSection)) {
      if (!this.lockScrolling && this.checkFocus()) {
        this.handlePageScrolling(event, ScrollDirection.Up);
      }
    }
  }

  @HostListener('window:keydown.PageDown', ['$event'])
  @HostListener('window:keydown.ArrowDown', ['$event'])
  @HostListener('window:keydown.space', ['$event'])
  public fullpageArrowDownEvent(event: KeyboardEvent) {
    if (inViewport(this.activeSection)) {
      if (!this.lockScrolling && this.checkFocus()) {
        this.handlePageScrolling(event, ScrollDirection.Down);
      }
    }
  }

  @HostListener('window:resize', ['$event'])
  public fullpageResizeEvent(event: UIEvent) {
    const vh = window.innerHeight * 0.01;
    this.document.documentElement.style.setProperty('--vh', `${vh}px`);
  }
}
