import { Component, OnInit } from '@angular/core';
import { Injectable } from '@angular/core';
import { Headers, Http } from '@angular/http';
import { Category } from './models';
import { dataService } from './data.service';


import 'rxjs/add/operator/toPromise';

@Component({
    selector: 'my-app',
    templateUrl: `./scripts/app/app.component.html`,
    providers: [dataService]
})
@Injectable()
export class AppComponent implements OnInit {
    title = 'Categories';
    categories = new RestList<Category>();
    status = 'ok';
    constructor(private server: dataService) {

    }
    ngOnInit(): void {
        this.categories.get(this.server, 'categories');
    }




}


class RestList<T extends hasId>{

    items: T[] = [];
    private server: dataService;
    private url: string;
    get(server: dataService, name: string) {
        this.server = server;
        this.url = name;
        this.server.getData<T[]>(name).then(r => {
            this.items = r;
        });
    }
    add() {
        let x: newItemInList = { newRow: true };
        this.items.push(x as any as T);
    }
    save(c: T) {
        if ('newRow' in c )
            return this.server.post(this.url, c).then(response => {
                this.items[this.items.indexOf(c)] = response as T;
            });
        else {
            return this.server.put(this.url + '/' + c.id, c).then(response => {
                this.items[this.items.indexOf(c)] = response as T;
            });
        }
    }
    delete(c: T) {
        return this.server.delete(this.url+'/' + c.id).then(() => {
            this.items.splice(this.items.indexOf(c), 1);
            
        });
    }

}
interface newItemInList {
    newRow: boolean;
}
interface hasId {
    id: any;
}