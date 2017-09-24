import { Component, OnInit } from '@angular/core';
import { Injectable } from '@angular/core';
import { Product, Category } from './models';
import { RestList, getOptions, Lookup } from './utils/RestList';
import { TableSettings } from "./utils/table-layout.component";


@Component({
    selector: 'my-app',
    template: `
<nav>
<a routerLink="/products" routerLinkActive="active">Products</a>
<a routerLink="/categories" routerLinkActive="active">Categories</a>
</nav>
<router-outlet></router-outlet>
`,

})

@Injectable()
export class AppComponent{
    


}


