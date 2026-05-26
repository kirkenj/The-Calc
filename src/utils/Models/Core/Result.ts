export type Result<T> =
    | { readonly Success: true; readonly Result: T; readonly Message: null }
    | { readonly Success: false; readonly Result: null; readonly Message: string }; 


// 2. AKA static methods
export const Result = {
  Success: <T>(value: T): Result<T> => ({
    Success: true,
    Result: value,
    Message: null
  }),
  
  Fail: (message: string): Result<never> => ({
    Success: false,
    Result: null,
    Message: message
  })
};