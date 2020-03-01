import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PleasewaitComponent } from './pleasewait.component';

describe('PleasewaitComponent', () => {
  let component: PleasewaitComponent;
  let fixture: ComponentFixture<PleasewaitComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PleasewaitComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PleasewaitComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
