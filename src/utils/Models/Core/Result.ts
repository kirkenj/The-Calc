export type Result<T> =
    | { readonly Success: true; readonly Result: T;  }
    | { readonly Success: false; readonly Message: string }; 


// 2. AKA static methods
export const Result = {
  Success: <T>(value: T): Result<T> => ({
    Success: true,
    Result: value,
  }),
  
  Fail: (message: string): Result<never> => ({
    Success: false,
    Message: message
  })
};