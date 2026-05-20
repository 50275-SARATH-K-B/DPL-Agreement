import { BranchdashboardModule } from './branchdashboard.module';

describe('BranchdashboardModule', () => {
  let branchdashboardModule: BranchdashboardModule;

  beforeEach(() => {
    branchdashboardModule = new BranchdashboardModule();
  });

  it('should create an instance', () => {
    expect(branchdashboardModule).toBeTruthy();
  });
});
