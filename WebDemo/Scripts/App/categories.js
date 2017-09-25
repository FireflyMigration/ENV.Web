"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@angular/core");
const table_layout_component_1 = require("./utils/table-layout.component");
let Categories = class Categories {
    constructor() {
        this.tableSettings = new table_layout_component_1.TableSettings({
            restUrl: apiUrl + 'categories'
        });
    }
};
Categories = __decorate([
    core_1.Component({
        selector: 'categories',
        template: `
<h1>Categories</h1>
<ct-table [settings]="tableSettings"></ct-table>
`
    }),
    core_1.Injectable()
], Categories);
exports.Categories = Categories;
const apiUrl = '/dataApi/';
//# sourceMappingURL=categories.js.map