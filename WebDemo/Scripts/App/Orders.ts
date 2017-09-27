import { Component, OnInit, Injectable } from '@angular/core';
import * as utils from './lib/utils';
import * as models from './models';

@Component({
    template:`
<h1>{{ title }} ({{title.length}})</h1>
<input [(ngModel)]="title">

`
})

@Injectable()
export class Orders  {

    title = 'the title';

}
const apiUrl = '/dataApi/';