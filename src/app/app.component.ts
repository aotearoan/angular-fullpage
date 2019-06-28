import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { sections } from './sections';
import { slideAnimation } from './slide.animation';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  animations: [slideAnimation],
})
export class AppComponent {
  private previousSectionIndex = 0;

  public prepareRoute(outlet: RouterOutlet) {
    return outlet && outlet.activatedRouteData && outlet.activatedRouteData.animation;
  }

  public animationParams(routerOutlet: RouterOutlet) {
    if (routerOutlet.isActivated) {
      const pathSegments = routerOutlet.activatedRoute.routeConfig.path.split('/');
      const section = pathSegments[pathSegments.length - 1];

      const newIndex = sections.findIndex((s) => s.url === section);
      const down = newIndex > this.previousSectionIndex;
      this.previousSectionIndex = newIndex;

      return {
        enterFrom: down ? 100 : -100,
        leaveTo: down ? -100 : 100,
      };
    }

    return {
      enterFrom: 100,
      leaveTo: -100,
    };
  }
}
