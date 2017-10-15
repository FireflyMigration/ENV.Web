import { Component } from '@angular/core';
import * as utils from './lib/utils';
import * as models from './models';

@Component({
    templateUrl:'./scripts/app/orders.html'
})
export class Orders {
    customers = new models.customers({
        numOfColumnsInGrid:4,
        columnSettings: [
            { key: "id" },
            { key: "companyName" },
            { key: "contactName" },
            { key: "country" },
            { key: "address" },
            { key: "city" },
        ]});
    shippers = new models.shippers();
    orderDetails = new models.orderDetails({
        allowUpdate: true,
        allowInsert: true,
        allowDelete: true,
        onNewRow: od => {
            od.orderID = this.orders.currentRow.id;
            od.quantity = 1;
        }
    });
    orders = new models.orders(
        {
            numOfColumnsInGrid: 4,
            get: { limit: 4 },
            onEnterRow: o => this.orderDetails.get({ isEqualTo: { orderID: o.id } }),
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
                }
            ]
        }
    );
    shipInfoArea = this.orders.addArea({
        numberOfColumnAreas:2,
        columnSettings: [
            { key: "requiredDate", inputType: "date" },
            { key: "shippedDate", inputType: "date" },
            { key: "shipAddress" },
            { key: "shipCity" },
        ]
    });
}
