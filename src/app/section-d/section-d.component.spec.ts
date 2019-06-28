import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { FullpageModule } from '@aotearoan/angular-fullpage';
import { FullpageTestModule } from '../../../projects/aotearoan/angular-fullpage/src/lib/fullpage/fullpage-test.module';
import { SectionModule } from '../section/section.module';
import { SectionDComponent } from './section-d.component';

describe('SectionDComponent', () => {
  let component: SectionDComponent;
  let fixture: ComponentFixture<SectionDComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SectionDComponent ],
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
    fixture = TestBed.createComponent(SectionDComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
