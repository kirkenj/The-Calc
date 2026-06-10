interface Node<T> {
    next: Node<T> | null,
    prev: Node<T> | null,
    value: T
}

export interface Bidirectionalterator<T> {
    GetValue(): T;
    MoveNext(): boolean;
    MovePrev(): boolean;
}

interface InternalBidirectionalterator<T> extends Bidirectionalterator<T> {
    version: number,
    node: Node<T>,
}

export class DoubleLinkedListClass<T> {
    protected head: Node<T> | null;
    protected tail: Node<T> | null;

    protected _length: number;

    protected lastAccess: {
        index: number,
        ref: Node<T>
    } | null;

    protected _version: number

    constructor() {
        this.head = null
        this.tail = null;
        this._length = 0;
        this.lastAccess = null;
        this._version = 0;
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
            this._version++;
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
        this._version++;
        return this._length - 1
    }

    public getByIndex(
        index: number
    ): T | undefined {
        return this.getNodeByIndex(index)?.value ?? undefined
    }

    public splice(start: number, deleteCount: number, ...items: T[]): T[] {
        const removed = this.removeRange(start, deleteCount);
        this.insertRange(start, items);
        return removed;
    }

    public removeRange(start: number, count: number): T[] {
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
            this._version++;
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
            const nextNodeAfterRight = nextNodePeeker(rightBorderNodeToDrop)
            nextNodeAfterRight.prev = null
            this.head = nextNodeAfterRight
            this.lastAccess = null
        } else if (isDeleteToTail) {
            const prevNodeBeforeLeftBorder = prevValuePeeker(leftBorderNodeToDrop)
            prevNodeBeforeLeftBorder.next = null
            this.tail = prevNodeBeforeLeftBorder
            this.lastAccess = null
        } else {
            const nextNodeAfterRight = nextNodePeeker(rightBorderNodeToDrop)
            const prevNodeBeforeLeftBorder = prevValuePeeker(leftBorderNodeToDrop)

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
        this._version++;

        return arrToRet
    }

    public insertRange(index: number, range: T[]): number {
        if (range.length === 0) {
            return 0
        }

        const isListEmpty = this.head === null && this.tail === null && this.length === 0
        if (isListEmpty) {
            if (index !== 0) {
                throw Error("ArgumentOutOfIndex: list initialization with from range command must be with index equal to 0")
            }

            const fromRangeResult = fromRange(range)
            if (fromRangeResult === null) {
                throw Error("Couldn't create sublist for the given range")
            }
            this.head = fromRangeResult.head
            this._length = fromRangeResult.length
            this.tail = fromRangeResult.tail
            this._version++
            return fromRangeResult.length
        }

        if (index < 0 || index > this._length) {
            throw Error("ArgumentOutOfIndex: index can not be less than 0 or bigger or equal to list's length")
        }

        if (this.head === null || this.tail === null) {
            throw Error("The list is empty or in incosistent state")
        }

        const isInsertAtTail = index === this.length
        const isInsertAtHead = index === 0

        const fromRangeResult = fromRange(range)
        if (fromRangeResult === null) {
            throw Error("Couldn't create sublist for the given range")
        }

        if (isInsertAtHead) {
            const exHead = this.head
            this.head = fromRangeResult.head


            fromRangeResult.tail.next = exHead
            exHead.prev = fromRangeResult.tail

            this._length += fromRangeResult.length

            this.lastAccess = {
                ref: exHead,
                index: fromRangeResult.length
            }

            this._version++
            return fromRangeResult.length
        } else if (isInsertAtTail) {
            this.lastAccess = {
                ref: this.tail,
                index: this.length - 1
            }

            const exTail = this.tail
            exTail.next = fromRangeResult.head
            fromRangeResult.head.prev = exTail
            this._length += fromRangeResult.length
            this.tail = fromRangeResult.tail
            this._version++

            return fromRangeResult.length
        } else {
            const targetNode = this.getNodeByIndex(index)
            if (!targetNode) {
                throw Error(`Couldn't get node at index ${index}`)
            }

            const nodeBeforeTargetNode = prevValuePeeker(targetNode)

            nodeBeforeTargetNode.next = fromRangeResult.head
            fromRangeResult.head.prev = nodeBeforeTargetNode

            targetNode.prev = fromRangeResult.tail
            fromRangeResult.tail.next = targetNode

            this._length += fromRangeResult.length
            this._version++

            this.lastAccess = {
                ref: targetNode,
                index: index + range.length
            }

            return fromRangeResult.length
        }
    }

    public GetIteratorAtIndex(
        index: number
    ): Bidirectionalterator<T> | null {
        const initNode = this.getNodeByIndex(index)
        if (!initNode) {
            return null
        }

        const iterToRet: InternalBidirectionalterator<T> = {
            GetValue: () => {
                if (iterToRet.version !== this._version)
                {
                    throw Error("List version changed")
                }

                return iterToRet.node.value
            },
            MoveNext: () => {
                if (iterToRet.version !== this._version)
                {
                    throw Error("List version changed")
                }

                if (iterToRet.node.next === null){
                    return false
                }

                iterToRet.node = iterToRet.node.next
                return true
            },
            MovePrev: () => {
                if (iterToRet.version !== this._version)
                {
                    throw Error("List version changed")
                }

                if (iterToRet.node.prev === null){
                    return false
                }

                iterToRet.node = iterToRet.node.prev 
                return true
            },
            version: this._version,
            node: initNode,
        }


        return iterToRet
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


    public toJSON() {
        const isListEmpty = this.head === null && this.tail === null && this.length === 0
        if (isListEmpty) {
            return []
        }

        if (this.head === null || this.tail === null) {
            throw Error("List is incosistent state")
        }

        return ToArray(this.head, this.tail)
    }

    public toDebugJSON() {
        const isListEmpty = this.head === null && this.tail === null && this.length === 0
        if (isListEmpty) {
            return []
        }

        if (this.head === null || this.tail === null) {
            throw Error("List is incosistent state")
        }

        let currenNode: Node<T> | null = this.head
        const listOfElements = []
        let indexCounter = 0
        while (currenNode !== null) {
            listOfElements.push({
                index: indexCounter,
                value: currenNode.value,
                next: currenNode.next?.value ?? null,
                prev: currenNode.prev?.value ?? null,
            })

            indexCounter++;
            currenNode = currenNode.next
        }

        const valToRet = {
            elements: listOfElements,
            length: this.length,
            lastAccess: this.lastAccess?.index ?? null
        }

        return valToRet
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