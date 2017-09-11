import { Component, OnInit } from '@angular/core';
import { Injectable } from '@angular/core';
import { Category } from './models';
import { RestList } from './utils/RestList';


@Component({
    selector: 'my-app',
    templateUrl: `./scripts/app/app.component.html`,

})
@Injectable()
export class AppComponent implements OnInit {

    categories = new RestList<Category>('http://localhost/web.demo/dataApi/categories');

    ngOnInit(): void {
    
        this.categories.get({
            sort: 'categoryName',
            order: "desc",
            isGreaterOrEqualTo: { id: 4 },
            isLessOrEqualTo: {id:7}
        });
    }
}


