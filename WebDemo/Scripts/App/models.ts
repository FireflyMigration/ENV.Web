export interface Category {
    id?: number;
    categoryName?: string;
    description?: string;
}
// /products?_responseType=D

export interface Product {
    id?: string;
    productName?: string;
    supplierID?: string;
    categoryID?: string;
    quantityPerUnit?: string;
    unitPrice?: string;
    unitsInStock?: string;
    unitsOnOrder?: string;
    reorderLevel?: string;
    discontinued?: string;
}