export default class UserFacingError extends Error {
  constructor(message: string) {
    super(message);
    return UserFacingError.from(new Error(message));
  }
  static from(err: Error) {
    err.name = 'UserFacingError';
    return err;
  }
  static is(error: any) {
    return (
      'message' in error && 'stack' in error && error.name === 'UserFacingError'
    );
  }
}
