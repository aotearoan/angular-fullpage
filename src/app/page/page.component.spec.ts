import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FullpageTestModule } from '../modules/fullpage/fullpage-test.module';
import { FullpageModule } from '../modules/fullpage/fullpage.module';
import { SectionModule } from '../section/section.module';
import { PageComponent } from './page.component';

describe('PageComponent', () => {
  let component: PageComponent;
  let fixture: ComponentFixture<PageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PageComponent ],
      imports: [
        FullpageModule,
        SectionModule,
        FullpageTestModule,
      ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
