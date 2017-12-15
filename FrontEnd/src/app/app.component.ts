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


  pForLookup = new models.Products();
  pLookUp = new radweb.Lookup(this.pForLookup.source);
  orderDetailsSettings = new radweb.GridSettings(new models.Order_details(), {
    allowDelete: true,
    allowUpdate: true,
    allowInsert: true,
    columnSettings: orderDetails => [
      {
        column: orderDetails.productID,
        dropDown: { source: new models.Products() },
        onUserChangedValue: od => this.pLookUp.whenGet(this.pForLookup.id.isEqualTo(od.productID)).then(p => od.unitPrice.value = p.unitPrice.value)
      },
      orderDetails.unitPrice,
      orderDetails.quantity,
      { caption: 'row total', getValue: od => od.unitPrice.value * od.quantity.value }
    ],
    onNewRow: od => {
      od.orderID.value = this.settings.currentRow.id.value;
      od.unitPrice.value = 1;
    }
  });

  customersSelect = new radweb.GridSettings(new models.Customers(), {
    numOfColumnsInGrid: 4,
    columnSettings: customers => [
      customers.id,
      customers.companyName,
      customers.contactName,
      customers.country,
      customers.address,
      customers.city
    ]
  });


  settings = new radweb.GridSettings(new models.Orders(), {
    numOfColumnsInGrid: 4,
    allowUpdate: true,
    allowInsert: true,
    get: { where: o => o.orderDate.IsGreaterOrEqualTo("1997") },

    onEnterRow: o => {

      this.orderDetailsSettings.get({ where: orderDetails => orderDetails.orderID.isEqualTo(o.id), additionalUrlParameters: { cust: o.customerID } })
    },
    columnSettings: orders => [
      {
        column: orders.id,
        caption: 'order id',
      },
      {
        column: orders.customerID,

        getValue: o => o.lookup(new models.Customers(), c => c.id.isEqualTo(o.customerID)).companyName,
        //getValue: o => o.lookup(new models.Customers(), o.customerID).companyName,
        click: o => this.customersSelect.showSelectPopup(c => o.customerID.value = c.id.value)
      },
      orders.orderDate,
      {
        column: orders.shipVia, dropDown: {
          source: new models.Shippers()
        }
      }

    ]
  });
  shipInfoArea = this.settings.addArea({
    columnSettings: orders => [
      orders.requiredDate,
      orders.shippedDate,
      orders.shipAddress,
      orders.shipCity
    ]
  });
  getOrderTotal() {
    let r = 0;
    this.orderDetailsSettings.items.forEach(od => r += od.unitPrice.value * od.quantity.value);
    return r;
  }
  printOrder() {
    window.open(environment.serverUrl + 'home/print/' + this.settings.currentRow.id.value, '_blank');
  }
  test() {
    this.settings.currentRow.id.error = '4312';
  }
}
