import { NgModule, Component } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import * as utils from './lib/utils';
import { RouterModule, Routes } from '@angular/router';
import { Categories } from './Categories';


var app = new utils.AppHelper();
app.Register(Categories);

















@Component({
    selector: 'my-app',
    template: `
<nav>
<span *ngFor="let m of app.menues">
<a routerLink="{{m.path}}" routerLinkActive="active">{{m.text}}</a> 
</span>
</nav>
<router-outlet></router-outlet>
`,
})
export class AppComponent {
    app = app;
}

app.Add(AppComponent);
@NgModule({

    imports: [
        RouterModule.forRoot(app.Routes, {
            enableTracing: false// set to true for debugging
        })
        , BrowserModule, FormsModule, HttpModule],
    declarations: app.Components,
    bootstrap: [AppComponent]
})
export class AppModule { }





