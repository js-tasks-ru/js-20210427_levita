/**
 * sortStrings - sorts array of string by two criteria "asc" or "desc"
 * @param {string[]} arr - the array of strings
 * @param {string} [param="asc"] param - the sorting type "asc" or "desc"
 * @returns {string[]}
 */
export function sortStrings(arr, param = 'asc') {
    const sorted = [...arr];
    
        return sorted.sort( (a, b ) => {
            if(param === 'desc') {
                return  -a.localeCompare(b, "ru", {caseFirst:"upper"})
            } else if (param === 'asc'){
                return a.localeCompare(b, "ru", {caseFirst:"upper"})
            }
            throw new Error();
        })
}   
