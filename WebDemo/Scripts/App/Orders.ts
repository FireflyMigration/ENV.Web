import { Component, OnInit, Injectable } from '@angular/core';
import * as utils from './lib/utils';
import * as models from './models';

@Component({
    template: `
<h1>Orders</h1>
    <data-grid [settings]="orders"></data-grid>
    <select-popup [settings]="customers"> </select-popup>
<h2 class="col-sm-12">Order Details</h2>
    <data-grid [settings]="orderDetails" *ngIf="orders.currentRow&&orders.currentRow.id>0" ></data-grid>
`
})

@Injectable()
export class Orders {
    customers = new models.customers();
    products = new models.products();
    shippers = new models.shippers();
    orders = new models.orders({
        allowUpdate: true,
        allowInsert: true,
        allowDelete: true,
        get: {limit:3}
        onEnterRow: (r) => {
            this.orderDetails.get({ isEqualTo: { orderID: r.id } });
        },
        numOfColumnsInGrid: 4,
        columnSettings: [
            { key: "id" },
            {
                key: "customerID",
                click: r => {
                    this.customers.show(c => r.customerID = c.id);
                },
                getValue: r => this.customers.lookup.get({ id: r.customerID }).companyName
            },
            { key: "orderDate", inputType: "date", defaultValue: r => utils.dateToDataString(new Date()) },
            {
                key: "shipVia", dropDown: { source: this.shippers }, cssClass: 'col-sm-3'
            },
            { key: "requiredDate", inputType: "date" },
            { key: "shippedDate", inputType: "date" },
            { key: "shipAddress" },
            { key: "shipCity" },
        ]
    });
    orderDetails = new models.orderDetails({
        allowDelete: true,
        allowInsert: true,
        allowUpdate: true,
        onNewRow: (r) => {
            r.orderID = this.orders.currentRow.id;
        },
        get: { limit: 20 },
        columnSettings: [

            {
                key: "productID", caption: "Product", dropDown: { source: this.products },
                onUserChangedValue: async r => r.unitPrice = (await this.products.lookup.whenGet({ id: r.productID })).unitPrice
            },
            { key: "unitPrice" },
            { key: "quantity" },
            { key: "discount" }
        ]
    });
}

