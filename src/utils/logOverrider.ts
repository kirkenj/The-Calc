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

    // Клонируем даты и регулярки (их не нужно прогонять через toJSON/toString)
    if (obj instanceof Date) return new Date(obj.getTime());
    if (obj instanceof RegExp) return new RegExp(obj);

    // ==========================================
    // ИСПРАВЛЕННАЯ МАГИЯ:
    // ==========================================

    // 1. Если у объекта есть кастомный метод toJSON (например, твой список)
    if (typeof obj.toJSON === 'function') {
        return safeClone(obj.toJSON(), seen);
    }

    // 2. Если у объекта есть кастомный toString, но это НЕ массив!
    if (obj.toString && obj.toString !== Object.prototype.toString && !Array.isArray(obj)) {
        return obj.toString();
    }

    // ==========================================

    // ==========================================

    // Клонируем массивы
    if (Array.isArray(obj)) {
        const arrCopy: any[] = [];
        seen.set(obj, arrCopy);
        for (const item of obj) {
            arrCopy.push(safeClone(item, seen));
        }
        return arrCopy;
    }

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