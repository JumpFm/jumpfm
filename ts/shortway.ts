const keyCodes: { [name: string]: number } = {
    backspace: 8,
    tab: 9,
    enter: 13,
    pause: 19,
    esc: 27,
    space: 32,
    pageup: 33,
    pagedown: 34,
    end: 35,
    home: 36,
    left: 37,
    up: 38,
    right: 39,
    down: 40,
    insert: 45,
    del: 46,
    slash: 191,
    0: 48,
    1: 49,
    2: 50,
    3: 51,
    4: 52,
    5: 53,
    6: 54,
    7: 55,
    8: 56,
    9: 57,
    a: 65,
    b: 66,
    c: 67,
    d: 68,
    e: 69,
    f: 70,
    g: 71,
    h: 72,
    i: 73,
    j: 74,
    k: 75,
    l: 76,
    m: 77,
    n: 78,
    o: 79,
    p: 80,
    q: 81,
    r: 82,
    s: 83,
    t: 84,
    u: 85,
    v: 86,
    w: 87,
    x: 88,
    y: 89,
    z: 90,
    f1: 112,
    f2: 113,
    f3: 114,
    f4: 115,
    f5: 116,
    f6: 117,
    f7: 118,
    f8: 119,
    f9: 120,
    f10: 121,
    f11: 122,
    f12: 123,
    numLock: 144,
    scrollLock: 145,
    ';': 186,
    '=': 187,
    ',': 188,
    '-': 189,
    '.': 190,
    '/': 191,
    '`': 192,
    '[': 219,
    '\\': 220,
    ']': 221,
    "'": 221
}

const includes = (array, item) => array.indexOf(item) > -1

export const shortway = (command, callback) => {
    const keys = command.split('+')
    const key = keys.filter(key => keyCodes[key])[0]
    const keyCode = keyCodes[key]
    const ctrl = keys.some(key => key === 'ctrl')
    const shift = keys.some(key => key === 'shift')
    const alt = keys.some(key => key === 'alt')

    if (!keyCode) throw new Error(`can't find keycode for command ${command}`)
    return function (e) {
        if (e.ctrlKey === ctrl &&
            e.shiftKey === shift &&
            e.altKey === alt &&
            e.keyCode === keyCode) {
            callback(e)
            return false
        }
    }
}