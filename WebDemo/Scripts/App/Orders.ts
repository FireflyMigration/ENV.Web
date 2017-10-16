import { Component } from '@angular/core';
import * as utils from './lib/utils';
import * as models from './models';

@Component({
    templateUrl: './scripts/app/orders.html'
})
export class Orders {
    customers = new models.customers({
        numOfColumnsInGrid: 4,
        columnSettings: [
            { key: "id" },
            { key: "companyName" },
            { key: "contactName" },
            { key: "country" },
            { key: "address" },
            { key: "city" },
        ]
    });
    shippers = new models.shippers();
    products = new models.products();
    orderDetails = new models.orderDetails({
        allowUpdate: true,
        allowInsert: true,
        allowDelete: true,
        columnSettings: [
            { key: "productID", caption: "Product", dropDown: { source: this.products } },
            { key: "unitPrice", inputType: "number" },
            { key: "quantity", inputType: "number" },
            {
                caption: "total",
                getValue: o => (o.quantity * o.unitPrice).toLocaleString()
            }
        ],
        onNewRow: od => {
            od.orderID = this.orders.currentRow.id;
            od.quantity = 1;
        }
    });
    getOrderTotal() {
        let result = 0;
        this.orderDetails.items.forEach(od =>
            result += od.unitPrice * od.quantity);
        return result;
    }
    printCurrentOrder() {
        window.open('home/print/' + this.orders.currentRow.id);
    }
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
        numberOfColumnAreas: 2,
        columnSettings: [
            { key: "requiredDate", inputType: "date" },
            { key: "shippedDate", inputType: "date" },
            { key: "shipAddress" },
            { key: "shipCity" },
        ]
    });
}
