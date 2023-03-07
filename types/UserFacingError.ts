import { TRPCError } from '@trpc/server';
import { SerializableObject, toSerializableObject } from './SerializableObject';

export class ForbiddenError extends Error {
  httpStatus?: number;
  constructor(message: string) {
    super(message);
    this.name = 'ForbiddenError';
    this.httpStatus = 403;
  }
}

export class UnauthorizedError extends Error {
  httpStatus?: number;
  constructor(message: string) {
    super(message);
    this.name = 'UnauthorizedError';
    this.httpStatus = 401;
  }
}

export default class UserFacingError<T extends Error> extends Error {
  e: SerializableObject;
  isUserFacingError: boolean;
  httpStatus?: number;
  constructor(e: T, httpStatus?: number) {
    super('User Facing Error');
    this.e = toSerializableObject(e);
    this.isUserFacingError = true;
    if ('httpStatus' in (this.e as any)) {
      this.httpStatus = (this.e as any).httpStatus;
    }
    if (httpStatus) {
      this.httpStatus = httpStatus;
    }
  }
  static is(e: any) {
    if (e) {
      if (e.data) {
        if (e.data.cause) {
          return !!e.data.cause.isUserFacingError;
        }
      }
    }
    return false;
  }
  static extract(e: TRPCError): any {
    return (
      ((e as any).data.cause as unknown as UserFacingError<Error>).e ??
      ({} as any)
    );
  }
}

export { UserFacingError };
