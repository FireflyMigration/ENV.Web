import { Component, OnInit, Injectable } from '@angular/core';
import * as utils from './lib/utils';
import * as models from './models';

@Component({
    template: `
<h1>{{ title }}</h1>
<data-grid [settings]="orders"></data-grid>
`
})

@Injectable()
export class Orders {

    title = 'Orders';
    customers = new utils.Lookup<models.customer, string>(apiUrl + 'customers');
    orders = new utils.DataSettings<models.order>(
        {
            restUrl: apiUrl + 'orders',
            columnSettings: [
                { key: "id", caption: "OrderID", inputType: "number", cssClass:"col-sm-1" },
                { key: "customerID", caption: "CustomerID", cssClass: "col-sm-1" },
                { caption: "Customer Name", getValue: o => this.customers.get(o.customerID).companyName },
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
                    
                },
                isGreaterOrEqualTo: {
                    orderDate:"1997-01-01"
                },
                orderBy:'orderDate'
            },
            rowButtons: [{ name: '', click: o => window.open('/home/print/' + o.id, '_blank'), cssClass:'glyphicon glyphicon-print' }]
            

        });

}
const apiUrl = '/dataApi/';