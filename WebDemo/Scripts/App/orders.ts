import { Component, OnInit, Injectable } from '@angular/core';
import { TableSettings } from "./utils/table-layout.component";
import * as models from './models';
import { Lookup, RestList } from './utils/RestList';


@Component({
    template: `
<h1>Orders</h1>
<ct-table [settings]="settings"></ct-table>
`
})

@Injectable()
export class orders {

    customers = new Lookup<models.customer,string>(apiUrl + 'customers');

    settings = new TableSettings<models.order>({
        restUrl: apiUrl + 'orders', 
        // /orders?_responseType=DCF

        columnSettings: [
            { key: "id", caption: "OrderID" },
            { key: "customerID", caption: "CustomerID" },
            { getValue: o => this.customers.get(o.customerID).companyName, caption: "Company Name", readonly: true },
            { key: "orderDate", caption: "OrderDate", inputType: 'date' },
            { key: "shipVia", caption: "ShipVia" },
            { key: "dayofWeek", caption: "Day of Week", readonly: true },
            { caption: 'Day of Week', getValue: r => new Date(r.orderDate).getDay() }
            
        ]
        , rowClass: r => new Date(r.orderDate).getDay() == 1 ? "bg-danger" : ""
        , editable: true
        , onSavingRow: s => s.required('shipVia')
        , get: {
            orderBy: "orderDate",
            orderByDir: "desc",
            isEqualTo: { shipVia: 1, customerID: "ALFKI" }
        }

    })

}
const apiUrl = '/dataApi/';