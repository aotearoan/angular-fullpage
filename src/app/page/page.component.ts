import { Component } from '@angular/core';

@Component({
  selector: 'app-page',
  templateUrl: './page.component.html',
  styleUrls: ['./page.component.scss']
})
export class PageComponent {
  public links = [
    {url: 'section-a', title: 'Section A'},
    {url: 'section-b', title: 'Section B'},
    {url: 'section-c', title: 'Section C'},
    {url: 'section-d', title: 'Section D'},
    {url: 'section-e', title: 'Section E'},
    {url: 'section-f', title: 'Section F'}
  ];

  public sections = this.links.map((l) => l.url);
}
