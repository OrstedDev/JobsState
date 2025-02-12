export type BaseResponseEntity<T> = {
  code: number;
  success: boolean;
  message: string;
  errors?: ErrorResponseEntity[];
  data?: T | null;
};

export type ErrorResponseEntity = {
  code: number;
  message: string;
};
