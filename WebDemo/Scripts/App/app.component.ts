import { Component, OnInit } from '@angular/core';
import { Injectable } from '@angular/core';
import { Product, Category } from './models';
import { RestList, getOptions, Lookup } from './utils/RestList';
import { TableSettings } from "./utils/table-layout.component";


@Component({
    selector: 'my-app',
    templateUrl: `./scripts/app/app.component.html`,

})

@Injectable()
export class AppComponent implements OnInit {
    

    products = new RestList<Product>(apiUrl +'products');

    category = new Lookup<Category, Product>(apiUrl+'categories', (product, o) => o.isEqualTo = { id: +product.categoryID } );

    tableSettings = new TableSettings({
        // /categories?_responseType=DCF
        editable: true,
        columnSettings: [
            { key: "id", caption: "ProductID", readonly: true },
            { key: "productName", caption: "ProductName" },
            { key: "supplierID", caption: "SupplierID" },
            { key: "categoryID", caption: "CategoryID" },
            {
                caption: "categoryName",
                getValue: (r: any) => this.category.get(r).categoryName,
                columnClass: r => this.category.found(r) ? '' : 'danger'
            }
        ]
    });


    ngOnInit(): void {
        this.products.get();
    }


}
const apiUrl = 'http://localhost/web.demo/dataApi/';




