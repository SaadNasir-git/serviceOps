import {
  createParamDecorator,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { AccessToken } from '../user/interfaces/accessToken.interface.js';

export interface AuthenticatedRequest extends Request {
  user: AccessToken;
}

export const AuthenticatedReq = createParamDecorator(
  (_: unknown, ctx: ExecutionContext): AuthenticatedRequest => {
    const req = ctx.switchToHttp().getRequest();
    if (!req.user) throw new UnauthorizedException('AuthGuard missing');
    return req as AuthenticatedRequest;
  }
);