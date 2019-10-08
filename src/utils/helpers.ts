export function GetRegExp(val: string){
    try {
        return new RegExp(`${val}`, 'i');
    } catch(e){
        return new RegExp('');
    }
}