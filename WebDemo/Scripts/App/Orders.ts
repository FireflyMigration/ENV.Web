import { Component, OnInit, Injectable } from '@angular/core';
import * as utils from './lib/utils';
import * as models from './models';

@Component({
    template: `
<h1>{{ title }} ({{title.length}})</h1>
<input [(ngModel)]="title">
<h2 *ngIf="title.length>15"> the title is long!!!</h2>
<button (click)="click()">my button</button>
<br/>
<ul>
<li *ngFor="let o of orders">
Order: {{o.orderId}}<br/>
Customer: {{o.customerId}}
</li>
</ul>
`
})

@Injectable()
export class Orders {

    title = 'Orders';
    orders: order[]= [{
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
        },
        {
            orderId: 9,
            customerId: "asd"
        },
        {
            orderId: 10,
            customerId:"xaw"
        },
        {
            orderId:11
        }
    ];

    click() {
        this.title += "button was clicked";
    }
}
export interface order {
    orderId?: number;
    customerId?: string;
}
const apiUrl = '/dataApi/';