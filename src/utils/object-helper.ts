export class ObjectHelper {
    public removeEmpty(input: Object, recursive: boolean = true): Object {
        const copy = Object.assign({}, input);

        for (const key in copy) {
            if ((copy[key] == null) || (copy[key] == undefined)) {
                delete copy[key];
            }

            if (recursive && this.isObject(copy[key])) {
                copy[key] = this.removeEmpty(copy[key], recursive);
            }
        }

        return copy;
    }

    public isObject(input: any): boolean {
        return (typeof input === 'object') && 
            (!Array.isArray(input)) &&
            input !== null &&
            input !== undefined;
    }
}