import {
  authSuccResponseStub,
  changePasswordResponseStub,
  signupResponseStub,
} from '../stubs/auth.stubs';

export const AuthService = jest.fn().mockReturnValue({
  signUp: jest.fn().mockResolvedValue(signupResponseStub()),
  createVerification: jest.fn().mockResolvedValue({}),
  sendVerificationCode: jest.fn().mockResolvedValue({}),
  forgotPassword: jest.fn().mockResolvedValue(signupResponseStub()),
  verifyAccount: jest.fn().mockResolvedValue(authSuccResponseStub()),
  authToken: jest.fn().mockResolvedValue(authSuccResponseStub()),
  authEmailPass: jest.fn().mockResolvedValue(authSuccResponseStub()),
  generateAccessToken: jest.fn().mockResolvedValue('some_token'),
  getHash: jest.fn().mockResolvedValue('some_hashed'),
  changePassword: jest.fn().mockResolvedValue(changePasswordResponseStub()),
});
