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
  selectCustomerGrid = new radweb.GridSettings(new models.Customers(),
    {
      numOfColumnsInGrid: 4,
      get: { limit: 4 },
      columnSettings: customers => [
        customers.id,
        customers.companyName,
        customers.contactName,
        customers.country,
        customers.address,
        customers.city
      ]
    });
  ordersGrid = new radweb.GridSettings(new models.Orders(),
    {
      numOfColumnsInGrid: 4,
      allowUpdate: true,
      onEnterRow: orders =>
        this.orderDetailsGrid.get({
          where: orderDetails =>
            orderDetails.orderID.isEqualTo(orders.id)
        }),
      columnSettings: orders => [
        {
          column: orders.id,
          readonly: true
        },
        {
          column: orders.customerID,
          getValue: orders =>
            orders.lookup(new models.Customers(), orders.customerID).companyName,
          click: orders =>
            this.selectCustomerGrid.showSelectPopup(
              selectedCustomer =>
                orders.customerID.value = selectedCustomer.id.value)
        },
        orders.orderDate,
        {
          column: orders.shipVia,
          dropDown: {
            source: new models.Shippers()
          },
          cssClass: 'col-sm-3'
        }
      ]
    }
  );
  shipInfoArea = this.ordersGrid.addArea({
    numberOfColumnAreas:2,
    columnSettings: orders => [
      orders.requiredDate,
      orders.shippedDate,
      orders.shipAddress,
      orders.shipCity
    ]
  });
  orderDetailsGrid = new radweb.GridSettings(new models.Order_details());
}
