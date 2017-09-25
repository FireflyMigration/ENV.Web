"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@angular/core");
const core_2 = require("@angular/core");
const RestList_1 = require("../utils/RestList");
const table_layout_component_1 = require("../utils/table-layout.component");
let Products = class Products {
    constructor() {
        this.category = new RestList_1.Lookup(apiUrl + 'categories', (product, o) => o.isEqualTo = { id: +product.categoryID });
        this.tableSettings = new table_layout_component_1.TableSettings({
            restUrl: apiUrl + 'products',
            editable: true,
            get: { limit: 5 },
            columnSettings: [
                { key: "id", caption: "ProductID" },
                { key: "productName", caption: "ProductName" },
                { key: "supplierID", caption: "SupplierID" },
                { key: "categoryID", caption: "CategoryID" },
                {
                    caption: "categoryName",
                    getValue: (r) => this.category.get(r).categoryName,
                    columnClass: r => this.category.found(r) ? '' : 'danger'
                },
            ]
        });
    }
};
Products = __decorate([
    core_1.Component({
        templateUrl: './scripts/app/demo/products.html',
    }),
    core_2.Injectable()
], Products);
exports.Products = Products;
const apiUrl = '/dataApi/';
//# sourceMappingURL=products.js.map