import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { FullpageModule } from '@aotearoan/angular-fullpage';
import { FullpageTestModule } from '../../../projects/aotearoan/angular-fullpage/src/lib/fullpage/fullpage-test.module';
import { SectionModule } from '../section/section.module';
import { SectionBComponent } from './section-b.component';

describe('SectionBComponent', () => {
  let component: SectionBComponent;
  let fixture: ComponentFixture<SectionBComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SectionBComponent ],
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
    fixture = TestBed.createComponent(SectionBComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
