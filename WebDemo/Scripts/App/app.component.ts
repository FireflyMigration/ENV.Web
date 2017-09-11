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
    categories: Category[];
    status = 'ok';
    constructor(private server: dataService) {

    }
    ngOnInit(): void {
        this.server.getData<Category[]>('categories').then(r => this.categories = r);
    }
    save(c: Category) {
        if (c instanceof newCategory)
            this.server.post('categories', c).then(response => {
                this.categories[this.categories.indexOf(c)] = response as Category;
            }).then(() => this.status = 'created');
        else
            this.server.put('categories/' + c.id, c).then(response => {
                this.categories[this.categories.indexOf(c)] = response as Category;
            }).then(() => this.status = 'updated');
    }
    add() {
        this.categories.push(new newCategory());
    }
    delete(c: Category) {
        this.server.delete('categories/' + c.id).then(() => {
            this.categories.splice(this.categories.indexOf(c),1);
            this.status = 'deleted';
        });
    }

}
class newCategory extends Category {
    newRow = true;
    constructor() { super();}
}
