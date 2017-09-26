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
        restUrl: apiUrl + 'orders'
        , columnKeys: ["id", "customerID", "companyName", "orderDate", "shipVia"]
        , editable: true
        , get: {
            sort: "orderDate",
            order: "desc",
            isEqualTo: { shipVia: 1, customerID:"ALFKI" }
        }

    })

}
const apiUrl = '/dataApi/';