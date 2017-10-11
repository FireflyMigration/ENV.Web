import { Component, OnInit, Injectable } from '@angular/core';
import * as utils from './lib/utils';
import * as models from './models';


@Component({
    template: `
<h1>Orders</h1>
    <data-grid [settings]="orders"></data-grid>
    <select-popup [settings]="custList"> </select-popup>
    <select-popup [settings]="shipList"> </select-popup>
`
})

@Injectable()
export class Orders {
    customers = new utils.Lookup<models.customer, string>(apiUrl + 'customers');
    shipList = new utils.SelectPopup( new utils.DataSettings<models.shipper>(apiUrl + "shippers", {}));
    custList = new utils.SelectPopup(new utils.DataSettings<models.customer>(apiUrl + "customers", {}));
    
    orders = new utils.DataSettings<models.order>(apiUrl + "orders", {
        allowUpdate: true,
        hideDataArea: false,
        columnSettings: [
            { key: "id" },
            {
                key: "customerID",
                click: r => {
                    this.custList.show(c => r.customerID = c.id);
                },
                getValue: r => this.customers.get(r.customerID).companyName
            },

            { key: "employeeID" },
            { key: "orderDate" },
            { key: "requiredDate" },
            { key: "shippedDate", inputType: "date" },
            {
                key: "shipVia",
                click: o => {
                    this.shipList.show(s => o.shipVia = s.id);
                   
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
