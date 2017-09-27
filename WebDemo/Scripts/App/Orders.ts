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
    orders = new utils.RestList<models.order>(apiUrl + 'orders');

    click() {
        this.title += "button was clicked";
        this.orders.get();
    }
}
const apiUrl = '/dataApi/';