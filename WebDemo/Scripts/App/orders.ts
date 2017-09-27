import { Component, OnInit, Injectable } from '@angular/core';
import { TableSettings } from "./utils/table-layout.component";
import { order } from './models';


@Component({
    template: `
<h1>Orders</h1>
<ct-table [settings]="settings"></ct-table>
`
})

@Injectable()
export class orders {

    settings = new TableSettings<order>({
        restUrl: apiUrl + 'orders',
        // /orders?_responseType=DCF

        columnSettings: [
            { key: "id", caption: "OrderID" },
            { key: "customerID", caption: "CustomerID" },
            { key: "companyName", caption: "CompanyName", readonly: true },
            { key: "orderDate", caption: "OrderDate" },
            { key: "shipVia", caption: "ShipVia" },
            { key: "dayofWeek", caption: "Day of Week", readonly: true },
            { caption: 'Day of Week', getValue: r => new Date(r.orderDate).toLocaleDateString("en-us", { weekday:'long' }) }
        ]
        , editable: true
        , get: {
            sort: "orderDate",
            order: "desc",
            isEqualTo: { shipVia: 1, customerID: "ALFKI" }
        }

    })

}
const apiUrl = '/dataApi/';