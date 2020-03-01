import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomernavComponent } from './customernav.component';

describe('CustomernavComponent', () => {
  let component: CustomernavComponent;
  let fixture: ComponentFixture<CustomernavComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CustomernavComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomernavComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
