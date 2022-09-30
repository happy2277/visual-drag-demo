import Vue from 'vue'

export function deepCopy (target) {
    if (typeof target == 'object') {
        const result = Array.isArray(target) ? [] : {}
        for (const key in target) {
            if (typeof target[key] == 'object') {
                result[key] = deepCopy(target[key])
            } else {
                result[key] = target[key]
            }
        }

        return result
    }

    return target
}

export function swap (arr, i, j) {
    const temp = arr[i]
    Vue.set(arr, i, arr[j])
    Vue.set(arr, j, temp)
}

export function $ (selector) {
    return document.querySelector(selector)
}

const components = ['VText', 'RectShape', 'CircleShape']
export function isPreventDrop (component) {
    return !components.includes(component) && !component.startsWith('SVG')
}

// 去重
export function unique (arr, key) {
    //reduce第一个参数是遍历需要执行的函数，第二个参数是item的初始值
    var obj = {};
    arr = arr.reduce(function (item, next) {
        obj[next[key]] ? '' : obj[next[key]] = true && item.push(next);
        return item;
    }, []);
    return arr
}
