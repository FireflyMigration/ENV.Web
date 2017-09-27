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