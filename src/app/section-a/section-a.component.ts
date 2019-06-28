import { Component } from '@angular/core';
import { sections } from '../sections';

@Component({
  selector: 'app-section-a',
  templateUrl: './section-a.component.html',
})
export class SectionAComponent {
  public sections = sections;
}
