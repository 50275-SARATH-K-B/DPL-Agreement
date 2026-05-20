import { SharedComponentModule } from './shared-component.module';

describe('SharedComponentModule', () => {
  let sharedComponentModule: SharedComponentModule;

  beforeEach(() => {
    sharedComponentModule = new SharedComponentModule();
  });

  it('should create an instance', () => {
    expect(sharedComponentModule).toBeTruthy();
  });
});
