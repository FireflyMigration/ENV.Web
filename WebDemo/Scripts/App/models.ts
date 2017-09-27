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