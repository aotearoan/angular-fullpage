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
var FullpageModule = /** @class */ (function () {
    function FullpageModule() {
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
    return FullpageModule;
}());
export { FullpageModule };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZnVsbHBhZ2UubW9kdWxlLmpzIiwic291cmNlUm9vdCI6Im5nOi8vQGFvdGVhcm9hbi9hbmd1bGFyLWZ1bGxwYWdlLyIsInNvdXJjZXMiOlsibGliL2Z1bGxwYWdlL2Z1bGxwYWdlLm1vZHVsZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7O0FBQUEsT0FBTyxFQUFFLFlBQVksRUFBRSxNQUFNLGlCQUFpQixDQUFDO0FBQy9DLE9BQU8sRUFBRSxRQUFRLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFDekMsT0FBTyxFQUFFLGNBQWMsRUFBRSxNQUFNLDhCQUE4QixDQUFDO0FBQzlELE9BQU8sRUFBRSxlQUFlLEVBQUUsTUFBTSxpQ0FBaUMsQ0FBQztBQUNsRSxPQUFPLEVBQUUsaUJBQWlCLEVBQUUsTUFBTSxzQkFBc0IsQ0FBQztBQUN6RCxPQUFPLEVBQUUsa0JBQWtCLEVBQUUsTUFBTSx3QkFBd0IsQ0FBQztBQUU1RDtJQUFBO0lBWThCLENBQUM7O2dCQVo5QixRQUFRLFNBQUM7b0JBQ1IsWUFBWSxFQUFFO3dCQUNaLGlCQUFpQjtxQkFDbEI7b0JBQ0QsT0FBTyxFQUFFLENBQUMsaUJBQWlCLENBQUM7b0JBQzVCLE9BQU8sRUFBRTt3QkFDUCxZQUFZO3dCQUNaLGNBQWMsQ0FBQyxPQUFPLEVBQUU7d0JBQ3hCLGVBQWU7cUJBQ2hCO29CQUNELFNBQVMsRUFBRSxDQUFDLGtCQUFrQixDQUFDO2lCQUNoQzs7SUFDNkIscUJBQUM7Q0FBQSxBQVovQixJQVkrQjtTQUFsQixjQUFjIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQ29tbW9uTW9kdWxlIH0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uJztcbmltcG9ydCB7IE5nTW9kdWxlIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBTY3JvbGxUb01vZHVsZSB9IGZyb20gJ0BuaWNreS1sZW5hZXJzL25neC1zY3JvbGwtdG8nO1xuaW1wb3J0IHsgV2luZG93UmVmTW9kdWxlIH0gZnJvbSAnLi4vd2luZG93LXJlZi93aW5kb3ctcmVmLm1vZHVsZSc7XG5pbXBvcnQgeyBGdWxscGFnZUNvbXBvbmVudCB9IGZyb20gJy4vZnVsbHBhZ2UuY29tcG9uZW50JztcbmltcG9ydCB7IFNjcm9sbEV2ZW50U2VydmljZSB9IGZyb20gJy4vc2Nyb2xsLWV2ZW50LnNlcnZpY2UnO1xuXG5ATmdNb2R1bGUoe1xuICBkZWNsYXJhdGlvbnM6IFtcbiAgICBGdWxscGFnZUNvbXBvbmVudCxcbiAgXSxcbiAgZXhwb3J0czogW0Z1bGxwYWdlQ29tcG9uZW50XSxcbiAgaW1wb3J0czogW1xuICAgIENvbW1vbk1vZHVsZSxcbiAgICBTY3JvbGxUb01vZHVsZS5mb3JSb290KCksXG4gICAgV2luZG93UmVmTW9kdWxlLFxuICBdLFxuICBwcm92aWRlcnM6IFtTY3JvbGxFdmVudFNlcnZpY2VdLFxufSlcbmV4cG9ydCBjbGFzcyBGdWxscGFnZU1vZHVsZSB7IH1cbiJdfQ==