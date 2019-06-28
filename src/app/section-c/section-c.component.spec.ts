import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { FullpageModule } from '@aotearoan/angular-fullpage';
import { FullpageTestModule } from '../../../projects/aotearoan/angular-fullpage/src/lib/fullpage/fullpage-test.module';
import { SectionModule } from '../section/section.module';
import { SectionCComponent } from './section-c.component';

describe('SectionCComponent', () => {
  let component: SectionCComponent;
  let fixture: ComponentFixture<SectionCComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SectionCComponent ],
      imports: [
        FullpageModule,
        SectionModule,
        FullpageTestModule,
        RouterTestingModule,
      ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SectionCComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
