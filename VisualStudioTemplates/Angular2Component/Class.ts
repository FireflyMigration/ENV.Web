import { Component, OnInit, Injectable } from '@angular/core';
import { TableSettings } from "./utils/table-layout.component";


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