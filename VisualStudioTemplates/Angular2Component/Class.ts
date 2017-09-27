import { Component, OnInit, Injectable } from '@angular/core';
import * as models from './models';
import { TableSettings } from "./utils/table-layout.component";
import { Lookup, RestList } from './utils/RestList';

@Component({
    template:`
<h1>$safeitemrootname$</h1>
<ct-table [settings]="settings"></ct-table>
`
})

@Injectable()
export class $safeitemrootname$  {

   

}
const apiUrl = '/dataApi/';