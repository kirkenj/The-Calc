interface Node<T> {
    next: Node<T> | null,
    prev: Node<T> | null,
    value: T
}


export class DoubleLinkedListClass<T> {
    protected head: Node<T> | null;
    protected tail: Node<T> | null;

    protected _length: number;

    protected lastAccess: {
        index: number,
        ref: Node<T>
    } | null;


    constructor() {
        this.head = null
        this.tail = null;
        this._length = 0;
        this.lastAccess = null;
    }

    public get length() { return this._length }

    public push(item: T) {
        if (this.head === null) {
            this.head = {
                next: null,
                prev: null,
                value: item
            }

            this._length = 1

            this.tail = this.head
            return 0
        }

        if (!this.tail) {
            throw Error("Tail can not be null while the list has the head")
        }

        const newValue = {
            next: null,
            prev: this.tail,
            value: item
        }

        this._length++
        this.tail.next = newValue
        this.tail = newValue
        return this._length - 1
    }


    public getByIndex(
        index: number
    ): T | undefined {
        return this.getNodeByIndex(index)?.value ?? undefined
    }

    protected getNodeByIndex(
        index: number
    ): Node<T> | undefined {
        if (this.head === null || this._length <= index || this.tail === null || index < 0) {
            return undefined
        }

        if (index === 0) {
            return this.head
        }

        if (index === this._length - 1) {
            return this.tail
        }

        const fromTailIndexDiff = (this._length - 1) - index
        const fromLastAccessIndexDiff = this.lastAccess === null
            ? fromTailIndexDiff + 1
            : this.lastAccess.index - index

        const fromLastAccessIndexDiffAbs = Math.abs(fromLastAccessIndexDiff)
        const minLen = Math.min(index, fromLastAccessIndexDiffAbs, fromTailIndexDiff)

        let currentIndex: number
        let currenNode: Node<T>
        let nodePeeker: (node: Node<T>) => Node<T>
        let indexCounterIncrementer: (currentIndex: number) => number

        if (minLen === index) {
            currentIndex = 0
            currenNode = this.head
            nodePeeker = nextNodePeeker
            indexCounterIncrementer = numberIncrementer
        }
        else if (minLen === fromLastAccessIndexDiffAbs) {
            if (this.lastAccess === null) {
                throw Error("this.lastAccess somehow is null here")
            }

            currentIndex = this.lastAccess.index
            currenNode = this.lastAccess.ref

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
            currentIndex = this._length - 1
            currenNode = this.tail
            nodePeeker = prevValuePeeker
            indexCounterIncrementer = numberDecrementer
        }

        while (index != currentIndex) {
            currenNode = nodePeeker(currenNode)
            currentIndex = indexCounterIncrementer(currentIndex)
        }

        this.lastAccess = {
            index: currentIndex,
            ref: currenNode
        }

        return currenNode
    }


    // splice(start: number, deleteCount: number, ...items: T[]): T[] {
    //     if (start < 0 || start >= this._length) {
    //         throw Error("ArgumentOutOfIndex: start can not be less than 0 or bigger or equal to list's length")
    //     }

    //     if (deleteCount < 0 || start + deleteCount >= this._length) {
    //         throw Error("ArgumentOutOfIndex: deleteCount can not be less than 0 or bigger or equal to list's length")
    //     }

    //     if (this.head === null) {
    //         throw Error("The list is empty? (head is null)")
    //     }

    //     const isDeleteNeeded = deleteCount !== 0


    //     if (isDeleteNeeded) {
    //         let initNode: Node<T> | null = null
    //         let isDeletingHead = false
    //         if (start === 0) {
    //             isDeletingHead = true
    //             initNode = this.head
    //         } else {
    //             initNode = this.getNodeByIndex(start)
    //         }


    //         const toInsert = items.length !== 0
    //             ? fromRange(items)
    //             : null

    //         const tailNodeToDelete = this.getNodeByIndex(start + deleteCount - 1)
    //         if (!tailNodeToDelete){
    //             throw Error("Couldn't get tailNodeToDelete")
    //         }

    //         const nextNodeAfterTail = tailNodeToDelete.next
    //         if (nextNodeAfterTail !== null){
    //             if ()
    //         }





    //     } else {

    //     }

    // }

    removeRange(start: number, count: number): T[] {
        if (start < 0 || start >= this._length) {
            throw Error("ArgumentOutOfIndex: start can not be less than 0 or bigger or equal to list's length")
        }

        if (count < 0 || start + count > this._length) {
            throw Error("ArgumentOutOfIndex: count can not be less than 0 or its sum with start parameter be bigger or equal to list's length")
        }

        if (this.head === null || this.tail === null) {
            throw Error("The list is empty or in incosistent state")
        }

        if (count === 0) {
            return []
        }

        if (start === 0 && count === this.length) {
            const arrToRet = ToArray(this.head, this.tail, this.length)
            this.head = null
            this.tail = null
            this.lastAccess = null
            this._length = 0
            return arrToRet
        }

        const leftBorderNodeToDrop = this.getNodeByIndex(start)
        if (!leftBorderNodeToDrop) {
            throw Error("Couldn't get the first node to delete")
        }

        const rightBorderNodeToDrop = this.getNodeByIndex(start + count - 1)
        if (!rightBorderNodeToDrop) {
            throw Error("Couldn't get the last node to delete")
        }

        const arrToRet = ToArray(leftBorderNodeToDrop, rightBorderNodeToDrop, count)

        const isDeleteToTail = start + count === this.length
        const isDeleteFromHead = start === 0

        if (isDeleteFromHead) {
            const nextNodeAfterRight = rightBorderNodeToDrop.next
            if (!nextNodeAfterRight) {
                throw Error("Couldn't get the next node after next to the last node to delete")
            }

            nextNodeAfterRight.prev = null
            this.head = nextNodeAfterRight
            this.lastAccess = null
        } else if (isDeleteToTail) {
            const prevNodeBeforeLeftBorder = leftBorderNodeToDrop.prev
            if (!prevNodeBeforeLeftBorder) {
                throw Error("Couldn't get the previous node before the first node to delete")
            }

            prevNodeBeforeLeftBorder.next = null
            this.tail = prevNodeBeforeLeftBorder
            this.lastAccess = null
        } else {
            const nextNodeAfterRight = rightBorderNodeToDrop.next
            if (!nextNodeAfterRight) {
                throw Error("Couldn't get the next node after next to the last node to delete")
            }

            const prevNodeBeforeLeftBorder = leftBorderNodeToDrop.prev
            if (!prevNodeBeforeLeftBorder) {
                throw Error("Couldn't get the previous node before the first node to delete")
            }

            nextNodeAfterRight.prev = prevNodeBeforeLeftBorder
            prevNodeBeforeLeftBorder.next = nextNodeAfterRight
            this.lastAccess = {
                index: start - 1,
                ref: prevNodeBeforeLeftBorder
            }
        }


        rightBorderNodeToDrop.next = null
        leftBorderNodeToDrop.prev = null
        this._length -= count

        return arrToRet
    }
}

const ToArray = <T>(
    startNode: Node<T>, 
    finishNode: Node<T>, 
    maxItersCount: number = 100
): T[] => {
    const arr: T[] = []
    let node = startNode
    let currentCount = 0
    while (node !== finishNode && currentCount < maxItersCount) {
        arr.push(node.value)
        if (node.next === null) {
            throw Error("Found a gap in node refs while looking for finishNode")
        }

        node = node.next
        currentCount++
    }

    if (node !== finishNode) {
        throw Error("Couldn't find the finish node")
    }

    arr.push(node.value)
    return arr
}

const fromRange = <T>(range: T[]): {
    head: Node<T>,
    tail: Node<T>,
    length: number
} | null => {
    if (range.length === 0) {
        return null
    }

    let prevNode: Node<T> = {
        value: range[0],
        next: null,
        prev: null
    }

    const headNode = prevNode


    for (let i: number = 1; i < range.length; i++) {

        prevNode.next = {
            value: range[i],
            next: null,
            prev: prevNode
        };

        prevNode = prevNode.next
    }

    return {
        head: headNode,
        tail: prevNode,
        length: range.length
    }
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

const numberIncrementer = (num: number) => num + 1
const numberDecrementer = (num: number) => num - 1