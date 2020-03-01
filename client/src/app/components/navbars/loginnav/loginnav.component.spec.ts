import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LoginnavComponent } from './loginnav.component';

describe('LoginnavComponent', () => {
  let component: LoginnavComponent;
  let fixture: ComponentFixture<LoginnavComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LoginnavComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginnavComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
