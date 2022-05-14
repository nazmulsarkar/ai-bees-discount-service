import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { StorageService } from '../services/storage.service';

describe('StorageService', () => {
  let storageService: StorageService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [StorageService, ConfigService],
    }).compile();

    storageService = module.get<StorageService>(StorageService);
  });

  it('should be defined', () => {
    expect(storageService).toBeDefined();
  });

  describe('generatePreSignedUrl', () => {
    it('storageService.generatePreSignedUrl', async () => {
      expect(storageService.generatePreSignedUrl).toBeDefined();
    });
  });

  describe('uploadFile', () => {
    it('storageService.uploadFile', async () => {
      expect(storageService.uploadFile).toBeDefined();
    });
  });

  describe('uploadMultipleFile', () => {
    it('storageService.uploadMultipleFile', async () => {
      expect(storageService.uploadMultipleFile).toBeDefined();
    });
  });

  describe('deleteFile', () => {
    it('storageService.deleteFile', async () => {
      expect(storageService.deleteFile).toBeDefined();
    });
  });
});
