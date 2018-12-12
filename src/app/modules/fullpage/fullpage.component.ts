import { DOCUMENT, PlatformLocation } from '@angular/common';
import { Component, EventEmitter, HostListener, Inject, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ScrollToConfigOptions, ScrollToService } from '@nicky-lenaers/ngx-scroll-to';
import { finalize } from 'rxjs/operators';
import { WindowRefService } from '../window-ref/window-ref.service';
import { IScrollEventListener } from './scroll-event.listener';
import { ScrollEventService } from './scroll-event.service';
import { SectionModel } from './section.model';

@Component({
  selector: 'ao-fullpage',
  styleUrls: ['./fullpage.component.scss'],
  templateUrl: './fullpage.component.html',
})
export class FullpageComponent implements OnInit, OnDestroy, IScrollEventListener {

  // if focus is on a form input then disable scrolling so that the form is usable
  public static ignoreWhenFocused = ['textarea', 'input'];
  public static eventListenerKey = 'fullpage';
  public static activeClass = 'fullpage-active';
  public static scrollSensitivity = 750;

  public window;
  public activeElement;
  public previousSectionIndex: number;
  public sectionIndex: number;
  public scrolling: boolean;

  @Input() public sections: SectionModel[];
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

  public ngOnInit() {
    // listen to scroll events from other components
    this.scrollEventService.addListener(FullpageComponent.eventListenerKey, this);

    // capture all scroll wheel events while scrolling is active (prevents the default action)
    this.window.onwheel = () => !this.scrolling;

    // needs to happen after rendering
    setTimeout(() => {
      const fragment = this.route.snapshot.fragment;
      this.scroll(Math.max(this.sections.findIndex((s) => s.url === fragment), 0));
    }, 200);
  }

  public ngOnDestroy() {
    this.scrollEventService.removeListener(FullpageComponent.eventListenerKey);
  }

  public scroll(index: number) {
    if (index !== this.sectionIndex) {
      this.scrolling = true;
      this.switchSections(index);
      this.invokeScroll();
    }
  }

  private switchSections(index: number) {
    this.previousSectionIndex = this.sectionIndex;
    this.sectionIndex = index;

    if (this.activeElement) {
      this.activeElement.classList.remove(FullpageComponent.activeClass);
    }

    const section = this.sections[this.sectionIndex];
    this.activeElement = this.document.getElementById(section.url);

    if (this.activeElement) {
      this.activeElement.classList.add(FullpageComponent.activeClass);
    }

    this.sections.forEach((s) => s.active = s.url === section.url);
    this.sectionChange.emit(section.url);
  }

  private invokeScroll() {
    const section = this.sections[this.sectionIndex];
    const config: ScrollToConfigOptions = {
      target: section.url,
    };

    this.router.navigate([this.window.location.pathname], {fragment: section.url});
    this.scrollToService.scrollTo(config)
      .pipe(
        finalize(() => {
          setTimeout(() => {
            this.scrolling = false;
          }, FullpageComponent.scrollSensitivity);
        }),
      ).subscribe();
  }

  public scrollUp(event: Event) {
    if (this.checkFocus(event)) {
      if (this.sectionIndex > 0) {
        this.scroll(this.sectionIndex - 1);
      } else if (event.type !== 'wheel') {
        // prevent default when this is the top section and we are scrolling up
        event.preventDefault();
      }
    }
  }

  public scrollDown(event: Event) {
    if (this.checkFocus(event)) {
      if (this.sectionIndex < this.sections.length - 1) {
        this.scroll(this.sectionIndex + 1);
      } else if (event.type !== 'wheel') {
        // prevent default when this is the bottom section and we are scrolling down
        event.preventDefault();
      }
    }
  }

  private checkFocus(event: Event) {
    return event.type !== 'keydown' || !FullpageComponent.ignoreWhenFocused.includes(this.document.activeElement.localName);
  }

  @HostListener('window:wheel', ['$event'])
  public fullpageWindowScroll(event: WheelEvent) {
    if (!this.scrolling) {
      if (event.deltaY > 0) {
        this.scrollDown(event);
      } else {
        this.scrollUp(event);
      }
    } else {
      event.preventDefault();
    }
  }

  @HostListener('window:keydown.PageUp', ['$event'])
  @HostListener('window:keydown.ArrowUp', ['$event'])
  @HostListener('window:keydown.shift.space', ['$event'])
  public fullpageArrowUpEvent(event: KeyboardEvent) {
    this.scrollUp(event);
  }

  @HostListener('window:keydown.PageDown', ['$event'])
  @HostListener('window:keydown.ArrowDown', ['$event'])
  @HostListener('window:keydown.space', ['$event'])
  public fullpageArrowDownEvent(event: KeyboardEvent) {
    this.scrollDown(event);
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