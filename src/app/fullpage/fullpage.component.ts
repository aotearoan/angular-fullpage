import {Component, EventEmitter, HostListener, Inject, Input, OnInit, Output} from '@angular/core';
import {ScrollToConfigOptions, ScrollToService} from '@nicky-lenaers/ngx-scroll-to';
import {ActivatedRoute, Router} from '@angular/router';
import {DOCUMENT} from '@angular/common';
import {FullpageChangeModel} from './fullpage-change.model';
import {finalize} from 'rxjs/operators';
import {from} from 'rxjs';

@Component({
  selector: 'app-fullpage',
  templateUrl: './fullpage.component.html',
  styleUrls: ['./fullpage.component.scss']
})
export class FullpageComponent implements OnInit {

  // if focus is on a form input then disable scrolling so that the form is usable
  public static ignoreWhenFocused = ['textarea', 'input', 'select', 'option'];
  public static activeClass = 'fullpage-active';
  public static scrollSensitivity = 750;

  public activeElement;
  public previousSectionIndex: number;
  public sectionIndex: number;
  public scrolling: boolean;

  @Input() public sections: string[];
  @Output() public sectionChange = new EventEmitter<FullpageChangeModel>();

  public constructor(private scrollToService: ScrollToService,
                     private route: ActivatedRoute,
                     private router: Router,
                     @Inject(DOCUMENT) private document: any) {
  }

  public ngOnInit() {
    setTimeout(() => {
      // normalise url slashes
      const fragment = this.route.snapshot.fragment;
      if (fragment) {
        const index = Math.max(this.sections.indexOf(fragment), 0);
        this.scroll(index);
      } else {
        this.scroll(0);
      }

      window.onwheel = () => !this.scrolling;
    });
  }

  public scroll(index: number) {
    if (index !== this.sectionIndex) {
      this.scrolling = true;
      this.setCurrentSectionInactive(index);
      this.invokeScroll();
      this.emitChangeEvent();
    }
  }

  private setCurrentSectionInactive(index: number) {
    this.previousSectionIndex = this.sectionIndex;
    this.sectionIndex = index;

    if (this.activeElement) {
      this.activeElement.classList.remove(FullpageComponent.activeClass);
    }
  }

  private onScrollComplete() {
    const section = this.sections[this.sectionIndex];
    this.activeElement = this.document.getElementById(section);

    if (this.activeElement) {
      this.activeElement.classList.add(FullpageComponent.activeClass);
    }

    this.scrolling = false;
  }

  private invokeScroll() {
    const section = this.sections[this.sectionIndex];
    const config: ScrollToConfigOptions = {
      target: section
    };

    from(this.router.navigate([window.location.pathname], {fragment: section}));
    this.scrollToService.scrollTo(config)
      .pipe(
        finalize(() => {
          setTimeout(() => {
            this.onScrollComplete();
          }, FullpageComponent.scrollSensitivity);
        })
      ).subscribe();
  }

  private emitChangeEvent() {
    const changeEvent = new FullpageChangeModel();
    changeEvent.previousSection = this.sections[this.previousSectionIndex];
    changeEvent.newSection = this.sections[this.sectionIndex];
    this.sectionChange.emit(changeEvent);
  }

  public scrollUp(event: Event) {
    if (this.checkFocus(event)) {
      if (this.sectionIndex > 0) {
        this.scroll(this.sectionIndex - 1);
      }
      event.preventDefault();
    }
  }

  public scrollDown(event: Event) {
    if (this.checkFocus(event)) {
      if (this.sectionIndex < this.sections.length - 1) {
        this.scroll(this.sectionIndex + 1);
      }
      event.preventDefault();
    }
  }

  private checkFocus(event: Event) {
    return event.type !== 'keydown' || !FullpageComponent.ignoreWhenFocused.includes(this.document.activeElement.localName);
  }

  @HostListener('window:wheel', ['$event'])
  onWindowScroll(event: WheelEvent) {
    if (!this.scrolling) {
      if (event.deltaY > 0) {
        this.scrollDown(event);
      } else {
        this.scrollUp(event);
      }
    }
  }

  @HostListener('window:keydown.PageUp', ['$event'])
  @HostListener('window:keydown.ArrowUp', ['$event'])
  @HostListener('window:keydown.shift.space', ['$event'])
  arrowUpEvent(event: KeyboardEvent) {
    this.scrollUp(event);
  }

  @HostListener('window:keydown.PageDown', ['$event'])
  @HostListener('window:keydown.ArrowDown', ['$event'])
  @HostListener('window:keydown.space', ['$event'])
  arrowDownEvent(event: KeyboardEvent) {
    this.scrollDown(event);
  }

  @HostListener('window:resize', ['$event'])
  resizeEvent(event: KeyboardEvent) {
    window.location.reload();
  }
}
