export class RestList<T extends hasId> implements Iterable<T>{
    [Symbol.iterator](): Iterator<T> {
        return this.items[Symbol.iterator]();
    }


    items: (restListItem & T)[] = [];
    constructor(private url: string) {

    }
    private map(item: T): restListItem & T {

        let x = <any>item;
        let id = x.id;
        x.save = () => this.save(id, x);
        x.delete = () => {
            return fetch(this.url + '/' + id, { method: 'delete' }).then(() => {
                this.items.splice(this.items.indexOf(x), 1);
            });

        }
        return <restListItem & T>x;
    }

    get(options?: getOptions<T>) {

        let url = new urlBuilder(this.url);
        if (options) {
            url.addObject({
                _limit: options.limit,
                _page: options.page,
                _sort: options.sort,
                _order: options.order
            });
            url.addObject(options.isEqualTo);
            url.addObject(options.isGreaterOrEqualTo,"_gte");
            url.addObject(options.isLessOrEqualTo,"_lte");
            url.addObject(options.isGreaterThan,"_gt");
            url.addObject(options.isLessThan,"_lt");
            url.addObject(options.isDifferentFrom,"_ne");
        }


        return myFetch(url.url).then(r => {
            let x: T[] = r;
            this.items = r.map(x => this.map(x));
        });
    }
    add(): T {
        let x: newItemInList = { newRow: true };
        this.items.push(this.map(x as any as T));
        return x as any as T;
    }
    private save(id: any, c: restListItem & T) {

        let nr: newItemInList = c as any as newItemInList;
        if (nr.newRow)
            return myFetch(this.url, {
                method: 'post',
                headers: {
                    'Content-type': "application/json"
                },
                body: JSON.stringify(c)
            }).then(response => {

                this.items[this.items.indexOf(c)] = this.map(response);
            });
        else {

            return myFetch(this.url + '/' + c.id, {
                method: 'put',
                headers: {
                    'Content-type': "application/json"
                },
                body: JSON.stringify(c)
            }).then(response => {

                this.items[this.items.indexOf(c)] = this.map(response);
            });
        }
    }

}
class urlBuilder {
    constructor(public url: string) {
    }
    add(key: string, value: any) {
        if (value == undefined)
            return;
        if (this.url.indexOf('?') >= 0)
            this.url += '&';
        else
            this.url += '?';
        this.url += encodeURIComponent(key) + '=' + encodeURIComponent(value);
    }
    addObject(object: any, suffix = '') {
        if (object != undefined)
            for (var key in object) {
                this.add(key + suffix, object[key]);
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
export  interface getOptions<T> {
    isEqualTo?: T;
    isGreaterOrEqualTo?: T;
    isLessOrEqualTo?: T;
    sort?: string;
    order?: string;
    page?: number;
    limit?: number;
    isGreaterThan?: T;
    isLessThan?: T;
    isDifferentFrom?: T;

}
export class Lookup<lookupType, mainType> {

    constructor(url: string, private options: (mt: mainType, o: getOptions<lookupType>) => lookupType) {
        this.categories = new RestList<lookupType>(url);
    }

    categories: RestList<lookupType>;
    private cache: {};



    get(r: any): lookupType {

        let find: getOptions<lookupType> = {};
        this.options(<mainType>r, find);
        let key = JSON.stringify(find);
        if (this.cache == undefined)
            this.cache = {};
        if (this.cache[key]) {
            return this.cache[key];
        } else {
            let res = {} as lookupType;
            this.cache[key] = res;
            this.categories.get(find).then(() => {
                if (this.categories.items.length > 0)
                    this.cache[key] = this.categories.items[0];

            });
            return res;
        }

    }
}