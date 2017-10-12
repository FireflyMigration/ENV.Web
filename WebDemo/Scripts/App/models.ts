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
export class orders extends utils.DataSettings<order>{
    constructor(settings?: utils.IDataSettings<order>) {
        super('dataapi/orders', settings);
    }
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
export interface orderDetail {
    orderID?: number;
    productID?: number;
    unitPrice?: number;
    quantity?: number;
    discount?: number;
    id?: string;
}
export interface product {
    id?: number;
    productName?: string;
    supplierID?: number;
    categoryID?: number;
    quantityPerUnit?: string;
    unitPrice?: number;
    unitsInStock?: number;
    unitsOnOrder?: number;
    reorderLevel?: number;
    discontinued?: boolean;
}

export class orderDetails extends utils.DataSettings<orderDetail>{
    constructor(settings?: utils.IDataSettings<orderDetail>) {
        super('/dataapi/orderDetails', settings);
    }
}
export interface orderDetail {
    orderID?: number;
    productID?: number;
    unitPrice?: number;
    quantity?: number;
    discount?: number;
    id?: string;
}