import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const CurrentUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const { _id, email, roles, isActive, createdAt, userProfile } = ctx
      .switchToHttp()
      .getRequest().user;

    return {
      _id,
      email,
      roles,
      isActive,
      createdAt,
      userProfile,
    };
  },
);
