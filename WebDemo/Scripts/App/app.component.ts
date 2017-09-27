import { Component, OnInit } from '@angular/core';
import { Injectable } from '@angular/core';
import * as utils from './lib/utils';

@Component({
    selector: 'my-app',
    template: `
<nav>
<a routerLink="/categories" routerLinkActive="active">Categories</a>
</nav>
<router-outlet></router-outlet>
`,

})

@Injectable()
export class AppComponent{
    


}


