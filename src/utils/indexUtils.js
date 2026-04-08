export const shuffleIndexes = (indexPairsArr, fromArrIndex, indexDecrement) => {
  for (let q = fromArrIndex; q < indexPairsArr.length; q++) {
    indexPairsArr[q].index -= indexDecrement
  }
}

export const getIndexedItemsOnCallback = (tokens, callback) => {
  const arrToRet = []

  for (let i = 0; i < tokens.length; i++) {
    const token = tokens[i]
    if (callback(token)) {
      arrToRet.push({ index: i, token })
    }
  }

  return arrToRet
}