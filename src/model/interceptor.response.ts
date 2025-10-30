export interface InterceptorResponse<T = any> {
  message: string;
  data?: T;
}
