import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BillingCheckerDashboardComponent } from './billing-checker-dashboard.component';

describe('BillingCheckerDashboardComponent', () => {
  let component: BillingCheckerDashboardComponent;
  let fixture: ComponentFixture<BillingCheckerDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BillingCheckerDashboardComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BillingCheckerDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
