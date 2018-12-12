import { Component, Input } from '@angular/core';
import { SectionModel } from '@aotearoan/angular-fullpage';

@Component({
  selector: 'app-section',
  styleUrls: ['./section.component.scss'],
  templateUrl: './section.component.html',
})
export class SectionComponent {
  @Input() public section: SectionModel;
}
