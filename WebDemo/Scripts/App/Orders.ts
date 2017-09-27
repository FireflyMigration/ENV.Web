import { Component, OnInit, Injectable } from '@angular/core';
import * as utils from './lib/utils';
import * as models from './models';

@Component({
    template:`
<h1>{{ title }} ({{title.length}})</h1>
<input [(ngModel)]="title">
<h2 *ngIf="title.length>15"> the title is long!!!</h2>
<button (click)="click()">my button</button>

`
})

@Injectable()
export class Orders  {

    title = 'the title';
    click() {
        this.title += "button was clicked";
    }
}
const apiUrl = '/dataApi/';