import { verificationStub } from '../stubs/verification.stubs';

export const VerificationService = jest.fn().mockReturnValue({
  findOne: jest.fn().mockResolvedValue(verificationStub()),
  create: jest.fn().mockResolvedValue(verificationStub()),
  removeById: jest.fn().mockResolvedValue({
    success: true,
    message: `Success: The verification doc removed successfully!`,
  }),
});
