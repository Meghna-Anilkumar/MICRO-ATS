export interface IAppError {
  status: number;
  success?: boolean;
  message: string;
  conflict?: unknown;
}