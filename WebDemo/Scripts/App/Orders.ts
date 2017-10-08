import { Component, OnInit, Injectable } from '@angular/core';
import * as utils from './lib/utils';
import * as models from './models';

@Component({
    templateUrl:'/scripts/app/orders.html'
})

@Injectable()
export class Orders {

    title = 'Orders';
    orders = [{
        orderId: 5,
        customerId: "abc"
    },
        {
            orderId: 6,
            customerId: "xyz"
        },
        {
            orderId: 7,
            customerId: "xyz"
        },
        {
            orderId: 8,
            customerId: "xyz"
        }
    ];

    click() {
        this.title += "button was clicked";
    }
}
const apiUrl = '/dataApi/';