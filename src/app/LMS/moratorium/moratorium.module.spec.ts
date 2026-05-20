import { MoratoriumModule } from './moratorium.module';

describe('MoratoriumModule', () => {
  let moratoriumModule: MoratoriumModule;

  beforeEach(() => {
    moratoriumModule = new MoratoriumModule();
  });

  it('should create an instance', () => {
    expect(moratoriumModule).toBeTruthy();
  });
});
