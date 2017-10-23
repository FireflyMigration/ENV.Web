import * as utils from './lib/utils';




export class orders extends utils.entity {
    id = new utils.numberColumn({ caption: 'Order ID', readonly:true });
    customerID = new utils.textColumn('CustomerID');
    employeeID = new utils.numberColumn('EmployeeID');
    orderDate = new utils.dateColumn('OrderDate');
    requiredDate = new utils.dateColumn('RequiredDate');
    shippedDate = new utils.dateColumn('ShippedDate');
    shipVia = new utils.numberColumn('ShipVia');
    freight = new utils.numberColumn('Freight');
    shipName = new utils.textColumn('ShipName');
    shipAddress = new utils.textColumn('ShipAddress');
    shipCity = new utils.textColumn('ShipCity');
    shipRegion = new utils.textColumn('ShipRegion');
    shipPostalCode = new utils.textColumn('ShipPostalCode');
    shipCountry = new utils.textColumn('ShipCountry');
    constructor() {
        super('/dataapi/orders');
        this.initColumns();
    }
}

export class shippers extends utils.entity {
    id = new utils.numberColumn({ caption: 'ShipperID', readonly: true });
    companyName = new utils.textColumn('CompanyName');
    phone = new utils.textColumn('Phone');
    constructor() {
        super('dataApi/shippers');
        this.initColumns();
    }
}
export class customers extends utils.entity {
    id = new utils.textColumn('CustomerID');
    companyName = new utils.textColumn('CompanyName');
    contactName = new utils.textColumn('ContactName');
    contactTitle = new utils.textColumn('ContactTitle');
    address = new utils.textColumn('Address');
    city = new utils.textColumn('City');
    region = new utils.textColumn('Region');
    postalCode = new utils.textColumn('PostalCode');
    country = new utils.textColumn('Country');
    phone = new utils.textColumn('Phone');
    fax = new utils.textColumn('Fax');

    constructor() {
        super('/dataapi/customers');
        this.initColumns();
    }
}