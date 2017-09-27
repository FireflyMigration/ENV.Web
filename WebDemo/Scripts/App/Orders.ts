import { Component, OnInit, Injectable } from '@angular/core';
import * as utils from './lib/utils';
import * as models from './models';

@Component({
    template: `
<h1>{{ title }} ({{title.length}})</h1>
<data-grid [settings]="orders"></data-grid>
`
})

@Injectable()
export class Orders {

    title = 'Orders';
    orders = new utils.DataSettings<models.order>(
        {
            restUrl: apiUrl + 'orders',
            columnSettings: [
                { key: "id", caption: "OrderID", inputType: "number" },
                { key: "customerID", caption: "CustomerID" },
                { key: "orderDate", caption: "OrderDate", inputType: "date" },
                { caption: "Day of Week", getValue: o => utils.getDayOfWeekName(o.orderDate) },
                { key: "shipVia", caption: "ShipVia", inputType: "number" },
            ],
            onSavingRow: ms => {
                ms.required('shipVia');
                ms.required('customerID');
                if (ms.row.orderDate < "1990-01-01")
                    ms.addError("orderDate", "invalid date");
            },
            allowUpdate: true,
            get: {
                limit: 5,
                isEqualTo: {
                    shipVia: 2,
                    customerID:"HANAR"
                },
                isGreaterOrEqualTo: {
                    orderDate:"1997-01-01"
                },
                orderBy:'orderDate'
            }

        });

}
const apiUrl = '/dataApi/';