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
                { key: "id", caption: "OrderID", inputType: "number", cssClass:"col-sm-1" },
                { key: "customerID", caption: "CustomerID", cssClass:"col-sm-1" },
                { key: "orderDate", caption: "OrderDate", inputType: "date" },
                {
                    caption: "Day of Week", getValue: o => utils.getDayOfWeekName(o.orderDate),
                    cssClass: o => utils.getDayOfWeek(o.orderDate)==1? "bg-danger":""
                },
                { key: "shipVia", caption: "ShipVia", inputType: "number", cssClass:'col-sm-1' },
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