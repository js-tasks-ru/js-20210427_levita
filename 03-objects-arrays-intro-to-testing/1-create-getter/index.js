/**
 * createGetter - creates function getter which allows select value from object
 * @param {string} path - the strings path separated by dot
 * @returns {function} - function-getter which allow get value from object by set path
 */
export function createGetter(path) {
    const keys = path.split('.');

    return function (obj) {
        let value;

        function getProp(prop){
            return value ? value[prop] : obj[prop]
        }

        for (let point of keys) {
            value = getProp(point)
        }
        return value
    }
}
