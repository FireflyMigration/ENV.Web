import { Component, OnInit, Injectable } from '@angular/core';
import * as utils from './lib/utils';
import * as models from './models';

@Component({
    template: `
<h1>Orders</h1>
    
    <data-grid [settings]="orders"></data-grid>
    
`
})

@Injectable()
export class Orders {

    customers = new utils.Lookup<models.customer, string>(apiUrl + 'customers');
    orders = new utils.DataSettings<models.order>(apiUrl + "orders", {
        allowUpdate: true,
        columnSettings: [
            { key: "id" },
            { key: "customerID" },
            { key: "employeeID" },
            { key: "orderDate", inputType: "date" },
            { key: "requiredDate" },
            { key: "shippedDate" },
            { key: "shipVia" },
            { key: "freight" },
            { key: "shipName" },
            { key: "shipAddress" },
            { key: "shipCity" },
            { key: "shipRegion" },
            { key: "shipPostalCode" },
            { key: "shipCountry" },
        ]
    });




}
const apiUrl = '/dataApi/';