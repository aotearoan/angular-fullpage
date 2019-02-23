import {DOCUMENT, PlatformLocation} from '@angular/common';
import {AfterViewInit, Component, EventEmitter, HostListener, Inject, Input, OnDestroy, Output} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {ScrollToConfigOptions, ScrollToService} from '@nicky-lenaers/ngx-scroll-to';
import {finalize} from 'rxjs/operators';
import {SwipeDirection} from '../swipe-listener/swipe-direction.model';
import {SwipeEvent} from '../swipe-listener/swipe.event';
import {WindowRefService} from '../window-ref/window-ref.service';
import {ScrollDirection} from './scroll-direction.enum';
import {IScrollEventListener, ScrollEventService} from './scroll-event.service';
import {SectionPositionModel} from './section-position.model';
import {SectionModel} from './section.model';

@Component({
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
    <div class="fullpage"
         *ngIf="sections"
         [class.scrolling]="isScrolling"
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
  public wheelFunction;
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
  @Input() public scrollSensitivity = 75;
  @Output() public sectionChange = new EventEmitter<string>();

  public constructor(private scrollToService: ScrollToService,
                     private route: ActivatedRoute,
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
      // listen to scroll events from other components
      this.scrollEventService.addListener(FullpageComponent.eventListenerKey, this);
      // only enable wheel events when section scrolling is enabled
      this.wheelFunction = this.window.onwheel;
      this.window.onwheel = () => this.sectionScrollingEnabled;

      const fragment = this.route.snapshot.fragment;
      const index = Math.max(this.sections.findIndex((s) => s.url === fragment), 0);
      this.switchSections(index);
      this.scroll(index);
    });
  }

  public ngOnDestroy() {
    if (this.wheelFunction) {
      this.window.onwheel = this.wheelFunction;
    }
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

  public scroll(index: number) {
    if (!this.lockScrolling) {
      this.doScroll(index);
    }
  }

  public scrollUp(event: Event) {
    if (this.sectionIndex > 0) {
      this.doScroll(this.sectionIndex - 1);
    }
    event.preventDefault();
  }

  public scrollDown(event: Event) {
    if (this.sectionIndex < this.sections.length - 1) {
      this.doScroll(this.sectionIndex + 1);
    }
    event.preventDefault();
  }

  private doScroll(index: number) {
    this.isScrolling = true;
    this.switchSections(index);
    this.invokeScroll();
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
    this.sectionChange.emit(section.url);
  }

  private invokeScroll() {
    const section = this.sections[this.sectionIndex];
    const config: ScrollToConfigOptions = {
      target: section.url,
    };

    if (section.pageTop) {
      this.router.navigate([this.window.location.pathname]);
    } else {
      this.router.navigate([this.window.location.pathname], {fragment: section.url});
    }
    setTimeout(() => {
      this.scrollToService.scrollTo(config)
        .pipe(
          finalize(() => {
            setTimeout(() => {
              this.isScrolling = false;
            });
          }),
        ).subscribe();
    }, 150);
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
      event.preventDefault();
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
    if (event.type === 'wheel' || event.type === 'touchend') {
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
          event.preventDefault();
        }
      } else {
        // only section scrolling can be invoked if scrolling is locked
        if (!this.sectionScrollingEnabled) {
          this.handlePageScrolling(event, scrollDirection);
        }
      }
    } else {
      event.preventDefault();
    }
  }

  @HostListener('window:wheel', ['$event'])
  public fullpageWindowScroll(event: WheelEvent) {
    const newWheelEventDate = Date.now();
    const eventTimeDelta = newWheelEventDate - this.lastWheelEventDate;
    this.lastWheelEventDate = newWheelEventDate;

    if (eventTimeDelta > this.scrollSensitivity) {
      this.handleScrollEvent(event, event.deltaY > 0 ? ScrollDirection.Down : ScrollDirection.Up);
    } else {
      event.preventDefault();
    }
  }

  @HostListener('window:keydown.PageUp', ['$event'])
  @HostListener('window:keydown.ArrowUp', ['$event'])
  @HostListener('window:keydown.shift.space', ['$event'])
  public fullpageArrowUpEvent(event: KeyboardEvent) {
    this.handleScrollEvent(event, ScrollDirection.Up);
  }

  @HostListener('window:keydown.PageDown', ['$event'])
  @HostListener('window:keydown.ArrowDown', ['$event'])
  @HostListener('window:keydown.space', ['$event'])
  public fullpageArrowDownEvent(event: KeyboardEvent) {
    this.handleScrollEvent(event, ScrollDirection.Down);
  }

  @HostListener('window:resize')
  public fullpageResizeEvent() {
    const section = this.sections[this.sectionIndex];
    const config: ScrollToConfigOptions = {
      target: section.url,
    };

    this.scrollToService.scrollTo(config);
  }
}
