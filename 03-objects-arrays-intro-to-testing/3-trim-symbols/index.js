/**
 * trimSymbols - removes consecutive identical symbols if they quantity bigger that size
 * @param {string} string - the initial string
 * @param {number} size - the allowed size of consecutive identical symbols
 * @returns {string} - the new string without extra symbols according passed size
 */
export function trimSymbols(string, size) {
    if ( size === undefined ){ 
        return string
    }

    if ( size === 0) {
        return ''
    }

    let trim = [ ...string.split('')]
    let key = trim[0];
    let count = 0;
    
    return trim = trim.filter( item => {
        if (item !== key) {
            count = 1;
            key = item;
            return item
        }
        if ( count < size) {
            key = item;
            count ++;
            return item
        }
    }).join('')
}