import { Test, TestingModule } from '@nestjs/testing';
import { VerificationService } from '../verification.service';
import { Verification } from '../../entities/verification.entity';
import { FilterVerificationDTO } from '../dto/filter-verification.dto';
import { verificationStub } from './stubs/verification.stubs';
import { CreateVerificationDTO } from '../dto/create-verification.dto';

jest.mock('../verification.service');

export const mockVerifyModel = {
  findOneAndUpdate: jest.fn().mockImplementation(() => ({
    exec: jest.fn().mockImplementation(() => verificationStub()),
  })),
  findOne: jest.fn().mockImplementation(() => ({
    exec: jest.fn().mockImplementation(() => verificationStub()),
  })),
  findByIdAndRemove: jest.fn().mockImplementation(() => ({
    success: true,
    message: `Success: The verification doc removed successfully!`,
  })),
};

describe('VerificationService', () => {
  let verifyService: VerificationService;

  beforeEach(async () => {
    jest.resetModules();

    const moduleRef: TestingModule = await Test.createTestingModule({
      providers: [VerificationService],
    }).compile();
    verifyService = moduleRef.get<VerificationService>(VerificationService);

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(verifyService).toBeDefined();
  });

  describe('findOne', () => {
    describe('when findOne is called', () => {
      let response: Verification;
      let responseFromModel: Verification;
      let filter: FilterVerificationDTO;

      beforeEach(async () => {
        filter = {
          code: verificationStub().code,
        };
        response = await verifyService.findOne({
          ...filter,
        });

        responseFromModel = await mockVerifyModel.findOne({ ...filter }).exec();
      });

      test('then it should check mockVerifyModel.findOne has been called with', () => {
        expect(mockVerifyModel.findOne).toBeCalledWith({ ...filter });
      });

      test('then it should response is equal from the model', () => {
        expect(response).toEqual(responseFromModel);
      });
    });
  });

  describe('create', () => {
    describe('when create is called', () => {
      let response: Verification;
      let responseFromModel: Verification;
      let dto: CreateVerificationDTO;

      beforeEach(async () => {
        dto = { ...verificationStub() };
        response = await verifyService.create(dto);

        responseFromModel = await mockVerifyModel.findOneAndUpdate(dto).exec();
      });

      test('then it should check mockVerifyModel.findOneAndUpdate has been called with', () => {
        expect(mockVerifyModel.findOneAndUpdate).toBeCalledWith(dto);
      });

      test('then it should response is equal from the model', () => {
        expect(response).toEqual(responseFromModel);
      });
    });
  });

  describe('removeById', () => {
    describe('when removeById is called', () => {
      let response: any;

      beforeEach(async () => {
        response = await verifyService.removeById(verificationStub()._id);
      });

      test("then it should response has 'success' property", () => {
        expect(response).toHaveProperty('success');
      });
    });
  });
});
