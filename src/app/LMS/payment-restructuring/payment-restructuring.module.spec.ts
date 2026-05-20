import { PaymentRestructuringModule } from './payment-restructuring.module';

describe('PaymentRestructuringModule', () => {
  let paymentRestructuringModule: PaymentRestructuringModule;

  beforeEach(() => {
    paymentRestructuringModule = new PaymentRestructuringModule();
  });

  it('should create an instance', () => {
    expect(paymentRestructuringModule).toBeTruthy();
  });
});
