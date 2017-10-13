import { Component } from '@angular/core';
import * as utils from './lib/utils';
import * as models from './models';

@Component({
    template:`
<h1>Orders</h1>
<data-grid [settings]="orders"></data-grid>
`
})
export class Orders  {
    customers = new models.customers();
    orders = new models.orders(
        {
            numOfColumnsInGrid:4,
            columnSettings: [
                { key: "id", caption: "Order ID", readonly: true },
                { key: "customerID" },
                { key: "orderDate", inputType: "date" },
                { key: "shipVia" },
                { key: "requiredDate", inputType:"date" },
                { key: "shippedDate" , inputType:"date" },
                { key: "shipAddress" },
                { key: "shipCity" },
            ]
        }
    );
}
