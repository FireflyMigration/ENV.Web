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
    shippers = new models.shippers();
    dv = new utils.dataView({
        from: this.orders,
        where: [
            this.orders.shipCity.isEqualTo("London")
        ],
        relations: { to: this.shippers, on: this.shippers.id.isEqualTo(this.orders.shipVia) }
        ,

        displayColumns: [
            this.orders.id,
            this.orders.customerID,
            this.orders.shippedDate,
            {
                column: this.orders.shipVia,
                getValue: () => this.shippers.companyName
            },

            
        ],
        allowUpdate: true
    });
}
