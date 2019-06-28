import { Component } from '@angular/core';
import { sections } from '../sections';

@Component({
  selector: 'app-section-d',
  templateUrl: './section-d.component.html',
})
export class SectionDComponent {
  public sections = sections;
}
