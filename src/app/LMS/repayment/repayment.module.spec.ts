import { RepaymentModule } from './repayment.module';

describe('RepaymentModule', () => {
  let repaymentModule: RepaymentModule;

  beforeEach(() => {
    repaymentModule = new RepaymentModule();
  });

  it('should create an instance', () => {
    expect(repaymentModule).toBeTruthy();
  });
});
