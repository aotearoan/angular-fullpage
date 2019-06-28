import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { FullpageModule } from '@aotearoan/angular-fullpage';
import { FullpageTestModule } from '../../../projects/aotearoan/angular-fullpage/src/lib/fullpage/fullpage-test.module';
import { SectionModule } from '../section/section.module';
import { SectionAComponent } from './section-a.component';

describe('SectionAComponent', () => {
  let component: SectionAComponent;
  let fixture: ComponentFixture<SectionAComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SectionAComponent ],
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
    fixture = TestBed.createComponent(SectionAComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
