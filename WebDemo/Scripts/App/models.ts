// /categories?_responseType=D

export interface category {
    id?: string;
    categoryName?: string;
    description?: string;
}

// /orders?_responseType=D

export interface order {
    id?: number;
    customerID?: string;
    companyName?: string;
    orderDate?: string;
    shipVia?: number;
    dayofWeek?: string;
}