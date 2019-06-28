import { Component } from '@angular/core';
import { sections } from '../sections';

@Component({
  selector: 'app-section-b',
  templateUrl: './section-b.component.html',
})
export class SectionBComponent {
  public sections = sections;
}
