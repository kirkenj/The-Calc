export const decrementIndexes = (indexes, startIndex, offset) => {
  for (let q = startIndex; q < indexes.length; q++) {
    indexes[q] -= offset
  }
}

export const getIndexesOnPredicate = (arr, callback) => {
  const arrToRet = []

  for (let i = 0; i < arr.length; i++) {
    const token = arr[i]
    if (callback(token)) {
      arrToRet.push(i)
    }
  }

  return arrToRet
}