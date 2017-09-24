import { Component, OnInit } from '@angular/core';
import { Injectable } from '@angular/core';
import { Category } from '../models';
import { RestList, getOptions, Lookup } from '../utils/RestList';
import { TableSettings } from "../utils/table-layout.component";


@Component({
    selector: 'categories',
    template:`
<h1>Categories</h1>
<ct-table [records]="categories"
          [settings]="tableSettings"></ct-table>`

})

@Injectable()
export class Categories implements OnInit {


    categories = new RestList<Category>(apiUrl + 'categories');


    tableSettings = new TableSettings<Category>({
        editable: true,
            // /categories?_responseType=DCF

            columnSettings:[
                { key: "id", caption: "CategoryID" },
                { key: "categoryName", caption: "CategoryName" },
                { key: "description", caption: "Description" }
            ]
    });


    ngOnInit(): void {
        this.categories.get({ limit: 5 });
    }


}
const apiUrl = '/dataApi/';




