import { Component, OnInit, Injectable } from '@angular/core';
import * as utils from './lib/utils';
import * as models from './models';

@Component({
    template:`
<h1>Orders</h1>
<data-grid [settings]="orders"></data-grid>
`
})

@Injectable()
export class Orders  {

    customers= new utils.Lookup<models.customer, string>(apiUrl + 'customers');
    orders = new utils.DataSettings<models.order>({
        restUrl: apiUrl + "orders",
        allowUpdate: true,
        columnSettings: [
            { key: "id", caption: "Order ID" },
            { key: "customerID", caption: "CustomerID" },
            { key: "orderDate", caption: "OrderDate", inputType: "date" },
            { key: "shipVia", caption: "ShipVia" },
        ]
        
   
    });
   

}
const apiUrl = '/dataApi/';