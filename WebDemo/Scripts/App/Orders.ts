import { Component, OnInit, Injectable } from '@angular/core';
import * as utils from './lib/utils';
import * as models from './models';


@Component({
    template: `
<h1>Orders</h1>
    <data-grid [settings]="orders"></data-grid>
    <select-popup [settings]="custList"> </select-popup>
    <select-popup [settings]="shipList"> </select-popup>
    <data-grid [settings]="orderDetails" *ngIf="orders.currentRow&&orders.currentRow.id>0" ></data-grid>
`
})

@Injectable()
export class Orders {
    customers = new utils.Lookup<models.customer, string>(apiUrl + 'customers');
    products = new utils.Lookup<models.product, number>(apiUrl + "products");
    shipList = new utils.SelectPopup(new utils.DataSettings<models.shipper>(apiUrl + "shippers", {}));
    custList = new utils.SelectPopup(new utils.DataSettings<models.customer>(apiUrl + "customers", {}), { searchColumnKey: 'contactName' });

    orders = new utils.DataSettings<models.order>(apiUrl + "orders", {
        allowUpdate: true,
        allowInsert: true,
        allowDelete: true,
        hideDataArea: false,
        get: { limit:3 },
        onEnterRow: (r) => {
            this.orderDetails.get({ isEqualTo: { orderID: r.id } });
        },
        numOfColumnsInGrid: 4,
        columnSettings: [
            { key: "id" },
            {
                key: "customerID",
                click: r => {
                    this.custList.show(c => r.customerID = c.id);
                },
                getValue: r => this.customers.get(r.customerID).companyName
            },
            { key: "orderDate", inputType: "date", defaultValue: r => utils.dateToDataString(new Date()) },

            {
                key: "shipVia",
                dropDown: {
                    source: apiUrl + "shippers"
                },
                cssClass: 'col-sm-3'

            },
            { key: "requiredDate", inputType: "date" },
            { key: "shippedDate", inputType: "date" },
            { key: "freight" },
            { key: "shipName" },
            { key: "shipAddress" },
            { key: "shipCity" },
            { key: "shipRegion" },
            { key: "shipPostalCode" },
            { key: "shipCountry" },
        ]
    });
    orderDetails = new utils.DataSettings<models.orderDetail>(apiUrl + "orderdetails", {
        allowDelete: true,
        allowInsert: true,
        allowUpdate: true,
        onNewRow: (r) => {
            r.orderID = this.orders.currentRow.id;
        },
        get: { isEqualTo: 20 },
        columnSettings: [

            {
                key: "productID", caption: "Product", dropDown: { source: apiUrl + "products" },
                onUserChangedValue: async r => r.unitPrice = (await this.products.whenGet(r.productID)).unitPrice
            },
            { key: "unitPrice", getValue: r => this.products.get(r.productID).unitPrice },

            { key: "quantity" },
            { key: "discount" }

        ]
    });




}

const apiUrl = '/dataApi/';
