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
Order: {{o.id}}<br/>
Customer: {{o.customerID}}
</li>
</ul>
`
})

@Injectable()
export class Orders {

    title = 'Orders';
    orders: models.order[]= [{
        id: 5,
        customerID: "abc"
    },
        {
            id: 6,
            customerID: "xyz"
        },
        {
            id: 7,
            customerID: "xyz"
        },
        {
            id: 8,
            customerID: "xyz"
        },
        {
            id: 9,
            customerID: "asd"
        },
        {
            id: 10,
            customerID:"xaw"
        },
        {
            id:11
        }
    ];

    click() {
        this.title += "button was clicked";
    }
}
const apiUrl = '/dataApi/';