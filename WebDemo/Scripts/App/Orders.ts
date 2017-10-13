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
    orders = new models.orders(
        {
            columnSettings: [
                { key: "id", caption: "Order ID", readonly: true },
                { key: "customerID" },
                { key: "orderDate", inputType: "date" },
                { key: "requiredDate" },
                { key: "shippedDate" },
                { key: "shipVia" },
                { key: "freight" },
                { key: "shipName" },
                { key: "shipAddress" },
                { key: "shipCity" },
                { key: "shipRegion" },
                { key: "shipPostalCode" },
                { key: "shipCountry" },
            ]
        }
    );
}
