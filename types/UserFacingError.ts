import { TRPCError } from '@trpc/server';
import { SerializableObject, toSerializableObject } from './SerializableObject';

export default class UserFacingError extends Error {
  e: SerializableObject;
  isUserFacingError: boolean;
  constructor(e: any) {
    super('User Facing Error');
    this.e = toSerializableObject(e);
    this.isUserFacingError = true;
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
  static extract(e: TRPCError) {
    return ((e as any).data.cause as unknown as UserFacingError).e;
  }
}
