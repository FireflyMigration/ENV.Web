import { Component } from '@angular/core';
import * as utils from './lib/utils';
import * as models from './newModels';

@Component({
    template: `
<h1>newOrders</h1>
<data-grid [dataView]="dv"></data-grid>
`
})
export class newOrders {
    orders = new models.orders();
    dv = new utils.dataView({
        from: this.orders,
        where: [
            this.orders.shipVia.isEqualTo(1),
            this.orders.shipCity.isEqualTo("London")
        ],

        displayColumns: [
            this.orders.id,
            this.orders.customerID,
            this.orders.shippedDate,
            this.orders.shipVia
        ],
        allowUpdate: true
    });
}
