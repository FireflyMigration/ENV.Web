﻿import { Component, OnInit } from '@angular/core';
import { Injectable } from '@angular/core';
import * as models from '../models';
import { RestList, getOptions, Lookup } from '../utils/RestList';
import { TableSettings } from "../utils/table-layout.component";


@Component({
    selector: 'categories',
    templateUrl: './scripts/app/demo/products.html',

})

@Injectable()
export class Products implements OnInit {


    products = new RestList<models.Product>(apiUrl + 'products');

    category = new Lookup<models.Category, models.Product>(apiUrl + 'categories', (product, o) => o.isEqualTo = { id: +product.categoryID });

    tableSettings = new TableSettings<models.Product>({
        // /categories?_responseType=DCF
        editable: true,
        columnSettings: [
            { key: "id", caption: "ProductID" },
            { key: "productName", caption: "ProductName" },
            { key: "supplierID", caption: "SupplierID" },
            { key: "categoryID", caption: "CategoryID" },
            {
                caption: "categoryName",
                getValue: (r) => this.category.get(r).categoryName,
                columnClass: r => this.category.found(r) ? '' : 'danger'
            },
            {
                caption: 'test', getValue: r => r.categoryID
            }
        ]
    });


    ngOnInit(): void {
        this.products.get({ limit: 5 });
    }


}
const apiUrl = '/dataApi/';



