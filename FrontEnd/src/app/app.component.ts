import { environment } from './../environments/environment';
import { Component } from '@angular/core';
import * as models from './models';
import * as radweb from 'radweb';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],

})
export class AppComponent {
  ordersGrid = new radweb.GridSettings(new models.Orders(),
    {
      numOfColumnsInGrid:4,
      columnSettings: orders => [
        {
          column: orders.id,
          readonly: true
        },
        orders.customerID,
        orders.orderDate,
        orders.shipVia,
        orders.requiredDate,
        orders.shippedDate,
        orders.shipAddress,
        orders.shipCity
      ]
    }
  );
}
