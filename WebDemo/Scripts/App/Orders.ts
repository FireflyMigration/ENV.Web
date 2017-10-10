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
        hideDataArea: false,
        columnSettings: [
            { key: "id" },
            {
                key: "customerID", selectList: {
                    items: apiUrl+'customers'
                }
            },

            { key: "employeeID" },
            { key: "orderDate" },
            { key: "requiredDate" },
            { key: "shippedDate", inputType: "date" },
            {
                key: "shipVia",

                selectList: {
                    items: apiUrl + "shippers",
                }
            },
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