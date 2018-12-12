import { Component } from '@angular/core';

@Component({
  selector: 'app-page',
  styleUrls: ['./page.component.scss'],
  templateUrl: './page.component.html',
})
export class PageComponent {
  public sections = [
    {url: 'section-a', title: 'Section A', active: false},
    {url: 'section-b', title: 'Section B', active: false},
    {url: 'section-c', title: 'Section C', active: false},
    {url: 'section-d', title: 'Section D', active: false},
    {url: 'section-e', title: 'Section E', active: false},
    {url: 'section-f', title: 'Section F', active: false},
  ];
}
