import { Component, OnInit, Injectable } from '@angular/core';
import * as utils from './lib/utils';
import * as models from './models';

@Component({
    template:`
<h1>Orders</h1>
<data-grid [settings]="orders"></data-grid>
    <data-area [settings]="orders" [columns]="2" ></data-area>
    <data-area [settings]="area1" [columns]="2" ></data-area>
`
})

@Injectable()
export class Orders  {

    customers= new utils.Lookup<models.customer, string>(apiUrl + 'customers');
    orders = new utils.DataSettings<models.order>({
        restUrl: apiUrl + "orders",
        allowUpdate: true,
        hideDataArea:true
    });
    area1 = this.orders.addArea();

    
   

}
const apiUrl = '/dataApi/';