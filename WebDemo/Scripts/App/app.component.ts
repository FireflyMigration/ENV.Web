import { Component, OnInit } from '@angular/core';
import { Injectable } from '@angular/core';
import { Category } from './models';
import { RestList } from './utils/RestList';
import { ColumnSetting } from "./utils/table-layout.component";


@Component({
    selector: 'my-app',
    templateUrl: `./scripts/app/app.component.html`,

})
@Injectable()
export class AppComponent implements OnInit {

    categories = new RestList<Category>('http://localhost/web.demo/dataApi/categories');
    columnSettings: ColumnSetting[] =
    [
        {
            key: 'id',
            caption: 'id'
        },
        {
            key: 'categoryName',
            caption: 'Name'
        },
        {
            key: 'description',
            caption: 'Description'
        }
    ];
    ngOnInit(): void {
    
        this.categories.get({
            sort: 'categoryName',
            order: "desc",
            isGreaterOrEqualTo: { id: 4 },
            isLessOrEqualTo: {id:7}
        });
    }
}


