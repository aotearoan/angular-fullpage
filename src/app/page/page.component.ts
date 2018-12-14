import { Component } from '@angular/core';

@Component({
  selector: 'app-page',
  styleUrls: ['./page.component.scss'],
  templateUrl: './page.component.html',
})
export class PageComponent {
  public sections = [
    {url: 'section-a', active: false},
    {url: 'section-b', active: false},
    {url: 'section-c', active: false},
    {url: 'section-d', active: false},
  ];
}
