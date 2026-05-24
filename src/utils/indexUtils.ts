export function decrementValuesFromIndex(
  values: number[], 
  startIndex: number, 
  offset: number
): void {
  for (let q = startIndex; q < values.length; q++) {
    values[q] -= offset
  }
}

export function getIndexesOnPredicate<T>(
  arr: T[], 
  callback: (arg: T) => boolean
): number[] {
  const arrToRet: number[] = []

  for (let i = 0; i < arr.length; i++) {
    const token = arr[i]
    if (callback(token)) {
      arrToRet.push(i)
    }
  }

  return arrToRet
}