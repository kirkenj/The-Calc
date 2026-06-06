import { describe, expect, test } from "vitest";
import { DoubleLinkedList } from "./DoubleLinkedList";

describe("DoubleLinkedList tests", () => {

    test("1. Empty List - Should be initialized with default safe state", () => {
        const list = DoubleLinkedList.Create<number>();

        expect(list.length).toBe(0);
        expect(list.head).toBeNull();
        expect(list.tail).toBeNull();
    });

    test("2. Push Single Element - Head and Tail should point to the same Node", () => {
        const list = DoubleLinkedList.Create<number>();
        list.push(42); // Предполагаем, что у тебя метод называется push

        expect(list.length).toBe(1);
        expect(list.head).not.toBeNull();
        expect(list.tail).not.toBeNull();
        expect(list.head).toBe(list.tail); // Ссылка на один и тот же объект
        expect(list.head!.value).toBe(42);
        expect(list.head!.prev).toBeNull();
        expect(list.head!.next).toBeNull();
    });

    test("3. Push Multiple Elements - Should maintain correct bidirectional links", () => {
        const list = DoubleLinkedList.Create<number>();
        list.push(12);
        list.push(3);
        list.push(23);

        expect(list.length).toBe(3);
        
        const first = list.head!;
        const second = first.next;
        const third = list.tail!;

        expect(first.value).toBe(12);
        expect(second!.value).toBe(3);
        expect(third.value).toBe(23);

        // Проверяем прямые связи (forward)
        expect(first.next).toBe(second);
        expect(second!.next).toBe(third);
        expect(third.next).toBeNull();

        // Проверяем обратные связи (backward)
        expect(third.prev).toBe(second);
        expect(second!.prev).toBe(first);
        expect(first.prev).toBeNull();
    });

    test("4. Index Access & Carriage (lastAccess) - Should correctly cache and traverse", () => {
        const list = DoubleLinkedList.Create<number>();
        list.push(10);
        list.push(20);
        list.push(30);
        list.push(40);

        // Первый доступ — кэша еще нет, идем от head
        const val1 = list.getByIndex(1); // Должно быть 20
        expect(val1).toBe(20);

        // Второй доступ — шаг вперед от сохраненного кэша (с 1 на 2 индекс)
        const val2 = list.getByIndex(2); // Должно быть 30
        expect(val2).toBe(30);

        // Третий доступ — шаг назад от сохраненного кэша (с 2 на 1 индекс)
        const val3 = list.getByIndex(1); // Должно быть 20
        expect(val3).toBe(20);
    });

    test("5. Boundary Checks - Should safely handle invalid index access", () => {
        const list = DoubleLinkedList.Create<number>();
        list.push(10);
        list.push(20);

        // Индекс меньше нуля
        expect(list.getByIndex(-1)).toBeUndefined();

        // Индекс больше длины списка
        expect(list.getByIndex(5)).toBeUndefined();
    });

    test("6. Cache Invalidation - Should reset lastAccess on modification", () => {
        const list = DoubleLinkedList.Create<number>();
        list.push(10);
        list.push(20);

        // Заполняем кэш
        list.getByIndex(1); 

        // Модифицируем список (добавляем элемент)
        list.push(30); 

        // После модификации кэш должен сброситься в null (не ломать логику индексов)
        // Мы проверяем это косвенно: новый вызов должен отработать корректно
        expect(list.getByIndex(2)).toBe(30);
    });
});