import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { JwtPayload } from 'src/auth/auth.guard';

const ALLOWED_UNVERIFIED_ROUTES: Array<{
  method?: string;
  regex: RegExp;
}> = [
  { method: 'GET', regex: /^\/users\/profile$/ },
  { method: 'GET', regex: /^\/users\/me$/ },
  { method: 'POST', regex: /^\/auth\/verify-email$/ },
];

@Injectable()
export class UnverifiedGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const token = this.extractTokenFromHeader(request);

    if (!token) {
      throw new UnauthorizedException();
    }

    try {
      const payload = await this.jwtService.verifyAsync<JwtPayload>(token);

      const { trialEndAt, accountDeleteAt } = payload;
      const now = Date.now();

      // 1️⃣ Trial still active → allow everything
      if (trialEndAt && now < trialEndAt) {
        return true;
      }

      // 2️⃣ Trial ended but account not deleted
      if (accountDeleteAt && now < accountDeleteAt) {
        // Allow profile endpoint only
        if (this.isAllowedRoute(request)) {
          return true;
        }

        throw new UnauthorizedException(
          `Your services are blocked. Verify your email before ${new Date(
            accountDeleteAt,
          ).toLocaleDateString()}`,
        );
      }

      // 3️⃣ Account deletion time passed
      throw new UnauthorizedException(
        'Account deleted. Please contact support.',
      );
    } catch {
      throw new UnauthorizedException();
    }
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }

  private isAllowedRoute(request: Request): boolean {
    const { method, originalUrl } = request;

    return ALLOWED_UNVERIFIED_ROUTES.some((rule) => {
      if (rule.method && rule.method !== method) {
        return false;
      }
      return rule.regex.test(originalUrl);
    });
  }
}
