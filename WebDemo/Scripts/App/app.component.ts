import { Component, OnInit } from '@angular/core';
import { Injectable } from '@angular/core';
import { Headers, Http } from '@angular/http';
import { Categorie } from './models';
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
    categories: Categorie[];
    status= 'ok';
    constructor(private server: dataService) {

    }
    ngOnInit(): void {
        this.server.getData<Categorie[]>('categories').then(r => this.categories = r);
    }
    save(c: Categorie) {
         
        this.server.put('categories/' + c.id, c).then(()=>this.status='updated');
    }

}
