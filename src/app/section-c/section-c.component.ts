import { Component } from '@angular/core';
import { sections } from '../sections';

@Component({
  selector: 'app-section-c',
  templateUrl: './section-c.component.html',
})
export class SectionCComponent {
  public sections = sections;
}
