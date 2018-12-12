import { Component, Input } from '@angular/core';
import { SectionModel } from '../modules/fullpage/section.model';

@Component({
  selector: 'app-section',
  styleUrls: ['./section.component.scss'],
  templateUrl: './section.component.html',
})
export class SectionComponent {
  @Input() public section: SectionModel;
}
