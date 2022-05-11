export class Factory {
    public id : string;

    private static _store : { [name : string] : any } = { }

    public static $(id : string) {
        return Factory._store[`${this.name}-${id}`];
    }

    public constructor(id : string) {
        this.id = id;

        Factory._store[`${new.target.name}-${this.id}`] = this;
    }
}