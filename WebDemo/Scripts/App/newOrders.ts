import { Component } from '@angular/core';
import * as utils from './lib/utils';
import * as models from './newModels';

@Component({
    templateUrl: './scripts/app/newOrders.html'
})
export class newOrders {
    orders = new models.orders();
    orderDetails = new models.orderDetails();
    customers = new models.customers();

    customersForSelectCustomer = new models.customers();
    selectCustomer = new utils.dataView({
        from: this.customersForSelectCustomer,
        numOfColumnsInGrid: 4,
        displayColumns: [
            this.customersForSelectCustomer.id,
            this.customersForSelectCustomer.companyName,
            this.customersForSelectCustomer.contactName,
            this.customersForSelectCustomer.country,
            this.customersForSelectCustomer.address,
            this.customersForSelectCustomer.city
        ]
    });


    shippers = new models.shippers();
    products = new models.products();
    orderDetailsDataView = new utils.dataView({
        from: this.orderDetails,
        allowDelete : true,
        allowInsert : true,
        allowUpdate: true,
        displayColumns: [
            { column: this.orderDetails.productID, dropDown: { source: this.products } },
            this.orderDetails.quantity,
            this.orderDetails.unitPrice
        ],
        where: this.orderDetails.orderID.isEqualTo(this.orders.id),
        
        onNewRow: () => {
            this.orderDetails.orderID.value = this.orders.id.value;
            this.orderDetails.unitPrice.value = 1;
        }
    });

    dv = new utils.dataView({
        from: this.orders,
        where: [
            this.orders.shipCity.isEqualTo(() => "London")
        ],
        relations: [{
            to: this.shippers,
            on: this.shippers.id.isEqualTo(this.orders.shipVia)
        },
        {
            to: this.customers,
            on: this.customers.id.isEqualTo(this.orders.customerID)
        }
        ],
        onEnterRow: () => this.orderDetailsDataView.refreshData(),
        
        displayColumns: [
            this.orders.id,
            {
                column: this.orders.customerID,
                getValue: () => this.customers.companyName,
                click: (r, scopeAndDo) =>
                    this.selectCustomer.showSelectPopup(() =>
                        scopeAndDo(() =>
                            this.orders.customerID.value = this.customersForSelectCustomer.id.value))

            },
            this.orders.orderDate,
            {
                column: this.orders.shipVia,
                dropDown: { source: this.shippers }
            },
        ],
        allowUpdate: true,
        allowInsert: true
    });

    


    shipInfoArea = this.dv.addArea({
        numberOfColumnAreas:2,
        columnSettings: [
            this.orders.requiredDate,
            this.orders.shippedDate,
            this.orders.shipAddress,
            this.orders.shipCity
        ]
    });
}
