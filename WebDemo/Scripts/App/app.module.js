"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@angular/core");
const platform_browser_1 = require("@angular/platform-browser");
const app_component_1 = require("./app.component");
const forms_1 = require("@angular/forms");
const http_1 = require("@angular/http");
const table_layout_component_1 = require("./utils/table-layout.component");
const router_1 = require("@angular/router");
const categories_1 = require("./categories");
const appRoues = [
    { path: 'categories', component: categories_1.Categories },
    { path: '', redirectTo: '/categories', pathMatch: 'full' }
];
let AppModule = class AppModule {
};
AppModule = __decorate([
    core_1.NgModule({
        imports: [
            router_1.RouterModule.forRoot(appRoues, {
                enableTracing: false // set to true for debugging
            }),
            platform_browser_1.BrowserModule, forms_1.FormsModule, http_1.HttpModule
        ],
        declarations: [
            table_layout_component_1.TableLayoutComponent,
            app_component_1.AppComponent,
            categories_1.Categories,
        ],
        bootstrap: [app_component_1.AppComponent]
    })
], AppModule);
exports.AppModule = AppModule;
//# sourceMappingURL=app.module.js.map