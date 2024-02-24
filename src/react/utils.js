import { REACT_TEXT }from './type'
export function toObject(element){
    return typeof element == 'string' || typeof element == 'number' ?
    {type:REACT_TEXT,content:element} :
    element
}
export function shallEqual(obj1, obj2){
    if(obj1 === obj2){
        return true
    }

    if(typeof obj1 !== 'object' || obj1 == null || typeof obj2 !== 'object' || obj2 == null){
        return false
    }

    let key1 = Object.keys(obj1)
    let key2 = Object.keys(obj2)

    if(key1.length !== key2.length){
        return false
    }

    for(let key of key1){
    if(!obj2.hasOwnProperty(key) || obj1[key] !== obj2[key]){
        return false
    }}
    return true
}