interface Node<T> {
    next: Node<T> | null,
    prev: Node<T> | null,
    value: T
}

export interface DoubleLinkedList<T> {
    getByIndex: (index: number) => T | undefined
    push: (item: T) => number
    head: Node<T> | null,
    tail: Node<T> | null,
    length: number
    lastAccess: {
        index: number,
        ref: Node<T>
    } | null
}

const prevValuePeeker = <T>(node: Node<T>) => {
    if (node.prev === null) {
        throw Error("Prev node is null")
    }

    return node.prev
}

const nextNodePeeker = <T>(node: Node<T>) => {
    if (node.next === null) {
        throw Error("Next node is null")
    }

    return node.next
}

const numberIncrementer = (num: number) => ++num
const numberDecrementer = (num: number) => --num


const getByIndex = <T>(
    list: DoubleLinkedList<T>, index: number
): Node<T> | undefined => {
    if (list.head === null || list.length <= index || list.tail === null || index < 0) {
        return undefined
    }

    if (index === 0) {
        return list.head
    }

    if (index === list.length - 1) {
        return list.tail
    }

    const fromTailIndexDiff = (list.length - 1) - index
    const fromLastAccessIndexDiff = list.lastAccess === null
        ? fromTailIndexDiff + 1
        : list.lastAccess.index - index

    const fromLastAccessIndexDiffAbs = Math.abs(fromLastAccessIndexDiff)
    const minLen = Math.min(index, fromLastAccessIndexDiffAbs, fromTailIndexDiff)

    let currentIndex: number
    let currenNode: Node<T>
    let nodePeeker: (node: Node<T>) => Node<T>
    let indexCounterIncrementer: (currentIndex: number) => number

    if (minLen === index) {
        currentIndex = 0
        currenNode = list.head
        nodePeeker = nextNodePeeker
        indexCounterIncrementer = numberIncrementer
    }
    else if (minLen === fromLastAccessIndexDiffAbs) {
        if (list.lastAccess === null) {
            throw Error("list.lastAccess somehow is null here")
        }

        currentIndex = list.lastAccess.index
        currenNode = list.lastAccess.ref

        if (fromLastAccessIndexDiff < 0) {
            nodePeeker = nextNodePeeker
            indexCounterIncrementer = numberIncrementer
        }
        else {
            nodePeeker = prevValuePeeker
            indexCounterIncrementer = numberDecrementer
        }
    }
    else { //else if (minLen === fromTailIndexDiff) {
        currentIndex = list.length - 1
        currenNode = list.tail
        nodePeeker = prevValuePeeker
        indexCounterIncrementer = numberDecrementer
    }

    while (index != currentIndex) {
        currenNode = nodePeeker(currenNode)
        currentIndex = indexCounterIncrementer(currentIndex)
    }

    list.lastAccess = {
        index: currentIndex,
        ref: currenNode
    }

    return currenNode
}




export const DoubleLinkedList = {
    Create: <T>(
    ): DoubleLinkedList<T> => {
        const list: DoubleLinkedList<T> = {
            head: null,
            tail: null,
            lastAccess: null,
            length: 0,
            getByIndex: (index: number) => {
                const node = getByIndex(list, index)
                return node?.value ?? undefined
            },

            push: (item: T) => {
                if (list.head === null) {
                    list.head = {
                        next: null,
                        prev: null,
                        value: item
                    }

                    list.length = 1

                    list.tail = list.head
                    return 0
                }

                if (!list.tail) {
                    throw Error("Tail can not be null while the list has the head")
                }

                const newValue = {
                    next: null,
                    prev: list.tail,
                    value: item
                }

                list.length++
                list.tail.next = newValue
                list.tail = newValue
                return list.length - 1
            }
        }

        return list
    }
}