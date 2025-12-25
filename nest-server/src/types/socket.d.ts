import { JwtPayload } from 'src/auth/auth.guard';

declare module 'socket.io' {
  interface Socket {
    data: {
      user?: JwtPayload;
    };
  }
}
