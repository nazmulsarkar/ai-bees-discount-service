import { Types } from 'mongoose';
import { VerifyActionEnum } from '../../../common/enums/verify-action.enum';
import { Verification } from '../../../entities/verification.entity';

export const verificationStub = (): Verification => ({
  _id: new Types.ObjectId('61e7a543188d720ca8780aed'),
  code: '6864',
  expiry: new Date('2022-01-28T08:47:16.023Z'),
  user: new Types.ObjectId('61e80d1ce8b68318c347fdc3'),
  data: {
    verifyAction: VerifyActionEnum.EMAIL_VERIFICATION,
  },
});
