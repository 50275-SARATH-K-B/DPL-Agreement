import { CustomePipeModule } from './custome-pipe.module';

describe('CustomePipeModule', () => {
  let customePipeModule: CustomePipeModule;

  beforeEach(() => {
    customePipeModule = new CustomePipeModule();
  });

  it('should create an instance', () => {
    expect(customePipeModule).toBeTruthy();
  });
});
