import { Component, OnInit } from '@angular/core';
import { Injectable } from '@angular/core';
import { Headers, Http } from '@angular/http';
import { } from './models';
import { dataService } from './data.service';


import 'rxjs/add/operator/toPromise';

@Component({
    selector: 'my-app',
    templateUrl: `./scripts/app/app.component.html`,
    providers: [dataService]
})
@Injectable()
export class AppComponent implements OnInit {
    title = 'The title';
    constructor(private server: dataService) {

    }
    ngOnInit(): void {

    }

}
