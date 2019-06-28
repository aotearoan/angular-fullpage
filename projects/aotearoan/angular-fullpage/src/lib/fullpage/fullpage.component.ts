import { DOCUMENT, PlatformLocation } from '@angular/common';
import { AfterViewInit, Component, EventEmitter, HostListener, Inject, Input, OnDestroy, Output } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
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
    .fullpage {
      display: flex;
      flex-direction: column;
      margin: 0;
      position: fixed;
      top: 0;
      left: 0;
      overflow: hidden;
      transition: transform .7s ease-in;
      width: 100vw;
      height: calc(var(--vh, 1vh) * 100);
      -webkit-overflow-scrolling: touch;
      scrollbar-width: none;
    }

    ::ng-deep body {
      padding: 0;
      margin: 0;
    }

    ::ng-deep html,
    ::ng-deep body,
    .fullpage {
      -ms-overflow-style: none;
      overflow: auto;
    }

    ::ng-deep html::-webkit-scrollbar,
    ::ng-deep body::-webkit-scrollbar,
    .fullpage::-webkit-scrollbar {
      width: 0;
    }
  `],
  template: `
    <div *ngIf="sections"
         class="fullpage"
         [ngClass]="sections[sectionIndex].url"
         aoSwipeListener (swipeEvent)="swipeEventHandler($event)">
      <ng-content></ng-content>
    </div>
  `,
})
export class FullpageComponent implements AfterViewInit, OnDestroy, IScrollEventListener {

  // if focus is on a form input then disable scrolling so that the form is usable
  public static ignoreWhenFocused = ['textarea', 'input'];
  public static eventListenerKey = 'fullpage';

  public window;
  public activeSection;
  public sectionScrollingEnabled: boolean;

  public lastWheelEventDate = 0;

  @Input() public sections: SectionModel[];
  @Input() public sectionIndex: number;
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
      const path = this.route.snapshot.url[this.route.snapshot.url.length - 1].path || this.sections[0].url;
      this.switchSectionsByPath(path);
    });
    this.route.url.subscribe((url) => {
      setTimeout(() => {
        this.switchSectionsByPath(url[url.length - 1].path || this.sections[0].url);
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
  }

  public scrollDown(event: Event) {
    if (this.sectionIndex < this.sections.length - 1) {
      this.doScroll(this.sectionIndex + 1);
    }
  }

  private doScroll(index: number) {
    this.switchSections(index);
  }

  private switchSectionsByPath(path: string) {
    const index = Math.max(this.sections.findIndex((s) => s.url === path), 0);
    this.switchSections(index);
    this.scroll(index);
  }

  private switchSections(index: number) {
    const section = this.sections[index];
    this.activeSection = this.document.getElementById(section.url);

    this.sections.forEach((s) => s.active = s.url === section.url);
    const baseHref = this.platformLocation.getBaseHrefFromDOM();
    const pathSegments = this.window.location.pathname.split('/');
    pathSegments.pop();
    pathSegments.push(section.url);
    const pathName = pathSegments.join('/');
    const adjustedPathName = pathName.indexOf(baseHref) === 0 ? pathName.substring(baseHref.length) : pathName;
    if (section.pageTop) {
      this.router.navigate([adjustedPathName]);
    } else {
      this.router.navigate([adjustedPathName]);
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
  }

  @HostListener('window:wheel', ['$event'])
  public fullpageWindowScroll(event: WheelEvent) {
    const newWheelEventDate = event.timeStamp;
    const eventTimeDelta = newWheelEventDate - this.lastWheelEventDate;
    this.lastWheelEventDate = newWheelEventDate;

    if (Math.abs(event.deltaY) > Math.abs(event.deltaX) && eventTimeDelta > this.scrollSensitivity) {
      this.handleScrollEvent(event, event.deltaY > 0 ? ScrollDirection.Down : ScrollDirection.Up);
    }
  }

  @HostListener('window:keydown.PageUp', ['$event'])
  @HostListener('window:keydown.ArrowUp', ['$event'])
  @HostListener('window:keydown.shift.space', ['$event'])
  public fullpageArrowUpEvent(event: KeyboardEvent) {
    if (!this.lockScrolling && this.checkFocus()) {
      this.handlePageScrolling(event, ScrollDirection.Up);
    }
  }

  @HostListener('window:keydown.PageDown', ['$event'])
  @HostListener('window:keydown.ArrowDown', ['$event'])
  @HostListener('window:keydown.space', ['$event'])
  public fullpageArrowDownEvent(event: KeyboardEvent) {
    if (!this.lockScrolling && this.checkFocus()) {
      this.handlePageScrolling(event, ScrollDirection.Down);
    }
  }

  @HostListener('window:resize', ['$event'])
  public fullpageResizeEvent(event: UIEvent) {
    const vh = window.innerHeight * 0.01;
    this.document.documentElement.style.setProperty('--vh', `${vh}px`);
  }
}
