/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ScrollToModule } from '@nicky-lenaers/ngx-scroll-to';
import { WindowRefModule } from '../window-ref/window-ref.module';
import { FullpageComponent } from './fullpage.component';
import { ScrollEventService } from './scroll-event.service';
export class FullpageModule {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZnVsbHBhZ2UubW9kdWxlLmpzIiwic291cmNlUm9vdCI6Im5nOi8vQGFvdGVhcm9hbi9hbmd1bGFyLWZ1bGxwYWdlLyIsInNvdXJjZXMiOlsibGliL2Z1bGxwYWdlL2Z1bGxwYWdlLm1vZHVsZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7O0FBQUEsT0FBTyxFQUFFLFlBQVksRUFBRSxNQUFNLGlCQUFpQixDQUFDO0FBQy9DLE9BQU8sRUFBRSxRQUFRLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFDekMsT0FBTyxFQUFFLGNBQWMsRUFBRSxNQUFNLDhCQUE4QixDQUFDO0FBQzlELE9BQU8sRUFBRSxlQUFlLEVBQUUsTUFBTSxpQ0FBaUMsQ0FBQztBQUNsRSxPQUFPLEVBQUUsaUJBQWlCLEVBQUUsTUFBTSxzQkFBc0IsQ0FBQztBQUN6RCxPQUFPLEVBQUUsa0JBQWtCLEVBQUUsTUFBTSx3QkFBd0IsQ0FBQztBQWM1RCxNQUFNLE9BQU8sY0FBYzs7O1lBWjFCLFFBQVEsU0FBQztnQkFDUixZQUFZLEVBQUU7b0JBQ1osaUJBQWlCO2lCQUNsQjtnQkFDRCxPQUFPLEVBQUUsQ0FBQyxpQkFBaUIsQ0FBQztnQkFDNUIsT0FBTyxFQUFFO29CQUNQLFlBQVk7b0JBQ1osY0FBYyxDQUFDLE9BQU8sRUFBRTtvQkFDeEIsZUFBZTtpQkFDaEI7Z0JBQ0QsU0FBUyxFQUFFLENBQUMsa0JBQWtCLENBQUM7YUFDaEMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBDb21tb25Nb2R1bGUgfSBmcm9tICdAYW5ndWxhci9jb21tb24nO1xuaW1wb3J0IHsgTmdNb2R1bGUgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IFNjcm9sbFRvTW9kdWxlIH0gZnJvbSAnQG5pY2t5LWxlbmFlcnMvbmd4LXNjcm9sbC10byc7XG5pbXBvcnQgeyBXaW5kb3dSZWZNb2R1bGUgfSBmcm9tICcuLi93aW5kb3ctcmVmL3dpbmRvdy1yZWYubW9kdWxlJztcbmltcG9ydCB7IEZ1bGxwYWdlQ29tcG9uZW50IH0gZnJvbSAnLi9mdWxscGFnZS5jb21wb25lbnQnO1xuaW1wb3J0IHsgU2Nyb2xsRXZlbnRTZXJ2aWNlIH0gZnJvbSAnLi9zY3JvbGwtZXZlbnQuc2VydmljZSc7XG5cbkBOZ01vZHVsZSh7XG4gIGRlY2xhcmF0aW9uczogW1xuICAgIEZ1bGxwYWdlQ29tcG9uZW50LFxuICBdLFxuICBleHBvcnRzOiBbRnVsbHBhZ2VDb21wb25lbnRdLFxuICBpbXBvcnRzOiBbXG4gICAgQ29tbW9uTW9kdWxlLFxuICAgIFNjcm9sbFRvTW9kdWxlLmZvclJvb3QoKSxcbiAgICBXaW5kb3dSZWZNb2R1bGUsXG4gIF0sXG4gIHByb3ZpZGVyczogW1Njcm9sbEV2ZW50U2VydmljZV0sXG59KVxuZXhwb3J0IGNsYXNzIEZ1bGxwYWdlTW9kdWxlIHsgfVxuIl19