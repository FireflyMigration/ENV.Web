import { Injectable } from '@angular/core';
import { Headers, Http } from '@angular/http';

@Injectable()
export class dataService {
    constructor(private http: Http) {
    }
    private headers = new Headers({ 'Content-Type': 'application/json' });
    private url = "http://localhost/webDemo";
    getData<dataType>(url: string) {
        return this.get('dataApi/' + url).then(response => {
            let x = response.json();
            return x as dataType;
        });
    }
    private get(url: string) {
        return this.http.get(this.urlFor(url)).toPromise().catch(error => {
            console.error('An error occurred', error); // for demo purposes only
            return Promise.reject(error.message || error);
        });
    }
    do(url: string) {
        return this.get(url);
    }
    urlFor(url: string) {
        return `${this.url}/${url}`
    }

}