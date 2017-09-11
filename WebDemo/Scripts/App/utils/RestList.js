"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class RestList {
    constructor(url) {
        this.url = url;
        this.items = [];
    }
    [Symbol.iterator]() {
        return this.items[Symbol.iterator]();
    }
    map(item) {
        let x = item;
        let id = x.id;
        x.save = () => this.save(id, x);
        x.delete = () => {
            return fetch(this.url + '/' + id, { method: 'delete' }).then(() => {
                this.items.splice(this.items.indexOf(x), 1);
            });
        };
        return x;
    }
    get(options) {
        return myFetch(this.url).then(r => {
            let x = r;
            this.items = r.map(x => this.map(x));
        });
    }
    add() {
        let x = { newRow: true };
        this.items.push(this.map(x));
        return x;
    }
    save(id, c) {
        let nr = c;
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
exports.RestList = RestList;
function myFetch(url, init) {
    return fetch(url, init).then(onSuccess, error => {
    });
    function onSuccess(response) {
        if (response.status >= 200 && response.status < 300)
            return response.json();
        else
            throw response;
    }
    function onError(error) {
        throw error;
    }
}
//# sourceMappingURL=RestList.js.map