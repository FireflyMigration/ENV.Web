import { Component } from '@angular/core';
import * as utils from './lib/utils';
import * as models from './models';

@Component({
    template: `
<h1>Orders</h1>
<data-grid [settings]="orders"></data-grid>
<select-popup [settings]="customers"></select-popup>
`
})
export class Orders {
    customers = new models.customers();
    shippers = new models.shippers();
    orders = new models.orders(
        {
            numOfColumnsInGrid: 4,
            allowUpdate: true,
            allowInsert: true,
            allowDelete: true,
            columnSettings: [
                { key: "id", caption: "Order ID", readonly: true },
                {
                    key: "customerID",
                    getValue: o =>
                        this.customers.lookup.get({ id: o.customerID }).companyName,
                    click: o => this.customers.showSelectPopup(c => o.customerID = c.id)
                },
                { key: "orderDate", inputType: "date" },
                {
                    key: "shipVia",
                    dropDown: { source: this.shippers },
                    cssClass: 'col-sm-3'

                },
                { key: "requiredDate", inputType: "date" },
                { key: "shippedDate", inputType: "date" },
                { key: "shipAddress" },
                { key: "shipCity" },
            ]
        }
    );
}
