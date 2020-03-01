import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LogintransitionComponent } from './logintransition.component';

describe('LogintransitionComponent', () => {
  let component: LogintransitionComponent;
  let fixture: ComponentFixture<LogintransitionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LogintransitionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LogintransitionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
