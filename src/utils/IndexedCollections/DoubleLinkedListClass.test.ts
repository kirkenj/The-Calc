import { describe, it, expect, beforeEach } from 'vitest';
import { DoubleLinkedListClass } from './DoubleLinkedListClass'; 

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const verifyIntegrity = <T>(list: any) => {
    const forward: T[] = [];
    let current = list.head; // Accessing protected members via 'any' is acceptable for testing
    while (current) {
        forward.push(current.value);
        current = current.next;
    }

    const backward: T[] = [];
    let backCurrent = list.tail;
    while (backCurrent) {
        backward.push(backCurrent.value);
        backCurrent = backCurrent.prev;
    }

    return {
        forward,
        backward: backward.reverse(),
        isHeadOk: list.head ? list.head.prev === null : true,
        isTailOk: list.tail ? list.tail.next === null : true
    };
};

describe('DoubleLinkedListClass - Integrity Checks', () => {
    let list: DoubleLinkedListClass<number>;

    beforeEach(() => {
        list = new DoubleLinkedListClass<number>();
    });

    it('Connections should be consistent after multiple insertions and removals', () => {
        // 1. Setup base list
        [10, 20, 30, 40, 50].forEach(v => list.push(v));
        
        // 2. Perform complex operation: removal from middle followed by insertion
        list.removeRange(1, 2); // Removed 20, 30. [10, 40, 50] remains
        list.insertRange(1, [25, 35]); // Inserted [25, 35]. Result: [10, 25, 35, 40, 50]
        
        const { forward, backward, isHeadOk, isTailOk } = verifyIntegrity<number>(list);

        const expected = [10, 25, 35, 40, 50];

        // Check forward traversal (next)
        expect(forward).toEqual(expected);
        
        // Check backward traversal (prev)
        expect(backward).toEqual(expected);
        
        // Check terminators (edges)
        expect(isHeadOk).toBe(true); // Head has no previous node
        expect(isTailOk).toBe(true); // Tail has no next node
    });

    it('Should maintain integrity during clear and refill operations', () => {
        list.push(1);
        list.removeRange(0, 1); // List is now empty
        list.push(2);
        list.insertRange(0, [0, 1]); // Result: [0, 1, 2]

        const { forward, backward } = verifyIntegrity<number>(list);
        expect(forward).toEqual([0, 1, 2]);
        expect(backward).toEqual([0, 1, 2]);
    });
});

describe('DoubleLinkedListClass - Personnel Testing (Core Methods)', () => {
    let list: DoubleLinkedListClass<number>;

    beforeEach(() => {
        list = new DoubleLinkedListClass<number>();
    });

    describe('Phase 1: Deployment (Push & Length)', () => {
        it('Should be empty upon initialization', () => {
            expect(list.length).toBe(0);
            expect(list.getByIndex(0)).toBeUndefined();
        });

        it('Should correctly add elements and update length', () => {
            list.push(10);
            list.push(20);
            list.push(30);
            expect(list.length).toBe(3);
        });

        it('Should return correct index on push', () => {
            expect(list.push(100)).toBe(0);
            expect(list.push(200)).toBe(1);
        });
    });

    describe('Phase 2: Navigation (GetByIndex)', () => {
        it('Should find elements at the edges (Head and Tail)', () => {
            list.push(1);
            list.push(2);
            list.push(3);
            expect(list.getByIndex(0)).toBe(1); // Head
            expect(list.getByIndex(2)).toBe(3); // Tail
        });

        it('Should handle negative indices and out-of-bounds correctly', () => {
            list.push(1);
            expect(list.getByIndex(-1)).toBeUndefined();
            expect(list.getByIndex(10)).toBeUndefined();
        });

        it('Should find elements in the middle (verifying search logic)', () => {
            [10, 20, 30, 40, 50].forEach(val => list.push(val));
            expect(list.getByIndex(2)).toBe(30);
        });
    });

    describe('Phase 3: Reconnaissance (LastAccess Optimization)', () => {
        it('Should successfully perform sequential access (Cursor logic)', () => {
            [10, 20, 30, 40, 50].forEach(val => list.push(val));
            
            // First access (sets the cursor)
            expect(list.getByIndex(2)).toBe(30);
            // Accessing adjacent element (should trigger minLen === fromLastAccessIndexDiffAbs)
            expect(list.getByIndex(3)).toBe(40);
            // Backward access via cursor
            expect(list.getByIndex(1)).toBe(20);
        });

        it('Should correctly switch between Head/Tail and LastAccess', () => {
            for(let i = 0; i < 10; i++) list.push(i);
            
            expect(list.getByIndex(5)).toBe(5); // Cursor set to center
            expect(list.getByIndex(0)).toBe(0); // Jump to Head (closer than cursor)
            expect(list.getByIndex(9)).toBe(9); // Jump to Tail (closer than cursor)
        });
    });

        describe('Phase 5: Iterator Advanced (IsDeleted & spliceByIterator)', () => {
        it('Should correctly report IsDeleted state', () => {
            list.push(10);
            const iter = list.GetIteratorAtIndex(0)!;
            expect(iter.IsDeleted()).toBe(false);
            
            list.removeRange(0, 1);
            expect(iter.IsDeleted()).toBe(true);
            expect(() => iter.GetValue()).toThrow("Refrenced Node has been removed");
        });

        it('Should splice correctly using an iterator', () => {
            [1, 2, 3, 4, 5].forEach(v => list.push(v));
            const iter = list.GetIteratorAtIndex(1)!; // Points to '2'
            
            // Splice 3 elements starting from '2' (i.e., 2, 3, 4) and insert 99
            const removed = list.spliceByIterator(iter, 3, 99);
            
            expect(removed).toEqual([2, 3, 4]);
            expect(list.toJSON()).toEqual([1, 99, 5]);
            expect(iter.IsDeleted()).toBe(true);
            
            const { forward, backward } = verifyIntegrity<number>(list);
            expect(forward).toEqual([1, 99, 5]);
            expect(backward).toEqual([1, 99, 5]);
        });

        it('Should handle spliceByIterator at the Head', () => {
            [1, 2, 3].forEach(v => list.push(v));
            const iter = list.GetIteratorAtIndex(0)!;
            
            list.spliceByIterator(iter, 1, 0); // Replace 1 with 0
            expect(list.toJSON()).toEqual([0, 2, 3]);
            expect((list as any).head.value).toBe(0);
        });

        it('Should handle spliceByIterator at the Tail', () => {
            [1, 2, 3].forEach(v => list.push(v));
            const iter = list.GetIteratorAtIndex(2)!;
            
            list.spliceByIterator(iter, 1, 4); // Replace 3 with 4
            expect(list.toJSON()).toEqual([1, 2, 4]);
            expect((list as any).tail.value).toBe(4);
        });
    });
});


describe('DoubleLinkedListClass - removeRange Operation', () => {
    let list: DoubleLinkedListClass<number>;

    beforeEach(() => {
        list = new DoubleLinkedListClass<number>();
    });

    describe('1. Guard Clauses (Boundary Conditions)', () => {
        it('Should throw error on invalid start index', () => {
            list.push(1);
            expect(() => list.removeRange(-1, 1)).toThrow("ArgumentOutOfIndex");
            expect(() => list.removeRange(1, 1)).toThrow("ArgumentOutOfIndex");
        });

        it('Should throw error on invalid count', () => {
            list.push(1);
            list.push(2);
            // start + count (1 + 2) = 3, which is greater than length (2). Should throw.
            expect(() => list.removeRange(1, 2)).toThrow("ArgumentOutOfIndex");
        });

        it('Should successfully remove the last element (Fix Check)', () => {
            list.push(1);
            list.push(2);
            // start=1, count=1. 1 + 1 = 2. 2 > 2 is False. Should pass.
            const removed = list.removeRange(1, 1);
            expect(removed).toEqual([2]);
            expect(list.length).toBe(1);
            expect(list.getByIndex(0)).toBe(1);
        });
    });

    describe('2. Removal from Various Positions', () => {
        beforeEach(() => {
            [10, 20, 30, 40].forEach(v => list.push(v));
        });

        it('Total Clear (Wiping the range)', () => {
            const removed = list.removeRange(0, 4);
            expect(removed).toEqual([10, 20, 30, 40]);
            expect(list.length).toBe(0);
            // Verify state reset
            expect(list.getByIndex(0)).toBeUndefined();
        });

        it('Removal from Head (Head Shift)', () => {
            const removed = list.removeRange(0, 2); // Remove 10, 20
            expect(removed).toEqual([10, 20]);
            expect(list.length).toBe(2);
            expect(list.getByIndex(0)).toBe(30); // 30 becomes the new head
        });

        it('Removal from Tail (Tail Shift)', () => {
            const removed = list.removeRange(2, 2); // Remove 30, 40
            expect(removed).toEqual([30, 40]);
            expect(list.length).toBe(2);
            expect(list.getByIndex(1)).toBe(20); // 20 becomes the new tail
        });

        it('Removal from Middle (Stitching)', () => {
            const removed = list.removeRange(1, 2); // Remove 20, 30
            expect(removed).toEqual([20, 30]);
            expect(list.length).toBe(2);
            expect(list.getByIndex(0)).toBe(10);
            expect(list.getByIndex(1)).toBe(40);
        });
    });

    describe('3. Cursor Invalidation (lastAccess)', () => {
        it('Should place cursor on the element BEFORE the deleted range when removing from middle', () => {
            [1, 2, 3, 4, 5].forEach(v => list.push(v));
            
            // Remove 3 and 4 (indices 2, 3)
            list.removeRange(2, 2); 
            
            // Verify cursor survival. If it stands at index start-1 (index 1, value 2),
            // access to index 1 should be instantaneous and return 2.
            expect(list.getByIndex(1)).toBe(2);
            // And the following index 2 should be 5
            expect(list.getByIndex(2)).toBe(5);
        });

        it('Should reset cursor when removing from Head', () => {
            [1, 2, 3].forEach(v => list.push(v));
            list.getByIndex(1); // Set the cursor
            list.removeRange(0, 1); // Remove Head
            
            // lastAccess should be null, getByIndex should work normally starting from the new head
            expect(list.getByIndex(0)).toBe(2);
        });
    });
});


describe('DoubleLinkedListClass - insertRange Operation', () => {
    let list: DoubleLinkedListClass<number>;

    beforeEach(() => {
        list = new DoubleLinkedListClass<number>();
    });

    describe('1. Basic Insertion (Empty & Edges)', () => {
        it('Should insert into an absolutely empty list', () => {
            list.insertRange(0, [10, 20]);
            
            expect(list.length).toBe(2);
            expect(list.getByIndex(0)).toBe(10);
            expect(list.getByIndex(1)).toBe(20);
        });

        it('Should insert at the beginning (Head) of an existing list', () => {
            list.push(30);
            list.insertRange(0, [10, 20]);
            
            expect(list.length).toBe(3);
            expect(list.getByIndex(0)).toBe(10);
            expect(list.getByIndex(1)).toBe(20);
            expect(list.getByIndex(2)).toBe(30);
        });

        it('Should insert at the end (Tail) of an existing list', () => {
            list.push(10);
            list.insertRange(1, [20, 30]); // Index equals current length
            
            expect(list.length).toBe(3);
            expect(list.getByIndex(1)).toBe(20);
            expect(list.getByIndex(2)).toBe(30);
        });
    });

    describe('2. Insertion into the Middle', () => {
        it('Should expand the list and stitch in elements', () => {
            [10, 40].forEach(v => list.push(v));
            list.insertRange(1, [20, 30]);
            
            expect(list.length).toBe(4);
            expect(list.getByIndex(0)).toBe(10);
            expect(list.getByIndex(1)).toBe(20);
            expect(list.getByIndex(2)).toBe(30);
            expect(list.getByIndex(3)).toBe(40);
        });
    });

    describe('3. Cursor Management (lastAccess)', () => {
        it('Should place cursor on the last inserted element', () => {
            [1, 5].forEach(v => list.push(v));
            list.insertRange(1, [2, 3, 4]); // Insert [2, 3, 4] at indices 1, 2, 3
            
            // If the cursor is placed at index 3 (value 4), 
            // access to index 3 should be instantaneous
            expect(list.getByIndex(3)).toBe(4);
            // And the following index 4 (value 5) should be one step away
            expect(list.getByIndex(4)).toBe(5);
        });
    });

    describe('4. Errors & Edge Cases', () => {
        it('Should ignore empty array insertion', () => {
            list.push(1);
            list.insertRange(0, []);
            expect(list.length).toBe(1);
            expect(list.getByIndex(0)).toBe(1);
        });

        it('Should throw error on invalid index', () => {
            list.push(1);
            expect(() => list.insertRange(-1, [10])).toThrow();
            expect(() => list.insertRange(5, [10])).toThrow();
        });

        it('Should correctly insert a single element', () => {
            list.push(1);
            list.push(3);
            list.insertRange(1, [2]);
            expect(list.length).toBe(3);
            expect(list.getByIndex(1)).toBe(2);
        });
    });
});

describe('DoubleLinkedListClass - Splice Operation (Combined)', () => {
    let list: DoubleLinkedListClass<number | string>;

    beforeEach(() => {
        list = new DoubleLinkedListClass<number | string>();
    });

    describe('1. Basic Scenarios (JS Standard Behavior)', () => {
        it('Should replace one element with another (Simple Swap)', () => {
            [1, 2, 3].forEach(v => list.push(v));
            // splice(index 1, delete 1, insert 2.5)
            const removed = list.splice(1, 1, 2.5);

            expect(removed).toEqual([2]);
            expect(list.length).toBe(3);
            expect(list.getByIndex(0)).toBe(1);
            expect(list.getByIndex(1)).toBe(2.5);
            expect(list.getByIndex(2)).toBe(3);
        });

        it('Should only remove elements if items are not provided', () => {
            [1, 2, 3, 4].forEach(v => list.push(v));
            const removed = list.splice(1, 2); // Delete 2 and 3

            expect(removed).toEqual([2, 3]);
            expect(list.length).toBe(2);
            expect(list.getByIndex(0)).toBe(1);
            expect(list.getByIndex(1)).toBe(4);
        });

        it('Should only insert elements if deleteCount is zero', () => {
            [1, 2].forEach(v => list.push(v));
            const removed = list.splice(1, 0, 1.5);

            expect(removed).toEqual([]);
            expect(list.length).toBe(3);
            expect(list.getByIndex(0)).toBe(1);
            expect(list.getByIndex(1)).toBe(1.5);
            expect(list.getByIndex(2)).toBe(2);
        });
    });

    describe('2. Calculator Scenarios (Collapsing)', () => {
        it('Should collapse an expression into a result', () => {
            // "2 * 2 + 5"
            [2, '*', 2, '+', 5].forEach(v => list.push(v));
            
            // Collapse [2, *, 2] (indices 0, 1, 2) into [4]
            const removed = list.splice(0, 3, 4);

            expect(removed).toEqual([2, '*', 2]);
            expect(list.length).toBe(3);
            expect(list.getByIndex(0)).toBe(4);
            expect(list.getByIndex(1)).toBe('+');
            expect(list.getByIndex(2)).toBe(5);
        });
    });

    describe('3. Boundary Conditions and Exceptions', () => {
        it('Should throw exception when start index is out of bounds', () => {
            list.push(1);
            expect(() => list.splice(-1, 1, 10)).toThrow("ArgumentOutOfIndex");
            expect(() => list.splice(5, 1, 10)).toThrow("ArgumentOutOfIndex");
        });

        it('Should throw exception on invalid deleteCount', () => {
            [1, 2, 3].forEach(v => list.push(v));
            // 1 + 5 = 6, which is greater than length (3)
            expect(() => list.splice(1, 5, 10)).toThrow("ArgumentOutOfIndex");
        });

        it('Should work correctly at the edges (Head & Tail)', () => {
            [1, 2].forEach(v => list.push(v));
            
            // Replace Head
            list.splice(0, 1, 0);
            expect(list.getByIndex(0)).toBe(0);

            // Replace Tail
            list.splice(1, 1, 3);
            expect(list.getByIndex(1)).toBe(3);
            
            expect(list.length).toBe(2);
        });
    });

    describe('4. Integrity Check', () => {
        it('Should maintain correct prev/next connections after splice', () => {
            [1, 2, 3, 4, 5].forEach(v => list.push(v));
            list.splice(1, 3, 99); // Should result in [1, 99, 5]

            // Verification via forward iteration (next)
            const forward: any[] = [];
            let curr: any = (list as any).head;
            while(curr) { forward.push(curr.value); curr = curr.next; }
            expect(forward).toEqual([1, 99, 5]);

            // Verification via backward iteration (prev)
            const backward: any[] = [];
            let backCurr: any = (list as any).tail;
            while(backCurr) { backward.push(backCurr.value); backCurr = backCurr.prev; }
            expect(backward.reverse()).toEqual([1, 99, 5]);
        });
    });
});