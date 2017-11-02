import { Component } from "@angular/core";
import { Router } from '@angular/router';

@Component({
    selector: 'my-app',
    templateUrl: `./scripts/app/main.html`,
})
export class AppComponent {
    constructor(public router: Router) {
        console.log(router);
     }
}