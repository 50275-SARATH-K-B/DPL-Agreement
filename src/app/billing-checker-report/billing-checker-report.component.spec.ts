import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BillingCheckerReportComponent } from './billing-checker-report.component';

describe('BillingCheckerReportComponent', () => {
  let component: BillingCheckerReportComponent;
  let fixture: ComponentFixture<BillingCheckerReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BillingCheckerReportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BillingCheckerReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
