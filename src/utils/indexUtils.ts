import { Result } from "./Models/Core/Result"

export function decrementValuesFromIndex(
  values: number[], 
  startIndex: number, 
  offset: number
): void {
  for (let q = startIndex; q < values.length; q++) {
    values[q] -= offset
  }
}

export interface IndexKeyValuePair<T>{
  index: number,
  value: T
}

export function getIndexesOnPredicate<TI,TT>(
  arr: TI[], 
  transformCallback: (arg: TI) => Result<TT>,
  stopOnFail: boolean = false
): Result<IndexKeyValuePair<TT>[]> {
  
  const arrToRet: IndexKeyValuePair<TT>[] = []

  for (let i = 0; i < arr.length; i++) {
    const transformResult = transformCallback(arr[i])
    if (transformResult.Success){
      arrToRet.push({
        index: i,
        value: transformResult.Result
      })
    }
    else if (stopOnFail){
      return Result.Fail(`Couldn't transform at index ${i}`)
    }
  }

  return Result.Success(arrToRet)
}