import { MatFileUploadModule } from './matFileUpload.module';

describe('MatFileUploadModule', () => {
  let matFileUploadModule: MatFileUploadModule;

  beforeEach(() => {
    matFileUploadModule = new MatFileUploadModule();
  });

  it('should create an instance', () => {
    expect(matFileUploadModule).toBeTruthy();
  });
});
