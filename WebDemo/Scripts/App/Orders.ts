﻿import { Component, OnInit, Injectable } from '@angular/core';
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
            columnKeys: ["id", "customerID", "orderDate", "shipVia"],
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