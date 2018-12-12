import { Component } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { FullpageTestModule } from './fullpage-test.module';
import { FullpageComponent } from './fullpage.component';
import { FullpageModule } from './fullpage.module';
@Component({
  template: `
    <app-fullpage [sections]="sections">
      <div class="fullpage-section" data-anchor="section-1"></div>
      <div class="fullpage-section" data-anchor="section-2"></div>
    </app-fullpage>
  `,
})
export class FullpageTestComponent {
  public sections = [
    { url: 'section-1', title: 'Section 1', active: true},
    { url: 'section-2', title: 'Section 2', active: false},
  ];
}
describe('FullpageComponent', () => {
  let component: FullpageTestComponent;
  let fixture: ComponentFixture<FullpageTestComponent>;
  let fullpageComponent: FullpageComponent;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [FullpageTestComponent],
      imports: [
        FullpageModule,
        FullpageTestModule,
      ],
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FullpageTestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    fullpageComponent = fixture.debugElement.query(By.directive(FullpageComponent))
      .injector.get(FullpageComponent);  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
