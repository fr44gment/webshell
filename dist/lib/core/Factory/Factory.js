export class Factory {
    constructor(id) {
        this.id = id;
        Factory._store[`${new.target.name}-${this.id}`] = this;
    }
    static $(id) {
        return Factory._store[`${this.name}-${id}`];
    }
}
Factory._store = {};
