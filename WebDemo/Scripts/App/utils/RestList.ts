export class RestList<T extends hasId> implements Iterable<T>{
    [Symbol.iterator](): Iterator<T> {
        return this.items[Symbol.iterator]();
    }


    private items: (restListItem & T)[] = [];
    constructor(private url: string) {

    }
    private map(item: T): restListItem & T {

        let x = <any>item;
        let id = x.id;
        x.save = () => this.save(id, x);
        x.delete = () => {
            return fetch( this.url + '/' + id, { method: 'delete' }).then(() => {
                this.items.splice(this.items.indexOf(x), 1);
            });
            
        }
        return <restListItem & T>x;
    }

    get(options?: getOptions<T>) {
        return myFetch(this.url).then(r => {
            let x: T[] = r;
            this.items = r.map(x => this.map(x));
        });
    }
    add(): T {
        let x: newItemInList = { newRow: true };
        this.items.push(this.map( x as any as T));
        return x as any as T;
    }
    private save(id: any, c: restListItem & T) {

        let nr: newItemInList = c as any  as newItemInList;
        if (nr.newRow)
            return myFetch(this.url, {
                method: 'post',
                headers: {
                    'Content-type': "application/json"
                },
                body: JSON.stringify(c)
            }).then(response => {

                this.items[this.items.indexOf(c)] = this.map( response);
            });
        else {

            return myFetch(this.url + '/' + c.id, {
                method: 'put',
                headers: {
                    'Content-type': "application/json"
                },
                body: JSON.stringify(c)
            }).then(response => {

                this.items[this.items.indexOf(c)] = this.map( response );
            });
        }
    }
    
}
function myFetch(url: string, init?: RequestInit): Promise<any> {

    return fetch(url, init).then(onSuccess, error => {

    });
    function onSuccess(response: Response) {

        if (response.status >= 200 && response.status < 300)
            return response.json(); 
        else throw response;

    }
    function onError(error: any) {
        throw error;
    }
}
interface newItemInList {
    newRow: boolean;
}
interface hasId {
    id?: any;
}
interface restListItem {
    save: () => void;
    delete: () => void;
}
interface getOptions<T> {
    isEqualTo?: T;
    sort?: string[];
    order?: string[];
    page?: number;
    limit?: number;
    isGreaterThan?: T;
    isGreaterOrEqualTo?: T;
    isLessThan?: T;
    isLessOrEqualTo?: T;
    isDifferentFrom?: T;

}