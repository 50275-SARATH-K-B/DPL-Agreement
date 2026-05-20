import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BillingCheckerComponent } from './billing-checker.component';

describe('BillingCheckerComponent', () => {
  let component: BillingCheckerComponent;
  let fixture: ComponentFixture<BillingCheckerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BillingCheckerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BillingCheckerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
