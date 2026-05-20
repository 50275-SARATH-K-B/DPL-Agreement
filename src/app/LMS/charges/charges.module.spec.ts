import { ChargesModule } from './charges.module';

describe('ChargesModule', () => {
  let chargesModule: ChargesModule;

  beforeEach(() => {
    chargesModule = new ChargesModule();
  });

  it('should create an instance', () => {
    expect(chargesModule).toBeTruthy();
  });
});
