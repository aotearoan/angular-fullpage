import { APP_BASE_HREF } from '@angular/common';
import { NgModule } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ScrollToService } from '@nicky-lenaers/ngx-scroll-to';
import { Observable } from 'rxjs';
import { ScrollEventService } from './scroll-event.service';
@NgModule({
  declarations: [],
  exports: [],
  providers: [
    {provide: APP_BASE_HREF, useValue: '/'},
    {
      provide: Router, useValue: {
        navigate: jasmine.createSpy('navigate'),
      },
    },
    {
      provide: ScrollEventService, useValue: {
        addListener: jasmine.createSpy('scroll-addListener'),
        removeListener: jasmine.createSpy('scroll-removeListener'),
        scroll: jasmine.createSpy('scroll'),
      },
    },
    {
      provide: ScrollToService, useValue: {
        scrollTo: () => Observable.create(),
      },
    },
    {
      provide: ActivatedRoute, useValue: {
        snapshot: {
          fragment: '',
        },
      },
    },
  ],
})
export class FullpageTestModule {}
