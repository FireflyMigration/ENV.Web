import { Component, OnInit, Injectable } from '@angular/core';
import * as utils from './lib/utils';
import * as models from './models';

@Component({

    template: `
<h1>Categories</h1>
<data-grid [settings]="dataSettings"></data-grid>
<data-area [settings]="dataSettings"></data-area>

`
})

@Injectable()
export class Categories {

    dataSettings = new utils.DataSettings<models.category>({
        restUrl: apiUrl + 'categories',
        columnKeys: ["id","categoryName","categoryDescription"],
        allowUpdate:true
    });

}
const apiUrl = '/dataApi/';




