import { Component, OnInit, Injectable } from '@angular/core';
import { category } from './models';
import { TableSettings } from "./utils/table-layout.component";


@Component({
    selector: 'categories',
    template:`
<h1>Categories</h1>
<ct-table [settings]="tableSettings"></ct-table>
`
})

@Injectable()
export class Categories  {

    tableSettings = new TableSettings<category>({
        restUrl: apiUrl + 'categories'
    });

}
const apiUrl = '/dataApi/';




