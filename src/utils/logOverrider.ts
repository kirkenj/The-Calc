const originalConsoleLog = console.log;

console.log = (...args: Parameters<typeof console.log>): void => {
    // Бежим по всем аргументам лога
    const clonedArgs = args.map(arg => {
        // Если это объект (массив, токен, мапа), пробуем его глубоко скопировать
        if (typeof arg === 'object' && arg !== null) {
            try {
                return safeClone(arg);
            } catch {
                // Если внутри есть методы или функции, structuredClone выдаст ошибку.
                // В этом случае просто возвращаем оригинальный объект, чтобы не ронять приложение.
                return arg;
            }
        }
        // Примитивы (числа, строки) копировать не нужно, возвращаем как есть
        return arg;
    });

    // Выплевываем «замороженные» данные в реальную консоль
    originalConsoleLog(...clonedArgs);
};

// Безопасный глубокий клон, защищенный от функций и циклических ссылок
function safeClone(obj: any, seen = new WeakMap()): any {
    if (obj === null || typeof obj !== 'object') {
        return obj;
    }

    // Если это функция — возвращаем её текстовое описание
    if (typeof obj === 'function') {
        return '[Function]';
    }

    // Защита от бесконечной рекурсии (циклических ссылок)
    if (seen.has(obj)) {
        return '[Circular]';
    }

    // Клонируем массивы
    if (Array.isArray(obj)) {
        const arrCopy: any[] = [];
        seen.set(obj, arrCopy);
        for (const item of obj) {
            arrCopy.push(safeClone(item, seen));
        }
        return arrCopy;
    }

    // Клонируем даты и регулярки
    if (obj instanceof Date) return new Date(obj.getTime());
    if (obj instanceof RegExp) return new RegExp(obj);

    // Клонируем обычные объекты
    const objCopy: any = {};
    seen.set(obj, objCopy);
    for (const key in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, key)) {
            const val = obj[key];
            if (typeof val === 'function') {
                objCopy[key] = '[Function]';
            } else {
                objCopy[key] = safeClone(val, seen);
            }
        }
    }
    return objCopy;
}

// Защита от двойного переопределения при Hot Module Replacement в Vite
if (!(console.log as any).__isPatched) {
    const originalConsoleLog = console.log;

    const patchedLog = (...args: any[]): void => {
        // Безопасно клонируем аргументы перед выводом
        const clonedArgs = args.map(arg => safeClone(arg));
        originalConsoleLog(...clonedArgs);
    };

    // Вешаем метку, что консоль уже пропатчена
    (patchedLog as any).__isPatched = true;
    console.log = patchedLog;
}