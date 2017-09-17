import { Component, OnInit } from '@angular/core';
import { Injectable } from '@angular/core';
import { Category } from './models';
import { RestList } from './utils/RestList';
import { TableSettings } from "./utils/table-layout.component";


@Component({
    selector: 'my-app',
    templateUrl: `./scripts/app/app.component.html`,

})
@Injectable()
export class AppComponent implements OnInit {

    categories = new RestList<Category>('http://localhost/web.demo/dataApi/categories');
    tableSettings = new TableSettings({
        // /categories?_responseType=DCF
        editable:true,
        columnSettings: [
            { key: "id", caption: "CategoryID", readonly:true },
            { key: "categoryName", caption: "CategoryName" },
            { key: "description", caption: "Description" }
        ]
    });


    ngOnInit(): void {
        this.categories.get();
    }
}


