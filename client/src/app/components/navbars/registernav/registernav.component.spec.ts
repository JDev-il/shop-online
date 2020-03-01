import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RegisternavComponent } from './registernav.component';

describe('RegisternavComponent', () => {
  let component: RegisternavComponent;
  let fixture: ComponentFixture<RegisternavComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RegisternavComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RegisternavComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
