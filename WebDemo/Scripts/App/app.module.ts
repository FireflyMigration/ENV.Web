import { NgModule, Component } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import * as utils from './lib/utils';
import { RouterModule, Routes } from '@angular/router';
import { Categories } from './Categories';
import { Orders } from "./Orders";


var app = new utils.AppHelper();
app.Register(Categories);
app.Register(Orders);








@Component({
    selector: 'my-app',
    templateUrl: `./scripts/app/main.html`,
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





