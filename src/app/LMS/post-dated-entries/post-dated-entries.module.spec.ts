import { PostDatedEntriesModule } from './post-dated-entries.module';

describe('PostDatedEntriesModule', () => {
  let postDatedEntriesModule: PostDatedEntriesModule;

  beforeEach(() => {
    postDatedEntriesModule = new PostDatedEntriesModule();
  });

  it('should create an instance', () => {
    expect(postDatedEntriesModule).toBeTruthy();
  });
});
