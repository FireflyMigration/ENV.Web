import { Component, OnInit } from '@angular/core';
import { Injectable } from '@angular/core';
import { Category } from './models';
import { RestList } from './utils/RestList';
import { ColumnSettings } from "./utils/table-layout.component";


@Component({
    selector: 'my-app',
    templateUrl: `./scripts/app/app.component.html`,

})
@Injectable()
export class AppComponent implements OnInit {

    categories = new RestList<Category>('http://localhost/web.demo/dataApi/categories');
    columnSettings = new ColumnSettings('id', 'categoryName', 'description');
        
    ngOnInit(): void {
        this.categories.get();
    }
}


