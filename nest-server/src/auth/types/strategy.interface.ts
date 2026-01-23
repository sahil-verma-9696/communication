export interface AuthStrategy {
  validate(email: string, password: string): boolean | Promise<boolean>;
}
