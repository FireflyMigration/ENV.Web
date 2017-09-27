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