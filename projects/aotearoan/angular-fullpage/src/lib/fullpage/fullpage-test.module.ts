import { APP_BASE_HREF } from '@angular/common';
import { NgModule } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
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
      provide: ActivatedRoute, useValue: {
        snapshot: {
          fragment: '',
        },
      },
    },
  ],
})
export class FullpageTestModule {}
