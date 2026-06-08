import { describe, it, expect, beforeEach } from 'vitest';
import { DoubleLinkedListClass } from './DoubleLinkedListClass'; // проверь путь

describe('DoubleLinkedListClass - Тестирование личного состава', () => {
    let list: DoubleLinkedListClass<number>;

    beforeEach(() => {
        list = new DoubleLinkedListClass<number>();
    });

    describe('Фаза 1: Развертывание (Push & Length)', () => {
        it('Должен быть пустым при инициализации', () => {
            expect(list.length).toBe(0);
            expect(list.getByIndex(0)).toBeUndefined();
        });

        it('Должен корректно добавлять элементы и обновлять длину', () => {
            list.push(10);
            list.push(20);
            list.push(30);
            expect(list.length).toBe(3);
        });

        it('Должен возвращать правильный индекс при пуше', () => {
            expect(list.push(100)).toBe(0);
            expect(list.push(200)).toBe(1);
        });
    });

    describe('Фаза 2: Навигация (GetByIndex)', () => {
        it('Должен находить элементы по краям (Head и Tail)', () => {
            list.push(1);
            list.push(2);
            list.push(3);
            expect(list.getByIndex(0)).toBe(1); // Head
            expect(list.getByIndex(2)).toBe(3); // Tail
        });

        it('Должен корректно работать с отрицательными индексами и за границами', () => {
            list.push(1);
            expect(list.getByIndex(-1)).toBeUndefined();
            expect(list.getByIndex(10)).toBeUndefined();
        });

        it('Должен находить элементы в середине (проверка логики поиска)', () => {
            [10, 20, 30, 40, 50].forEach(val => list.push(val));
            expect(list.getByIndex(2)).toBe(30);
        });
    });

    describe('Фаза 3: Разведка (LastAccess Optimization)', () => {
        it('Должен успешно выполнять последовательный доступ (Cursor logic)', () => {
            [10, 20, 30, 40, 50].forEach(val => list.push(val));
            
            // Первый доступ (ставим курсор)
            expect(list.getByIndex(2)).toBe(30);
            // Доступ к соседнему элементу (должен сработать minLen === fromLastAccessIndexDiffAbs)
            expect(list.getByIndex(3)).toBe(40);
            // Доступ назад через курсор
            expect(list.getByIndex(1)).toBe(20);
        });

        it('Должен корректно переключаться между Head/Tail и LastAccess', () => {
            for(let i = 0; i < 10; i++) list.push(i);
            
            expect(list.getByIndex(5)).toBe(5); // Установили курсор в центр
            expect(list.getByIndex(0)).toBe(0); // Прыгнули в Head (ближе чем курсор)
            expect(list.getByIndex(9)).toBe(9); // Прыгнули в Tail (ближе чем курсор)
        });
    });

    describe('Фаза 4: Особые условия (Edge Cases)', () => {
        it('Должен выдержать один элемент в списке', () => {
            list.push(42);
            expect(list.getByIndex(0)).toBe(42);
            expect(list.length).toBe(1);
        });

        it('Не должен падать при многократном запросе одного и того же индекса', () => {
            list.push(1);
            list.push(2);
            expect(list.getByIndex(1)).toBe(2);
            expect(list.getByIndex(1)).toBe(2);
            expect(list.getByIndex(1)).toBe(2);
        });
    });
});

describe('DoubleLinkedListClass - Операция removeRange', () => {
    let list: DoubleLinkedListClass<number>;

    beforeEach(() => {
        list = new DoubleLinkedListClass<number>();
    });

    describe('1. Граничные условия (Guard Clauses)', () => {
        it('Должен выбрасывать ошибку при неверном start', () => {
            list.push(1);
            expect(() => list.removeRange(-1, 1)).toThrow("ArgumentOutOfIndex");
            expect(() => list.removeRange(1, 1)).toThrow("ArgumentOutOfIndex");
        });

        it('Должен выбрасывать ошибку при неверном count', () => {
            list.push(1);
            list.push(2);
            // start + count (1 + 2) = 3, что больше длины (2). Должно упасть.
            expect(() => list.removeRange(1, 2)).toThrow("ArgumentOutOfIndex");
        });

        it('Должен успешно удалять последний элемент (Fix Check)', () => {
            list.push(1);
            list.push(2);
            // start=1, count=1. 1 + 1 = 2. 2 > 2 - False. Проходит!
            const removed = list.removeRange(1, 1);
            expect(removed).toEqual([2]);
            expect(list.length).toBe(1);
            expect(list.getByIndex(0)).toBe(1);
        });
    });

    describe('2. Удаление из разных позиций', () => {
        beforeEach(() => {
            [10, 20, 30, 40].forEach(v => list.push(v));
        });

        it('Удаление всей дистанции (Total Clear)', () => {
            const removed = list.removeRange(0, 4);
            expect(removed).toEqual([10, 20, 30, 40]);
            expect(list.length).toBe(0);
            // Проверка сброса состояния
            expect(list.getByIndex(0)).toBeUndefined();
        });

        it('Удаление с головы (Head Shift)', () => {
            const removed = list.removeRange(0, 2); // Удаляем 10, 20
            expect(removed).toEqual([10, 20]);
            expect(list.length).toBe(2);
            expect(list.getByIndex(0)).toBe(30); // 30 стала новой головой
        });

        it('Удаление с хвоста (Tail Shift)', () => {
            const removed = list.removeRange(2, 2); // Удаляем 30, 40
            expect(removed).toEqual([30, 40]);
            expect(list.length).toBe(2);
            expect(list.getByIndex(1)).toBe(20); // 20 стала новым хвостом
        });

        it('Удаление из середины (Stitching)', () => {
            const removed = list.removeRange(1, 2); // Удаляем 20, 30
            expect(removed).toEqual([20, 30]);
            expect(list.length).toBe(2);
            expect(list.getByIndex(0)).toBe(10);
            expect(list.getByIndex(1)).toBe(40);
        });
    });

    describe('3. Инвалидация курсора (lastAccess)', () => {
        it('Должен ставить курсор на элемент ПЕРЕД удаленным при удалении из середины', () => {
            [1, 2, 3, 4, 5].forEach(v => list.push(v));
            
            // Удаляем 3 и 4 (индексы 2, 3)
            list.removeRange(2, 2); 
            
            // Проверяем, что курсор выжил. Если он встал на индекс start-1 (индекс 1, значение 2),
            // то доступ к индексу 1 должен быть мгновенным и вернуть 2.
            expect(list.getByIndex(1)).toBe(2);
            // И следующий за ним индекс 2 должен быть 5
            expect(list.getByIndex(2)).toBe(5);
        });

        it('Должен сбрасывать курсор при удалении от головы', () => {
            [1, 2, 3].forEach(v => list.push(v));
            list.getByIndex(1); // Поставили курсор
            list.removeRange(0, 1); // Удалили голову
            
            // lastAccess должен быть null, getByIndex должен отработать штатно от новой головы
            expect(list.getByIndex(0)).toBe(2);
        });
    });
});


// describe('DoubleLinkedListClass - Операция Splice', () => {
//     let list: DoubleLinkedListClass<number>;

//     beforeEach(() => {
//         list = new DoubleLinkedListClass<number>();
//     });

//     describe('Базовое удаление (Removal)', () => {
//         it('Должен удалять элементы из середины', () => {
//             [1, 2, 3, 4, 5].forEach(v => list.push(v));
//             // Удаляем 2 и 3 (индексы 1, 2)
//             const removed = list.splice(1, 2); 
            
//             expect(removed).toEqual([2, 3]);
//             expect(list.length).toBe(3);
//             expect(list.getByIndex(0)).toBe(1);
//             expect(list.getByIndex(1)).toBe(4);
//             expect(list.getByIndex(2)).toBe(5);
//         });

//         it('Должен удалять Head (индекс 0)', () => {
//             [1, 2, 3].forEach(v => list.push(v));
//             list.splice(0, 1);
            
//             expect(list.length).toBe(2);
//             expect(list.getByIndex(0)).toBe(2);
//             // Важно: проверить, что у нового head prev === null (это внутри, но getByIndex(0) должен работать)
//         });

//         it('Должен удалять Tail', () => {
//             [1, 2, 3].forEach(v => list.push(v));
//             list.splice(2, 1);
            
//             expect(list.length).toBe(2);
//             expect(list.getByIndex(1)).toBe(2);
//         });

//         it('Должен очистить весь список, если deleteCount >= length', () => {
//             [1, 2, 3].forEach(v => list.push(v));
//             list.splice(0, 5);
            
//             expect(list.length).toBe(0);
//             expect(list.getByIndex(0)).toBeUndefined();
//         });
//     });

//     describe('Базовая вставка (Insertion)', () => {
//         it('Должен вставлять элементы в середину без удаления', () => {
//             [1, 4].forEach(v => list.push(v));
//             list.splice(1, 0, 2, 3);
            
//             expect(list.length).toBe(4);
//             expect(Array.from(list)).toEqual([1, 2, 3, 4]); // Если итератор готов
//             // Если нет итератора, проверяем поштучно:
//             expect(list.getByIndex(1)).toBe(2);
//             expect(list.getByIndex(2)).toBe(3);
//         });

//         it('Должен вставлять в пустой список', () => {
//             list.splice(0, 0, 10, 20);
//             expect(list.length).toBe(2);
//             expect(list.getByIndex(0)).toBe(10);
//             expect(list.getByIndex(1)).toBe(20);
//         });
//     });

//     describe('Замена (Replacement - то что нужно калькулятору)', () => {
//         it('Должен заменять несколько узлов одним (схлопывание)', () => {
//             // "2 * 2 + 5" -> [2, *, 2, +, 5]
//             [2, 100, 2, 200, 5].forEach(v => list.push(v)); 
//             // Заменяем [2, 100, 2] на [4] (индексы 0, 1, 2)
//             list.splice(0, 3, 4);
            
//             expect(list.length).toBe(3);
//             expect(list.getByIndex(0)).toBe(4);
//             expect(list.getByIndex(1)).toBe(200);
//         });
//     });

//     describe('Работа с курсором (lastAccess Safety)', () => {
//         it('Должен инвалидировать или корректировать курсор после мутации', () => {
//             [1, 2, 3, 4, 5].forEach(v => list.push(v));
//             list.getByIndex(4); // Установили курсор на конец
            
//             list.splice(2, 2); // Удалили элементы 3 и 4. Курсор мог указывать на них!
            
//             // После splice доступ по индексу не должен приводить к ошибке
//             expect(() => list.getByIndex(2)).not.toThrow();
//             expect(list.getByIndex(2)).toBe(5);
//         });
//     });

//     describe('Крайние случаи (Edge Cases)', () => {
//         it('Если deleteCount 0 и items нет — ничего не должно меняться', () => {
//             list.push(1);
//             list.splice(0, 0);
//             expect(list.length).toBe(1);
//             expect(list.getByIndex(0)).toBe(1);
//         });

//         it('Должен корректно работать, если start > length', () => {
//             list.push(1);
//             list.splice(10, 0, 2); // Должен просто добавить в конец, как push
//             expect(list.length).toBe(2);
//             expect(list.getByIndex(1)).toBe(2);
//         });
//     });
//});