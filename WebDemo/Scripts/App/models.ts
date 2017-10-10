import * as utils from './lib/utils';
export interface category {
    id?: number;
    categoryName?: string;
    description?: string;
}
export interface order {
    id?: number;
    customerID?: string;
    employeeID?: number;
    orderDate?: string;
    requiredDate?: string;
    shippedDate?: string;
    shipVia?: number;
    freight?: number;
    shipName?: string;
    shipAddress?: string;
    shipCity?: string;
    shipRegion?: string;
    shipPostalCode?: string;
    shipCountry?: string;
}
export interface customer {
    id?: string;
    companyName?: string;
    contactName?: string;
    contactTitle?: string;
    address?: string;
    city?: string;
    region?: string;
    postalCode?: string;
    country?: string;
    phone?: string;
    fax?: string;
}
export interface shipper {
    id?: number;
    companyName?: string;
    phone?: string;
}

class shipperSelect extends utils.SelectSettings<shipper,number>
{ 
    constructor() {
        super('dataapi/shippers', s => s.id, s => s.companyName);
    }
}