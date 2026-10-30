import {
  CanActivate,
  ExecutionContext,
  Injectable,
  mixin,
  Type,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Role } from '../user/types/roles.js';
import { AccessToken } from '../user/interfaces/accessToken.interface.js';

export const AuthGuard = (...allowedRoles: Role[]): Type<CanActivate> => {
  @Injectable()
  class AuthGuardMixin implements CanActivate {
    constructor(private readonly jwtService: JwtService) {}

    canActivate(context: ExecutionContext): boolean {
      const request = context.switchToHttp().getRequest();
      const auth = request.headers.authorization;
      if (!auth) return false;

      const [type, token] = auth.split(' ');
      if (type !== 'Bearer' || !token) return false;

      let payload: AccessToken;
      try {
        payload = this.jwtService.verify<AccessToken>(token);
      } catch {
        return false;
      }

      request.user = payload;

      if (allowedRoles.length === 0) return true;

      return allowedRoles.includes(payload.role);
    }
  }

  return mixin(AuthGuardMixin);
};